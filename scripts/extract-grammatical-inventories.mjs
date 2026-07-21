import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "data/lexicon-master.json");
const jsonPath = resolve(projectRoot, "data/grammatical-inventories.json");
const reportPath = resolve(projectRoot, "data/grammatical-inventories-report.json");
const entries = JSON.parse(await readFile(sourcePath, "utf8"));

const productFamilies = new Map([[8, "S"], [9, "Vt"], [10, "Vi"], [11, "Adj"], [12, "Adv"], [13, "Pron"], [14, "Interj"]]);
const productNames = {
  8: "Sustantivos", 9: "Verbos transitivos", 10: "Verbos intransitivos", 11: "Adjetivos", 12: "Adverbios",
  13: "Pronombres", 14: "Interjecciones", 15: "Términos regionales", 16: "Singulares y plurales",
  17: "Pasado y futuro", 18: "Imperativos", 19: "Gerundios y participios", 20: "Homonimia y polisemia",
};

function normalize(value) {
  return value.replace(/[’‘`´]/gu, "'").normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es").replace(/\s+/gu, " ").trim();
}

function primaryHeadword(value) {
  return value.split(/\s*[,:[\]]\s*/u)[0].trim();
}

function sourceFields(entry) {
  return {
    source_code: entry.source_code,
    source_document: entry.source_document,
    page_start: entry.page_start,
    page_end: entry.page_end,
    source_status: entry.status,
    validation_status: "Pendiente de cotejo lingüístico",
  };
}

function baseRecord(productId, entry, overrides = {}) {
  return {
    inventory_id: "",
    product_id: productId,
    product_name: productNames[productId],
    record_type: "Entrada gramatical",
    form: entry.headword,
    normalized_form: entry.headword_normalized,
    related_form: "",
    label: entry.classification || entry.classification_family,
    subtype: entry.classification_family,
    classification: entry.classification,
    classification_family: entry.classification_family,
    translation: entry.translation_raw,
    senses: entry.senses,
    sense_count: entry.senses.length,
    evidence: entry.headword_raw || entry.headword,
    entry_id: entry.record_id,
    related_entry_ids: [],
    homonym_number: entry.homonym_number,
    group_key: entry.headword_normalized,
    relation_status: "Documentado",
    example_count: entry.examples.length,
    variant_count: entry.variants.length,
    ...sourceFields(entry),
    ...overrides,
  };
}

const records = [];
const seen = new Set();
function add(record) {
  const key = [record.product_id, record.entry_id, normalize(record.form), normalize(record.related_form), record.label, record.subtype].join("::");
  if (seen.has(key)) return;
  seen.add(key);
  records.push(record);
}

for (const [productId, family] of productFamilies) {
  for (const entry of entries.filter((item) => item.classification_family === family)) add(baseRecord(productId, entry));
}

const regionalPattern = /(?:\(\s*reg\.?\s*\)|\breg\.\s*[:,]|\breg\s*:)/iu;
for (const entry of entries) {
  const fields = [entry.translation_raw, entry.comments_raw, ...entry.senses, ...entry.variants];
  const evidence = fields.find((value) => regionalPattern.test(value));
  if (!evidence) continue;
  add(baseRecord(15, entry, {
    record_type: "Término regional",
    label: "Marca regional explícita",
    subtype: entry.classification_family,
    evidence,
  }));
}

function labeledForms(entry, labels) {
  const output = [];
  const sources = [...entry.variants, entry.translation_raw, entry.comments_raw];
  const labelPattern = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")).join("|");
  const regex = new RegExp(String.raw`\b(${labelPattern})\.?\s*:\s*([^\];.]+)`, "giu");
  for (const source of sources) {
    for (const match of source.matchAll(regex)) {
      for (const rawForm of match[2].split(/\s*,\s*/u)) {
        const form = rawForm.replace(/^[¡¿\s]+|[!?,:\s]+$/gu, "").replace(/^\d+\s*/u, "").trim();
        if (!form || form.length > 80 || /^(?:que|el|la|los|las)$/iu.test(form)) continue;
        output.push({ label: match[1].replace(/\.$/u, "").toLocaleLowerCase("es"), form, evidence: match[0] });
      }
    }
  }
  return output;
}

for (const entry of entries) {
  const headword = primaryHeadword(entry.headword);
  const numberForms = labeledForms(entry, ["pl", "sing", "sg"]);
  for (const item of numberForms) {
    const pluralTarget = item.label === "pl";
    add(baseRecord(16, entry, {
      record_type: "Relación de número",
      form: pluralTarget ? headword : item.form,
      normalized_form: normalize(pluralTarget ? headword : item.form),
      related_form: pluralTarget ? item.form : headword,
      label: "Singular–plural",
      subtype: "Par explícito",
      evidence: item.evidence,
      relation_status: "Par documentado",
    }));
  }
  if (!numberForms.length) {
    const classification = entry.classification.toLocaleLowerCase("es");
    const number = /\b(?:sing|sg|sin)\b/u.test(classification) ? "Singular" : /\bpl\b/u.test(classification) || /^vipl$/u.test(classification) ? "Plural" : "";
    if (number) add(baseRecord(16, entry, {
      record_type: "Forma de número",
      form: headword,
      normalized_form: normalize(headword),
      label: number,
      subtype: "Clasificación explícita",
      evidence: entry.classification,
      relation_status: "Contraparte no indicada",
    }));
  }

  const temporalForms = labeledForms(entry, ["pret", "fut"]);
  for (const item of temporalForms) add(baseRecord(17, entry, {
    record_type: "Forma temporal",
    form: item.form,
    normalized_form: normalize(item.form),
    related_form: headword,
    label: item.label === "pret" ? "Pasado" : "Futuro",
    subtype: "Forma etiquetada",
    evidence: item.evidence,
  }));
  const classification = entry.classification.toLocaleLowerCase("es");
  if (/\bpret\b/u.test(classification)) add(baseRecord(17, entry, { record_type: "Forma temporal", form: headword, normalized_form: normalize(headword), label: "Pasado", subtype: "Clasificación explícita", evidence: entry.classification }));
  if (/\bfut\b/u.test(classification)) add(baseRecord(17, entry, { record_type: "Forma temporal", form: headword, normalized_form: normalize(headword), label: "Futuro", subtype: "Clasificación explícita", evidence: entry.classification }));
}

const imperativeMarker = /\bimper\.?/iu;
const spanishBeforeImperative = new Set(["elegir", "tomar", "poner", "hacer"]);
for (const entry of entries) {
  const sourceText = [entry.classification, entry.translation_raw, entry.comments_raw].join(" ");
  if (!imperativeMarker.test(sourceText)) continue;
  add(baseRecord(18, entry, {
    record_type: "Forma imperativa",
    form: primaryHeadword(entry.headword),
    normalized_form: normalize(primaryHeadword(entry.headword)),
    label: "Imperativo",
    subtype: /\bpl\b/iu.test(entry.classification) ? "Plural" : "Número no indicado",
    evidence: entry.classification_family === "Imper" ? entry.classification : sourceText.match(/.{0,45}\bimper\.?[^.]{0,70}/iu)?.[0] || sourceText,
  }));
  for (const match of entry.comments_raw.matchAll(/([’‘'ʼ´`\p{L}\p{M}]+)[.!¡?\s]*\bimper\.?(?:\s+pl)?/giu)) {
    const form = match[1].trim();
    if (spanishBeforeImperative.has(normalize(form))) continue;
    if (normalize(form) !== normalize(primaryHeadword(entry.headword)) && !/[áéíóú’‘'ʼ´`]/iu.test(form) && !/si$/iu.test(form)) continue;
    add(baseRecord(18, entry, {
      record_type: "Forma imperativa",
      form,
      normalized_form: normalize(form),
      related_form: primaryHeadword(entry.headword),
      label: "Imperativo",
      subtype: /\bpl\b/iu.test(match[0]) ? "Plural" : "Número no indicado",
      evidence: match[0],
    }));
  }
}

for (const entry of entries) {
  const headword = primaryHeadword(entry.headword);
  if (entry.classification_family === "Pp") add(baseRecord(19, entry, { record_type: "Forma no finita", form: headword, normalized_form: normalize(headword), label: "Participio", subtype: "Clasificación Pp", evidence: entry.classification }));
  for (const item of labeledForms(entry, ["pp"])) add(baseRecord(19, entry, {
    record_type: "Forma no finita", form: item.form, normalized_form: normalize(item.form), related_form: headword,
    label: "Participio", subtype: "Etiqueta pp", evidence: item.evidence,
  }));
  if ((entry.variants || []).some((value) => /^pp\s+de\b/iu.test(value))) add(baseRecord(19, entry, { record_type: "Forma no finita", form: headword, normalized_form: normalize(headword), label: "Participio", subtype: "Remisión pp", evidence: entry.variants.find((value) => /^pp\s+de\b/iu.test(value)) }));
  const ppCandidates = [...entry.comments_raw.matchAll(/([’‘'ʼ´`\p{L}\p{M}]+)[.,;:\s]*\bpp\.?/giu)].map((match) => ({ form: match[1], evidence: match[0] })).filter((item) => /(?:a|ra|ta|ca)?mi[l]?$/iu.test(item.form));
  for (const item of ppCandidates) add(baseRecord(19, entry, { record_type: "Forma no finita", form: item.form, normalized_form: normalize(item.form), related_form: headword, label: "Participio", subtype: "Marca pp en comentario", evidence: item.evidence }));
  if (/\bgerundio\b/iu.test([entry.translation_raw, entry.comments_raw].join(" "))) add(baseRecord(19, entry, { record_type: "Forma no finita", form: headword, normalized_form: normalize(headword), label: "Gerundio", subtype: "Marca explícita", evidence: [entry.translation_raw, entry.comments_raw].find((value) => /\bgerundio\b/iu.test(value)) }));
}

const numberedGroups = new Map();
for (const entry of entries.filter((item) => item.homonym_number != null)) {
  const group = numberedGroups.get(entry.headword_normalized) || [];
  group.push(entry.record_id);
  numberedGroups.set(entry.headword_normalized, group);
}
for (const entry of entries.filter((item) => item.homonym_number != null || item.senses.length > 1)) {
  const homonym = entry.homonym_number != null;
  const polysemic = entry.senses.length > 1;
  add(baseRecord(20, entry, {
    record_type: "Relación léxica",
    label: homonym && polysemic ? "Homonimia y polisemia" : homonym ? "Homonimia" : "Polisemia",
    subtype: homonym ? `Homónimo ${entry.homonym_number}` : `${entry.senses.length} acepciones`,
    evidence: entry.translation_raw,
    related_entry_ids: numberedGroups.get(entry.headword_normalized) || [],
    relation_status: homonym ? "Numeración explícita" : "Acepciones explícitas",
  }));
}

records.sort((a, b) => a.product_id - b.product_id || a.normalized_form.localeCompare(b.normalized_form, "es") || a.entry_id.localeCompare(b.entry_id) || a.label.localeCompare(b.label, "es"));
const counters = new Map();
for (const record of records) {
  const next = (counters.get(record.product_id) || 0) + 1;
  counters.set(record.product_id, next);
  record.inventory_id = `INV-${String(record.product_id).padStart(2, "0")}-${String(next).padStart(6, "0")}`;
}

const products = {};
for (let productId = 8; productId <= 20; productId += 1) {
  const subset = records.filter((record) => record.product_id === productId);
  products[productId] = {
    records: subset.length,
    entries: new Set(subset.map((record) => record.entry_id)).size,
    pages: new Set(subset.flatMap((record) => Array.from({ length: record.page_end - record.page_start + 1 }, (_, index) => record.page_start + index))).size,
    with_examples: subset.filter((record) => record.example_count > 0).length,
    labels: Object.fromEntries([...new Set(subset.map((record) => record.label))].sort((a, b) => a.localeCompare(b, "es")).map((label) => [label, subset.filter((record) => record.label === label).length])),
    subtypes: Object.fromEntries([...new Set(subset.map((record) => record.subtype))].sort((a, b) => a.localeCompare(b, "es")).map((subtype) => [subtype, subset.filter((record) => record.subtype === subtype).length])),
  };
}
const report = {
  records: records.length,
  source_entries: entries.length,
  products,
  extraction_method: "Clasificación por familia gramatical; marcas regionales explícitas; extracción de etiquetas morfológicas; homonimia numerada y acepciones estructuradas",
  validation_status: "Pendiente de cotejo lingüístico",
};

await Promise.all([
  writeFile(jsonPath, JSON.stringify(records, null, 2) + "\n"),
  writeFile(reportPath, JSON.stringify(report, null, 2) + "\n"),
]);
console.log(JSON.stringify(report, null, 2));
