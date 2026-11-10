(() => {
  const STORAGE_KEY = "armando-publications-draft-v1";
  const $ = (id) => document.getElementById(id);
  let items = [];
  const clean = (item = {}) => {
    const tags = Array.isArray(item.tags) ? item.tags.map(String) : [];
    return {
      year: Number(item.year) || new Date().getFullYear(),
      title: String(item.title || ""), citation: String(item.citation || ""), journal: String(item.journal || ""),
      link: String(item.link || ""), pdfLink: String(item.pdfLink || ""), abstract: String(item.abstract || ""),
      tags, tagsText: String(item.tagsText ?? tags.join(", ")), firstAuthor: item.firstAuthor === true,
      correspondingAuthor: item.correspondingAuthor === true, bibtex: String(item.bibtex || "")
    };
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const setStatus = (message, error = false) => {
    $("managerStatus").textContent = message;
    $("managerStatus").dataset.state = error ? "error" : "ok";
  };
  const saveDraft = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (_) { setStatus("El navegador no permitió guardar el borrador local.", true); }
  };

  function field(index, key, label, value, type = "text", wide = false) {
    const control = type === "textarea"
      ? `<textarea data-index="${index}" data-field="${key}"${wide ? "" : ""}>${esc(value)}</textarea>`
      : `<input type="${type}" data-index="${index}" data-field="${key}" value="${esc(value)}">`;
    return `<label class="${wide ? "wide" : ""}">${label}${control}</label>`;
  }

  function render() {
    $("publicationEditor").innerHTML = items.map((item, index) => {
      const tags = item.tagsText ?? (Array.isArray(item.tags) ? item.tags.join(", ") : "");
      return `<article class="editor-item" data-record="${index}">
        <div class="editor-item-head"><strong>Publicación ${index + 1} · ${esc(item.year)}</strong><button class="delete-button" data-delete="${index}" type="button" aria-label="Eliminar publicación ${index + 1}">Eliminar</button></div>
        <div class="editor-form">
          ${field(index,"year","Año",item.year,"number")}
          ${field(index,"title","Título breve",item.title)}
          ${field(index,"journal","Revista",item.journal)}
          ${field(index,"link","Enlace al artículo o DOI",item.link,"url")}
          ${field(index,"pdfLink","Enlace directo al PDF (opcional)",item.pdfLink,"url")}
          ${field(index,"tagsText","Etiquetas (separadas por comas)",tags)}
          ${field(index,"citation","Referencia bibliográfica",item.citation,"textarea",true)}
          ${field(index,"abstract","Resumen (opcional)",item.abstract,"textarea",true)}
          ${field(index,"bibtex","BibTeX (opcional)",item.bibtex,"textarea",true)}
        </div>
        <div class="editor-checks">
          <label class="check-label"><input type="checkbox" data-index="${index}" data-field="firstAuthor" ${item.firstAuthor ? "checked" : ""}> Primer autor</label>
          <label class="check-label"><input type="checkbox" data-index="${index}" data-field="correspondingAuthor" ${item.correspondingAuthor ? "checked" : ""}> Autor de correspondencia</label>
        </div>
      </article>`;
    }).join("") || `<div class="empty-state">Todavía no hay publicaciones. Usa “Agregar publicación” para empezar.</div>`;
  }

  async function loadPublished() {
    const response = await fetch("data/publications.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar data/publications.json");
    const data = await response.json();
    return (Array.isArray(data.items) ? data.items : []).map(clean);
  }

  function exportJson() {
    const payload = { schemaVersion: 1, updated: new Date().toISOString().slice(0, 10), items: items.map((raw) => {
      const item = clean(raw);
      if (raw.tagsText !== undefined) item.tags = String(raw.tagsText).split(",").map(tag => tag.trim()).filter(Boolean);
      return item;
    }) };
    const blob = new Blob([JSON.stringify(payload, null, 2) + "\n"], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "publications.json"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Archivo descargado. Reemplaza data/publications.json en tu repositorio.");
  }

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const draft = localStorage.getItem(STORAGE_KEY);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (Array.isArray(parsed)) { items = parsed.map(clean); setStatus("Se cargó el borrador local de este navegador."); }
      }
      if (!items.length) { items = await loadPublished(); setStatus("Catálogo publicado cargado."); }
    } catch (error) { setStatus(error.message || "Error al cargar datos.", true); }
    render();

    $("publicationEditor").addEventListener("input", (event) => {
      const control = event.target.closest("[data-index][data-field]");
      if (!control) return;
      const index = Number(control.dataset.index), key = control.dataset.field;
      const value = control.type === "checkbox" ? control.checked : control.value;
      if (key === "tagsText") items[index].tagsText = value;
      else items[index][key] = key === "year" ? Number(value) : value;
      saveDraft();
      if (key === "year") control.closest(".editor-item").querySelector(".editor-item-head strong").textContent = `Publicación ${index + 1} · ${value}`;
    });
    $("publicationEditor").addEventListener("click", (event) => {
      const button = event.target.closest("[data-delete]");
      if (!button) return;
      items.splice(Number(button.dataset.delete), 1); saveDraft(); render(); setStatus("Registro eliminado del borrador local.");
    });
    $("addPublication").addEventListener("click", () => {
      items.unshift(clean({ year: new Date().getFullYear() })); saveDraft(); render(); setStatus("Registro nuevo agregado.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    $("downloadData").addEventListener("click", exportJson);
    $("importData").addEventListener("click", () => $("fileInput").click());
    $("fileInput").addEventListener("change", async (event) => {
      const file = event.target.files[0]; if (!file) return;
      try { const parsed = JSON.parse(await file.text()); if (!Array.isArray(parsed.items)) throw new Error("El archivo debe tener una lista items."); items = parsed.items.map(clean); saveDraft(); render(); setStatus("JSON importado en el navegador."); }
      catch (error) { setStatus(error.message || "No se pudo importar el JSON.", true); }
      event.target.value = "";
    });
    $("resetData").addEventListener("click", async () => {
      try { localStorage.removeItem(STORAGE_KEY); items = await loadPublished(); render(); setStatus("Borrador eliminado; se cargaron los datos publicados."); }
      catch (error) { setStatus(error.message || "No se pudieron cargar los datos.", true); }
    });
  });
})();
