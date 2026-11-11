(() => {
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const lang = () => document.documentElement.lang === "en" ? "en" : "es";
  const text = (value) => typeof value === "object" && value !== null ? String(value[lang()] ?? value.es ?? value.en ?? "") : String(value ?? "");
  const labels = {
    es: { projects: "Proyectos relacionados", download: "Descargar", link: "Abrir recurso", cite: "Para citar:", empty: "No hay elementos publicados en esta sección." },
    en: { projects: "Related projects", download: "Download", link: "Open resource", cite: "How to cite:", empty: "There are no published items in this section." }
  };
  const safeHref = (value) => {
    const raw = String(value ?? "").trim();
    if (!raw || raw === "#") return "";
    if (/^(https?:|mailto:)/i.test(raw)) return raw;
    if (/^(?:img|files|uploads|data)\/[a-z0-9._/-]+$/i.test(raw) && !raw.includes("..")) return raw;
    return "";
  };
  const pathValue = (object, path) => String(path || "").split(".").reduce((value, key) => value?.[key], object);
  let content = null;

  function applyCopy() {
    if (!content) return;
    document.querySelectorAll("[data-cms-copy]").forEach((element) => {
      const value = text(pathValue(content, element.dataset.cmsCopy));
      if (value) element.textContent = value;
    });
  }

  function row(item) {
    const year = escapeHtml(item.year || "");
    const file = safeHref(item.attachment);
    const link = safeHref(item.link);
    const action = file ? `<a class="record-file-link" href="${escapeHtml(file)}" download>${escapeHtml(labels[lang()].download)} ↗</a>` : link ? `<a class="record-file-link" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(labels[lang()].link)} ↗</a>` : "";
    return `<tr><td class="pub-year">${year}</td><td class="pub-ref">${escapeHtml(text(item.text))}${action ? `<div>${action}</div>` : ""}</td></tr>`;
  }

  function renderProfile() {
    const profile = content.profile || {};
    document.querySelectorAll("[data-profile-name]").forEach((el) => { el.textContent = profile.name || ""; });
    document.querySelectorAll("[data-profile-photo]").forEach((el) => {
      const photo = safeHref(profile.photo);
      if (photo) el.src = photo;
      el.alt = `${lang() === "es" ? "Foto de " : "Photo of "}${profile.name || ""}`;
    });
    document.querySelectorAll('[data-profile-field="role"]').forEach((el) => { el.textContent = text(profile.role); });
    document.querySelectorAll('[data-profile-field="affiliation"]').forEach((el) => { el.textContent = text(profile.affiliation); });
    document.querySelectorAll('[data-profile-field="location"]').forEach((el) => { el.textContent = text(profile.location); });
    document.querySelectorAll("[data-profile-email]").forEach((el) => { el.textContent = profile.email || ""; });
    const emailAnchor = document.querySelector("#profileSocials a[href^='mailto:']");
    if (emailAnchor && profile.email) emailAnchor.href = `mailto:${profile.email}`;
    const membershipList = document.getElementById("profileMemberships");
    if (membershipList) membershipList.innerHTML = (profile.memberships || []).map((item) => {
      const href = safeHref(item.url);
      const label = escapeHtml(text(item.text));
      return `<li>${href ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${label}</a>` : label}</li>`;
    }).join("");
    const sidebarLinks = document.getElementById("profileSocialLinks");
    const homeLinks = document.getElementById("homeProfileLinks");
    const links = (profile.socialLinks || []).filter((item) => item.url && !String(item.url).startsWith("mailto:"));
    if (sidebarLinks) sidebarLinks.innerHTML = links.map((item) => {
      const href = safeHref(item.url), icon = safeHref(item.icon);
      return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(text(item.label))}">${icon ? `<img src="${escapeHtml(icon)}" alt="" class="social-icon">` : ""}<span>${escapeHtml(text(item.label))}</span></a>`;
    }).join("");
    if (homeLinks) homeLinks.innerHTML = links.map((item) => {
      const href = safeHref(item.url), icon = safeHref(item.icon);
      return `<a class="profile-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${icon ? `<img src="${escapeHtml(icon)}" alt="">` : ""}<span>${escapeHtml(text(item.label))}</span><span class="profile-arrow" aria-hidden="true">↗</span></a>`;
    }).join("");
  }

  function renderPeople(items, targetId, kind) {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.innerHTML = items.length ? items.map((item) => {
      const photo = safeHref(item.photo);
      const name = escapeHtml(text(item.name));
      let details = "";
      if (kind === "group") {
        details = String(text(item.bio)).split("\n").filter(Boolean).map((line) => `<li>${escapeHtml(line)}</li>`).join("");
      } else {
        details = [item.degree, item.position, item.interests].map((part) => text(part)).filter(Boolean).map((line) => `<li>${escapeHtml(line)}</li>`).join("");
      }
      return `<article class="person-card" data-cursor-size="1.22"><div class="group-member-text"><h4>${name}</h4><ul class="member-details">${details}</ul></div>${photo ? `<div class="group-member-image"><img src="${escapeHtml(photo)}" alt="${name}" class="profile-placeholder" loading="lazy"></div>` : ""}</article>`;
    }).join("") : `<div class="empty-state">${escapeHtml(labels[lang()].empty)}</div>`;
  }

  function renderContent() {
    if (!content) return;
    applyCopy();
    renderProfile();
    const presentationRows = document.getElementById("presentationsRows");
    if (presentationRows) presentationRows.innerHTML = (content.presentations || []).map(row).join("");

    const projectGrid = document.getElementById("projectsCurrent");
    if (projectGrid) projectGrid.innerHTML = (content.projectsCurrent || []).map((item, index) => {
      const href = safeHref(item.link);
      return `<article id="${escapeHtml(item.id || `proyecto-${index + 1}`)}" class="project-card" data-cursor-size="1.25"><span class="project-number">${String(index + 1).padStart(2, "0")}</span><p class="project-status">${escapeHtml(text(item.status))}</p><h3>${escapeHtml(text(item.title))}</h3><p>${escapeHtml(text(item.description))}</p><span class="project-topic">${escapeHtml(text(item.topics))}</span>${href ? `<p><a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(labels[lang()].link)} ↗</a></p>` : ""}</article>`;
    }).join("") || `<div class="empty-state">${escapeHtml(labels[lang()].empty)}</div>`;
    const archiveRows = document.getElementById("projectsArchiveRows");
    if (archiveRows) {
      const archive = content.projectsArchive || [];
      const categories = [...new Set(archive.map((item) => text(item.category)).filter(Boolean))];
      archiveRows.innerHTML = archive.map(row).join("");
      const details = document.getElementById("projectsArchive");
      if (details) {
        const wasOpen = details.open;
        details.innerHTML = `<summary>${escapeHtml(text(content.pageCopy?.projects?.archiveTitle))}</summary><p class="muted-note">${escapeHtml(text(content.pageCopy?.projects?.archiveIntro))}</p>${categories.map((category) => `<h3 class="subsection-title">${escapeHtml(category)}</h3><table class="publications-table"><tbody>${archive.filter((item) => text(item.category) === category).map(row).join("")}</tbody></table>`).join("")}`;
        details.open = wasOpen;
      }
    }

    const setRows = (id, items) => { const target = document.getElementById(id); if (target) target.innerHTML = (items || []).map(row).join(""); };
    setRows("teachingUndergraduateRows", content.teachingUndergraduate);
    setRows("teachingGraduateRows", content.teachingGraduate);
    setRows("outreachArticlesRows", content.outreachArticles);
    setRows("outreachEventsRows", content.outreachEvents);
    setRows("outreachInterviewsRows", content.outreachInterviews);

    renderPeople(content.groupMembers || [], "groupMembersList", "group");
    renderPeople(content.collaborators || [], "collaboratorsList", "collaborators");

    const resourceList = document.getElementById("publicResourcesList");
    if (resourceList) resourceList.innerHTML = (content.publicResources || []).map((item) => {
      const file = safeHref(item.file), url = safeHref(item.url);
      const buttonText = escapeHtml(text(item.button) || (file ? labels[lang()].download : labels[lang()].link));
      const href = file || url;
      const action = href ? `<a href="${escapeHtml(href)}" ${file ? "download" : "target=\"_blank\" rel=\"noopener noreferrer\""} class="download-btn">${buttonText}</a>` : "";
      return `<article class="resource-card" data-cursor-size="1.2"><h4 class="resource-title">${escapeHtml(text(item.title))}</h4><p>${escapeHtml(text(item.description))}</p>${text(item.citation) ? `<div class="citation-box"><strong>${escapeHtml(content.pageCopy?.resources?.citationLabel?.[lang()] || labels[lang()].cite)}</strong><br>${escapeHtml(text(item.citation))}</div>` : ""}${action}</article>`;
    }).join("") || `<div class="empty-state">${escapeHtml(labels[lang()].empty)}</div>`;

    const blogList = document.getElementById("blogPostsList");
    if (blogList) blogList.innerHTML = (content.blogPosts || []).map((item) => {
      const href = safeHref(item.url);
      const image = safeHref(item.image);
      return `<article class="blog-post">${image ? `<img class="blog-post-image" src="${escapeHtml(image)}" alt="" loading="lazy">` : ""}<h4>${escapeHtml(text(item.title))}</h4><span>${escapeHtml(text(item.date))}</span><p>${escapeHtml(text(item.excerpt))}</p>${href ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(content.pageCopy?.blog?.readMore?.[lang()] || labels[lang()].link)}</a>` : ""}</article>`;
    }).join("") || `<div class="empty-state">${escapeHtml(labels[lang()].empty)}</div>`;

    const areas = document.getElementById("researchAreas");
    if (areas) areas.innerHTML = (content.areas || []).map((item, index) => {
      const href = safeHref(item.link);
      return `<article class="research-card" data-cursor-size="1.45"><span class="card-index">${escapeHtml(item.number || String(index + 1).padStart(2, "0"))}</span><h3>${escapeHtml(text(item.title))}</h3><p>${escapeHtml(text(item.description))}</p>${href ? `<a href="${escapeHtml(href)}">${escapeHtml(content.homeCopy?.homeAreaLink?.[lang()] || labels[lang()].projects)} <span aria-hidden="true">↗</span></a>` : ""}</article>`;
    }).join("");
    const methods = document.getElementById("homeMethods");
    if (methods) methods.innerHTML = (content.methods || []).map((item) => `<span>${escapeHtml(text(item.label))}</span>`).join("");
    const education = document.getElementById("educationList");
    if (education) education.innerHTML = (content.education || []).map((item) => `<article><span>${escapeHtml(item.year)}</span><div><h3>${escapeHtml(text(item.degree))}</h3><p>${escapeHtml(text(item.institution))}</p></div></article>`).join("");
  }

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("data/site-content.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      content = await response.json();
      renderContent();
      document.addEventListener("site:language", renderContent);
      window.addEventListener("site:components-loaded", renderProfile);
    } catch (error) {
      console.error("No se pudo cargar el contenido administrable:", error);
    }
  });
})();
