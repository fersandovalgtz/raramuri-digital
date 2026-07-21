import { readFile, writeFile } from "node:fs/promises";
import { deriveParallelPairs } from "../lib/parallel-corpus.ts";
import { products } from "../lib/products.ts";

const root = new URL("../", import.meta.url);
const entries = JSON.parse(await readFile(new URL("data/lexicon-master.json", root), "utf8"));
const inventoryReport = JSON.parse(await readFile(new URL("data/grammatical-inventories-report.json", root), "utf8"));
const reports = {
  4: JSON.parse(await readFile(new URL("data/terminology-extraction-report.json", root), "utf8")).records,
  5: JSON.parse(await readFile(new URL("data/graphic-variants-report.json", root), "utf8")).records,
  6: JSON.parse(await readFile(new URL("data/glottal-stop-words-report.json", root), "utf8")).records,
  7: JSON.parse(await readFile(new URL("data/accented-words-report.json", root), "utf8")).records,
};

const rows = entries.map((entry) => ({
  recordId: entry.record_id, headword: entry.headword, classification: entry.classification,
  classificationFamily: entry.classification_family, translationRaw: entry.translation_raw,
  examplesJson: JSON.stringify(entry.examples), sourceCode: entry.source_code,
  sourceDocument: entry.source_document, pageStart: entry.page_start, pageEnd: entry.page_end, status: entry.status,
}));
const pairs = deriveParallelPairs(rows);
const advanced = [];

