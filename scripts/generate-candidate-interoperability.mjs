import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const candidateVersion = "1.1.0-candidate";
const stableClDfDir = join(projectRoot, "public", "downloads", "cldf");
const stableTeiPath = join(projectRoot, "public", "downloads", "raramuri-lex0.xml");
const typedVariantsPath = join(projectRoot, "data", "variants-typed.json");
const relationsPath = join(projectRoot, "data", "lexical-relations.json");
const metadataPath = join(projectRoot, "project-metadata.json");

const outputArgIndex = process.argv.indexOf("--output");
const outputDir = outputArgIndex >= 0 && process.argv[outputArgIndex + 1]
  ? resolve(process.argv[outputArgIndex + 1])
  : join(projectRoot, ".tmp", "candidate-interoperability");
const cldfDir = join(outputDir, "cldf");

const [stableTei, variantsPayload, relationsPayload, projectMetadata, stableClDfMetadata] = await Promise.all([
  readFile(stableTeiPath, "utf8"),
  readFile(typedVariantsPath, "utf8").then(JSON.parse),
  readFile(relationsPath, "utf8").then(JSON.parse),
  readFile(metadataPath, "utf8").then(JSON.parse),
  readFile(join(stableClDfDir, "cldf-metadata.json"), "utf8").then(JSON.parse),
]);

if (variantsPayload.schema_version !== candidateVersion || relationsPayload.schema_version !== candidateVersion) {
  throw new Error(`Expected both candidate layers to use ${candidateVersion}.`);
}
if (relationsPayload.ambiguous_resolution_count !== 0 || relationsPayload.unresolved_resolution_count !== 0) {
  throw new Error("Candidate lexical relations still contain unresolved documentary targets.");
}

await mkdir(cldfDir, { recursive: true });

