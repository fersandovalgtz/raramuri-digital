import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const [advanced, report, relationPayload, entries] = await Promise.all([
  readFile(new URL("data/advanced-products.json", root), "utf8").then(JSON.parse),
  readFile(new URL("data/advanced-products-report.json", root), "utf8").then(JSON.parse),
  readFile(new URL("data/lexical-relations.json", root), "utf8").then(JSON.parse),
  readFile(new URL("data/lexicon-master.json", root), "utf8").then(JSON.parse),
]);

const entryById = new Map(entries.map((entry) => [entry.record_id, entry]));
const canonical = relationPayload.records
  .filter((row) => row.relation_type === "cross_reference")
  .sort((a, b) => a.relation_id.localeCompare(b.relation_id));
const existing = advanced.filter((row) => row.product_id === 21).sort((a, b) => a.advanced_id.localeCompare(b.advanced_id));

if (canonical.length !== 19) throw new Error(`Expected 19 canonical cross-references, found ${canonical.length}`);
if (existing.length !== 19) throw new Error(`Expected 19 existing P-21 records, found ${existing.length}`);
if (canonical.some((row) => row.resolution_status !== "resolved_unique" || !row.target_record_id)) {
  throw new Error("P-21 cannot be published while canonical cross-references contain ambiguous or unresolved targets");
}

const sourceFieldLabel = (field) => field === "translation_raw" ? "Traducción" : field === "comments_raw" ? "Comentarios" : field;
const reconciled = canonical.map((relation, index) => {
  const source = entryById.get(relation.source_record_id);
  const target = entryById.get(relation.target_record_id);
  if (!source || !target) throw new Error(`Missing lexicon entry for ${relation.source_record_id} -> ${relation.target_record_id}`);
  const skeleton = existing[index];
  return {
    ...skeleton,
    form: relation.source_headword,
    normalized_form: String(relation.source_headword).toLocaleLowerCase("es-MX").normalize("NFC"),
    related_form: target.headword,
    label: "Resuelta",
    subtype: sourceFieldLabel(relation.source_field),
    relation_type: "VÉASE",
    target_id: relation.target_record_id,
    target_type: "Entrada lexicográfica",
    entity_id: relation.source_record_id,
    entry_id: relation.source_record_id,
    related_entry_ids: [relation.target_record_id],
    evidence: relation.raw_evidence,
    description: `${relation.source_headword} → ${target.headword}`,
    source_code: relation.source_code,
    source_document: relation.source_document,
    page_start: relation.source_page,
    page_end: relation.source_page_end,
    method: relation.target_resolution_method === "documentary_adjudication"
      ? `Relación canónica data/lexical-relations.json; destino resuelto por adjudicación documental ${relation.target_adjudication_id}.`
      : "Relación canónica data/lexical-relations.json; destino resuelto inequívocamente por correspondencia documental de forma.",
    confidence: "Alta",
    validation_status: relation.validation_status,
  };
});

let cursor = 0;
const updated = advanced.map((row) => row.product_id === 21 ? reconciled[cursor++] : row);
if (cursor !== reconciled.length) throw new Error(`Replaced ${cursor} P-21 rows, expected ${reconciled.length}`);

if (!report.products?.["21"] && !report.products?.[21]) throw new Error("P-21 report metadata not found");
const p21 = report.products["21"] ?? report.products[21];
p21.records = 19;
p21.labels = { Resuelta: 19 };
p21.method = "19 remisiones canónicas tomadas de data/lexical-relations.json; destinos únicos, incluidas cuatro adjudicaciones documentales reproducibles.";
p21.validation_status = "Destinos estructuralmente resueltos; cotejo lingüístico pendiente";
report.records = updated.length;

await Promise.all([
  writeFile(new URL("data/advanced-products.json", root), `${JSON.stringify(updated, null, 2)}\n`, "utf8"),
  writeFile(new URL("data/advanced-products-report.json", root), `${JSON.stringify(report, null, 2)}\n`, "utf8"),
]);

console.log(JSON.stringify({
  p21_records: reconciled.length,
  resolved_unique: canonical.filter((row) => row.resolution_status === "resolved_unique").length,
  documentary_adjudications: canonical.filter((row) => row.target_resolution_method === "documentary_adjudication").length,
  total_advanced_records: updated.length,
}, null, 2));