const normalizeText = (value) => String(value ?? "").replace(/[’‘`´]/gu, "ʼ").normalize("NFC").toLocaleLowerCase("es").replace(/\s+/gu, " ").trim();
const searchText = (value) => normalizeText(value).normalize("NFD").replace(/\p{M}/gu, "").replace(/ʼ/gu, "'");
const productName = (id) => products.find((product) => product.id === id)?.title ?? `Producto ${id}`;
const code = (id, index) => `ADV-${String(id).padStart(2, "0")}-${String(index).padStart(6, "0")}`;
const base = (productId, entry, values = {}) => ({
  advanced_id: "", product_id: productId, product_name: productName(productId), record_type: "",
  form: entry?.headword ?? "", normalized_form: normalizeText(entry?.headword ?? ""), related_form: "", label: "", subtype: "",
  description: "", relation_type: "", target_id: "", target_type: "", entity_id: entry?.record_id ?? "",
  entry_id: entry?.record_id ?? "", related_entry_ids: [], text_rrm: "", text_spa: "", evidence: "", tags: [],
  score: 0, rank: 0, record_count: 0, example_count: entry?.examples?.length ?? 0, form_count: 0, sense_count: entry?.senses?.length ?? 0,
  token_count_rrm: 0, token_count_spa: 0, route: `/productos/${products.find((product) => product.id === productId)?.slug ?? ""}`,
  source_code: entry?.source_code ?? "SRC-02", source_document: entry?.source_document ?? "DICCIONARIO raramuri.pdf",
  page_start: entry?.page_start ?? 3, page_end: entry?.page_end ?? 87, method: "", confidence: "", validation_status: "Pendiente de validación académica",
  ...values,
});
const addProduct = (productId, records) => records.forEach((record, index) => advanced.push({ ...record, advanced_id: code(productId, index + 1) }));

// P-21. Remisiones explícitas “véase”.
const headwordMap = new Map();
for (const entry of entries) {
  const forms = [entry.headword, entry.headword_raw, ...(String(entry.headword_raw).split(/[,/]/gu))];
  for (const form of forms) {
    const key = searchText(form).replace(/^\d+/u, "").replace(/[^a-zñ' ]+$/giu, "").trim();
    if (!key) continue;
    if (!headwordMap.has(key)) headwordMap.set(key, []);
    headwordMap.get(key).push(entry.record_id);
  }
}
const remissionRecords = [];
const remissionSeen = new Set();
for (const entry of entries) {
  const fields = [["Traducción", entry.translation_raw], ["Comentarios", entry.comments_raw], ...entry.variants.map((value) => ["Variante", value])];
  for (const [field, value] of fields) {
    for (const match of String(value).matchAll(/\bv[ée]ase\s+([^.;\]\n]+)/giu)) {
      for (const rawTarget of match[1].split(/\s*(?:,|\by\b)\s*/giu).filter(Boolean)) {
        const target = rawTarget.trim().replace(/^[\s:–—-]+|[\s,;:()[\].]+$/gu, "").replace(/^\d+(?=\p{L})/u, "");
        const targetKey = searchText(target).replace(/[^a-zñ' ]+$/giu, "").trim();
        const dedupe = `${entry.record_id}|${targetKey}`;
        if (!targetKey || remissionSeen.has(dedupe)) continue;
        remissionSeen.add(dedupe);
        const targets = headwordMap.get(targetKey) ?? [];
        remissionRecords.push(base(21, entry, {
          record_type: "Arista de remisión", related_form: target, label: targets.length ? "Resuelta" : "No resuelta",
          subtype: field, relation_type: "VÉASE", target_id: targets[0] ?? "", target_type: "Entrada lexicográfica",
          related_entry_ids: targets, evidence: match[0].trim(), description: `${entry.headword} → ${target}`,
          method: "Expresión regular sobre traducción, comentarios y variantes; resolución por lema normalizado.",
          confidence: targets.length ? "Alta" : "Media",
        }));
      }
    }
  }
}
addProduct(21, remissionRecords);

// P-22. Tesauro temático controlado.
const themes = {
  Animales: ["animal", "perro", "caballo", "vaca", "toro", "oveja", "borrego", "cabra", "chiva", "burro", "venado", "conejo", "pajaro", "ave", "aguila", "gallina", "pollo", "guajolote", "pez", "pescado", "culebra", "serpiente", "insecto", "mosquito", "abeja", "abejorro", "mariposa", "hormiga", "raton", "mapache", "coyote", "lobo", "gato", "cerdo", "marrano", "rana"],
  Cuerpo: ["cuerpo", "cabeza", "cara", "ojo", "nariz", "boca", "diente", "muela", "lengua", "oreja", "cuello", "pecho", "espalda", "brazo", "mano", "dedo", "pierna", "pie", "rodilla", "corazon", "sangre", "hueso", "piel", "cabello", "pelo", "estomago", "vientre", "ombligo", "garganta"],
  Familia: ["padre", "madre", "papa", "mama", "abuelo", "abuela", "hijo", "hija", "hermano", "hermana", "esposo", "esposa", "marido", "familia", "nieto", "nieta", "tio", "tia", "primo", "pariente"],
  Naturaleza: ["agua", "rio", "arroyo", "lluvia", "viento", "nube", "sol", "luna", "estrella", "cielo", "tierra", "monte", "cerro", "sierra", "piedra", "arbol", "planta", "flor", "semilla", "bosque", "fuego", "frio", "calor", "nieve", "hielo"],
  Alimentos: ["alimento", "comida", "comer", "maiz", "frijol", "tortilla", "pinole", "esquiate", "carne", "leche", "queso", "huevo", "chile", "sal", "azucar", "fruta", "manzana", "calabaza", "papa", "bebida", "beber"],
  Acciones: [],
  Espacio: ["arriba", "abajo", "dentro", "fuera", "aqui", "alli", "alla", "cerca", "lejos", "delante", "detras", "lado", "lugar", "camino", "direccion"],
  Tiempo: ["hoy", "ayer", "mañana", "noche", "dia", "tarde", "temprano", "ahora", "antes", "despues", "siempre", "nunca", "tiempo", "año", "mes"],
};
const thesaurusRecords = [];
const thematicByEntry = new Map();
const containsWord = (haystack, needle) => new RegExp(`(?:^|[^a-zñ])${needle.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}(?:$|[^a-zñ])`, "u").test(haystack);
for (const entry of entries) {
  const text = searchText([entry.translation_raw, ...entry.senses].join(" "));
  const assignments = [];
  for (const [theme, keywords] of Object.entries(themes)) {
    const matches = theme === "Acciones" && /^(Vt|Vi|Vr|V|Imper)$/u.test(entry.classification_family)
      ? [entry.classification_family]
      : keywords.filter((keyword) => containsWord(text, keyword));
    if (!matches.length) continue;
    assignments.push(theme);
    thesaurusRecords.push(base(22, entry, {
      record_type: "Asignación temática", related_form: theme, label: theme, subtype: "Campo semántico",
      relation_type: "PERTENECE_A_CAMPO", target_id: `FIELD-${theme.toLocaleUpperCase("es").normalize("NFD").replace(/\p{M}/gu, "")}`,
      target_type: "Campo semántico", evidence: matches.join(", "), tags: matches,
      description: `${entry.headword}: ${entry.translation_raw}`, method: "Regla léxica controlada sobre traducciones y acepciones.", confidence: "Media",
    }));
  }
  thematicByEntry.set(entry.record_id, assignments);
}
addProduct(22, thesaurusRecords);

// P-23. Relaciones de la ontología léxica inicial.
const ontologyRecords = [];
for (const entry of entries) {
  ontologyRecords.push(base(23, entry, {
    record_type: "Relación ontológica", related_form: entry.classification_family || "Sin clasificar", label: "Categoría gramatical",
    subtype: "Entry → Category", relation_type: "HAS_GRAMMATICAL_CATEGORY", target_id: `CAT-${entry.classification_family || "NA"}`,
    target_type: "Categoría gramatical", evidence: entry.classification || "Sin clasificación", method: "Relación derivada de la clasificación canónica de P-01.", confidence: "Alta",
  }));
  entry.senses.forEach((sense, index) => ontologyRecords.push(base(23, entry, {
    record_type: "Relación ontológica", related_form: sense, label: "Acepción", subtype: "Entry → Sense",
    relation_type: "HAS_SENSE", target_id: `SENSE-${entry.record_id.slice(3)}-${String(index + 1).padStart(2, "0")}`,
    target_type: "Acepción", evidence: sense, method: "Relación derivada de las acepciones estructuradas de P-01.", confidence: "Alta",
  })));
  (thematicByEntry.get(entry.record_id) ?? []).forEach((theme) => ontologyRecords.push(base(23, entry, {
    record_type: "Relación ontológica", related_form: theme, label: "Campo semántico", subtype: "Entry → Field",
    relation_type: "IN_SEMANTIC_FIELD", target_id: `FIELD-${theme.toLocaleUpperCase("es").normalize("NFD").replace(/\p{M}/gu, "")}`,
    target_type: "Campo semántico", evidence: `Asignación P-22: ${theme}`, method: "Relación importada del tesauro P-22.", confidence: "Media",
  })));
}
addProduct(23, ontologyRecords);

// P-24. Índice documental por ejemplos y formas etiquetadas.
const frequencyRecords = entries.map((entry) => {
  const derivedForms = new Set();
  entry.variants.forEach((variant) => {
    const chunks = String(variant).split(/[;,]/gu).map((item) => item.replace(/^(?:pret|fut|imper|pp|pl|sing|sg)\.?\s*:\s*/iu, "").trim()).filter(Boolean);
    chunks.forEach((form) => derivedForms.add(normalizeText(form)));
  });
  const score = entry.examples.length + derivedForms.size;
  return base(24, entry, {
    record_type: "Métrica documental", label: score >= 4 ? "Alta" : score >= 2 ? "Media" : score === 1 ? "Baja" : "Sin evidencia derivada",
    subtype: "Ejemplos + formas", description: `${entry.examples.length} ejemplo(s); ${derivedForms.size} forma(s) documentada(s).`,
    score, example_count: entry.examples.length, form_count: derivedForms.size, evidence: `examples=${entry.examples.length}; forms=${derivedForms.size}`,
    method: "Suma de ejemplos y formas etiquetadas distintas; no representa frecuencia de uso comunitario.", confidence: "Alta", validation_status: "Cálculo reproducible; cotejo documental pendiente",
  });
}).sort((a, b) => b.score - a.score || a.form.localeCompare(b.form, "es"));
frequencyRecords.forEach((record, index) => { record.rank = index + 1; });
addProduct(24, frequencyRecords);

// P-25. Índice alfabético con acentos y saltillo conservados.
const collator = new Intl.Collator("es-MX", { sensitivity: "variant", numeric: true, ignorePunctuation: false });
const alphabeticRecords = entries.map((entry) => {
  const exact = normalizeText(entry.headword);
  const baseKey = exact.normalize("NFD").replace(/\p{M}/gu, "");
  const initial = [...exact].find((character) => character !== "ʼ" && /\p{L}/u.test(character))?.toLocaleUpperCase("es") ?? "#";
  return base(25, entry, {
    record_type: "Clave alfabética", label: initial, subtype: entry.homonym_number == null ? "Lema" : `Homónimo ${entry.homonym_number}`,
    description: `Clave exacta: ${exact}; clave base de búsqueda: ${baseKey}`, evidence: entry.headword_raw,
    method: "NFC, saltillo U+02BC e intercalación es-MX con sensibilidad de variante.", confidence: "Alta", validation_status: "Normalización técnica verificada",
  });
}).sort((a, b) => collator.compare(a.normalized_form, b.normalized_form) || a.entry_id.localeCompare(b.entry_id));
alphabeticRecords.forEach((record, index) => { record.rank = index + 1; });
addProduct(25, alphabeticRecords);

// P-26 y P-27. Candidatos editoriales por reglas explícitas.
const concreteExtras = ["casa", "puerta", "ventana", "mesa", "silla", "cesta", "canasta", "olla", "plato", "cuchara", "cuchillo", "hacha", "arco", "flecha", "ropa", "camisa", "falda", "sombrero", "huarache", "zapato", "mecate", "cuerda", "palo", "madera", "campo"];
const abstractKeywords = ["verdad", "mentira", "amor", "miedo", "pensamiento", "idea", "manera", "modo", "tiempo", "causa", "razon", "nombre", "palabra", "idioma", "costumbre", "trabajo", "fuerza", "deseo", "necesidad", "posibilidad", "cantidad", "cualidad", "estado", "accion", "conocimiento", "recuerdo", "sueño", "pregunta", "respuesta", "derecho", "obligacion", "orden", "paz", "respeto"];
const illustrableRecords = [];
const abstractRecords = [];
for (const entry of entries) {
  const text = searchText([entry.translation_raw, ...entry.senses].join(" "));
  const fields = thematicByEntry.get(entry.record_id) ?? [];
  const abstractMatches = abstractKeywords.filter((keyword) => containsWord(text, keyword));
  const concreteMatches = concreteExtras.filter((keyword) => containsWord(text, keyword));
  const concreteFields = fields.filter((field) => ["Animales", "Cuerpo", "Familia", "Naturaleza", "Alimentos"].includes(field));
  if ((concreteFields.length || concreteMatches.length) && !abstractMatches.length) {
    const labels = [...new Set([...concreteFields, ...concreteMatches])];
    illustrableRecords.push(base(26, entry, {
      record_type: "Candidato ilustrable", label: concreteFields[0] ?? "Objeto", subtype: "Referente concreto",
      description: entry.translation_raw, evidence: labels.join(", "), tags: labels, score: concreteFields.length ? 90 : 75,
      method: "Regla de concreción por campo temático y vocabulario de objetos.", confidence: concreteFields.length ? "Alta" : "Media",
    }));
    continue;
  }
  const abstractFamily = ["Adv", "Pron", "Conj", "Prep", "Interr"].includes(entry.classification_family);
  if (abstractMatches.length || abstractFamily) {
    const labels = abstractMatches.length ? abstractMatches : [entry.classification_family];
    abstractRecords.push(base(27, entry, {
      record_type: "Candidato abstracto", label: abstractMatches.length ? "Concepto abstracto" : "Función gramatical",
      subtype: abstractMatches.length ? "Semántico" : entry.classification_family, description: entry.translation_raw,
      evidence: labels.join(", "), tags: labels, score: abstractMatches.length ? 85 : 70,
      method: "Regla de abstracción por vocabulario y familia funcional.", confidence: abstractMatches.length ? "Alta" : "Media",
    }));
  }
}
addProduct(26, illustrableRecords);
addProduct(27, abstractRecords);

// P-28 y P-29. Selección de ejemplos paralelos por métricas observables.
const tokenCount = (value) => String(value).trim().split(/\s+/u).filter(Boolean).length;
const complexMarkers = /\b(?:mapu|maparí|mapari|mapujiti|jiti|nirá|nira|churigá|churiga)\b/iu;
const teachingRecords = [];
const analysisRecords = [];
for (const pair of pairs) {
  const entry = entries.find((item) => item.record_id === pair.entryId);
  const rrmTokens = tokenCount(pair.rrmText);
  const spaTokens = tokenCount(pair.spaText);
  const hasMarker = complexMarkers.test(pair.rrmText);
  const hasClausePunctuation = /[;:]/u.test(`${pair.rrmText} ${pair.spaText}`);
  const initial = pair.alignmentStatus === "Alineado" && pair.alignmentType === "1:1" && pair.confidence !== "Baja" && rrmTokens >= 2 && rrmTokens <= 8 && spaTokens >= 2 && spaTokens <= 12 && !hasMarker && !hasClausePunctuation;
  if (initial) teachingRecords.push(base(28, entry, {
    record_type: "Ejemplo didáctico", form: pair.headwordRrm, text_rrm: pair.rrmText, text_spa: pair.spaText,
    label: rrmTokens <= 5 && spaTokens <= 8 ? "Inicial A" : "Inicial B", subtype: pair.confidence,
    entity_id: pair.pairId, target_id: pair.pairId, target_type: "Par paralelo", evidence: pair.sourceExample,
    score: 100 - rrmTokens - spaTokens, token_count_rrm: rrmTokens, token_count_spa: spaTokens,
    method: "Filtro por alineación 1:1, confianza y longitud; excluye marcadores complejos.", confidence: pair.confidence,
  }));
  const phenomena = [];
  if (rrmTokens >= 10 || spaTokens >= 14) phenomena.push("Extensión");
  if (pair.alignmentType !== "1:1") phenomena.push("Alineación compleja");
  if (pair.alignmentStatus === "Revisión requerida") phenomena.push("Segmento sin contraparte");
  if (hasMarker) phenomena.push("Subordinación / enlace");
  if (hasClausePunctuation) phenomena.push("Estructura multicláusula");
  if (phenomena.length) analysisRecords.push(base(29, entry, {
    record_type: "Ejemplo analítico", form: pair.headwordRrm, text_rrm: pair.rrmText, text_spa: pair.spaText,
    label: phenomena[0], subtype: pair.alignmentType, entity_id: pair.pairId, target_id: pair.pairId, target_type: "Par paralelo",
    description: phenomena.join("; "), evidence: pair.sourceExample, tags: phenomena,
    score: rrmTokens + spaTokens + (pair.alignmentType === "1:1" ? 0 : 10) + (hasMarker ? 5 : 0),
    token_count_rrm: rrmTokens, token_count_spa: spaTokens,
    method: "Selección por extensión, estructura de alineación y marcadores lingüísticos observables.", confidence: pair.confidence,
  }));
}
addProduct(28, teachingRecords);
addProduct(29, analysisRecords);

// P-30. Matriz de auditoría por producto; los registros P-21–P-29 ya conservan fuente, página y entidad.
const productCounts = { 1: entries.length, 2: entries.length, 3: pairs.length, ...reports };
for (let id = 8; id <= 20; id += 1) productCounts[id] = inventoryReport.products[id].records;
for (let id = 21; id <= 29; id += 1) productCounts[id] = advanced.filter((record) => record.product_id === id).length;
productCounts[30] = 30;
const traceRecords = products.map((product) => base(30, null, {
  record_type: "Control de trazabilidad", form: `P-${String(product.id).padStart(2, "0")}`, normalized_form: product.slug,
  label: "Cobertura completa", subtype: product.domain, description: product.title, entity_id: `P-${String(product.id).padStart(2, "0")}`,
  target_id: `P-${String(product.id).padStart(2, "0")}`, target_type: "Producto", record_count: productCounts[product.id],
  evidence: `Unidad: ${product.recordUnit}; registros: ${productCounts[product.id]}; fuente mínima: entidad + source_code + página.`,
  route: `/productos/${product.slug}`, source_code: product.id === 4 ? "SRC-01" : "SRC-02",
  source_document: product.id === 4 ? "Diccionario tarahumara de Samachique" : "DICCIONARIO raramuri.pdf",
  page_start: product.id === 4 ? 91 : 3, page_end: product.id === 4 ? 140 : 87,
  method: "Matriz de producto, entidad, fuente, página, proceso y versión.", confidence: "Alta",
  validation_status: product.id <= 30 ? "Trazabilidad técnica activa; validación académica pendiente" : "Pendiente",
}));
addProduct(30, traceRecords);

const summary = {};
for (let id = 21; id <= 30; id += 1) {
  const records = advanced.filter((record) => record.product_id === id);
  summary[id] = {
    records: records.length,
    entries: new Set(records.map((record) => record.entry_id).filter(Boolean)).size,
    pages: new Set(records.flatMap((record) => Array.from({ length: record.page_end - record.page_start + 1 }, (_, index) => record.page_start + index))).size,
    labels: Object.fromEntries([...new Set(records.map((record) => record.label))].sort((a, b) => a.localeCompare(b, "es")).map((label) => [label, records.filter((record) => record.label === label).length])),
    relation_types: Object.fromEntries([...new Set(records.map((record) => record.relation_type).filter(Boolean))].sort().map((relation) => [relation, records.filter((record) => record.relation_type === relation).length])),
  };
}
const report = {
  records: advanced.length, source_entries: entries.length, parallel_pairs: pairs.length, products: summary,
  extraction_method: "Derivaciones reproducibles P-21–P-30 sobre P-01 y P-03; reglas y evidencia conservadas por registro.",
  validation_status: "Validación lingüística, semántica y didáctica pendiente",
};
await writeFile(new URL("data/advanced-products.json", root), JSON.stringify(advanced, null, 2) + "\n");
await writeFile(new URL("data/advanced-products-report.json", root), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
