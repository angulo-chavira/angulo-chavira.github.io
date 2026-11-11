(() => {
  const REPOSITORY = "angulo-chavira/angulo-chavira.github.io";
  const $ = (id) => document.getElementById(id);
  let envelope;
  let records = [];
  let unlocked = false;
  let dirty = false;
  let formUnsaved = false;
  let editingIndex = -1;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const status = (text, error = false) => { $("editorStatus").textContent = text; $("editorStatus").dataset.state = error ? "error" : "ok"; };
  const contentStatus = (text, error = false) => { $("resourceEditorStatus").textContent = text; $("resourceEditorStatus").dataset.state = error ? "error" : "ok"; };
  const githubStatus = (text, error = false) => { $("resourceGithubStatus").textContent = text; $("resourceGithubStatus").dataset.state = error ? "error" : "ok"; };

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
    $("resourceEditorList").innerHTML = records.map((item, index) => {
      const safeUrl = /^https?:\/\//i.test(String(item.url || "")) ? item.url : "";
      return `<article class="editor-item"><div class="editor-item-head"><strong>${esc(item.title)}${item.category ? ` · ${esc(item.category)}` : ""}</strong><div><button class="action-button secondary resource-edit-button" type="button" data-edit="${index}">Editar</button><button class="delete-button" type="button" data-remove="${index}">Eliminar</button></div></div><p>${esc(item.notes || "Sin nota")}</p>${safeUrl ? `<p><a href="${esc(safeUrl)}" target="_blank" rel="noopener noreferrer">${esc(safeUrl)}</a></p>` : ""}${item.tags?.length ? `<div class="pub-tags">${item.tags.map(tag => `<span class="pub-tag">${esc(tag)}</span>`).join("")}</div>` : ""}</article>`;
    }).join("") || `<div class="empty-state">El almacén todavía está vacío. Agrega un enlace o una nota arriba.</div>`;
  }

  function clearForm() {
    $("resourceForm").reset();
    formUnsaved = false;
    editingIndex = -1;
    $("resourceForm").querySelector('button[type="submit"]').textContent = "Agregar recurso";
    $("cancelResourceEdit").hidden = true;
  }

  function editRecord(index) {
    const item = records[index];
    if (!item) return;
    editingIndex = index;
    $("resourceTitle").value = item.title || "";
    $("resourceCategoryInput").value = item.category || "";
    $("resourceUrl").value = item.url || "";
    $("resourceTags").value = Array.isArray(item.tags) ? item.tags.join(", ") : "";
    $("resourceNotes").value = item.notes || "";
    $("resourceForm").querySelector('button[type="submit"]').textContent = "Guardar recurso";
    $("cancelResourceEdit").hidden = false;
    $("resourceTitle").focus();
    contentStatus("Editando un recurso. Guarda los cambios en el formulario.");
  }

  async function encryptedEnvelope() {
    return VaultCrypto.encrypt({ resources: records, updated: new Date().toISOString().slice(0, 10) }, $("editorPassphrase").value);
  }

  async function downloadEncryptedEnvelope() {
    const updatedEnvelope = await encryptedEnvelope();
    const blob = new Blob([JSON.stringify(updatedEnvelope, null, 2) + "\n"], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "private-resources.enc.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    envelope = updatedEnvelope;
    return updatedEnvelope;
  }

  function lock() {
    if ((dirty || formUnsaved) && !window.confirm("Hay cambios que todavía no se han guardado en GitHub. Si bloqueas ahora, se borrarán de esta pestaña. ¿Quieres continuar?")) return;
    records = []; unlocked = false; dirty = false; formUnsaved = false; editingIndex = -1;
    $("editorPassphrase").value = ""; $("confirmPassphrase").value = "";
    $("editorGate").hidden = false; $("resourceEditor").hidden = true;
    GitHubPublisher.disconnect();
    $("resourceGithubToken").value = "";
    $("resourceGithubState").textContent = "Sin conectar";
    $("resourceGithubState").classList.remove("is-connected");
    $("connectResourceGithub").disabled = false;
    $("disconnectResourceGithub").disabled = true;
    $("commitVault").disabled = true;
    githubStatus("La conexión con GitHub se cerró al bloquear el almacén.");
    contentStatus("");
    status("Almacén bloqueado. La frase de paso se eliminó de la página.");
  }

  function setGitHubConnected(info) {
    $("resourceGithubState").textContent = `Conectado: @${info.login}`;
    $("resourceGithubState").classList.add("is-connected");
    $("connectResourceGithub").disabled = true;
    $("disconnectResourceGithub").disabled = false;
    $("commitVault").disabled = false;
    $("resourceGithubToken").value = "";
    githubStatus(`Acceso listo para ${info.repository}; rama ${info.branch}. El token queda solo en memoria en esta pestaña.`);
  }

  async function connectGitHub() {
    const token = $("resourceGithubToken").value.trim();
    if (!token) { githubStatus("Pega el token detallado generado en GitHub.", true); return; }
    $("connectResourceGithub").disabled = true;
    githubStatus("Verificando token y acceso al repositorio…");
    try {
      const info = await GitHubPublisher.connect(token, REPOSITORY);
      setGitHubConnected(info);
    } catch (error) {
      $("connectResourceGithub").disabled = false;
      githubStatus(error.message || "No se pudo conectar. Revisa el permiso Contents: read/write.", true);
    }
  }

  function disconnectGitHub() {
    GitHubPublisher.disconnect();
    $("resourceGithubState").textContent = "Sin conectar";
    $("resourceGithubState").classList.remove("is-connected");
    $("connectResourceGithub").disabled = false;
    $("disconnectResourceGithub").disabled = true;
    $("commitVault").disabled = true;
    $("resourceGithubToken").value = "";
    githubStatus("Se eliminó el token de la memoria de esta pestaña.");
  }

  async function commitVault() {
    if (!unlocked) return;
    if (formUnsaved) { contentStatus("Guarda primero el recurso del formulario y después haz el commit.", true); return; }
    if (!GitHubPublisher.connected) { githubStatus("Conecta GitHub antes de hacer el commit.", true); return; }
    const button = $("commitVault");
    button.disabled = true;
    button.textContent = "Cifrando y guardando…";
    contentStatus("Cifrando los recursos en este navegador antes de enviarlos…");
    try {
      const updatedEnvelope = await encryptedEnvelope();
      const result = await GitHubPublisher.commit([{
        path: "data/private-resources.enc.json",
        content: JSON.stringify(updatedEnvelope, null, 2) + "\n",
        encoding: "utf-8"
      }], $("privateCommitMessage").value.trim() || "Actualizar recursos personales cifrados");
      envelope = updatedEnvelope;
      dirty = false;
      contentStatus(`Almacén cifrado guardado en ${result.repository} (${result.branch}). Solo se subió el archivo cifrado. ${result.url}`);
    } catch (error) {
      contentStatus(error.message || "No se pudo guardar el almacén cifrado.", true);
    } finally {
      button.textContent = "Guardar cifrado y hacer commit";
      button.disabled = !GitHubPublisher.connected;
    }
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
        unlocked = true; dirty = false;
        $("editorGate").hidden = true; $("resourceEditor").hidden = false; render();
        contentStatus(envelope?.initialized ? "Almacén abierto. Puedes agregar, editar o eliminar recursos." : "Almacén nuevo listo. Agrega recursos y guarda la primera versión cifrada.");
      } catch (error) {
        status(error.message === "The operation failed for an operation-specific reason" ? "No se pudo abrir el almacén; revisa la frase de paso." : (error.message || "No se pudo abrir el almacén."), true);
      } finally { button.disabled = false; }
    });

    $("resourceForm").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!unlocked) return;
      const url = $("resourceUrl").value.trim();
      if (url && !/^https?:\/\//i.test(url)) { contentStatus("El enlace debe comenzar con https:// o http://.", true); return; }
      const record = {
        title: $("resourceTitle").value.trim(),
        category: $("resourceCategoryInput").value.trim(),
        url,
        notes: $("resourceNotes").value.trim(),
        tags: $("resourceTags").value.split(",").map(tag => tag.trim()).filter(Boolean)
      };
      if (editingIndex >= 0) records[editingIndex] = record;
      else records.unshift(record);
      dirty = true;
      clearForm(); render();
      contentStatus("Cambios en memoria. Pulsa “Guardar cifrado y hacer commit” para actualizar el sitio, o descarga el respaldo cifrado.");
    });
    $("resourceForm").addEventListener("input", () => { formUnsaved = true; });
    $("cancelResourceEdit").addEventListener("click", () => { clearForm(); contentStatus("Edición cancelada."); });
    $("resourceEditorList").addEventListener("click", (event) => {
      const edit = event.target.closest("[data-edit]");
      const remove = event.target.closest("[data-remove]");
      if (edit) { editRecord(Number(edit.dataset.edit)); return; }
      if (!remove) return;
      const index = Number(remove.dataset.remove);
      if (editingIndex === index) clearForm();
      else if (editingIndex > index) editingIndex -= 1;
      records.splice(index, 1); dirty = true; render();
      contentStatus("Recurso eliminado. Pulsa “Guardar cifrado y hacer commit” para aplicar el cambio.");
    });
    $("downloadVault").addEventListener("click", async () => {
      if (!unlocked) return;
      if (formUnsaved) { contentStatus("Guarda primero el recurso del formulario y después descarga el archivo cifrado.", true); return; }
      const button = $("downloadVault"); button.disabled = true; contentStatus("Cifrando y preparando descarga…");
      try {
        await downloadEncryptedEnvelope();
        contentStatus("Archivo cifrado descargado. Puedes conservarlo como respaldo o reemplazar el archivo en GitHub.");
      } catch (error) { contentStatus(error.message || "No se pudo cifrar el archivo.", true); }
      finally { button.disabled = false; }
    });
    $("commitVault").addEventListener("click", commitVault);
    $("connectResourceGithub").addEventListener("click", connectGitHub);
    $("disconnectResourceGithub").addEventListener("click", disconnectGitHub);
    $("closeEditor").addEventListener("click", lock);
    $("lockVault").addEventListener("click", lock);
  });
})();