function xml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function csvCell(value) {
  const text = Array.isArray(value)
    ? value.join("|")
    : typeof value === "object" && value !== null
      ? JSON.stringify(value)
      : String(value ?? "").replaceAll("\r", " ").replaceAll("\n", " ");
  return /[",\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function csvTable(columns, records) {
  return `\ufeff${[columns, ...records.map((record) => columns.map((column) => record[column]))]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n")}\r\n`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

const typedByEntry = new Map();
for (const record of variantsPayload.records) {
  const bucket = typedByEntry.get(record.record_id) ?? [];
  bucket.push(record);
  typedByEntry.set(record.record_id, bucket);
}

const relationsByEntry = new Map();
for (const record of relationsPayload.records) {
  if (!record.target_record_id) throw new Error(`Resolved relation ${record.relation_id} has no target_record_id.`);
  const bucket = relationsByEntry.get(record.source_record_id) ?? [];
  bucket.push(record);
  relationsByEntry.set(record.source_record_id, bucket);
}

let candidateTei = stableTei
  .replace(/<edition n="[^"]+">Edición digital completa<\/edition>/u, `<edition n="${candidateVersion}">Extensión documental candidata ${candidateVersion} sobre dataset ${xml(projectMetadata.dataset_version)}</edition>`)
  .replace(
    /<editorialDecl><p>La difusión está autorizada; el cotejo con facsímil y la validación lingüística permanecen pendientes\.<\/p><\/editorialDecl>/u,
    "<editorialDecl><p>Extensión documental candidata: la trazabilidad y las resoluciones se validan de forma reproducible contra fuente. No existe una etapa de validación humana externa como requisito operativo.</p></editorialDecl>",
  )
  .replace(
    /<revisionDesc>([\s\S]*?)<\/revisionDesc>/u,
    `<revisionDesc>$1<change when="${xml(projectMetadata.release_date)}">Añadidas capas documentales tipadas ${candidateVersion}: variantes co-lema, formas gramaticales documentadas y relaciones lexicográficas resueltas.</change></revisionDesc>`,
  );

for (const [recordId, records] of typedByEntry) {
  const entryPattern = new RegExp(`<entry xml:id="${escapeRegExp(recordId)}"[\\s\\S]*?<\\/entry>`, "u");
  const match = candidateTei.match(entryPattern);
  if (!match) throw new Error(`TEI entry not found for typed variants: ${recordId}`);

  let entryXml = match[0].replace(/\n\s*<form type="variant"><orth xml:lang="tar">[\s\S]*?<\/orth><\/form>/gu, "");
  entryXml = entryXml.replace(/\n\s*<form type="variant"><orth>[\s\S]*?<\/orth><\/form>/gu, "");

  const coHeadword = records.filter((record) => record.variant_nature === "co_headword_form");
  const grammatical = records.filter((record) => record.variant_origin === "bracket_annotation");

  if (coHeadword.length) {
    const nested = coHeadword
      .map((record) => `\n        <form type="variant"><orth>${xml(record.form)}</orth></form>`)
      .join("");
    entryXml = entryXml.replace(
      /(<form type="lemma"><orth>[\s\S]*?<\/orth>)(<\/form>)/u,
      `$1${nested}\n      $2`,
    );
  }

  const inflected = [];
  for (const record of grammatical) {
    for (const feature of record.grammatical_features ?? []) {
      for (const form of feature.forms ?? []) {
        inflected.push(`      <form type="inflected"><orth>${xml(form)}</orth><note type="sourceLabel">${xml(feature.source_label)}</note></form>`);
      }
    }
  }
  if (inflected.length) {
    entryXml = entryXml.replace(/(<\/form>\n)(\s*<gramGrp>)/u, `$1${inflected.join("\n")}\n$2`);
  }

  candidateTei = candidateTei.replace(entryPattern, entryXml);
}

for (const [recordId, relations] of relationsByEntry) {
  const entryPattern = new RegExp(`<entry xml:id="${escapeRegExp(recordId)}"[\\s\\S]*?<\\/entry>`, "u");
  const match = candidateTei.match(entryPattern);
  if (!match) throw new Error(`TEI entry not found for lexical relations: ${recordId}`);
  let entryXml = match[0];
  const xrXml = relations.map((relation) => {
    const label = relation.relation_label || relation.relation_type || "relación documental";
    return `      <xr type="related"><lbl>${xml(label)}</lbl><ref type="entry" target="#${xml(relation.target_record_id)}">${xml(relation.target_form)}</ref></xr>`;
  }).join("\n");
  entryXml = entryXml.replace(/(\n\s*<note type="sourceComment">)/u, `\n${xrXml}$1`);
  candidateTei = candidateTei.replace(entryPattern, entryXml);
}

candidateTei = candidateTei.replace(
  /<note type="validationStatus">[^<]*<\/note>/gu,
  '<note type="validationStatus">Validación documental del proyecto; sin requisito de validación humana externa</note>',
);

const teiOutput = join(outputDir, `raramuri-lex0-${candidateVersion}.xml`);
await writeFile(teiOutput, candidateTei, "utf8");

for (const filename of ["entries.csv", "senses.csv", "languages.csv", "sources.bib"]) {
  await copyFile(join(stableClDfDir, filename), join(cldfDir, filename));
}

const typedColumns = [
  "variant_token_id", "record_id", "headword", "form", "variant_origin", "variant_nature", "source_field", "source_page", "source_page_end",
  "raw_evidence", "target_record_id", "target_form", "target_resolution_status", "target_resolution_method", "target_adjudication_id", "documentary_basis",
  "grammatical_features", "relation_feature", "validation_status", "source_document", "source_code", "source_status",
];
const relationsColumns = [
  "relation_id", "source_record_id", "source_headword", "source_page", "source_page_end", "relation_type", "relation_label", "source_field", "raw_evidence",
  "target_form", "target_homonym_number", "target_record_id", "resolution_status", "target_resolution_method", "target_adjudication_id", "documentary_basis",
  "validation_status", "source_document", "source_code",
];
await writeFile(join(cldfDir, "typed-variants.csv"), csvTable(typedColumns, variantsPayload.records), "utf8");
await writeFile(join(cldfDir, "lexical-relations.csv"), csvTable(relationsColumns, relationsPayload.records), "utf8");

const candidateClDfMetadata = structuredClone(stableClDfMetadata);
candidateClDfMetadata["dc:title"] = "Rarámuri Digital: CLDF Dictionary · extensión documental candidata";
candidateClDfMetadata["dc:description"] = "Serialización candidata 1.1.0 que mantiene las tablas CLDF Dictionary estables y añade tablas documentales tipadas para variantes y relaciones lexicográficas. No depende de validación humana externa.";
candidateClDfMetadata["dc:version"] = candidateVersion;
candidateClDfMetadata["dc:issued"] = projectMetadata.release_date;
candidateClDfMetadata.tables.push(
  {
    url: "typed-variants.csv",
    "dc:title": "Typed documentary variants and grammatical forms",
    tableSchema: {
      columns: typedColumns.map((name) => ({
        name,
        datatype: name === "source_page" || name === "source_page_end" ? "integer" : "string",
        ...(name === "record_id" ? { propertyUrl: "http://cldf.clld.org/v1.0/terms.rdf#entryReference", required: true } : {}),
      })),
      primaryKey: "variant_token_id",
      foreignKeys: [{ columnReference: "record_id", reference: { resource: "entries.csv", columnReference: "ID" } }],
    },
  },
  {
    url: "lexical-relations.csv",
    "dc:title": "Documentary lexical relations",
    tableSchema: {
      columns: relationsColumns.map((name) => ({
        name,
        datatype: name === "source_page" || name === "source_page_end" || name === "target_homonym_number" ? "integer" : "string",
        ...((name === "source_record_id" || name === "target_record_id") ? { required: true } : {}),
      })),
      primaryKey: "relation_id",
      foreignKeys: [
        { columnReference: "source_record_id", reference: { resource: "entries.csv", columnReference: "ID" } },
        { columnReference: "target_record_id", reference: { resource: "entries.csv", columnReference: "ID" } },
      ],
    },
  },
);
await writeFile(join(cldfDir, "cldf-metadata.json"), `${JSON.stringify(candidateClDfMetadata, null, 2)}\n`, "utf8");

const candidateFiles = [
  teiOutput,
  ...["cldf-metadata.json", "entries.csv", "senses.csv", "languages.csv", "sources.bib", "typed-variants.csv", "lexical-relations.csv"].map((name) => join(cldfDir, name)),
];
const files = [];
for (const path of candidateFiles) {
  const bytes = (await stat(path)).size;
  const sha256 = createHash("sha256").update(await readFile(path)).digest("hex");
  files.push({
    file: path.slice(outputDir.length + 1).replaceAll("\\", "/"),
    bytes,
    sha256,
  });
}
const manifest = {
  schema_version: candidateVersion,
  base_dataset_version: projectMetadata.dataset_version,
  generated: projectMetadata.release_date,
  validation_policy: "documentary_source_based_reproducible",
  external_human_validation_required: false,
  typed_variant_records: variantsPayload.record_count,
  lexical_relation_records: relationsPayload.relation_count,
  documentary_adjudications: relationsPayload.documentary_adjudication_count,
  unresolved_lexical_relations: relationsPayload.ambiguous_resolution_count + relationsPayload.unresolved_resolution_count,
  tei_mapping: {
    co_headword_form: "nested form[@type='variant'] inside lemma",
    grammatical_annotation: "entry/form[@type='inflected'] with note[@type='sourceLabel'] preserving the source label",
    lexical_relation: "entry/xr[@type='related']/ref[@type='entry'] with explicit target",
  },
  cldf_mapping: {
    stable_dictionary_tables_preserved: true,
    typed_variants_table: "cldf/typed-variants.csv",
    lexical_relations_table: "cldf/lexical-relations.csv",
  },
  files,
};
await writeFile(join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(JSON.stringify(manifest, null, 2));
