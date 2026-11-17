/* Datos y exportación de los exploradores. Sin servicios externos. */
(function (root) {
  'use strict';
  const missing = v => v == null || /^(?:NA|NaN|null)?$/i.test(String(v).trim());
  const number = v => missing(v) || !Number.isFinite(Number(v)) ? null : Number(v);
  const normalize = (v, accents = false) => {
    const s = String(v ?? '').trim().toLocaleLowerCase('es');
    return accents ? s.normalize('NFD').replace(/n\u0303/g, 'ñ').replace(/[\u0300-\u036f]/g, '') : s;
  };
  function parseCSV(text) {
    text = text.replace(/^\uFEFF/, '');
    const first = text.split(/\r?\n/, 1)[0];
    const delimiter = first.includes('\t') ? '\t' : first.split(';').length > first.split(',').length ? ';' : ',';
    const matrix = []; let row = [], value = '', quoted = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') { if (quoted && text[i + 1] === '"') { value += '"'; i++; } else quoted = !quoted; }
      else if (c === delimiter && !quoted) { row.push(value); value = ''; }
      else if ((c === '\n' || c === '\r') && !quoted) {
        row.push(value); if (row.some(v => v !== '')) matrix.push(row); row = []; value = '';
        if (c === '\r' && text[i + 1] === '\n') i++;
      } else value += c;
    }
    if (quoted) throw new Error('El CSV contiene una celda con comillas sin cerrar.');
    row.push(value); if (row.some(v => v !== '')) matrix.push(row);
    if (!matrix.length) throw new Error('El archivo no contiene datos.');
    const seen = new Set();
    const columns = matrix.shift().map((c, i) => { const k = c.trim() || (i === 0 ? 'source_row' : 'column_' + (i + 1)); if (seen.has(k)) throw new Error('Columna duplicada: ' + k); seen.add(k); return k; });
    return { columns, rows: matrix.map(row => Object.fromEntries(columns.map((c, i) => [c, row[i] ?? '']))) };
  }
  const nodeText = n => n ? n.textContent || '' : '';
  function parseWorkbook(bytes) {
    const files = root.fflate.unzipSync(bytes);
    const xml = path => { if (!files[path]) throw new Error('Falta la hoja del Excel: ' + path); const doc = new DOMParser().parseFromString(root.fflate.strFromU8(files[path]), 'application/xml'); if (doc.querySelector('parsererror')) throw new Error('El Excel contiene XML inválido.'); return doc; };
    const shared = files['xl/sharedStrings.xml'] ? [...xml('xl/sharedStrings.xml').getElementsByTagName('si')].map(nodeText) : [];
    const relations = new Map([...xml('xl/_rels/workbook.xml.rels').getElementsByTagName('Relationship')].map(n => [n.getAttribute('Id'), n.getAttribute('Target')]));
    const sheets = {};
    for (const sheet of xml('xl/workbook.xml').getElementsByTagName('sheet')) {
      const name = sheet.getAttribute('name');
      if (!['Sentences', 'Unified', 'ID_responses', 'ID_selected'].includes(name)) continue;
      let target = relations.get(sheet.getAttribute('r:id'));
      target = target.startsWith('/') ? target.slice(1) : 'xl/' + target.replace(/^\.\//, '');
      const doc = xml(target), matrix = [];
      for (const row of doc.getElementsByTagName('row')) {
        const values = []; const index = Number(row.getAttribute('r')) - 1;
        for (const c of row.getElementsByTagName('c')) {
          const letters = c.getAttribute('r').match(/^[A-Z]+/)[0]; let col = 0;
          for (const letter of letters) col = col * 26 + letter.charCodeAt(0) - 64;
          const v = c.getElementsByTagName('v')[0];
          values[col - 1] = c.getAttribute('t') === 's' ? shared[Number(nodeText(v))] : c.getAttribute('t') === 'inlineStr' ? nodeText(c.getElementsByTagName('is')[0]) : nodeText(v);
        }
        matrix[index] = values;
      }
      sheets[name] = matrix;
    }
    return sheets;
  }
  function aggregateCloze(sheets) {
    for (const name of ['Sentences', 'Unified', 'ID_responses', 'ID_selected']) if (!sheets[name]?.length) throw new Error('El Excel debe incluir la hoja ' + name + '.');
    const selected = new Set(sheets.ID_selected.slice(1).map(r => String(r?.[0] ?? '').trim()).filter(x => !missing(x)));
    const responses = sheets.Unified, ids = sheets.ID_responses;
    const responseCols = new Map(responses[0].map((v, i) => [String(v).trim(), i]));
    const idCols = new Map(ids[0].map((v, i) => [String(v).trim(), i]));
    const rows = [], details = {}; let observations = 0;
    for (const sentence of sheets.Sentences.slice(1)) {
      if (!sentence || missing(sentence[0])) continue;
      const ID = String(sentence[0]).trim(), c = responseCols.get(ID), j = idCols.get(ID);
      if (c == null || j == null) throw new Error('El contexto ' + ID + ' no tiene columnas de respuestas alineadas.');
      const counts = new Map(), participantSeen = new Set();
      for (let r = 1; r < responses.length; r++) {
        const pid = String(ids[r]?.[j] ?? '').trim(), response = String(responses[r]?.[c] ?? '').trim();
        if (!selected.has(pid) || missing(response)) continue;
        if (participantSeen.has(pid)) throw new Error('ID de participante repetido en ' + ID + '.');
        participantSeen.add(pid); counts.set(response, (counts.get(response) || 0) + 1);
      }
      const N = [...counts.values()].reduce((a, b) => a + b, 0); observations += N;
      const alternatives = [...counts].map(([Response, Count]) => ({ Response, Count, Probability: Count / N, Surprisal_bits: -Math.log2(Count / N) })).sort((a, b) => b.Count - a.Count || (a.Response < b.Response ? -1 : a.Response > b.Response ? 1 : 0));
      const entropy = alternatives.reduce((sum, a) => sum - a.Probability * Math.log2(a.Probability), 0);
      rows.push({ ID, Sentence: sentence[1] || '', English: sentence[2] || '', N, Top_completion: alternatives[0]?.Response || '', Cloze_max: alternatives[0]?.Probability ?? null, Entropy_bits: N ? entropy : null, Response_types: alternatives.length });
      details[ID] = alternatives;
    }
    return { schemaVersion: 1, columns: ['ID','Sentence','English','N','Top_completion','Cloze_max','Entropy_bits','Response_types'], rows, details, provenance: { responseSheet: 'Unified', selectedSheet: 'ID_selected', alignmentSheet: 'ID_responses', selectedParticipants: selected.size, validObservations: observations, denominator: 'N = respuestas válidas de participantes ID_selected, alineadas por celda con ID_responses; NA, na, NaN y vacíos excluidos.', metrics: 'Probability = Count/N; Cloze_max = max(Probability); Entropy_bits = -sum(p*log2(p)); Surprisal_bits = -log2(p). Valores derivados para consulta, no columnas precomputadas publicadas.' } };
  }
  async function prepare(bytes, path, type) {
    let data;
    if (type === 'cloze') data = aggregateCloze(parseWorkbook(bytes));
    else data = { schemaVersion: 1, ...parseCSV(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) };
    if (type === 'anew' && ['Word','M_Val','M_Aro','M_Dom'].some(key => !data.columns.includes(key))) throw new Error('El CSV ANEW necesita Word, M_Val, M_Aro y M_Dom.');
    data.sourceFile = path;
    if (root.crypto?.subtle) data.sourceSha256 = [...new Uint8Array(await root.crypto.subtle.digest('SHA-256', bytes))].map(v => v.toString(16).padStart(2, '0')).join('');
    return data;
  }
  function csv(rows, columns) {
    const cell = value => {
      let text = value == null ? '' : String(value);
      if (/^[=+@\t\r]/.test(text) || (/^-/.test(text) && number(text) == null)) text = "'" + text;
      return /[",\r\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
    };
    return '\uFEFF' + [columns.map(cell).join(','), ...rows.map(r => columns.map(c => cell(r[c])).join(','))].join('\r\n');
  }
  const escapeXML = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c])).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  function worksheet(rows, columns) {
    const column = n => { let s = ''; for (n++; n; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + (n - 1) % 26) + s; return s; };
    const data = [Object.fromEntries(columns.map(c => [c, c])), ...rows];
    return '<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" state="frozen"/></sheetView></sheetViews><sheetData>' + data.map((r, i) => '<row r="' + (i + 1) + '">' + columns.map((c, j) => {
      const v = r[c], ref = column(j) + (i + 1), n = i > 0 ? number(v) : null;
      return n != null && !/^0\d/.test(String(v)) ? '<c r="' + ref + '"><v>' + n + '</v></c>' : '<c r="' + ref + '" t="inlineStr"><is><t xml:space="preserve">' + escapeXML(v) + '</t></is></c>';
    }).join('') + '</row>').join('') + '</sheetData><autoFilter ref="A1:' + column(columns.length - 1) + Math.max(1, data.length) + '"/></worksheet>';
  }
  function xlsx(rows, columns, metadata) {
    if (!columns.length) throw new Error('Selecciona al menos una columna.');
    const strings = {
      '[Content_Types].xml': '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
      '_rels/.rels': '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
      'xl/workbook.xml': '<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Datos" sheetId="1" r:id="rId1"/><sheet name="Ficha" sheetId="2" r:id="rId2"/></sheets></workbook>',
      'xl/_rels/workbook.xml.rels': '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/></Relationships>',
      'xl/worksheets/sheet1.xml': worksheet(rows, columns),
      'xl/worksheets/sheet2.xml': worksheet(Object.entries(metadata).map(([Campo, Valor]) => ({ Campo, Valor: typeof Valor === 'object' ? JSON.stringify(Valor) : Valor })), ['Campo','Valor'])
    };
    return root.fflate.zipSync(Object.fromEntries(Object.entries(strings).map(([k, v]) => [k, root.fflate.strToU8(v)])), { level: 6 });
  }
  const api = { missing, number, normalize, parseCSV, parseWorkbook, aggregateCloze, prepare, csv, xlsx };
  root.ResourceData = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
