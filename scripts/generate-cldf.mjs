import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const sourcePath = join(projectRoot, "data", "lexicon-master.json");
const metadataPath = join(projectRoot, "project-metadata.json");

function outputDirectory() {
  const index = process.argv.indexOf("--output");
  if (index >= 0 && process.argv[index + 1]) return resolve(process.argv[index + 1]);
  return join(projectRoot, "public", "downloads", "cldf");
}

function csv(value) {
  const text = value == null ? "" : String(value).replaceAll(/\r?\n/g, " ");
  return `"${text.replaceAll('"', '""')}"`;
}

function pageContext(entry) {
  if (entry.page_start == null) return "";
  if (entry.page_end == null || entry.page_end === entry.page_start) return String(entry.page_start);
  return `${entry.page_start}-${entry.page_end}`;
}

function bibEscape(value) {
  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("{", "\\{")
    .replaceAll("}", "\\}")
    .replaceAll("\n", " ");
}

const outputDir = outputDirectory();
const entries = JSON.parse(await readFile(sourcePath, "utf8"));
const project = JSON.parse(await readFile(metadataPath, "utf8"));
const rights = project.source_rights;
await mkdir(outputDir, { recursive: true });

const entryHeader = [
  "ID", "Language_ID", "Headword", "Part_Of_Speech", "Headword_Raw", "Headword_Normalized",
  "Homonym_Number", "Classification_Family", "Translation_Raw", "Variants_JSON", "Examples_JSON",
  "Comment", "Source", "Publication_Status", "Validation_Status", "Transcription_Status",
];

const entryRows = entries.map((entry) => [
  entry.record_id,
  "tar",
  entry.headword,
  entry.classification,
  entry.headword_raw,
  entry.headword_normalized,
  entry.homonym_number,
  entry.classification_family,
  entry.translation_raw,
  JSON.stringify(entry.variants ?? []),
  JSON.stringify(entry.examples ?? []),
  entry.comments_raw,
  `${entry.source_code}${pageContext(entry) ? `[${pageContext(entry)}]` : ""}`,
  project.publication_status,
  project.validation_status,
  entry.status,
]);

const senseHeader = ["ID", "Description", "Entry_ID", "Position", "Description_Language"];
const senseRows = [];
for (const entry of entries) {
  (entry.senses ?? []).forEach((sense, index) => {
    senseRows.push([
      `${entry.record_id}-S${String(index + 1).padStart(2, "0")}`,
      sense,
      entry.record_id,
      index + 1,
      "spa",
    ]);
  });
}

const languagesRows = [
  ["tar", "rarámuri / tarahumara", "North America", "", "", "cent2131", "tar"],
  ["spa", "español", "Eurasia", "", "", "stan1288", "spa"],
];

const distinctSources = [...new Map(entries.map((entry) => [entry.source_code, entry.source_document])).entries()]
  .sort(([a], [b]) => a.localeCompare(b));
const sourcesBib = distinctSources.map(([code, title]) => `@misc{${code},\n  title = {${bibEscape(title)}},\n  note = {Representación estructurada derivada de Hilton 1993, SIL 10966. ${bibEscape(rights.rights_notice)}}\n}`).join("\n\n") + `\n\n@book{SRC-01,\n  author = {Hilton, K. Simón},\n  title = {Diccionario tarahumara de Samachique, Chihuahua, México},\n  year = {1993},\n  publisher = {Instituto Lingüístico de Verano},\n  note = {Edición especial corregida y actualizada; archivo SIL 10966. ${bibEscape(rights.rights_notice)}}\n}\n`;

