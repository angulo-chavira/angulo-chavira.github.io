/* Herramientas de estímulos para las normas de completamiento.
   Las probabilidades pertenecen a una pareja contexto/respuesta. */
(function (root) {
  'use strict';
  const D = typeof module === 'object' && module.exports ? require('./resource-data.js') : root.ResourceData;
  const key = item => String(item.id) + '\u0000' + String(item.target);
  function matches(rows, details, query, ignoreAccents) {
    const q = D.normalize(query, ignoreAccents);
    if (!q) return [];
    return rows.flatMap(row => (details[row.ID] || []).filter(a => D.normalize(a.Response, ignoreAccents) === q).map(a => ({ ...row, ...a })));
  }
  function sample(rows, count, seed) {
    if (!Number.isInteger(count) || count < 1) throw new Error('Invalid sample size');
    let h = 2166136261;
    for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
    const random = () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const copy = rows.slice();
    for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
    return copy.slice(0, count);
  }
  function stimulus(row, alternatives, target) {
    const a = alternatives.find(a => a.Response === target);
    return { ...row, Target: target, Target_count: a?.Count ?? null, Target_probability: a?.Probability ?? null, Target_surprisal_bits: a?.Surprisal_bits ?? null, Target_status: a ? 'observed' : 'not_observed' };
  }
  function summary(items) {
    return ['Target_probability', 'Entropy_bits', 'N'].map(column => {
      const values = items.map(x => D.number(x[column])).filter(x => x != null);
      return { column, n: values.length, mean: values.length ? values.reduce((a,b) => a+b,0)/values.length : null, min: values.length ? Math.min(...values) : null, max: values.length ? Math.max(...values) : null };
    });
  }
  function validateProject(project, resourceId) {
    if (project?.format !== 'cloze-stimulus-lists' || project.resource !== resourceId || !Array.isArray(project.lists) || project.lists.length > 20) throw new Error('Invalid list project');
    return project.lists.map((list, i) => {
      if (typeof list.name !== 'string' || !list.name.trim() || list.name.length > 120 || !Array.isArray(list.items) || list.items.length > 5000) throw new Error('Invalid list');
      const seen = new Set();
      const items = list.items.map(item => {
        if (!item || typeof item.id !== 'string' || !item.id.trim() || item.id.length > 100 || typeof item.target !== 'string' || item.target.length > 200) throw new Error('Invalid stimulus');
        return { id: item.id, target: item.target };
      }).filter(item => { const k = key(item); if (seen.has(k)) return false; seen.add(k); return true; });
      return { id: 'import-' + i + '-' + Date.now(), name: list.name.trim(), items, history: Array.isArray(list.history) ? list.history.slice(-50) : [] };
    });
  }
  function create(api) {
    const { app, rows, data, cfg, L, e, fmt, download } = api;
    const details = data.details || {}, byID = new Map(rows.map(r => [r.ID, r]));
    const storageKey = 'cloze-lists-v1:' + cfg.id;
    const columns = ['list_name','list_order','ID','Sentence','Target','Target_count','Target_probability','Target_surprisal_bits','Target_status','N','Cloze_max','Entropy_bits','Response_types','English'];
    const state = { word: '', accents: false, min: '', max: '', sort: 'prob-desc', wordPage: 1, compare: [], probe: '', lists: [], active: '', listPage: 1, requested: 40, seed: '1', method: 'random', exclude: true, storageOK: true, loadError: false, undo: null };
    let wordRows = [];
    const $ = id => document.getElementById(id);
    const newList = name => ({ id: 'list-' + Date.now() + '-' + Math.random().toString(36).slice(2,8), name, items: [], history: [] });
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved) {
        const validated = validateProject(saved, cfg.id);
        state.lists = validated.map((list,i) => ({ ...list, id: 'saved-' + i, history: Array.isArray(saved.lists[i].history) ? saved.lists[i].history.slice(-50) : [] }));
        state.loadError = saved.source_sha256 !== data.sourceSha256;
      }
    } catch (_) { state.storageOK = false; state.loadError = true; }
    if (!state.lists.length) state.lists.push(newList(L('Lista 1','List 1')));
    state.active = state.lists[0].id;
    const active = () => state.lists.find(l => l.id === state.active) || state.lists[0];
    const project = () => ({ format: 'cloze-stimulus-lists', version: 1, resource: cfg.id, source_sha256: data.sourceSha256, saved_at_utc: new Date().toISOString(), lists: state.lists });
    function persist() { try { localStorage.setItem(storageKey, JSON.stringify(project())); state.storageOK = true; } catch (_) { state.storageOK = false; } }
    function notice(message, error) {
      api.status(message, error);
      app.querySelectorAll('[data-cw-status]').forEach(el => { el.textContent = message; el.classList.toggle('error', Boolean(error)); });
    }
    const allItems = list => list.items.filter(item => byID.has(item.id)).map((item,i) => ({ ...stimulus(byID.get(item.id), details[item.id] || [], item.target), list_name: list.name, list_order: i + 1 }));
    const button = (attr, text, primary) => '<button type="button" class="rx-button' + (primary ? ' primary' : '') + '" ' + attr + '>' + text + '</button>';
    function rowActions(row, target) {
      return '<div class="rx-actions cw-row-actions">' + button('data-cw-compare="' + e(row.ID) + '"',L('Comparar','Compare')) + button('data-cw-add="' + e(row.ID) + '" data-cw-target="' + e(target ?? row.Top_completion) + '"',L('Añadir a lista','Add to list')) + '</div>';
    }
    function panels(tab) {
      const panel = (id, html) => '<section role="tabpanel" id="panel-' + id + '" aria-labelledby="tab-' + id + '" ' + (tab === id ? '' : 'hidden') + '>' + html + '</section>';
      return panel('words',
        '<section class="rx-panel"><h2>' + L('Buscar una palabra final','Find a final word') + '</h2><p>' + L('Encuentra todos los contextos donde se observó esta respuesta, aunque no sea la más frecuente.','Find every context where this completion was observed, including less frequent responses.') + '</p><div class="cw-word-form"><label class="rx-field">' + L('Palabra final exacta','Exact final word') + '<input id="cwWord" type="search" value="' + e(state.word) + '" placeholder="abejas"></label><label class="rx-check"><input id="cwAccents" type="checkbox" ' + (state.accents ? 'checked' : '') + '>' + L('Ignorar tildes (conservar ñ)','Ignore accents (keep ñ distinct)') + '</label></div><div class="cw-three"><label class="rx-field">' + L('Probabilidad mínima','Minimum probability') + '<input id="cwWordMin" type="number" min="0" max="1" step="any" value="' + e(state.min) + '"></label><label class="rx-field">' + L('Probabilidad máxima','Maximum probability') + '<input id="cwWordMax" type="number" min="0" max="1" step="any" value="' + e(state.max) + '"></label><label class="rx-field">' + L('Orden de coincidencias','Match order') + '<select id="cwWordSort" aria-label="' + L('Orden de coincidencias','Match order') + '"><option value="prob-desc">' + L('Mayor probabilidad','Highest probability') + '</option><option value="prob-asc">' + L('Menor probabilidad','Lowest probability') + '</option><option value="entropy">' + L('Menor entropía','Lowest entropy') + '</option></select></label></div><p class="rx-help">' + L('Esta búsqueda consulta toda la base y usa sus propios límites de probabilidad. Una respuesta no observada no se trata como una probabilidad poblacional de cero.','This search uses the whole dataset and its own probability limits. An unobserved response is not treated as a population probability of zero.') + '</p></section><section class="rx-panel"><p id="cwWordCount" aria-live="polite"></p><div class="rx-actions">' + button('data-cw-action="word-csv"',L('Exportar coincidencias (CSV)','Export matches (CSV)')) + button('data-cw-action="word-add"',L('Añadir coincidencias a lista activa','Add matches to active list')) + '</div><div id="cwWordResults"></div><div class="rx-pagination">' + button('data-cw-action="word-prev" id="cwWordPrev"',L('Anterior','Previous')) + '<span id="cwWordPage"></span>' + button('data-cw-action="word-next" id="cwWordNext"',L('Siguiente','Next')) + '</div><p data-cw-status class="rx-status" role="status"></p></section>') +
        panel('compare','<section class="rx-panel"><div class="rx-tools"><h2>' + L('Comparar contextos','Compare contexts') + '</h2>' + button('data-cw-action="compare-clear"',L('Vaciar comparador','Clear comparison')) + '</div><p>' + L('Añade hasta cuatro contextos desde la tabla, las coincidencias o una ficha.','Add up to four contexts from the table, word matches or a record detail.') + '</p><label class="rx-field">' + L('Consultar la misma respuesta en los contextos comparados','Look up the same response in the compared contexts') + '<input id="cwProbe" type="search" placeholder="abejas" value="' + e(state.probe) + '"></label><div id="cwCompare"></div><div class="rx-actions">' + button('data-cw-action="compare-csv"',L('Exportar respuestas comparadas (CSV)','Export compared responses (CSV)')) + '</div><p data-cw-status class="rx-status" role="status"></p></section>') +
        panel('lists','<section class="rx-panel"><h2>' + L('Mis listas de estímulos','My stimulus lists') + '</h2><p class="rx-help">' + L('Las listas se guardan en este navegador. Descarga una copia del proyecto para trasladarlas a otro equipo o recuperarlas después de borrar los datos del navegador.','Lists are saved in this browser. Download a project backup to move them to another computer or recover them after clearing browser data.') + '</p><div class="cw-three"><label class="rx-field">' + L('Lista activa','Active list') + '<select id="cwActive" aria-label="' + L('Lista activa','Active list') + '"></select></label><label class="rx-field">' + L('Nombre de nueva lista','New list name') + '<input id="cwNewListName" maxlength="120"></label>' + button('data-cw-action="list-new"',L('Crear lista','Create list')) + '</div><div class="rx-actions cw-gap">' + button('data-cw-action="list-selected"',L('Añadir mi selección de Consultar','Add my Browse selection')) + button('data-cw-action="project-export"',L('Guardar proyecto (.json)','Save project (.json)')) + '<label class="rx-field">' + L('Abrir proyecto (.json)','Open project (.json)') + '<input id="cwProjectFile" type="file" accept=".json,application/json"></label></div><p id="cwStorage" class="rx-help"></p><p data-cw-status class="rx-status" role="status"></p></section>' +
        '<section class="rx-panel"><h2>' + L('Construir desde los filtros actuales','Build from current filters') + '</h2><p id="cwCandidates" class="rx-help"></p><div class="cw-three"><label class="rx-field">' + L('Cantidad que añadir','Number to add') + '<input id="cwRequested" type="number" min="1" max="2925" step="1" value="' + state.requested + '"></label><label class="rx-field">' + L('Método de selección','Selection method') + '<select id="cwMethod" aria-label="' + L('Método de selección','Selection method') + '"><option value="random">' + L('Aleatorio con semilla','Seeded random') + '</option><option value="ordered">' + L('Primeros en el orden actual','First in current order') + '</option></select></label><label class="rx-field">' + L('Semilla','Seed') + '<input id="cwSeed" maxlength="100" value="' + e(state.seed) + '"></label></div><label class="rx-check cw-gap"><input type="checkbox" id="cwExclude" ' + (state.exclude ? 'checked' : '') + '>' + L('Excluir contextos que ya estén en cualquiera de mis listas','Exclude contexts already in any of my lists') + '</label><p class="rx-help">' + L('Usa los filtros de Consultar para definir los candidatos. La selección automática toma la respuesta más frecuente de cada contexto y no garantiza equivalencia entre condiciones.','Use Browse filters to define candidates. Automatic selection uses each context’s top completion and does not establish equivalence between conditions.') + '</p>' + button('data-cw-action="list-build"',L('Añadir candidatos a la lista','Add candidates to list'),true) + '</section>' +
        '<section class="rx-panel"><div class="cw-three"><label class="rx-field">' + L('Nombre de la lista activa','Active list name') + '<input id="cwRename" maxlength="120"></label>' + button('data-cw-action="list-rename"',L('Cambiar nombre','Rename')) + button('data-cw-action="list-delete"',L('Eliminar lista','Delete list')) + '</div><div id="cwUndo"></div><div id="cwListSummary"></div><div class="rx-actions">' + button('data-cw-action="list-csv"','CSV') + button('data-cw-action="list-xlsx"','Excel') + button('data-cw-action="list-zip"',L('Paquete de lista (.zip)','List package (.zip)'),true) + '</div><div id="cwListRows"></div><div class="rx-pagination">' + button('data-cw-action="list-prev" id="cwListPrev"',L('Anterior','Previous')) + '<span id="cwListPage"></span>' + button('data-cw-action="list-next" id="cwListNext"',L('Siguiente','Next')) + '</div></section>');
    }
    function renderWords() {
      const min = D.number(state.min), max = D.number(state.max);
      const invalid = (state.min !== '' && (min == null || min < 0 || min > 1)) || (state.max !== '' && (max == null || max < 0 || max > 1)) || (min != null && max != null && min > max);
      wordRows = invalid ? [] : matches(rows, details, state.word, state.accents).filter(r => (min == null || r.Probability >= min) && (max == null || r.Probability <= max)).sort((a,b) => state.sort === 'entropy' ? a.Entropy_bits-b.Entropy_bits : state.sort === 'prob-asc' ? a.Probability-b.Probability : b.Probability-a.Probability);
      const totalPages = Math.max(1,Math.ceil(wordRows.length/25)); state.wordPage = Math.max(1,Math.min(totalPages,state.wordPage));
      const page = wordRows.slice((state.wordPage-1)*25,state.wordPage*25);
      $('cwWordCount').textContent = invalid ? L('Revisa los límites: deben estar entre 0 y 1 y el mínimo no puede superar el máximo.','Check bounds: use values from 0 to 1, with minimum no larger than maximum.') : !state.word.trim() ? L('Escribe una palabra para consultar sus contextos.','Enter a word to find its contexts.') : wordRows.length + L(' coincidencias en ',' matches in ') + new Set(wordRows.map(r=>r.ID)).size + L(' contextos.',' contexts.');
      const metric = r => '<dl class="cw-metrics"><div><dt>n / N</dt><dd>' + r.Count + ' / ' + r.N + '</dd></div><div><dt>p(' + e(r.Response) + ')</dt><dd>' + fmt(r.Probability) + '</dd></div><div><dt>' + L('Sorpresa (bits)','Surprisal (bits)') + '</dt><dd>' + fmt(r.Surprisal_bits) + '</dd></div><div><dt>' + L('Entropía (bits)','Entropy (bits)') + '</dt><dd>' + fmt(r.Entropy_bits) + '</dd></div></dl>';
      $('cwWordResults').innerHTML = page.map(r=>'<article class="cw-match"><p class="eyebrow">' + e(r.ID) + '</p><button type="button" class="cw-context" data-row="' + r._id + '" data-cw-response="' + e(r.Response) + '">' + e(r.Sentence) + ' <strong>' + e(r.Response) + '</strong></button>' + metric(r) + rowActions(r,r.Response) + '</article>').join('') || (state.word.trim() && !invalid ? '<p class="empty-state">' + L('No se observaron coincidencias con estos criterios.','No observed matches meet these criteria.') + '</p>' : '');
      $('cwWordPage').textContent = state.wordPage + ' / ' + totalPages; $('cwWordPrev').disabled = state.wordPage <= 1; $('cwWordNext').disabled = state.wordPage >= totalPages;
    }
    function renderCompare() {
      const compared = state.compare.map(id=>byID.get(id)).filter(Boolean);
      $('cwCompare').innerHTML = '<div class="cw-compare-grid" style="--cw-count:' + Math.max(1,compared.length) + '">' + compared.map(r=>{
        const observed = (details[r.ID] || []).find(a=>D.normalize(a.Response)===D.normalize(state.probe));
        return '<article class="cw-compare-card"><div class="rx-tools"><strong>' + e(r.ID) + '</strong>' + button('data-cw-remove-compare="' + e(r.ID) + '"',L('Quitar','Remove')) + '</div><p class="cw-sentence">' + e(r.Sentence) + ' <span aria-label="' + L('Espacio final','Final blank') + '">_____</span></p><dl class="cw-metrics"><div><dt>N</dt><dd>' + r.N + '</dd></div><div><dt>' + L('Cierre máximo','Maximum cloze') + '</dt><dd>' + fmt(r.Cloze_max) + '</dd></div><div><dt>' + L('Entropía (bits)','Entropy (bits)') + '</dt><dd>' + fmt(r.Entropy_bits) + '</dd></div></dl>' + (state.probe.trim() ? '<p class="cw-probe-result">' + e(state.probe) + ': ' + (observed ? 'p = ' + fmt(observed.Probability) + ' · ' + L('sorpresa','surprisal') + ' = ' + fmt(observed.Surprisal_bits) + ' bits' : L('no observada','not observed')) + '</p>' : '') + '<div class="rx-bars">' + (details[r.ID]||[]).slice(0,5).map(a=>'<div class="rx-bar"><span>' + e(a.Response) + '</span><div class="rx-bar-track"><div class="rx-bar-fill" style="width:' + a.Probability*100 + '%"></div></div><span>' + fmt(a.Probability*100) + '%</span></div>').join('') + '</div><div class="rx-actions">' + button('data-row="' + r._id + '"',L('Ver ficha','View detail')) + button('data-cw-add="' + e(r.ID) + '" data-cw-target="' + e(observed?.Response || r.Top_completion) + '"',L('Añadir ','Add ') + e(observed?.Response || r.Top_completion)) + '</div></article>';
      }).join('') + '</div>' + (compared.length ? comparisonTable(compared) : '<p class="empty-state">' + L('El comparador está vacío. Usa los botones Comparar junto a una oración.','Comparison is empty. Use Compare next to a context.') + '</p>');
    }
    function comparisonTable(compared) {
      const responses = [...new Set(compared.flatMap(r=>(details[r.ID]||[]).map(a=>a.Response)))].sort((a,b)=>compared.reduce((sum,r)=>sum+((details[r.ID]||[]).find(x=>x.Response===b)?.Probability||0)-((details[r.ID]||[]).find(x=>x.Response===a)?.Probability||0),0));
      return '<details class="rx-more"><summary>' + L('Comparar todas las respuestas','Compare all responses') + '</summary><p class="rx-help">' + L('Cada celda muestra p. El guion indica una respuesta no observada en ese contexto.','Cells show p. A dash indicates a response not observed in that context.') + '</p><div class="rx-table-wrap"><table class="rx-table"><thead><tr><th>' + L('Respuesta','Response') + '</th>' + compared.map(r=>'<th>' + e(r.ID) + '</th>').join('') + '</tr></thead><tbody>' + responses.map(response=>'<tr><td>' + e(response) + '</td>' + compared.map(r=>{ const a=(details[r.ID]||[]).find(x=>x.Response===response); return '<td>' + (a ? fmt(a.Probability) : '—') + '</td>'; }).join('') + '</tr>').join('') + '</tbody></table></div></details>';
    }
    function renderLists() {
      if (!$('cwActive')) return;
      const list = active(), values = allItems(list), missing = list.items.filter(item=>!byID.has(item.id)).length;
      $('cwActive').innerHTML = state.lists.map(l=>'<option value="' + e(l.id) + '" ' + (l.id===list.id?'selected':'') + '>' + e(l.name) + ' (' + l.items.length + ')</option>').join('');
      $('cwRename').value = list.name;
      $('cwStorage').textContent = !state.storageOK ? L('El guardado local no está disponible. Conserva un proyecto JSON antes de cerrar.','Local saving is unavailable. Save a JSON project before closing.') : state.loadError ? L('La fuente o los datos guardados cambiaron. Revisa las respuestas y los IDs antes de exportar.','The source or saved data changed. Review responses and IDs before exporting.') : L('Guardado local en este navegador.','Saved locally in this browser.');
      $('cwCandidates').textContent = api.getFiltered().length + L(' contextos con los filtros actuales de Consultar.',' contexts match current Browse filters.');
      const stats = summary(values), labels = {Target_probability:L('Probabilidad de la palabra objetivo','Target word probability'),Entropy_bits:L('Entropía del contexto','Context entropy'),N:L('Respuestas válidas','Valid responses')};
      $('cwListSummary').innerHTML = '<h3>' + e(list.name) + '</h3><p>' + list.items.length + L(' estímulos · ',' stimuli · ') + new Set(list.items.map(x=>x.id)).size + L(' contextos distintos.',' distinct contexts.') + '</p>' + (missing ? '<p class="rx-status error">' + missing + L(' IDs no están en la fuente actual; se conservan en el proyecto y se omiten de la exportación de datos.',' IDs are absent from the current source; they remain in the project and are omitted from data exports.') + '</p>' : '') + '<div class="rx-table-wrap"><table class="rx-table"><thead><tr><th>' + L('Variable','Variable') + '</th><th>n</th><th>' + L('Media','Mean') + '</th><th>' + L('Mínimo','Minimum') + '</th><th>' + L('Máximo','Maximum') + '</th></tr></thead><tbody>' + stats.map(s=>'<tr><td>' + labels[s.column] + '</td><td>' + s.n + '</td><td>' + fmt(s.mean) + '</td><td>' + fmt(s.min) + '</td><td>' + fmt(s.max) + '</td></tr>').join('') + '</tbody></table></div><p class="rx-help">' + L('Resumen descriptivo de los estímulos, sin prueba de equivalencia entre listas.','Descriptive stimulus summary; no equivalence test between lists.') + '</p>';
      const pages=Math.max(1,Math.ceil(list.items.length/25));state.listPage=Math.max(1,Math.min(pages,state.listPage));
      $('cwListRows').innerHTML = list.items.slice((state.listPage-1)*25,state.listPage*25).map((item,j)=>{
        const i=(state.listPage-1)*25+j,r=byID.get(item.id),s=r?stimulus(r,details[item.id]||[],item.target):null;
        return '<article class="cw-list-item"><div><p class="eyebrow">' + (i+1) + ' · ' + e(item.id) + '</p><p>' + (r ? e(r.Sentence) : L('Contexto no disponible','Context unavailable')) + ' <strong>' + e(item.target) + '</strong></p><p class="rx-help">' + (s?.Target_status==='observed' ? 'p = ' + fmt(s.Target_probability) + ' · ' + L('sorpresa','surprisal') + ' = ' + fmt(s.Target_surprisal_bits) + ' bits' : L('Respuesta no observada en la fuente actual','Response not observed in current source')) + '</p></div><div class="rx-actions">' + (r?button('data-row="' + r._id + '" data-cw-response="' + e(item.target) + '"',L('Ficha','Detail')):'') + button('aria-label="' + L('Mover estímulo arriba','Move stimulus up') + '" data-cw-up="' + i + '" ' + (i===0?'disabled':''),'↑') + button('aria-label="' + L('Mover estímulo abajo','Move stimulus down') + '" data-cw-down="' + i + '" ' + (i===list.items.length-1?'disabled':''),'↓') + button('data-cw-remove="' + i + '"',L('Quitar','Remove')) + '</div></article>';
      }).join('') || '<p class="empty-state">' + L('Añade contextos desde Consultar, Palabra final o el constructor.','Add contexts from Browse, Final word or the builder.') + '</p>';
      $('cwListPage').textContent=state.listPage+' / '+pages;$('cwListPrev').disabled=state.listPage<=1;$('cwListNext').disabled=state.listPage>=pages;
      $('cwUndo').innerHTML=state.undo?button('data-cw-action="list-undo"',L('Restaurar lista eliminada','Restore deleted list')):'';
    }
    function add(items, recipe) {
      const list=active(), seen=new Set(list.items.map(key));let count=0;
      for(const item of items){const k=key(item);if(!seen.has(k)&&byID.has(item.id)){list.items.push({id:item.id,target:item.target});seen.add(k);count++;}}
      if(recipe&&count){list.history.push({at_utc:new Date().toISOString(),...recipe,added:count});list.history=list.history.slice(-50);}
      persist();renderLists();notice(count+L(' estímulos añadidos a ',' stimuli added to ')+list.name+'.');
    }
    function addComparison(id) {
      if(state.compare.includes(id)){notice(L('Este contexto ya está en el comparador.','This context is already in the comparison.'));return;}
      if(state.compare.length>=4)throw new Error(L('Compara hasta cuatro contextos. Quita uno para añadir otro.','Compare up to four contexts. Remove one to add another.'));
      if(byID.has(id))state.compare.push(id);renderCompare();notice(L('Contexto añadido. Abre la pestaña Comparar.','Context added. Open the Compare tab.'));
    }
    function exportList(kind) {
      const list=active(),values=allItems(list);if(!values.length)throw new Error(L('La lista no contiene estímulos disponibles.','The list contains no available stimuli.'));
      const meta={...api.metadata('stimulus-list',columns,values.length),list_name:list.name,stimulus_order:list.items,selection_history:list.history,summary:summary(values),missing_context_ids:list.items.filter(i=>!byID.has(i.id)).map(i=>i.id),note:'Target probability and surprisal refer to the chosen context/completion pair; entropy refers to the context. Unobserved targets have null metrics.'};
      const name=cfg.id+'-lista-'+list.name.replace(/[^a-z0-9_-]/gi,'_').slice(0,70);
      if(kind==='csv')download(D.csv(values,columns),name+'.csv','text/csv;charset=utf-8');
      if(kind==='xlsx')download(D.xlsx(values,columns,meta),name+'.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      if(kind==='zip')download(root.fflate.zipSync({'estimulos.csv':root.fflate.strToU8(D.csv(values,columns)),'ficha.json':root.fflate.strToU8(JSON.stringify(meta,null,2)),'proyecto.json':root.fflate.strToU8(JSON.stringify(project(),null,2)),'cita.bib':root.fflate.strToU8(cfg.bibtex||''),'cargar_en_R.R':root.fflate.strToU8('estimulos <- read.csv("estimulos.csv", fileEncoding = "UTF-8-BOM", check.names = FALSE)\nhead(estimulos)\n')},{level:6}),name+'.zip','application/zip');
      notice(L('Lista exportada: ','List exported: ')+values.length+L(' estímulos.',' stimuli.'));
    }
    app.addEventListener('click',event=>{
      const el=event.target.closest('[data-cw-action],[data-cw-add],[data-cw-compare],[data-cw-remove-compare],[data-cw-remove],[data-cw-up],[data-cw-down]');if(!el)return;
      try {
        if(el.dataset.cwAdd!=null)add([{id:el.dataset.cwAdd,target:el.dataset.cwTarget}]);
        if(el.dataset.cwCompare!=null)addComparison(el.dataset.cwCompare);
        if(el.dataset.cwRemoveCompare!=null){state.compare=state.compare.filter(x=>x!==el.dataset.cwRemoveCompare);renderCompare();}
        if(el.dataset.cwRemove!=null){active().items.splice(Number(el.dataset.cwRemove),1);persist();renderLists();}
        for(const [attr,delta] of [['cwUp',-1],['cwDown',1]])if(el.dataset[attr]!=null){const i=Number(el.dataset[attr]),items=active().items,j=i+delta;if(j>=0&&j<items.length){[items[i],items[j]]=[items[j],items[i]];persist();renderLists();}}
        const action=el.dataset.cwAction;
        if(action==='word-prev'){state.wordPage--;renderWords();}if(action==='word-next'){state.wordPage++;renderWords();}
        if(action==='list-prev'){state.listPage--;renderLists();}if(action==='list-next'){state.listPage++;renderLists();}
        if(action==='word-csv'){if(!wordRows.length)throw new Error(L('No hay coincidencias para exportar.','No matches to export.'));download(D.csv(wordRows,['ID','Sentence','Response','Count','N','Probability','Surprisal_bits','Entropy_bits','Top_completion','Cloze_max']),cfg.id+'-palabra-final.csv','text/csv;charset=utf-8');}
        if(action==='word-add')add(wordRows.map(r=>({id:r.ID,target:r.Response})),{method:'word-matches',query:state.word,ignore_accents:state.accents,probability_min:state.min,probability_max:state.max});
        if(action==='compare-clear'){state.compare=[];renderCompare();}
        if(action==='compare-csv'){const output=state.compare.flatMap(id=>(details[id]||[]).map(a=>({...byID.get(id),...a})));if(!output.length)throw new Error(L('Añade contextos al comparador.','Add contexts to the comparison.'));download(D.csv(output,['ID','Sentence','Response','Count','N','Probability','Surprisal_bits','Entropy_bits']),cfg.id+'-comparacion.csv','text/csv;charset=utf-8');}
        if(action==='list-new'){const name=$('cwNewListName').value.trim();if(!name)throw new Error(L('Escribe un nombre para la lista.','Enter a list name.'));if(state.lists.length>=20)throw new Error(L('Guarda hasta 20 listas por proyecto.','Save up to 20 lists per project.'));const list=newList(name);state.lists.push(list);state.active=list.id;$('cwNewListName').value='';state.listPage=1;persist();renderLists();}
        if(action==='list-rename'){const name=$('cwRename').value.trim();if(!name)throw new Error(L('El nombre no puede estar vacío.','Name cannot be empty.'));active().name=name;persist();renderLists();}
        if(action==='list-delete'){state.undo=active();state.lists=state.lists.filter(x=>x.id!==state.active);if(!state.lists.length)state.lists.push(newList(L('Lista 1','List 1')));state.active=state.lists[0].id;persist();renderLists();}
        if(action==='list-undo'){if(state.lists.length>=20)throw new Error(L('Ya hay 20 listas.','There are already 20 lists.'));if(state.undo){state.lists.push(state.undo);state.active=state.undo.id;state.undo=null;persist();renderLists();}}
        if(action==='list-selected')add(api.getSelected().map(r=>({id:r.ID,target:r.Top_completion})),{method:'manual-browse-selection',...api.queryState()});
        if(action==='list-build'){
          const count=Number($('cwRequested').value),seed=$('cwSeed').value,method=$('cwMethod').value;
          if(!Number.isInteger(count)||count<1||count>5000)throw new Error(L('La cantidad debe ser un entero entre 1 y 5,000.','Count must be an integer from 1 to 5,000.'));
          const excluded=new Set(state.exclude?state.lists.flatMap(l=>l.items.map(i=>i.id)):active().items.map(i=>i.id));
          const candidates=api.getFiltered().filter(r=>!excluded.has(r.ID));
          if(!candidates.length)throw new Error(L('No quedan candidatos disponibles con estos criterios.','No available candidates remain under these criteria.'));
          const chosen=method==='random'?sample(candidates,count,seed):candidates.slice(0,count);
          add(chosen.map(r=>({id:r.ID,target:r.Top_completion})),{method:method==='random'?'seeded-fisher-yates-v1':'current-order',seed:method==='random'?seed:null,requested:count,available:candidates.length,exclude_used_contexts:state.exclude,...api.queryState(),candidate_ids:candidates.map(r=>r.ID),chosen_ids:chosen.map(r=>r.ID)});
          if(chosen.length<count)notice(L('Solo había ','Only ')+chosen.length+L(' candidatos disponibles; se añadieron todos.',' candidates were available; all were added.'));
        }
        if(action?.startsWith('list-')&&['csv','xlsx','zip'].includes(action.slice(5)))exportList(action.slice(5));
        if(action==='project-export')download(JSON.stringify(project(),null,2),cfg.id+'-proyecto-listas.json','application/json');
      }catch(error){notice(error.message,true);}
    });
    app.addEventListener('input',event=>{
      const el=event.target,map={cwWord:'word',cwWordMin:'min',cwWordMax:'max'};
      if(map[el.id]){state[map[el.id]]=el.value;state.wordPage=1;renderWords();}
      if(el.id==='cwProbe'){state.probe=el.value;renderCompare();}
      if(el.id==='cwRequested')state.requested=el.value;if(el.id==='cwSeed')state.seed=el.value;
    });
    app.addEventListener('change',async event=>{
      const el=event.target;
      if(el.id==='cwAccents'){state.accents=el.checked;state.wordPage=1;renderWords();}
      if(el.id==='cwWordSort'){state.sort=el.value;state.wordPage=1;renderWords();}
      if(el.id==='cwActive'){state.active=el.value;state.listPage=1;renderLists();}
      if(el.id==='cwMethod')state.method=el.value;if(el.id==='cwExclude')state.exclude=el.checked;
      if(el.id==='cwProjectFile'&&el.files?.[0])try{
        if(el.files[0].size>5*1024*1024)throw new Error(L('El proyecto debe pesar menos de 5 MB.','Project must be smaller than 5 MB.'));
        const source=JSON.parse(await el.files[0].text()),imported=validateProject(source,cfg.id);
        if(state.lists.length+imported.length>20)throw new Error(L('La importación superaría el máximo de 20 listas.','Import would exceed the 20-list limit.'));
        state.lists.push(...imported);state.active=imported[0]?.id||state.active;state.loadError=source.source_sha256!==data.sourceSha256;persist();renderLists();notice(L('Proyecto importado como listas adicionales.','Project imported as additional lists.'));
      }catch(error){notice(L('No se pudo abrir el proyecto: ','Could not open project: ')+error.message,true);}finally{el.value='';}
    });
    function mount(){if(!$('cwWordResults'))return;$('cwWordSort').value=state.sort;$('cwMethod').value=state.method;renderWords();renderCompare();renderLists();}
    return { panels, rowActions, mount, refresh:()=>{if($('cwCandidates'))$('cwCandidates').textContent=api.getFiltered().length+L(' contextos con los filtros actuales de Consultar.',' contexts match current Browse filters.');} };
  }
  const exported={matches,sample,stimulus,summary,validateProject,create};
  if(typeof module==='object'&&module.exports)module.exports=exported;else root.ClozeWorkbench=exported;
})(typeof globalThis!=='undefined'?globalThis:this);
