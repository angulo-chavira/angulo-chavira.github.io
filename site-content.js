(() => {
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const lang = () => document.documentElement.lang === "en" ? "en" : "es";
  const text = (value) => typeof value === "object" && value !== null ? String(value[lang()] ?? value.es ?? value.en ?? "") : String(value ?? "");
  const labels = {
    es: { projects: "Proyectos relacionados", download: "Descargar", link: "Abrir recurso", cite: "Para citar:", empty: "No hay elementos publicados en esta sección." },
    en: { projects: "Related projects", download: "Download", link: "Open resource", cite: "How to cite:", empty: "There are no published items in this section." }
  };
  const studentLabels = {
    es: {
      participation: "Modalidad de participación",
      badges: "Modalidad de participación y nivel académico",
      level: "Nivel",
      types: {
        "servicio-social": "Servicio social",
        tesista: "Tesista",
        voluntariado: "Voluntariado",
        "practicas-profesionales": "Prácticas profesionales",
        "asistente-investigacion": "Asistente de investigación",
        estancia: "Estancia de investigación",
        otro: "Otra modalidad"
      },
      levels: {
        bachillerato: "Bachillerato",
        licenciatura: "Licenciatura",
        maestria: "Maestría",
        doctorado: "Doctorado",
        posdoctorado: "Posdoctorado",
        otro: "Otro nivel"
      }
    },
    en: {
      participation: "Participation type",
      badges: "Participation type and academic level",
      level: "Level",
      types: {
        "servicio-social": "Social service",
        tesista: "Thesis student",
        voluntariado: "Volunteer",
        "practicas-profesionales": "Professional internship",
        "asistente-investigacion": "Research assistant",
        estancia: "Research placement",
        otro: "Other role"
      },
      levels: {
        bachillerato: "High school",
        licenciatura: "Undergraduate",
        maestria: "Master's",
        doctorado: "Doctoral",
        posdoctorado: "Postdoctoral",
        otro: "Other level"
      }
    }
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
  let profilePhotoVariants = new Map();
  let profilePhotoResizeObserver = null;
  const observedProfilePhotos = new WeakSet();
  let profilePhotoSizeFrame = 0;

  // La foto original sigue definida una sola vez en profile.photo.
  // Este catálogo opcional contiene únicamente sus copias filtradas al reducirlas.
  async function loadProfilePhotoVariants() {
    const variants = new Map();
    try {
      const response = await fetch("data/profile-photo-variants.json", { cache: "no-store" });
      if (!response.ok) return variants;
      const data = await response.json();
      if (data?.schemaVersion !== 1 || !data.photos || typeof data.photos !== "object") return variants;
      Object.entries(data.photos).forEach(([source, entry]) => {
        const href = safeHref(source);
        const width = Number(entry?.width), height = Number(entry?.height);
        if (!href || !Number.isInteger(width) || width < 1 || !Number.isInteger(height) || height < 1) return;
        const sources = (Array.isArray(entry.sources) ? entry.sources : []).map((item) => ({
          src: safeHref(item?.src), width: Number(item?.width)
        })).filter((item) => item.src && Number.isInteger(item.width) && item.width > 0 && item.width <= width)
          .sort((a, b) => a.width - b.width);
        if (sources.length) variants.set(new URL(href, document.baseURI).href, { width, height, sources });
      });
    } catch (_) { /* Sin catálogo, se muestra la foto original. */ }
    return variants;
  }

  function applyProfilePhotoCandidate(el, variants) {
    const width = el.getBoundingClientRect().width;
    const fallback = el.classList.contains("profile-pic") ? 72 : 164;
    const zoom = Math.max(1, Number(window.visualViewport?.scale) || 1);
    const density = Math.max(0.5, Number(window.devicePixelRatio) || 1);
    const displayWidth = (width || fallback) * zoom;
    const requiredWidth = Math.ceil(displayWidth * density);
    const selected = variants.sources.find((item) => item.width >= requiredWidth) || {
      src: el.dataset.profilePhotoTarget, width: variants.width
    };
    // sizes expresa píxeles CSS; el navegador incorpora la densidad de la pantalla.
    const sizes = `${Math.max(1, Math.ceil(displayWidth))}px`;
    if (el.sizes !== sizes) el.sizes = sizes;
    // Ofrecer la copia elegida también obliga a cambiar a una más pequeña al alejar el zoom.
    // Así no se sigue reduciendo una copia grande que quedó en caché después de acercar.
    const srcset = `${selected.src} ${selected.width}w`;
    if (el.srcset !== srcset) el.srcset = srcset;
  }

  function updateProfilePhotoSize(el) {
    if (!el.hasAttribute("srcset")) return;
    const variants = profilePhotoVariants.get(el.dataset.profilePhotoTarget);
    if (variants) applyProfilePhotoCandidate(el, variants);
  }

  function queueProfilePhotoSizes() {
    if (profilePhotoSizeFrame) return;
    profilePhotoSizeFrame = requestAnimationFrame(() => {
      profilePhotoSizeFrame = 0;
      document.querySelectorAll("[data-profile-photo][srcset]").forEach(updateProfilePhotoSize);
    });
  }

  function clearProfilePhotoVariants(el) {
    ["srcset", "sizes", "width", "height"].forEach((attribute) => el.removeAttribute(attribute));
  }

  function configureProfilePhotoVariants(el, target) {
    const variants = profilePhotoVariants.get(target);
    if (!variants) return;
    el.width = variants.width;
    el.height = variants.height;
    applyProfilePhotoCandidate(el, variants);
    if (typeof ResizeObserver === "function" && !observedProfilePhotos.has(el)) {
      if (!profilePhotoResizeObserver) profilePhotoResizeObserver = new ResizeObserver(queueProfilePhotoSizes);
      profilePhotoResizeObserver.observe(el);
      observedProfilePhotos.add(el);
    }
  }

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
      el.alt = `${lang() === "es" ? "Foto de " : "Photo of "}${profile.name || ""}`;
      if (!photo) {
        clearProfilePhotoVariants(el);
        el.removeAttribute("src");
        el.dataset.profilePhotoStatus = "empty";
        el.classList.add("profile-photo-loading");
        return;
      }

      const target = new URL(photo, document.baseURI).href;
      if (el.dataset.profilePhotoTarget === target && ["loading", "loaded", "error"].includes(el.dataset.profilePhotoStatus)) return;
      clearProfilePhotoVariants(el);
      el.removeAttribute("src");
      el.dataset.profilePhotoTarget = target;
      el.dataset.profilePhotoStatus = "loading";
      el.classList.add("profile-photo-loading");
      const finish = (loaded) => {
        if (el.dataset.profilePhotoTarget !== target) return;
        if (loaded && el.naturalWidth > 0) {
          el.dataset.profilePhotoStatus = "loaded";
          el.classList.remove("profile-photo-loading");
        } else {
          el.dataset.profilePhotoStatus = "error";
          el.removeAttribute("src");
          el.classList.add("profile-photo-loading");
        }
      };
      el.addEventListener("load", () => finish(true), { once: true });
      el.addEventListener("error", () => {
        if (el.dataset.profilePhotoTarget !== target) return;
        if (el.hasAttribute("srcset")) {
          // Si aún no se subieron todas las copias, intentar la original.
          clearProfilePhotoVariants(el);
          el.addEventListener("error", () => finish(false), { once: true });
          el.src = target;
        } else finish(false);
      }, { once: true });
      configureProfilePhotoVariants(el, target);
      el.src = target;
      if (el.complete && el.naturalWidth > 0) finish(true);
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
      const badges = kind === "group" ? (() => {
        const dictionary = studentLabels[lang()];
        const roleBadges = (Array.isArray(item.participationTypes) ? item.participationTypes : [])
          .map((type) => dictionary.types[type])
          .filter(Boolean)
          .map((label) => `<span class="student-badge">${escapeHtml(label)}</span>`);
        const level = dictionary.levels[item.academicLevel];
        if (level) roleBadges.push(`<span class="student-badge student-badge--level">${escapeHtml(dictionary.level)}: ${escapeHtml(level)}</span>`);
        return roleBadges.length ? `<div class="student-badges" aria-label="${escapeHtml(dictionary.badges)}">${roleBadges.join("")}</div>` : "";
      })() : "";
      return `<article class="person-card${kind === "group" ? " student-card" : ""}" data-cursor-size="1.22"><div class="group-member-text"><h4>${name}</h4>${badges}<ul class="member-details">${details}</ul></div>${photo ? `<div class="group-member-image"><img src="${escapeHtml(photo)}" alt="${name}" loading="lazy" decoding="async"></div>` : ""}</article>`;
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
    const details = document.getElementById("projectsArchive");
    if (details) {
      const archive = content.projectsArchive || [];
      const categories = [...new Set(archive.map((item) => text(item.category)).filter(Boolean))];
      const wasOpen = details.open;
      details.innerHTML = `<summary>${escapeHtml(text(content.pageCopy?.projects?.archiveTitle))}</summary><p class="muted-note">${escapeHtml(text(content.pageCopy?.projects?.archiveIntro))}</p>${categories.map((category) => `<h3 class="subsection-title">${escapeHtml(category)}</h3><table class="publications-table"><tbody>${archive.filter((item) => text(item.category) === category).map(row).join("")}</tbody></table>`).join("")}`;
      details.open = wasOpen;
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

    const methods = document.getElementById("homeMethods");
    if (methods) methods.innerHTML = (content.methods || []).map((item) => `<span>${escapeHtml(text(item.label))}</span>`).join("");
    const education = document.getElementById("educationList");
    if (education) education.innerHTML = (content.education || []).map((item) => `<article class="trajectory-entry"><span>${escapeHtml(item.year)}</span><div><h3>${escapeHtml(text(item.degree))}</h3><p>${escapeHtml(text(item.institution))}</p></div></article>`).join("");
  }

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const [response, variants] = await Promise.all([
        fetch("data/site-content.json", { cache: "no-store" }),
        loadProfilePhotoVariants()
      ]);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      content = await response.json();
      profilePhotoVariants = variants;
      renderContent();
      document.addEventListener("site:language", renderContent);
      window.addEventListener("site:components-loaded", renderProfile);
      window.addEventListener("resize", queueProfilePhotoSizes, { passive: true });
      window.visualViewport?.addEventListener("resize", queueProfilePhotoSizes, { passive: true });
      document.addEventListener("toggle", queueProfilePhotoSizes, true);
    } catch (error) {
      console.error("No se pudo cargar el contenido administrable:", error);
      document.querySelectorAll("[data-profile-photo]").forEach((el) => {
        clearProfilePhotoVariants(el);
        el.removeAttribute("src");
        el.dataset.profilePhotoStatus = "error";
        el.classList.add("profile-photo-loading");
      });
    }
  });
})();