const term = "http://cldf.clld.org/v1.0/terms.rdf#";
const metadata = {
  "@context": ["http://www.w3.org/ns/csvw", { "@language": "es" }],
  "dc:conformsTo": `${term}Dictionary`,
  "dc:title": "Rarámuri Digital: CLDF Dictionary",
  "dc:description": "Serialización interoperable de la base lexicográfica publicada por Rarámuri Digital. No constituye validación lingüística adicional.",
  "dc:bibliographicCitation": `Sandoval Gutierrez, Fernando. Rarámuri Digital, dataset ${project.dataset_version}. DOI: ${project.doi}.`,
  "dc:license": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  "dc:rights": rights.rights_notice,
  "dc:source": "sources.bib",
  "dc:version": project.dataset_version,
  "dc:issued": project.release_date,
  "dc:identifier": `https://doi.org/${project.doi}`,
  "rd:rightsProfile": rights.rights_profile,
  "rd:sourceAttribution": rights.canonical_attribution,
  "rd:commercialUseAuthorized": rights.commercial_use_authorized,
  dialect: { commentPrefix: null },
  tables: [
    {
      url: "entries.csv",
      "dc:conformsTo": `${term}EntryTable`,
      tableSchema: {
        columns: [
          { name: "ID", required: true, propertyUrl: `${term}id`, datatype: { base: "string", format: "[a-zA-Z0-9_\\-]+" } },
          { name: "Language_ID", required: true, propertyUrl: `${term}languageReference`, "dc:extent": "singlevalued", datatype: "string" },
          { name: "Headword", required: true, propertyUrl: `${term}headword`, "dc:extent": "singlevalued", datatype: "string" },
          { name: "Part_Of_Speech", required: false, propertyUrl: `${term}partOfSpeech`, datatype: "string" },
          { name: "Headword_Raw", datatype: "string" },
          { name: "Headword_Normalized", datatype: "string" },
          { name: "Homonym_Number", datatype: "integer" },
          { name: "Classification_Family", datatype: "string" },
          { name: "Translation_Raw", datatype: "string" },
          { name: "Variants_JSON", datatype: "string" },
          { name: "Examples_JSON", datatype: "string" },
          { name: "Comment", propertyUrl: `${term}comment`, datatype: "string" },
          { name: "Source", propertyUrl: `${term}source`, separator: ";", datatype: "string" },
          { name: "Publication_Status", datatype: "string" },
          { name: "Validation_Status", datatype: "string" },
          { name: "Transcription_Status", datatype: "string" },
        ],
        primaryKey: "ID",
        foreignKeys: [{ columnReference: "Language_ID", reference: { resource: "languages.csv", columnReference: "ID" } }],
      },
    },
    {
      url: "senses.csv",
      "dc:conformsTo": `${term}SenseTable`,
      tableSchema: {
        columns: [
          { name: "ID", required: true, propertyUrl: `${term}id`, datatype: { base: "string", format: "[a-zA-Z0-9_\\-]+" } },
          { name: "Description", required: true, propertyUrl: `${term}description`, datatype: "string" },
          { name: "Entry_ID", required: true, propertyUrl: `${term}entryReference`, datatype: "string" },
          { name: "Position", propertyUrl: `${term}position`, datatype: "integer" },
          { name: "Description_Language", datatype: "string" },
        ],
        primaryKey: "ID",
        foreignKeys: [{ columnReference: "Entry_ID", reference: { resource: "entries.csv", columnReference: "ID" } }],
      },
    },
    {
      url: "languages.csv",
      "dc:conformsTo": `${term}LanguageTable`,
      tableSchema: {
        columns: [
          { name: "ID", required: true, propertyUrl: `${term}id`, datatype: { base: "string", format: "[a-z0-9_\\-]+" } },
          { name: "Name", propertyUrl: `${term}name`, datatype: "string" },
          { name: "Macroarea", propertyUrl: `${term}macroarea`, datatype: "string" },
          { name: "Latitude", propertyUrl: `${term}latitude`, datatype: { base: "decimal", minimum: -90, maximum: 90 } },
          { name: "Longitude", propertyUrl: `${term}longitude`, datatype: { base: "decimal", minimum: -180, maximum: 180 } },
          { name: "Glottocode", propertyUrl: `${term}glottocode`, datatype: { base: "string", format: "[a-z0-9]{4}[1-9][0-9]{3}" }, valueUrl: "http://glottolog.org/resource/languoid/id/{Glottocode}" },
          { name: "ISO639P3code", propertyUrl: `${term}iso639P3code`, datatype: { base: "string", format: "[a-z]{3}" } },
        ],
        primaryKey: "ID",
      },
    },
  ],
};

const writeCsv = async (name, header, rows) => {
  const body = [header, ...rows].map((row) => row.map(csv).join(",")).join("\r\n") + "\r\n";
  await writeFile(join(outputDir, name), body, "utf8");
};

await writeCsv("entries.csv", entryHeader, entryRows);
await writeCsv("senses.csv", senseHeader, senseRows);
await writeCsv("languages.csv", ["ID", "Name", "Macroarea", "Latitude", "Longitude", "Glottocode", "ISO639P3code"], languagesRows);
await writeFile(join(outputDir, "sources.bib"), sourcesBib, "utf8");
await writeFile(join(outputDir, "cldf-metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
await writeFile(join(outputDir, "README.md"), `# Rarámuri Digital — CLDF Dictionary\n\nDataset version: ${project.dataset_version}. Entries: ${entries.length}. Senses: ${senseRows.length}.\n\nThis package is generated deterministically from \`data/lexicon-master.json\`. It preserves Rarámuri Digital identifiers and source-page references. Documentary examples remain serialized as data columns and are not promoted to CLDF ExampleTable until linguistic segmentation and review are available.\n\nPublication status: ${project.publication_status}. Linguistic validation: ${project.validation_status}.\n\nSource attribution: ${rights.canonical_attribution}\n\nRights: ${rights.rights_notice}\n`, "utf8");

console.log(`CLDF Dictionary generated in ${outputDir}: ${entries.length} entries, ${senseRows.length} senses.`);
