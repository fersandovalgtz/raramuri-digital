import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const inputDir = process.argv[2] ? resolve(process.argv[2]) : resolve(projectRoot, "../work/pdfs/spanish-raramuri");
const jsonPath = resolve(projectRoot, "data/terminology-spanish-raramuri.json");
const csvPath = resolve(projectRoot, "data/terminology-spanish-raramuri.csv");
const reportPath = resolve(projectRoot, "data/terminology-extraction-report.json");

const posPattern = String.raw`(?:adj(?:\s+(?:dem|pos))?|pron(?:\s+(?:dem|pos))?|v(?:t|i|r|í|£|7)|\/?m|Mm|f|adv|prep|interj|interr|imper|pp|conj|num|art|impers|s)`;
const posRegex = new RegExp(String.raw`(?<!\p{L})(${posPattern})(?!\p{L})`, "iu");

function normalizePos(value) {
  const normalized = value.toLocaleLowerCase("es").replace(/\s+/g, " ").trim();
  if (["vt", "ví", "v£", "v7"].includes(normalized)) return "vt";
  if (["/m", "mm"].includes(normalized)) return "m";
  return normalized;
}

function normalizeTerm(value) {
  return value
    .replace(/^[-—–]+\s*/u, "")
    .replace(/\s+\d+[.)]?\s*$/u, "")
    .replace(/^\d+[.)]?\s*/u, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function normalizeSearch(value) {
  return value
    .replace(/[’‘]/g, "'")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("es")
    .replace(/\s+/gu, " ")
    .trim();
}

function isNoise(line) {
  return !line
    || /^(?:ESPAÑOL\s*-?|TARAHUMARA|DICCIONARIO TARAHUMARA|NOTAS|GRAM[AÁ]TICA|AP[EÉ]NDICES|BIBLIOGRAF[IÍ]A)$/iu.test(line)
    || /^[A-ZÁÉÍÓÚÜÑ]$/u.test(line)
    || /^\d{1,3}$/u.test(line)
    || /^\d{1,3}\s+DICCIONARIO TARAHUMARA(?:\s+\S+)?$/iu.test(line)
    || /^\S+\s+DICCIONARIO TARAHUMARA\s+\d{1,3}$/iu.test(line);
}

function csvCell(value) {
  const text = String(value ?? "").replaceAll("\r", " ").replaceAll("\n", " ");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const records = [];
let current = null;

records.push({
  term_id: "",
  term_es: "a pesar de",
  term_es_normalized: "a pesar de",
  grammatical_label: "locución",
  equivalents_rrm: "arigá",
  raw_entry: "a pesar de arigá",
  source_code: "SRC-01",
  source_document: "Diccionario tarahumara de Samachique, edición 1993",
  source_section: "ESPAÑOL - TARAHUMARA",
  pdf_page: 91,
  printed_page: 81,
  extraction_status: "OCR estructurado",
  validation_status: "Pendiente de cotejo",
});

function closeCurrent() {
  if (!current) return;
  current.raw_entry = current.raw_lines.join(" ").replace(/\s+/gu, " ").trim();
  current.equivalents_rrm = current.target_lines.join(" ").replace(/\s+/gu, " ").trim();
  delete current.raw_lines;
  delete current.target_lines;
  records.push(current);
  current = null;
}

for (let pdfPage = 91; pdfPage <= 140; pdfPage += 1) {
  const filename = `page-${String(pdfPage).padStart(3, "0")}.txt`;
  const text = await readFile(resolve(inputDir, filename), "utf8");
  for (const sourceLine of text.split(/\r?\n/u)) {
    const line = sourceLine.replace(/\s+/gu, " ").trim();
    if (isNoise(line)) continue;
    const match = posRegex.exec(line);
    const crossReference = /^(.+?)\s+V[ée]ase\s+(.+)$/iu.exec(line);
    const beginsWithSenseNumber = /^\d+[.)]?\s/u.test(line);
    if (crossReference && !beginsWithSenseNumber) {
      closeCurrent();
      const term = normalizeTerm(crossReference[1]);
      current = {
        term_id: "",
        term_es: term,
        term_es_normalized: normalizeSearch(term),
        grammatical_label: "remisión",
        equivalents_rrm: "",
        raw_entry: "",
        source_code: "SRC-01",
        source_document: "Diccionario tarahumara de Samachique, edición 1993",
        source_section: "ESPAÑOL - TARAHUMARA",
        pdf_page: pdfPage,
        printed_page: pdfPage - 10,
        extraction_status: "OCR estructurado",
        validation_status: "Pendiente de cotejo",
        raw_lines: [line],
        target_lines: [`Véase ${crossReference[2]}`],
      };
      continue;
    }
    if (match && match.index > 0 && !beginsWithSenseNumber) {
      const term = normalizeTerm(line.slice(0, match.index));
      if (term && term.length <= 100) {
        closeCurrent();
        const afterPos = line.slice(match.index + match[0].length).replace(/^\s*[.:;,]?\s*/u, "").trim();
        current = {
          term_id: "",
          term_es: term,
          term_es_normalized: normalizeSearch(term),
          grammatical_label: normalizePos(match[1]),
          equivalents_rrm: "",
          raw_entry: "",
          source_code: "SRC-01",
          source_document: "Diccionario tarahumara de Samachique, edición 1993",
          source_section: "ESPAÑOL - TARAHUMARA",
          pdf_page: pdfPage,
          printed_page: pdfPage - 10,
          extraction_status: "OCR estructurado",
          validation_status: "Pendiente de cotejo",
          raw_lines: [line],
          target_lines: afterPos ? [afterPos] : [],
        };
        continue;
      }
    }
    if (current) {
      current.raw_lines.push(line);
      current.target_lines.push(line);
    }
  }
}
closeCurrent();

records.forEach((record, index) => {
  record.term_id = `TERM-${String(index + 1).padStart(6, "0")}`;
});

const columns = ["term_id", "term_es", "term_es_normalized", "grammatical_label", "equivalents_rrm", "source_code", "source_document", "source_section", "pdf_page", "printed_page", "extraction_status", "validation_status", "raw_entry"];
const csv = "\ufeff" + [columns, ...records.map((record) => columns.map((column) => record[column]))]
  .map((row) => row.map(csvCell).join(","))
  .join("\r\n");

const report = {
  records: records.length,
  source_pages: 50,
  pdf_page_min: 91,
  pdf_page_max: 140,
  printed_page_min: 81,
  printed_page_max: 130,
  without_equivalent: records.filter((record) => !record.equivalents_rrm).length,
  source_section: "ESPAÑOL - TARAHUMARA",
  extraction_method: "OCR por página, segmentación por etiqueta gramatical y conservación de entrada completa",
  validation_status: "Pendiente de cotejo",
};

await Promise.all([
  writeFile(jsonPath, JSON.stringify(records, null, 2) + "\n"),
  writeFile(csvPath, csv),
  writeFile(reportPath, JSON.stringify(report, null, 2) + "\n"),
]);

console.log(JSON.stringify(report));
