(() => {
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const safeURL = (value) => {
    try {
      const url = new URL(value, window.location.href);
      return ["https:", "http:"].includes(url.protocol) ? url.href : "";
    } catch (_) { return ""; }
  };
  const labels = {
    es: { first: "Primer autor", corr: "Autor de correspondencia", link: "Ver publicación ↗", error: "No se pudieron cargar las publicaciones." },
    en: { first: "First author", corr: "Corresponding author", link: "View publication ↗", error: "Publications could not be loaded." }
  };
  const lang = () => document.documentElement.lang === "en" ? "en" : "es";
  const target = document.getElementById("homePublications");
  if (!target) return;

  async function render() {
    try {
      const response = await fetch("data/publications.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const items = Array.isArray(data.items) ? data.items.slice() : [];
      items.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
      const recent = items.slice(0, 3);
      const text = labels[lang()];
      target.innerHTML = recent.length ? recent.map(item => {
        const roleBadges = [];
        if (item.firstAuthor) roleBadges.push(`<span>${escapeHTML(text.first)}</span>`);
        if (item.correspondingAuthor) roleBadges.push(`<span>${escapeHTML(text.corr)}</span>`);
        const href = safeURL(item.link || item.pdfLink);
        return `<article class="home-pub-card"><span class="home-pub-year">${escapeHTML(item.year || "—")}</span><div class="home-pub-copy"><p class="home-pub-citation">${escapeHTML(item.title ? `${item.citation} ${item.title}` : item.citation)}</p>${roleBadges.length ? `<div class="home-pub-badges">${roleBadges.join("")}</div>` : ""}${href ? `<a href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(text.link)}</a>` : ""}</div></article>`;
      }).join("") : `<p class="muted-note">${escapeHTML(text.error)}</p>`;
    } catch (error) {
      target.innerHTML = `<p class="muted-note">${escapeHTML(labels[lang()].error)}</p>`;
    }
  }

  document.addEventListener("DOMContentLoaded", render, { once: true });
  document.addEventListener("site:language", render);
})();
