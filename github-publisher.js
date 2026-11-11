(() => {
  let token = "";
  let repository = "";
  const API = "https://api.github.com";
  const API_VERSION = "2022-11-28";

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": API_VERSION,
        ...(options.headers || {})
      }
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(body.message || `GitHub respondió ${response.status}.`);
      error.status = response.status;
      throw error;
    }
    return body;
  }

  async function connect(newToken, repo) {
    token = String(newToken || "").trim();
    repository = String(repo || "").trim();
    if (!token || !repository.includes("/")) throw new Error("Falta el token o el nombre del repositorio.");
    try {
      const [user, repoInfo] = await Promise.all([
        request("/user"),
        request(`/repos/${repository.split("/").map(encodeURIComponent).join("/")}`)
      ]);
      if (repoInfo.permissions && repoInfo.permissions.push === false) throw new Error("El token puede leer el repositorio, pero no tiene permiso para escribir.");
      return { login: user.login, repository: repoInfo.full_name, branch: repoInfo.default_branch };
    } catch (error) {
      token = "";
      repository = "";
      throw error;
    }
  }

  function disconnect() {
    token = "";
    repository = "";
  }

  function requireConnection() {
    if (!token || !repository) throw new Error("Conecta GitHub antes de hacer el commit.");
  }

  async function commit(files, message) {
    requireConnection();
    const repoPath = repository.split("/").map(encodeURIComponent).join("/");
    const repoInfo = await request(`/repos/${repoPath}`);
    const branch = repoInfo.default_branch;
    if (!branch) throw new Error("GitHub no indicó la rama principal del repositorio.");
    const ref = await request(`/repos/${repoPath}/git/ref/heads/${encodeURIComponent(branch)}`);
    const parentSha = ref.object.sha;
    const parentCommit = await request(`/repos/${repoPath}/git/commits/${parentSha}`);
    const treeEntries = [];

    for (const file of files) {
      const body = { content: file.content, encoding: file.encoding || "utf-8" };
      const blob = await request(`/repos/${repoPath}/git/blobs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      treeEntries.push({ path: file.path, mode: "100644", type: "blob", sha: blob.sha });
    }

    if (!treeEntries.length) throw new Error("No hay cambios que guardar.");
    const tree = await request(`/repos/${repoPath}/git/trees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base_tree: parentCommit.tree.sha, tree: treeEntries })
    });
    const commitResult = await request(`/repos/${repoPath}/git/commits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: String(message || "Actualizar contenido del sitio"), tree: tree.sha, parents: [parentSha] })
    });
    await request(`/repos/${repoPath}/git/refs/heads/${encodeURIComponent(branch)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sha: commitResult.sha, force: false })
    });
    return { sha: commitResult.sha, url: commitResult.html_url, branch, repository };
  }

  globalThis.GitHubPublisher = Object.freeze({ connect, disconnect, commit, get connected() { return Boolean(token && repository); } });
})();
