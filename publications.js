(() => {
  const els = {};
  let items = [];

  const labels = {
    es: {
      search: "Buscar por título, autor, revista o palabra clave",
      allYears: "Todos los años", allTags: "Todos los temas", first: "Primer autor",
      corr: "Autor de correspondencia", order: "Orden", newest: "Más recientes", oldest: "Más antiguas",
      clear: "Limpiar filtros", loading: "Cargando publicaciones…", result: (n, total) => `${n} de ${total} publicaciones`,
      article: "Ver publicación", pdf: "PDF", abstract: "Resumen", noResults: "No hay publicaciones que coincidan con estos filtros.",
      firstBadge: "Primer autor", corrBadge: "Correspondencia", noData: "No fue posible cargar el catálogo. Revisa que exista data/publications.json."
    },
    en: {
      search: "Search by title, author, journal, or keyword",
      allYears: "All years", allTags: "All topics", first: "First author",
      corr: "Corresponding author", order: "Sort", newest: "Newest first", oldest: "Oldest first",
      clear: "Clear filters", loading: "Loading publications…", result: (n, total) => `${n} of ${total} publications`,
      article: "View article", pdf: "PDF", abstract: "Abstract", noResults: "No publications match these filters.",
      firstBadge: "First author", corrBadge: "Corresponding author", noData: "Could not load the catalog. Check that data/publications.json exists."
    }
  };
  const lang = () => document.documentElement.lang === "en" ? "en" : "es";
  const t = () => labels[lang()];
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const safeUrl = (value) => {
    try { const url = new URL(value, window.location.href); return ["http:","https:"].includes(url.protocol) ? url.href : ""; }
    catch { return ""; }
  };

  function localize() {
    if (!els.search) return;
    els.search.placeholder = t().search;
    els.search.setAttribute("aria-label", t().search);
    els.year.options[0].textContent = t().allYears;
    els.tag.options[0].textContent = t().allTags;
    els.firstLabel.textContent = t().first;
    els.corrLabel.textContent = t().corr;
    els.sortLabel.textContent = t().order;
    els.sort.options[0].textContent = t().newest;
    els.sort.options[1].textContent = t().oldest;
    els.clear.textContent = t().clear;
    render();
  }

  function buildFilters() {
    const years = [...new Set(items.map(item => Number(item.year)).filter(Number.isFinite))].sort((a,b) => b-a);
    const tags = [...new Set(items.flatMap(item => Array.isArray(item.tags) ? item.tags : []))].sort((a,b) => a.localeCompare(b, lang()));
    for (const year of years) els.year.add(new Option(String(year), String(year)));
    for (const tag of tags) els.tag.add(new Option(tag, tag));
  }

  function matches(item) {
    const query = els.search.value.trim().toLocaleLowerCase(lang());
    const text = [item.title, item.citation, item.journal, item.abstract, ...(item.tags || [])].join(" ").toLocaleLowerCase(lang());
    return (!query || text.includes(query))
      && (!els.year.value || Number(item.year) === Number(els.year.value))
      && (!els.tag.value || (item.tags || []).includes(els.tag.value))
      && (!els.first.checked || item.firstAuthor === true)
      && (!els.corr.checked || item.correspondingAuthor === true);
  }

  function renderCard(item) {
    const title = String(item.title || "").trim();
    const citation = String(item.citation || "").trim();
    const link = safeUrl(item.link);
    const pdf = safeUrl(item.pdfLink);
    const roles = [];
    if (item.firstAuthor) roles.push(`<span class="pub-role">${escapeHtml(t().firstBadge)}</span>`);
    if (item.correspondingAuthor) roles.push(`<span class="pub-role">${escapeHtml(t().corrBadge)}</span>`);
    const tags = (Array.isArray(item.tags) ? item.tags : []).filter(Boolean)
      .map(tag => `<span class="pub-tag">${escapeHtml(tag)}</span>`).join("");
    const details = item.abstract || tags ? `<details><summary>${escapeHtml(item.abstract ? t().abstract : (lang()==="en" ? "Topics" : "Temas"))}</summary>${item.abstract ? `<p class="pub-abstract">${escapeHtml(item.abstract)}</p>` : ""}${tags ? `<div class="pub-tags">${tags}</div>` : ""}</details>` : "";
    const links = `${link ? `<a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t().article)} ↗</a>` : ""}${pdf ? `<a href="${escapeHtml(pdf)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t().pdf)} ↗</a>` : ""}`;
    const heading = title ? `<span class="pub-title">${escapeHtml(title)}</span>` : "";
    return `<article class="pub-card" data-cursor-size="1.22"><div class="pub-year-badge">${escapeHtml(item.year || "—")}</div><div><h2>${heading}${escapeHtml(citation)}</h2>${roles.length ? `<div class="pub-badges">${roles.join("")}</div>` : ""}${tags && !details ? `<div class="pub-tags">${tags}</div>` : ""}${links ? `<div class="pub-card-actions">${links}</div>` : ""}${details}</div></article>`;
  }

  function render() {
    if (!els.list) return;
    const filtered = items.filter(matches).sort((a,b) => {
      const direction = els.sort.value === "oldest" ? 1 : -1;
      return direction * (Number(a.year || 0) - Number(b.year || 0)) || String(a.citation || "").localeCompare(String(b.citation || ""));
    });
    els.count.textContent = t().result(filtered.length, items.length);
    els.list.innerHTML = filtered.length ? filtered.map(renderCard).join("") : `<div class="empty-state">${escapeHtml(t().noResults)}</div>`;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    Object.assign(els, {
      search: document.getElementById("pubSearch"), year: document.getElementById("yearFilter"), tag: document.getElementById("tagFilter"),
      first: document.getElementById("firstAuthorFilter"), corr: document.getElementById("correspondingFilter"), sort: document.getElementById("sortOrder"),
      list: document.getElementById("publicationList"), count: document.getElementById("resultsCount"), clear: document.getElementById("clearFilters"),
      firstLabel: document.getElementById("firstAuthorLabel"), corrLabel: document.getElementById("correspondingLabel"), sortLabel: document.getElementById("sortLabel")
    });
    try {
      const response = await fetch("data/publications.json");
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = await response.json();
      items = Array.isArray(data.items) ? data.items : [];
      buildFilters();
      for (const el of [els.search, els.year, els.tag, els.first, els.corr, els.sort]) el.addEventListener("input", render);
      els.clear.addEventListener("click", () => { els.search.value = ""; els.year.value = ""; els.tag.value = ""; els.first.checked = false; els.corr.checked = false; els.sort.value = "newest"; render(); });
      localize();
      document.addEventListener("site:language", localize);
    } catch (error) {
      console.error("No se pudo leer el catálogo de publicaciones:", error);
      els.count.textContent = t().noData;
      els.list.innerHTML = `<div class="empty-state">${escapeHtml(t().noData)}</div>`;
    }
  });
})();
