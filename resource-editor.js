(() => {
  const $ = (id) => document.getElementById(id);
  let envelope;
  let records = [];
  let unlocked = false;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const status = (text, error = false) => { $("editorStatus").textContent = text; $("editorStatus").dataset.state = error ? "error" : "ok"; };
  const contentStatus = (text, error = false) => { $("resourceEditorStatus").textContent = text; $("resourceEditorStatus").dataset.state = error ? "error" : "ok"; };

  async function loadEnvelope() {
    try {
      const response = await fetch("data/private-resources.enc.json", { cache: "no-store" });
      if (!response.ok) throw new Error("No se encontró data/private-resources.enc.json.");
      envelope = await response.json();
      const initialized = envelope.initialized === true;
      $("confirmGroup").hidden = initialized;
      $("confirmPassphrase").required = !initialized;
      $("openEditor").textContent = initialized ? "Abrir y editar" : "Crear almacén cifrado";
      status(initialized ? "Almacén cifrado encontrado. Introduce tu frase de paso." : "Configura una frase de paso de al menos 14 caracteres para crear el almacén.");
    } catch (error) { status(error.message, true); }
  }

  function render() {
    $("resourceEditorList").innerHTML = records.map((item, index) => `<article class="editor-item"><div class="editor-item-head"><strong>${esc(item.title)}${item.category ? ` · ${esc(item.category)}` : ""}</strong><button class="delete-button" type="button" data-remove="${index}">Eliminar</button></div><p>${esc(item.notes || "Sin nota")}</p>${item.url ? `<p><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.url)}</a></p>` : ""}${item.tags?.length ? `<div class="pub-tags">${item.tags.map(tag => `<span class="pub-tag">${esc(tag)}</span>`).join("")}</div>` : ""}</article>`).join("") || `<div class="empty-state">El almacén todavía está vacío. Agrega un enlace o una nota arriba.</div>`;
  }

  function lock() {
    records = []; unlocked = false;
    $("editorPassphrase").value = ""; $("confirmPassphrase").value = "";
    $("editorGate").hidden = false; $("resourceEditor").hidden = true;
    contentStatus(""); status("Almacén bloqueado. La frase de paso se eliminó de la página.");
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await loadEnvelope();
    $("editorUnlockForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const passphrase = $("editorPassphrase").value;
      const button = $("openEditor"); button.disabled = true; status("Procesando en este navegador…");
      try {
        if (envelope?.initialized) {
          const payload = await VaultCrypto.decrypt(envelope, passphrase);
          records = Array.isArray(payload.resources) ? payload.resources : [];
        } else {
          if (passphrase !== $("confirmPassphrase").value) throw new Error("Las frases de paso no coinciden.");
          if (passphrase.length < 14) throw new Error("Usa una frase de paso de al menos 14 caracteres.");
          records = [];
        }
        unlocked = true;
        $("editorGate").hidden = true; $("resourceEditor").hidden = false; render();
        contentStatus(envelope?.initialized ? "Almacén abierto. Agrega, elimina o edita los recursos antes de descargar." : "Almacén nuevo listo. Agrega recursos y descarga el archivo cifrado.");
      } catch (error) {
        status(error.message === "The operation failed for an operation-specific reason" ? "No se pudo abrir el almacén; revisa la frase de paso." : (error.message || "No se pudo abrir el almacén."), true);
      } finally { button.disabled = false; }
    });

    $("resourceForm").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!unlocked) return;
      const title = $("resourceTitle").value.trim();
      const url = $("resourceUrl").value.trim();
      if (url && !/^https?:\/\//i.test(url)) { contentStatus("El enlace debe comenzar con https:// o http://.", true); return; }
      records.unshift({
        title,
        category: $("resourceCategoryInput").value.trim(),
        url,
        notes: $("resourceNotes").value.trim(),
        tags: $("resourceTags").value.split(",").map(tag => tag.trim()).filter(Boolean)
      });
      $("resourceForm").reset(); render(); contentStatus("Recurso agregado en memoria. Descarga el archivo cifrado para conservarlo.");
    });
    $("resourceEditorList").addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove]");
      if (!button) return;
      records.splice(Number(button.dataset.remove), 1); render(); contentStatus("Recurso eliminado en memoria; descarga el archivo actualizado para aplicar el cambio.");
    });
    $("downloadVault").addEventListener("click", async () => {
      if (!unlocked) return;
      const button = $("downloadVault"); button.disabled = true; contentStatus("Cifrando y preparando descarga…");
      try {
        const updatedEnvelope = await VaultCrypto.encrypt({ resources: records, updated: new Date().toISOString().slice(0,10) }, $("editorPassphrase").value);
        const blob = new Blob([JSON.stringify(updatedEnvelope, null, 2) + "\n"], { type: "application/json;charset=utf-8" });
        const url = URL.createObjectURL(blob); const link = document.createElement("a");
        link.href = url; link.download = "private-resources.enc.json"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        envelope = updatedEnvelope;
        contentStatus("Archivo cifrado descargado. Reemplaza data/private-resources.enc.json en GitHub para actualizar el sitio.");
      } catch (error) { contentStatus(error.message || "No se pudo cifrar el archivo.", true); }
      finally { button.disabled = false; }
    });
    $("closeEditor").addEventListener("click", lock);
    $("lockVault").addEventListener("click", lock);
  });
})();
