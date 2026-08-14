import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("publishes candidate lexical-relations and typed-variants APIs", async () => {
  const [relationsRoute, typedRoute, relations, variants, downloadsPage, publicationPolicy, validationPolicy] = await Promise.all([
    readFile(new URL("app/api/lexical-relations/route.ts", root), "utf8"),
    readFile(new URL("app/api/typed-variants/route.ts", root), "utf8"),
    readFile(new URL("data/lexical-relations.json", root), "utf8").then(JSON.parse),
    readFile(new URL("data/variants-typed.json", root), "utf8").then(JSON.parse),
    readFile(new URL("app/descargas/page.tsx", root), "utf8"),
    readFile(new URL("CANDIDATE_LAYER_PUBLICATION_V1.md", root), "utf8"),
    readFile(new URL("PROJECT_VALIDATION_POLICY_V1.md", root), "utf8"),
  ]);

  assert.equal(relations.schema_version, "1.1.0-candidate");
  assert.equal(relations.relation_count, 28);
  assert.equal(relations.unique_resolution_count, 28);
  assert.equal(relations.ambiguous_resolution_count, 0);
  assert.equal(relations.unresolved_resolution_count, 0);
  assert.equal(relations.documentary_adjudication_count, 4);
  assert.ok(relations.records.every((row) => row.relation_id && row.source_record_id && row.resolution_status === "resolved_unique" && row.target_record_id));

  assert.equal(variants.schema_version, "1.1.0-candidate");
  assert.equal(variants.record_count, 224);
  assert.equal(variants.unresolved_origin_count, 0);
  assert.ok(variants.records.every((row) => row.variant_token_id && row.record_id && row.variant_origin !== "unresolved"));

  assert.match(relationsRoute, /raramuri-relaciones-lexicograficas-1\.1\.0-candidate/);
  assert.match(relationsRoute, /documentary_adjudications/);
  assert.match(relationsRoute, /format === "csv" \|\| format === "jsonl"/);
  assert.match(typedRoute, /raramuri-variants-tipados-1\.1\.0-candidate/);
  assert.match(typedRoute, /unresolved_origins/);
  assert.match(typedRoute, /format === "csv" \|\| format === "jsonl"/);

  assert.match(downloadsPage, /Capas experimentales · 1\.1\.0-candidate/);
  assert.match(downloadsPage, /\/api\/lexical-relations/);
  assert.match(downloadsPage, /\/api\/typed-variants/);
  assert.match(downloadsPage, /no equivale a validación lingüística/i);
  assert.match(publicationPolicy, /No se cambia `dataset_version = 1\.0\.0`/);
  assert.match(publicationPolicy, /serializaciones experimentales explícitamente separadas de las exportaciones estables/i);
  assert.match(publicationPolicy, /no dependerá de una validación humana externa/i);
  assert.match(validationPolicy, /no utilizará una etapa de validación humana externa como requisito operativo/i);
});