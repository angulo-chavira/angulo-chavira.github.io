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
  const preparedResources = new Map();
  let resourceCatalog = { items: [] };
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
        { title: "Proyectos en desarrollo", path: ["projectsCurrent"], fields: [F("id", "Identificador del enlace", "text"), localized("status", "Estado", "text"), localized("title", "Título", "text"), localized("description", "Descripción"), localized("topics", "Temas", "text"), localized("question", "Pregunta de investigación"), localized("methods", "Enfoques y métodos"), localized("progress", "Avances"), localized("participants", "Equipo y colaboradores"), F("resourceIds", "Recursos relacionados (IDs separados por comas)", "tags"), F("publicationLinks", "Publicaciones relacionadas (URLs separadas por comas)", "tags"), F("link", "Enlace", "url")] },
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
      id: "group", label: "Estudiantes", objects: [
        { title: "Textos de la sección", path: ["pageCopy", "group"], fields: [localized("title", "Título", "text"), localized("intro", "Introducción")] },
        { title: "Trabajar conmigo", path: ["collaborationInfo"], fields: [localized("title", "Título", "text"), localized("intro", "Introducción"), localized("socialService", "Servicio social"), localized("thesis", "Tesis"), localized("volunteer", "Voluntariado")] }
      ], collections: [
        { title: "Estudiantes", path: ["groupMembers"], fields: [
          localized("name", "Nombre", "text"),
          F("participationTypes", "Modalidad de participación", "multiselect", { hint: "Puedes seleccionar más de una modalidad.", options: [
            { value: "servicio-social", label: "Servicio social" },
            { value: "tesista", label: "Tesista" },
            { value: "voluntariado", label: "Voluntariado" },
            { value: "practicas-profesionales", label: "Prácticas profesionales" },
            { value: "asistente-investigacion", label: "Asistente de investigación" },
            { value: "estancia", label: "Estancia de investigación" },
            { value: "otro", label: "Otra modalidad" }
          ] }),
          F("academicLevel", "Nivel académico", "select", { options: [
            { value: "", label: "Sin especificar" },
            { value: "bachillerato", label: "Bachillerato" },
            { value: "licenciatura", label: "Licenciatura" },
            { value: "maestria", label: "Maestría" },
            { value: "doctorado", label: "Doctorado" },
            { value: "posdoctorado", label: "Posdoctorado" },
            { value: "otro", label: "Otro nivel" }
          ] }),
          localized("bio", "Descripción"),
          F("photo", "Fotografía", "asset")
        ] }
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
        { title: "Bases de datos y materiales", path: ["publicResources"], fields: [localized("title", "Título", "text"), localized("description", "Descripción"), localized("citation", "Cita"), localized("button", "Texto del botón", "text"), F("file", "Archivo para descargar", "asset"), F("url", "Enlace externo", "url"), F("explorer", "Explorador de datos", "explorer")] }
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
    if (field.type === "explorer") return { id: "", enabled: false, kind: "csv", version: "Consulta 1", keyColumn: "", shortTitle: {es:"",en:""}, notes: {es:"",en:""}, variables: [] };
    if (field.type === "localized") return { es: "", en: "" };
    if (field.type === "checkbox") return false;
    if (field.type === "tags" || field.type === "multiselect") return [];
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
    const rootName = path[0] === "items" ? "publications" : "content";
    if (field.type === "explorer") {
      const cfg = value || {};
      const fields = [F("enabled", "Habilitar consulta interactiva", "checkbox"), F("id", "ID del recurso (sin espacios)"), F("kind", "Estructura del archivo", "select", { options: [{value:"anew",label:"ANEW (CSV)"},{value:"cloze",label:"Completamiento (Excel con Unified e IDs)"},{value:"csv",label:"Tabla general (CSV)"}] }), localized("shortTitle", "Nombre breve", "text"), localized("summary", "Presentación breve del explorador"), F("version", "Versión de consulta"), F("keyColumn", "Columna principal de búsqueda"), F("articleUrl", "Artículo relacionado (DOI o URL)", "url"), F("bibtex", "Referencia BibTeX", "textarea"), localized("notes", "Método y notas de uso"), localized("license", "Condiciones de uso")];
      const variables = Array.isArray(cfg.variables) ? cfg.variables : [];
      return `<details class="cms-explorer-settings"><summary>Explorador de datos · ${escapeHtml(cfg.id || "sin configurar")}</summary><p class="cms-section-note">Activa el explorador, elige la estructura y sube el CSV o Excel en “Archivo para descargar”. Puedes leer sus columnas antes del commit. Al guardar se prepara una copia ligera para la consulta.</p><div class="cms-field-grid">${fields.map(f => renderField(f, cfg[f.key], [...path, f.key], ownerId)).join("")}</div><button type="button" class="action-button secondary" data-inspect-resource="${escapeHtml(ownerId)}">Leer columnas y preparar consulta</button><details class="rx-more"><summary>Variables, etiquetas y filtros (${variables.length})</summary>${variables.map((v,i)=>`<details class="cms-variable-record"><summary>${escapeHtml(v.key)} · ${escapeHtml(v.label?.es || "")}</summary><div class="cms-field-grid">${[localized("label","Nombre visible","text"),localized("description","Definición"),F("type","Tipo","select",{options:[{value:"text",label:"Texto"},{value:"number",label:"Número"}]}),F("visible","Visible de inicio","checkbox"),F("filter","Usar como filtro numérico","checkbox")].map(f=>renderField(f,v[f.key],[...path,"variables",i,f.key],ownerId)).join("")}</div></details>`).join("")}</details></details>`;
    }
    if (field.type === "localized") {
      const data = value && typeof value === "object" ? value : { es: "", en: "" };
      const control = (language) => {
        const actualType = field.controlType || "textarea";
        const current = escapeHtml(data[language] || "");
        return `<label class="cms-locale-field"><span>${language === "es" ? "Español" : "English"}</span>${actualType === "textarea" ? `<textarea data-root="content" data-path="${stringifyPath([...path, language])}" rows="3">${current}</textarea>` : `<input type="${actualType}" data-root="content" data-path="${stringifyPath([...path, language])}" value="${current}">`}</label>`;
      };
      return `<fieldset class="cms-localized"><legend>${escapeHtml(field.label)}</legend><div class="cms-locale-grid">${control("es")}${control("en")}</div></fieldset>`;
    }
    if (field.type === "multiselect") {
      const selected = new Set(Array.isArray(value) ? value : []);
      return `<fieldset class="cms-multiselect" data-root="${rootName}" data-path="${pathAttr}" data-value-type="multiselect"><legend>${escapeHtml(field.label)}</legend>${field.hint ? `<span class="cms-field-hint">${escapeHtml(field.hint)}</span>` : ""}<div class="cms-multiselect-options">${(field.options || []).map((option) => `<label class="cms-check-field"><input type="checkbox" value="${escapeHtml(option.value)}" ${selected.has(option.value) ? "checked" : ""}><span>${escapeHtml(option.label)}</span></label>`).join("")}</div></fieldset>`;
    }
    if (field.type === "select") {
      return `<label>${escapeHtml(field.label)}<select data-root="${rootName}" data-path="${pathAttr}" data-value-type="select">${(field.options || []).map((option) => `<option value="${escapeHtml(option.value)}" ${String(value ?? "") === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select></label>`;
    }
    if (field.type === "checkbox") return `<label class="cms-check-field"><input type="checkbox" data-root="${path[0] === "items" ? "publications" : "content"}" data-path="${pathAttr}" ${value ? "checked" : ""}><span>${escapeHtml(field.label)}</span></label>`;
    if (field.type === "asset") {
      const queued = pendingFor(ownerId, field.key);
      const accept = ".pdf,.csv,.xlsx,.docx,.pptx,.png,.jpg,.jpeg,.webp";
      return `<div class="cms-asset-field"><label>${escapeHtml(field.label)}<input type="text" data-root="${path[0] === "items" ? "publications" : "content"}" data-path="${pathAttr}" value="${escapeHtml(value || "")}" placeholder="Ruta en el sitio o enlace"></label><label class="cms-file-picker">Subir archivo<input type="file" accept="${accept}" data-upload-owner="${escapeHtml(ownerId)}" data-upload-field="${escapeHtml(field.key)}"></label>${queued ? `<span class="cms-upload-pending">Listo para subir: ${escapeHtml(queued.file.name)}</span>` : ""}</div>`;
    }
    if (field.type === "tags") return `<label>${escapeHtml(field.label)}<input type="text" data-root="${rootName}" data-path="${pathAttr}" data-value-type="tags" value="${escapeHtml(Array.isArray(value) ? value.join(", ") : "")}" placeholder="Separadas por comas"></label>`;
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
    if (control.dataset.valueType === "multiselect") return [...control.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value);
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

  function mergeResourceColumns(owner, prepared) {
    const prior = new Map((owner.explorer.variables || []).map(v => [v.key, v]));
    owner.explorer.variables = prepared.columns.map((key, index) => prior.get(key) || { key, label: { es: key, en: key }, description: { es: "Columna del archivo de origen.", en: "Source file column." }, type: prepared.rows.slice(0,100).some(r => ResourceData.number(r[key]) != null) ? "number" : "text", visible: index < 5, filter: false });
    if (!prepared.columns.includes(owner.explorer.keyColumn)) owner.explorer.keyColumn = prepared.columns.includes("Word") ? "Word" : prepared.columns[0];
  }

  async function inspectResource(ownerId) {
    const owner = findById(content, ownerId);
    if (!owner?.explorer) throw new Error("Selecciona la estructura del explorador.");
    const pending = pendingFor(ownerId, "file"), path = pending?.path || owner.file;
    if (!path) throw new Error("Selecciona el CSV o Excel en Archivo para descargar.");
    setStatus("Leyendo el archivo y preparando los datos de consulta…");
    await new Promise(resolve => requestAnimationFrame(resolve));
    const response = pending ? null : await fetch(path, { cache: "no-store" });
    if (response && !response.ok) throw new Error("No se pudo leer el archivo de origen.");
    const bytes = new Uint8Array(pending ? await pending.file.arrayBuffer() : await response.arrayBuffer());
    const prepared = await ResourceData.prepare(bytes, path, owner.explorer.kind);
    preparedResources.set(ownerId, { data: prepared, path, kind: owner.explorer.kind });
    mergeResourceColumns(owner, prepared);
    saveDraft(); renderPanel();
    setStatus(`Consulta preparada: ${prepared.rows.length} registros, ${prepared.columns.length} columnas. Guarda con un commit para publicarla.`);
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

      const resourceIds = new Set();
      for (const owner of nextContent.publicResources || []) {
        if (!owner.explorer?.enabled) continue;
        const cfg = owner.explorer;
        if (!/^[a-z0-9_-]{1,80}$/i.test(cfg.id || "")) throw new Error("El ID de cada explorador debe contener letras, números, guiones o guiones bajos.");
        if (resourceIds.has(cfg.id)) throw new Error("El ID de explorador " + cfg.id + " está repetido. Usa un ID distinto para cada recurso.");
        resourceIds.add(cfg.id);
        owner.resourceId = cfg.id;
        if (!owner.file) throw new Error("El recurso " + cfg.id + " necesita un archivo CSV o Excel.");
        let cached = preparedResources.get(owner._cmsId);
        const uploaded = pendingUploads.some(u => u.ownerId === owner._cmsId && u.fieldKey === "file");
        const needsPreparation = uploaded || !cfg.variables?.length || (cfg.kind === "cloze" && cfg.preparedFor !== owner.file);
        if ((!cached || cached.path !== owner.file || cached.kind !== cfg.kind) && needsPreparation) {
          const upload = pendingFor(owner._cmsId, "file");
          const response = upload ? null : await fetch(owner.file, { cache: "no-store" });
          if (response && !response.ok) throw new Error("No se pudo leer el origen de " + cfg.id);
          const bytes = new Uint8Array(upload ? await upload.file.arrayBuffer() : await response.arrayBuffer());
          cached = { data: await ResourceData.prepare(bytes, owner.file, cfg.kind), path: owner.file, kind: cfg.kind };
        }
        if (cached && cached.path === owner.file && cached.kind === cfg.kind) {
          mergeResourceColumns(owner, cached.data);
          const path = `data/resources/${cfg.id}-${Date.now()}-${(cached.data.sourceSha256 || "data").slice(0,8)}.json.gz`;
          const compressed = fflate.gzipSync(fflate.strToU8(JSON.stringify(cached.data)), { level: 6 });
          files.push({ path, content: arrayBufferToBase64(compressed.buffer.slice(compressed.byteOffset, compressed.byteOffset + compressed.byteLength)), encoding: "base64" });
          cfg.preparedFile = path; cfg.preparedFor = owner.file;
        }
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
      preparedResources.clear();
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
    const [contentResponse, publicationsResponse, catalog] = await Promise.all([
      fetch("data/site-content.json", { cache: "no-store" }),
      fetch("data/publications.json", { cache: "no-store" }),
      fetch("data/resource-catalog.json", { cache: "no-store" }).then(r => r.ok ? r.json() : {items:[]}).catch(() => ({items:[]}))
    ]);
    if (!contentResponse.ok || !publicationsResponse.ok) throw new Error("No se pudieron cargar los datos publicados del sitio.");
    content = await contentResponse.json();
    resourceCatalog = catalog;
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
    if (content.profile?.photo === "img/profile.jpeg" && baselineContent.profile?.photo) {
      content.profile.photo = baselineContent.profile.photo;
    }
    const currentGroupCopy = baselineContent.pageCopy?.group || {};
    const obsoleteGroupCopy = {
      title: { es: "Miembros del Grupo de Investigación", en: "Research Group Members" },
      intro: {
        es: "Estudiantes y colegas que colaboran en proyectos del Laboratorio de Psicolingüística y en investigación sobre lenguaje y cognición.",
        en: "Students and colleagues collaborating on Psycholinguistics Laboratory projects and research on language and cognition."
      }
    };
    for (const key of ["title", "intro"]) {
      for (const language of ["es", "en"]) {
        if (content.pageCopy?.group?.[key]?.[language] === obsoleteGroupCopy[key][language] && currentGroupCopy[key]?.[language]) {
          content.pageCopy.group[key][language] = currentGroupCopy[key][language];
        }
      }
    }
    content.groupMembers ||= [];
    const currentStudents = new Map((baselineContent.groupMembers || []).map((student) => [student.name?.es, student]));
    content.groupMembers.forEach((student) => {
      const current = currentStudents.get(student.name?.es);
      if (!Array.isArray(student.participationTypes)) student.participationTypes = copy(current?.participationTypes || []);
      if (typeof student.academicLevel !== "string") student.academicLevel = current?.academicLevel || "";
      const oldBios = {
        "Alexandra Rosselli González Balderrama": {
          es: "Estudiante de Psicología y especialista en monitoreo de redes empresariales en Totalplay.",
          en: "Psychology student and enterprise network monitoring specialist at Totalplay."
        },
        "Arely Pérez Ramírez": {
          es: "Profesora de inglés y francés para niñas, niños, adolescentes y adultos. Sus intereses incluyen la educación consciente, la psicolingüística y las neurociencias.\nColabora en proyectos del Laboratorio de Psicolingüística de la Facultad de Psicología de la UNAM como parte de su servicio social.",
          en: "English and French teacher for children, teenagers, and adults. Her interests include conscious education, psycholinguistics, and neuroscience.\nShe collaborates on projects at the Psycholinguistics Laboratory, Faculty of Psychology, UNAM, as part of her social service."
        }
      };
      const oldBio = oldBios[student.name?.es];
      if (oldBio && current?.bio) {
        for (const language of ["es", "en"]) {
          if (student.bio?.[language] === oldBio[language]) student.bio[language] = current.bio[language];
        }
      }
    });
    content.collaborationInfo ||= copy(resourceCatalog.collaborationInfo || {title:{es:"",en:""},intro:{es:"",en:""},socialService:{es:"",en:""},thesis:{es:"",en:""},volunteer:{es:"",en:""}});
    (content.projectsCurrent || []).forEach(project => {
      for (const key of ["question","methods","progress","participants"]) project[key] ||= {es:"",en:""};
      project.resourceIds ||= []; project.publicationLinks ||= [];
    });
    (content.publicResources || []).forEach(resource => {
      const base = (resourceCatalog.items || []).find(c => c.id === resource.resourceId || c.id === resource.explorer?.id || c.matchFile === resource.file);
      resource.explorer = { ...(base ? copy(base) : { id:"",enabled:false,kind:"csv",version:"Consulta 1",variables:[] }), ...(resource.explorer || {}) };
      for (const key of ["shortTitle","summary","notes","license"]) resource.explorer[key] ||= {es:"",en:""};
      resource.explorer.variables ||= [];
      if (resource.explorer.id) resource.resourceId ||= resource.explorer.id;
    });
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
        const inspect = event.target.closest("[data-inspect-resource]");
        if (inspect) inspectResource(inspect.dataset.inspectResource).catch(error => setStatus(error.message, true));
        const add = event.target.closest("[data-add]");
        const remove = event.target.closest("[data-remove]");
        const move = event.target.closest("[data-move]");
        const reset = event.target.closest("#resetDraft");
        if (add) addCollectionItem(JSON.parse(add.dataset.add), add.dataset.root);
        if (remove) removeCollectionItem(JSON.parse(remove.dataset.remove), remove.dataset.root);
        if (move) moveCollectionItem(JSON.parse(move.dataset.path), move.dataset.root, move.dataset.move === "up" ? -1 : 1);
        if (reset && window.confirm("¿Descartar el borrador local y volver al contenido publicado?")) {
          clearDraft(); pendingUploads = []; preparedResources.clear(); loadData().then(() => { renderPanel(); setStatus("Borrador descartado; se restauraron los datos publicados."); }).catch((error) => setStatus(error.message, true));
        }
      });
    } catch (error) {
      setStatus(error.message || "No se pudo iniciar el editor.", true);
    }
  });
})();
