import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("materializes the typed variant compatibility layer", async () => {
  const payload = JSON.parse(await readFile(new URL("data/variants-typed.json", root), "utf8"));
  assert.equal(payload.schema_version, "1.1.0-candidate");
  assert.equal(payload.base_dataset_version, "1.0.0");
  assert.equal(payload.record_count, 224);
  assert.equal(payload.records.length, 224);
  assert.equal(payload.unresolved_origin_count, 0);
  assert.ok(payload.records.every((row) => row.variant_token_id && row.record_id && row.form && row.variant_origin && row.variant_nature && row.source_field && row.source_page && row.raw_evidence && row.validation_status));
  assert.ok(payload.records.some((row) => row.variant_origin === "headword_secondary"));
  assert.ok(payload.records.some((row) => row.variant_origin === "bracket_annotation"));
  assert.ok(payload.records.some((row) => row.variant_origin === "cross_reference"));
});

test("materializes lexical relations separately from variants", async () => {
  const payload = JSON.parse(await readFile(new URL("data/lexical-relations.json", root), "utf8"));
  assert.equal(payload.schema_version, "1.1.0-candidate");
  assert.equal(payload.base_dataset_version, "1.0.0");
  assert.equal(payload.relation_count, 28);
  assert.equal(payload.records.length, 28);
  assert.equal(payload.source_remission_occurrence_count, 18);
  assert.equal(payload.unique_resolution_count, 24);
  assert.equal(payload.ambiguous_resolution_count, 4);
  assert.equal(payload.unresolved_resolution_count, 0);
  const counts = Object.fromEntries([...new Set(payload.records.map((row) => row.relation_type))].sort().map((type) => [type, payload.records.filter((row) => row.relation_type === type).length]));
  assert.deepEqual(counts, { cross_reference: 19, grammatical_relation: 3, source_variant_reference: 6 });
  assert.ok(payload.records.every((row) => row.relation_id && row.source_record_id && row.source_headword && row.source_field && row.source_page && row.raw_evidence && row.target_form && row.target_record_ids.length && row.resolution_status && row.validation_status));
  assert.equal(payload.records.filter((row) => row.resolution_status === "resolved_ambiguous").length, 4);
});
