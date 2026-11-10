(() => {
  let envelope;
  let resources = [];
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const safeUrl = (value) => { try { const url = new URL(value); return ["http:","https:"].includes(url.protocol) ? url.href : ""; } catch { return ""; } };
  const message = (text, error = false) => { $("vaultStatus").textContent = text; $("vaultStatus").dataset.state = error ? "error" : "ok"; };

  async function loadEnvelope() {
    try {
      const response = await fetch("data/private-resources.enc.json", { cache: "no-store" });
      if (!response.ok) throw new Error("No se encontró el archivo cifrado.");
      envelope = await response.json();
      if (!envelope.initialized) {
        $("unlockButton").disabled = true;
        $("vaultSetupLink").hidden = false;
        message("El almacén privado aún no está configurado.");
      }
    } catch (error) { message(error.message || "No se pudo abrir el archivo cifrado.", true); }
  }

  function render() {
    const query = $("resourceSearch").value.trim().toLocaleLowerCase("es");
    const category = $("resourceCategory").value;
    const filtered = resources.filter(item => {
      const searchText = [item.title, item.category, item.url, item.notes, ...(item.tags || [])].join(" ").toLocaleLowerCase("es");
      return (!query || searchText.includes(query)) && (!category || item.category === category);
    });
    $("resourceCount").textContent = `${filtered.length} de ${resources.length} recursos`;
    $("resourceList").innerHTML = filtered.length ? filtered.map(item => {
      const tags = (item.tags || []).filter(Boolean).map(tag => `<span class="pub-tag">${esc(tag)}</span>`).join("");
      const link = safeUrl(item.url);
      return `<article class="vault-card"><p class="vault-meta">${esc(item.category || "Sin categoría")}</p><h3>${esc(item.title || "Recurso sin título")}</h3>${item.notes ? `<p>${esc(item.notes)}</p>` : ""}${tags ? `<div class="pub-tags">${tags}</div>` : ""}${link ? `<p><a href="${esc(link)}" target="_blank" rel="noopener noreferrer">Abrir recurso ↗</a></p>` : ""}</article>`;
    }).join("") : `<div class="empty-state">No hay recursos con esos filtros.</div>`;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await loadEnvelope();
    $("unlockForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!envelope?.initialized) { message("Primero crea el almacén desde el editor de recursos.", true); return; }
      const button = $("unlockButton"); button.disabled = true; message("Descifrando en este navegador…");
      try {
        const payload = await VaultCrypto.decrypt(envelope, $("passphrase").value);
        resources = Array.isArray(payload.resources) ? payload.resources : [];
        const categories = [...new Set(resources.map(item => String(item.category || "").trim()).filter(Boolean))].sort((a,b) => a.localeCompare(b, "es"));
        $("resourceCategory").innerHTML = `<option value="">Todas las categorías</option>` + categories.map(category => `<option value="${esc(category)}">${esc(category)}</option>`).join("");
        $("vaultGate").hidden = true; $("vaultContent").hidden = false; render();
      } catch (error) { message("No se pudo desbloquear. Revisa la frase de paso.", true); button.disabled = false; }
    });
    $("resourceSearch").addEventListener("input", render);
    $("resourceCategory").addEventListener("change", render);
    $("lockButton").addEventListener("click", () => {
      resources = []; $("passphrase").value = ""; $("resourceSearch").value = ""; $("resourceCategory").value = "";
      $("vaultContent").hidden = true; $("vaultGate").hidden = false; $("unlockButton").disabled = false;
      message("El almacén está bloqueado. No se guardó la clave.");
    });
  });
})();
