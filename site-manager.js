(() => {
  const REPOSITORY = "angulo-chavira/angulo-chavira.github.io";
  const DRAFT_KEY = "armando-site-content-draft-v1";
  const LEGACY_PUBLICATIONS_DRAFT_KEY = "armando-publications-draft-v1";
  const MAX_FILE_BYTES = 12 * 1024 * 1024;
  const ALLOWED_EXTENSIONS = new Set(["pdf", "csv", "xlsx", "docx", "pptx", "png", "jpg", "jpeg", "webp"]);
  const $ = (id) => document.getElementById(id);
  const copy = (value) => JSON.parse(JSON.stringify(value));
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const makeId = () => globalThis.crypto?.randomUUID?.() || `cms-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let content = null;
  let publications = null;
  let baselineContent = null;
  let baselinePublications = null;
  let pendingUploads = [];
  let activeSection = "profile";
  let connectedUser = "";

  const F = (key, label, type = "text", options = {}) => ({ key, label, type, ...options });
  const localized = (key, label, type = "textarea") => F(key, label, "localized", { controlType: type });

  const sections = [
    {
      id: "profile", label: "Perfil e inicio", objects: [
        { title: "Datos del perfil", path: ["profile"], fields: [F("name", "Nombre"), localized("role", "Puesto o perfil", "text"), localized("affiliation", "Adscripción", "text"), localized("location", "Ubicación", "text"), F("email", "Correo", "email"), F("photo", "Foto de perfil", "asset")] },
        { title: "Textos de la página de inicio", path: ["homeCopy"], fields: [localized("homeEyebrow", "Etiqueta superior", "text"), localized("homeTitle", "Título principal", "text"), localized("homeLead", "Presentación"), localized("homeMethodsTitle", "Título de métodos", "text"), localized("homeTrainingTitle", "Título de trayectoria", "text"), localized("homeCtaPubs", "Botón de publicaciones", "text"), localized("homeCtaProjects", "Botón de proyectos", "text")] }
      ], collections: [
        { title: "Membresías del perfil", path: ["profile", "memberships"], fields: [localized("text", "Membresía", "text"), F("url", "Enlace", "url")] },
        { title: "Perfiles académicos", path: ["profile", "socialLinks"], fields: [localized("label", "Nombre del perfil", "text"), F("url", "Enlace", "url"), F("icon", "Ícono", "asset")] },
        { title: "Métodos", path: ["methods"], fields: [localized("label", "Método", "text")] },
        { title: "Formación académica", path: ["education"], fields: [F("year", "Año", "text"), localized("degree", "Grado", "text"), localized("institution", "Institución", "text")] }
      ]
    },
    {
      id: "publications", label: "Publicaciones", objects: [
        { title: "Título e introducción", path: ["pageCopy", "publications"], fields: [localized("title", "Título", "text"), localized("intro", "Introducción")] }
      ], publications: true, collections: [
        { title: "Artículos y capítulos", path: ["items"], root: "publications", fields: [F("year", "Año", "number"), F("title", "Título breve", "text"), F("journal", "Revista o editorial", "text"), F("citation", "Referencia bibliográfica", "textarea"), F("link", "DOI o enlace", "url"), F("pdfLink", "PDF: enlace o archivo", "asset"), F("tags", "Etiquetas (separadas por comas)", "tags"), F("abstract", "Resumen"), F("bibtex", "BibTeX", "textarea"), F("firstAuthor", "Primer autor", "checkbox"), F("correspondingAuthor", "Autor de correspondencia", "checkbox")] }
      ]
    },
    {
      id: "projects", label: "Proyectos", objects: [
        { title: "Textos de la sección", path: ["pageCopy", "projects"], fields: [localized("eyebrow", "Etiqueta superior", "text"), localized("title", "Título", "text"), localized("intro", "Introducción"), localized("currentEyebrow", "Etiqueta de proyectos actuales", "text"), localized("currentTitle", "Título de proyectos actuales", "text"), localized("currentIntro", "Introducción de proyectos actuales"), localized("archiveTitle", "Título del archivo", "text"), localized("archiveIntro", "Introducción del archivo")] }
      ], collections: [
        { title: "Proyectos en desarrollo", path: ["projectsCurrent"], fields: [F("id", "Identificador del enlace", "text"), localized("status", "Estado", "text"), localized("title", "Título", "text"), localized("description", "Descripción"), localized("topics", "Temas", "text"), F("link", "Enlace", "url")] },
        { title: "Otros proyectos y colaboraciones", path: ["projectsArchive"], fields: [F("year", "Año", "text"), F("category", "Grupo o institución", "text"), localized("text", "Descripción", "textarea"), F("link", "Enlace", "url"), F("attachment", "Archivo adjunto", "asset")] }
      ]
    },
    {
      id: "presentations", label: "Presentaciones", objects: [
        { title: "Textos de la sección", path: ["pageCopy", "presentations"], fields: [localized("title", "Título", "text"), localized("intro", "Introducción")] }
      ], collections: [
        { title: "Ponencias y conferencias", path: ["presentations"], fields: [F("year", "Año", "text"), localized("text", "Referencia", "textarea"), F("link", "Enlace", "url"), F("attachment", "PDF o archivo adjunto", "asset")] }
      ]
    },
    {
      id: "outreach", label: "Divulgación", objects: [
        { title: "Textos de la sección", path: ["pageCopy", "outreach"], fields: [localized("title", "Título", "text"), localized("articlesTitle", "Título de artículos", "text"), localized("eventsTitle", "Título de eventos", "text"), localized("interviewsTitle", "Título de entrevistas", "text")] }
      ], collections: [
        { title: "Artículos de divulgación", path: ["outreachArticles"], fields: [F("year", "Año", "text"), localized("text", "Referencia", "textarea"), F("link", "Enlace", "url"), F("attachment", "Archivo adjunto", "asset")] },
        { title: "Organización de eventos", path: ["outreachEvents"], fields: [F("year", "Año", "text"), localized("text", "Descripción", "textarea"), F("link", "Enlace", "url"), F("attachment", "Archivo adjunto", "asset")] },
        { title: "Entrevistas", path: ["outreachInterviews"], fields: [F("year", "Año", "text"), localized("text", "Referencia", "textarea"), F("link", "Enlace", "url"), F("attachment", "Archivo adjunto", "asset")] }
      ]
    },
    {
      id: "teaching", label: "Docencia", objects: [
        { title: "Textos de la sección", path: ["pageCopy", "teaching"], fields: [localized("title", "Título", "text"), localized("undergraduateTitle", "Título de licenciatura", "text"), localized("graduateTitle", "Título de posgrado", "text")] }
      ], collections: [
        { title: "Cursos de licenciatura", path: ["teachingUndergraduate"], fields: [F("year", "Año", "text"), localized("text", "Curso y periodo", "textarea"), F("link", "Enlace", "url"), F("attachment", "Programa u otro archivo", "asset")] },
        { title: "Cursos de posgrado", path: ["teachingGraduate"], fields: [F("year", "Año", "text"), localized("text", "Curso y periodo", "textarea"), F("link", "Enlace", "url"), F("attachment", "Programa u otro archivo", "asset")] }
      ]
    },
    {
      id: "group", label: "Miembros del grupo", objects: [
        { title: "Textos de la sección", path: ["pageCopy", "group"], fields: [localized("title", "Título", "text"), localized("intro", "Introducción")] }
      ], collections: [
        { title: "Estudiantes y miembros", path: ["groupMembers"], fields: [localized("name", "Nombre", "text"), localized("bio", "Descripción"), F("photo", "Fotografía", "asset")] }
      ]
    },
    {
      id: "collaborations", label: "Colaboraciones", objects: [
        { title: "Textos de la sección", path: ["pageCopy", "collaborations"], fields: [localized("title", "Título", "text"), localized("intro", "Introducción")] }
      ], collections: [
        { title: "Colaboradores", path: ["collaborators"], fields: [localized("name", "Nombre", "text"), localized("degree", "Grado", "text"), localized("position", "Adscripción o puesto"), localized("interests", "Áreas de investigación"), F("photo", "Fotografía", "asset")] }
      ]
    },
    {
      id: "resources", label: "Recursos públicos", objects: [
        { title: "Textos de la sección", path: ["pageCopy", "resources"], fields: [localized("title", "Título", "text"), localized("citationLabel", "Etiqueta de cita", "text")] }
      ], collections: [
        { title: "Bases de datos y materiales", path: ["publicResources"], fields: [localized("title", "Título", "text"), localized("description", "Descripción"), localized("citation", "Cita"), localized("button", "Texto del botón", "text"), F("file", "Archivo para descargar", "asset"), F("url", "Enlace externo", "url")] }
      ]
    },
    {
      id: "blog", label: "Blog", objects: [
        { title: "Textos de la sección", path: ["pageCopy", "blog"], fields: [localized("title", "Título", "text"), localized("intro", "Introducción"), localized("readMore", "Texto del enlace", "text")] }
      ], collections: [
        { title: "Entradas", path: ["blogPosts"], fields: [localized("title", "Título", "text"), localized("date", "Fecha", "text"), localized("excerpt", "Resumen"), F("image", "Imagen de portada", "asset"), F("url", "Enlace a la entrada", "url")] }
      ]
    }
  ];

  function setStatus(message, error = false) {
    const status = $("managerStatus");
    if (!status) return;
    status.textContent = message;
    status.dataset.state = error ? "error" : "ok";
  }

  function setConnectionStatus(message, error = false) {
    const status = $("connectionStatus");
    if (status) { status.textContent = message; status.dataset.state = error ? "error" : "ok"; }
  }

  function getRoot(rootName) { return rootName === "publications" ? publications : content; }
  function getPath(root, path) { return path.reduce((value, key) => value == null ? undefined : value[key], root); }
  function setPath(root, path, value) {
    let node = root;
    for (let i = 0; i < path.length - 1; i += 1) node = node[path[i]];
    node[path[path.length - 1]] = value;
  }
  function stringifyPath(path) { return escapeHtml(JSON.stringify(path)); }
  function addEditorIds() {
    if (!content || !publications) return;
    content.profile._cmsId ||= "profile-root";
    const lists = ["profile.memberships", "profile.socialLinks", "areas", "methods", "education", "presentations", "projectsCurrent", "projectsArchive", "teachingUndergraduate", "teachingGraduate", "outreachArticles", "outreachEvents", "outreachInterviews", "groupMembers", "collaborators", "publicResources", "blogPosts"];
    lists.forEach((path) => {
      const list = getPath(content, path.split("."));
      (Array.isArray(list) ? list : []).forEach((item) => { item._cmsId ||= makeId(); });
    });
    (publications.items || []).forEach((item) => { item._cmsId ||= makeId(); });
  }

  function cleanInternal(value) {
    if (Array.isArray(value)) return value.map(cleanInternal);
    if (!value || typeof value !== "object") return value;
    const output = {};
    Object.keys(value).forEach((key) => { if (key !== "_cmsId") output[key] = cleanInternal(value[key]); });
    return output;
  }

  function findById(root, id) {
    if (!root || typeof root !== "object") return null;
    if (root._cmsId === id) return root;
    for (const value of Object.values(root)) {
      if (Array.isArray(value)) {
        for (const item of value) { const found = findById(item, id); if (found) return found; }
      } else if (value && typeof value === "object") {
        const found = findById(value, id); if (found) return found;
      }
    }
    return null;
  }

  function defaultValue(field) {
    if (field.type === "localized") return { es: "", en: "" };
    if (field.type === "checkbox") return false;
    if (field.type === "tags") return [];
    return "";
  }

  function newItem(fields) {
    const item = { _cmsId: makeId() };
    fields.forEach((field) => { item[field.key] = defaultValue(field); });
    return item;
  }

  function pendingFor(ownerId, key) { return pendingUploads.find((upload) => upload.ownerId === ownerId && upload.fieldKey === key); }

  function renderField(field, value, path, ownerId) {
    const pathAttr = stringifyPath(path);
    if (field.type === "localized") {
      const data = value && typeof value === "object" ? value : { es: "", en: "" };
      const control = (language) => {
        const actualType = field.controlType || "textarea";
        const current = escapeHtml(data[language] || "");
        return `<label class="cms-locale-field"><span>${language === "es" ? "Español" : "English"}</span>${actualType === "textarea" ? `<textarea data-root="content" data-path="${stringifyPath([...path, language])}" rows="3">${current}</textarea>` : `<input type="${actualType}" data-root="content" data-path="${stringifyPath([...path, language])}" value="${current}">`}</label>`;
      };
      return `<fieldset class="cms-localized"><legend>${escapeHtml(field.label)}</legend><div class="cms-locale-grid">${control("es")}${control("en")}</div></fieldset>`;
    }
    if (field.type === "checkbox") return `<label class="cms-check-field"><input type="checkbox" data-root="${path[0] === "items" ? "publications" : "content"}" data-path="${pathAttr}" ${value ? "checked" : ""}><span>${escapeHtml(field.label)}</span></label>`;
    if (field.type === "asset") {
      const queued = pendingFor(ownerId, field.key);
      const accept = ".pdf,.csv,.xlsx,.docx,.pptx,.png,.jpg,.jpeg,.webp";
      return `<div class="cms-asset-field"><label>${escapeHtml(field.label)}<input type="text" data-root="${path[0] === "items" ? "publications" : "content"}" data-path="${pathAttr}" value="${escapeHtml(value || "")}" placeholder="Ruta en el sitio o enlace"></label><label class="cms-file-picker">Subir archivo<input type="file" accept="${accept}" data-upload-owner="${escapeHtml(ownerId)}" data-upload-field="${escapeHtml(field.key)}"></label>${queued ? `<span class="cms-upload-pending">Listo para subir: ${escapeHtml(queued.file.name)}</span>` : ""}</div>`;
    }
    if (field.type === "tags") return `<label>${escapeHtml(field.label)}<input type="text" data-root="publications" data-path="${pathAttr}" data-value-type="tags" value="${escapeHtml(Array.isArray(value) ? value.join(", ") : "")}" placeholder="Separadas por comas"></label>`;
    if (field.type === "textarea") return `<label>${escapeHtml(field.label)}<textarea data-root="${path[0] === "items" ? "publications" : "content"}" data-path="${pathAttr}" rows="4">${escapeHtml(value || "")}</textarea></label>`;
    const type = ["number", "url", "email"].includes(field.type) ? field.type : "text";
    return `<label>${escapeHtml(field.label)}<input type="${type}" data-root="${path[0] === "items" ? "publications" : "content"}" data-path="${pathAttr}" data-value-type="${type}" value="${escapeHtml(value ?? "")}"></label>`;
  }

  function renderObject(objectConfig) {
    const data = getPath(content, objectConfig.path) || {};
    const ownerId = data._cmsId || "profile-root";
    return `<fieldset class="cms-object-editor"><legend>${escapeHtml(objectConfig.title)}</legend><div class="cms-field-grid">${objectConfig.fields.map((field) => renderField(field, data[field.key], [...objectConfig.path, field.key], ownerId)).join("")}</div></fieldset>`;
  }

  function renderCollection(collection) {
    const rootName = collection.root || "content";
    const root = getRoot(rootName);
    const rows = getPath(root, collection.path) || [];
    const prefix = collection.root ? ["items"] : collection.path;
    return `<section class="cms-collection"><div class="cms-collection-heading"><div><h3>${escapeHtml(collection.title)}</h3><span>${rows.length} ${rows.length === 1 ? "registro" : "registros"}</span></div><button type="button" class="action-button secondary" data-add="${escapeHtml(JSON.stringify(collection.path))}" data-root="${rootName}">+ Agregar</button></div><div class="cms-records">${rows.map((item, index) => {
      const ownerId = item._cmsId || "";
      const base = [...prefix, index];
      const titleField = collection.fields.find((field) => ["title", "name", "text", "citation", "label"].includes(field.key));
      const titleValue = titleField ? (titleField.type === "localized" ? (item[titleField.key]?.es || item[titleField.key]?.en) : item[titleField.key]) : "";
      const heading = titleValue || `${collection.title.slice(0, -1)} ${index + 1}`;
      const fieldRoot = rootName === "publications" ? "publications" : "content";
      return `<article class="cms-record" data-record-id="${escapeHtml(ownerId)}"><header class="cms-record-heading"><strong>${escapeHtml(String(heading).slice(0, 90))}</strong><div><button type="button" class="cms-order-button" data-move="up" data-path="${stringifyPath([...collection.path, index])}" data-root="${rootName}" aria-label="Subir registro">↑</button><button type="button" class="cms-order-button" data-move="down" data-path="${stringifyPath([...collection.path, index])}" data-root="${rootName}" aria-label="Bajar registro">↓</button><button type="button" class="delete-button" data-remove="${escapeHtml(JSON.stringify([...collection.path, index]))}" data-root="${rootName}">Eliminar</button></div></header><div class="cms-field-grid">${collection.fields.map((field) => renderField(field, item[field.key], [...base, field.key], ownerId)).join("")}</div></article>`;
    }).join("") || `<div class="empty-state">No hay registros. Pulsa “Agregar” para crear uno.</div>`}</div></section>`;
  }

  function renderTabs() {
    $("cmsSectionTabs").innerHTML = sections.map((section) => `<button type="button" class="cms-tab ${section.id === activeSection ? "is-active" : ""}" data-tab="${section.id}" aria-current="${section.id === activeSection ? "page" : "false"}">${escapeHtml(section.label)}</button>`).join("");
  }

  function renderPanel() {
    const section = sections.find((item) => item.id === activeSection) || sections[0];
    const objects = (section.objects || []).map(renderObject).join("");
    const collections = (section.collections || []).map(renderCollection).join("");
    const notice = section.id === "resources" || section.id === "group" || section.id === "collaborations"
      ? `<p class="cms-section-note">Los archivos subidos aquí quedarán públicos en el sitio. Para imágenes, usa JPG o WebP optimizados; para documentos, sube solo materiales que puedas distribuir.</p>` : "";
    $("cmsEditorPanel").innerHTML = `<div class="cms-panel-heading"><div><p class="eyebrow">CONTENIDO EDITABLE</p><h2>${escapeHtml(section.label)}</h2></div><button id="resetDraft" class="action-button secondary" type="button">Descartar borrador local</button></div>${notice}${objects}${collections}`;
  }

  function render() { renderTabs(); renderPanel(); }

  function saveDraft() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ content: cleanInternal(content), publications: cleanInternal(publications) }));
      setStatus(pendingUploads.length ? `Borrador local guardado. ${pendingUploads.length} archivo(s) listo(s) para subir; no recargues la página antes del commit.` : "Borrador local guardado en este navegador.");
    } catch (_) { setStatus("El navegador no permitió guardar el borrador local.", true); }
  }

  function clearDraft() { try { localStorage.removeItem(DRAFT_KEY); localStorage.removeItem(LEGACY_PUBLICATIONS_DRAFT_KEY); } catch (_) { /* storage is optional */ } }

  function cleanValue(control) {
    if (control.type === "checkbox") return control.checked;
    if (control.dataset.valueType === "number") return control.value === "" ? "" : Number(control.value);
    if (control.dataset.valueType === "tags") return control.value.split(",").map((tag) => tag.trim()).filter(Boolean);
    return control.value;
  }

  function handleFieldInput(event) {
    const control = event.target.closest("[data-path][data-root]");
    if (!control) return;
    try {
      const root = getRoot(control.dataset.root);
      setPath(root, JSON.parse(control.dataset.path), cleanValue(control));
      saveDraft();
    } catch (error) { setStatus("No se pudo actualizar este campo.", true); }
  }

  function getCollection(path, rootName) { return getPath(getRoot(rootName), path); }

  function addCollectionItem(path, rootName) {
    const section = sections.find((item) => item.id === activeSection);
    const collection = (section?.collections || []).find((item) => JSON.stringify(item.path) === JSON.stringify(path) && (item.root || "content") === rootName);
    if (!collection) return;
    const rows = getCollection(path, rootName);
    rows.push(newItem(collection.fields));
    saveDraft(); renderPanel();
    const last = $("cmsEditorPanel").querySelector(".cms-record:last-child");
    last?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function removeCollectionItem(path, rootName) {
    const rows = getCollection(path.slice(0, -1), rootName);
    const item = rows?.[path[path.length - 1]];
    if (item?._cmsId) pendingUploads = pendingUploads.filter((upload) => upload.ownerId !== item._cmsId);
    rows?.splice(path[path.length - 1], 1);
    saveDraft(); renderPanel();
  }

  function moveCollectionItem(path, rootName, direction) {
    const rows = getCollection(path.slice(0, -1), rootName);
    const index = path[path.length - 1], next = index + direction;
    if (!rows || next < 0 || next >= rows.length) return;
    [rows[index], rows[next]] = [rows[next], rows[index]];
    saveDraft(); renderPanel();
  }

  function sanitizeName(name) {
    const pieces = String(name || "archivo").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(".");
    const extension = pieces.length > 1 ? pieces.pop().replace(/[^a-z0-9]/g, "") : "";
    const base = pieces.join("-").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 55) || "archivo";
    return extension ? `${base}.${extension}` : base;
  }

  function fileBasePath(ownerId, fieldKey, fileName) {
    const owner = findById(content, ownerId) || findById(publications, ownerId);
    const hint = owner?.title?.es || owner?.name?.es || owner?.citation || fieldKey;
    const safeHint = sanitizeName(String(hint).replace(/\.[^.]+$/, ""));
    return `uploads/${safeHint}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${sanitizeName(fieldKey)}-${sanitizeName(fileName)}`;
  }

  function handleUpload(event) {
    const input = event.target.closest("input[type=file][data-upload-owner]");
    if (!input) return;
    const file = input.files?.[0];
    if (!file) return;
    const extension = file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      setStatus("Formato no permitido. Usa PDF, CSV, XLSX, DOCX, PPTX, PNG, JPG o WebP.", true); input.value = ""; return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setStatus("El archivo supera el límite del editor (12 MB). Comprime el archivo o usa un enlace externo.", true); input.value = ""; return;
    }
    const ownerId = input.dataset.uploadOwner;
    const fieldKey = input.dataset.uploadField;
    const relativePath = fileBasePath(ownerId, fieldKey, file.name);
    pendingUploads = pendingUploads.filter((upload) => !(upload.ownerId === ownerId && upload.fieldKey === fieldKey));
    pendingUploads.push({ ownerId, fieldKey, file, path: relativePath });
    renderPanel();
    setStatus(`Archivo listo: ${file.name}. Se subirá con el siguiente commit.`);
  }

  function findOwnerAndSet(root, id, key, value) {
    const target = findById(root, id);
    if (!target) return false;
    target[key] = value;
    return true;
  }

  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    return btoa(binary);
  }

  function serializeFile(data) { return JSON.stringify(data, null, 2) + "\n"; }
  function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

  async function commitChanges() {
    if (!GitHubPublisher.connected) { setStatus("Conecta GitHub antes de hacer el commit.", true); return; }
    const button = $("commitChanges");
    button.disabled = true;
    button.textContent = "Preparando commit…";
    try {
      const nextContent = copy(content);
      const nextPublications = copy(publications);
      const files = [];
      for (const upload of pendingUploads) {
        const contentOwner = findById(nextContent, upload.ownerId);
        const publicationOwner = contentOwner ? null : findById(nextPublications, upload.ownerId);
        const owner = contentOwner || publicationOwner;
        if (!owner) throw new Error("Un archivo pendiente ya no corresponde a un registro. Vuelve a seleccionarlo.");
        owner[upload.fieldKey] = upload.path;
        files.push({ path: upload.path, content: arrayBufferToBase64(await upload.file.arrayBuffer()), encoding: "base64" });
      }

      const normalizedContent = cleanInternal(nextContent);
      const normalizedPublications = cleanInternal(nextPublications);
      const contentChanged = !same(normalizedContent, baselineContent);
      const publicationsChanged = !same(normalizedPublications, baselinePublications);
      const today = new Date().toISOString().slice(0, 10);
      if (contentChanged) { normalizedContent.updated = today; files.push({ path: "data/site-content.json", content: serializeFile(normalizedContent), encoding: "utf-8" }); }
      if (publicationsChanged) { normalizedPublications.updated = today; files.push({ path: "data/publications.json", content: serializeFile(normalizedPublications), encoding: "utf-8" }); }
      if (!files.length) throw new Error("No hay cambios para guardar.");

      const result = await GitHubPublisher.commit(files, $("commitMessage").value.trim() || "Actualizar contenido del sitio");
      content = nextContent;
      publications = nextPublications;
      if (contentChanged) content.updated = today;
      if (publicationsChanged) publications.updated = today;
      pendingUploads = [];
      baselineContent = cleanInternal(content);
      baselinePublications = cleanInternal(publications);
      clearDraft();
      renderPanel();
      setStatus(`Commit creado en ${result.repository} (${result.branch}). GitHub Pages publicará los cambios en unos momentos. ${result.url}`);
    } catch (error) {
      setStatus(error.message || "No se pudo crear el commit. Revisa el token y vuelve a intentar.", true);
    } finally {
      button.disabled = !GitHubPublisher.connected;
      button.textContent = "Guardar cambios y hacer commit";
    }
  }

  function setConnected(info) {
    connectedUser = info.login;
    $("githubConnectionState").textContent = `Conectado: @${info.login}`;
    $("githubConnectionState").classList.add("is-connected");
    $("connectGitHub").disabled = true;
    $("forgetGitHub").disabled = false;
    $("commitChanges").disabled = false;
    $("githubToken").value = "";
    setConnectionStatus(`Acceso listo para ${info.repository}; rama ${info.branch}. El token queda solo en memoria en esta pestaña.`);
  }

  async function connectGitHub() {
    const token = $("githubToken").value.trim();
    if (!token) { setConnectionStatus("Pega el token detallado generado en GitHub.", true); return; }
    $("connectGitHub").disabled = true;
    setConnectionStatus("Verificando token y acceso al repositorio…");
    try {
      const info = await GitHubPublisher.connect(token, REPOSITORY);
      setConnected(info);
    } catch (error) {
      $("connectGitHub").disabled = false;
      setConnectionStatus(error.message || "No se pudo conectar. Confirma el token y que tenga Contents: read/write.", true);
    }
  }

  function disconnectGitHub() {
    GitHubPublisher.disconnect();
    connectedUser = "";
    $("githubConnectionState").textContent = "Sin conectar";
    $("githubConnectionState").classList.remove("is-connected");
    $("connectGitHub").disabled = false;
    $("forgetGitHub").disabled = true;
    $("commitChanges").disabled = true;
    $("githubToken").value = "";
    setConnectionStatus("Se eliminó el token de la memoria de esta pestaña.");
  }

  async function loadData() {
    const [contentResponse, publicationsResponse] = await Promise.all([
      fetch("data/site-content.json", { cache: "no-store" }),
      fetch("data/publications.json", { cache: "no-store" })
    ]);
    if (!contentResponse.ok || !publicationsResponse.ok) throw new Error("No se pudieron cargar los datos publicados del sitio.");
    content = await contentResponse.json();
    publications = await publicationsResponse.json();
    baselineContent = cleanInternal(content);
    baselinePublications = cleanInternal(publications);

    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (draft?.content && draft?.publications) { content = draft.content; publications = draft.publications; setStatus("Se recuperó el borrador local de este navegador."); }
      else {
        const oldPublicationsDraft = JSON.parse(localStorage.getItem(LEGACY_PUBLICATIONS_DRAFT_KEY) || "null");
        if (Array.isArray(oldPublicationsDraft)) { publications.items = oldPublicationsDraft; setStatus("Se recuperó el borrador local anterior de publicaciones."); }
        else setStatus("Contenido publicado cargado. Puedes elegir una sección para editar.");
      }
    } catch (_) { setStatus("Contenido publicado cargado. Puedes elegir una sección para editar."); }
    addEditorIds();
  }

  document.addEventListener("DOMContentLoaded", async () => {
    $("repoName").textContent = `Repositorio: ${REPOSITORY}`;
    $("connectGitHub").addEventListener("click", connectGitHub);
    $("forgetGitHub").addEventListener("click", disconnectGitHub);
    $("commitChanges").addEventListener("click", commitChanges);

    try {
      await loadData();
      render();
      $("cmsSectionTabs").addEventListener("click", (event) => {
        const button = event.target.closest("[data-tab]");
        if (!button) return;
        activeSection = button.dataset.tab;
        render();
      });
      $("cmsEditorPanel").addEventListener("input", handleFieldInput);
      $("cmsEditorPanel").addEventListener("change", (event) => {
        if (event.target.matches("input[type=file][data-upload-owner]")) handleUpload(event);
        else handleFieldInput(event);
      });
      $("cmsEditorPanel").addEventListener("click", (event) => {
        const add = event.target.closest("[data-add]");
        const remove = event.target.closest("[data-remove]");
        const move = event.target.closest("[data-move]");
        const reset = event.target.closest("#resetDraft");
        if (add) addCollectionItem(JSON.parse(add.dataset.add), add.dataset.root);
        if (remove) removeCollectionItem(JSON.parse(remove.dataset.remove), remove.dataset.root);
        if (move) moveCollectionItem(JSON.parse(move.dataset.path), move.dataset.root, move.dataset.move === "up" ? -1 : 1);
        if (reset && window.confirm("¿Descartar el borrador local y volver al contenido publicado?")) {
          clearDraft(); pendingUploads = []; loadData().then(() => { renderPanel(); setStatus("Borrador descartado; se restauraron los datos publicados."); }).catch((error) => setStatus(error.message, true));
        }
      });
    } catch (error) {
      setStatus(error.message || "No se pudo iniciar el editor.", true);
    }
  });
})();
