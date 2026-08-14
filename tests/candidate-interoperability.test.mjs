import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const root = new URL("../", import.meta.url);
const output = new URL("../.tmp/test-candidate-interoperability/", import.meta.url);

test("generates deterministic candidate interoperability package without a human validation gate", async () => {
  await rm(output, { recursive: true, force: true });
  await execFileAsync(process.execPath, ["scripts/generate-candidate-interoperability.mjs", "--output", output.pathname], { cwd: root });

  const [manifest, tei, cldf, typedCsv, relationsCsv, policy] = await Promise.all([
    readFile(new URL("manifest.json", output), "utf8").then(JSON.parse),
    readFile(new URL("raramuri-lex0-1.1.0-candidate.xml", output), "utf8"),
    readFile(new URL("cldf/cldf-metadata.json", output), "utf8").then(JSON.parse),
    readFile(new URL("cldf/typed-variants.csv", output), "utf8"),
    readFile(new URL("cldf/lexical-relations.csv", output), "utf8"),
    readFile(new URL("PROJECT_VALIDATION_POLICY_V1.md", root), "utf8"),
  ]);

  assert.equal(manifest.schema_version, "1.1.0-candidate");
  assert.equal(manifest.base_dataset_version, "1.0.0");
  assert.equal(manifest.external_human_validation_required, false);
  assert.equal(manifest.typed_variant_records, 224);
  assert.equal(manifest.lexical_relation_records, 28);
  assert.equal(manifest.documentary_adjudications, 4);
  assert.equal(manifest.unresolved_lexical_relations, 0);

  assert.match(tei, /<edition n="1\.1\.0-candidate">/);
  assert.match(tei, /<form type="variant"><orth>/);
  assert.match(tei, /<form type="inflected"><orth>/);
  assert.match(tei, /<note type="sourceLabel">/);
  assert.match(tei, /<xr type="related"><lbl>/);
  assert.match(tei, /target="#RD-[0-9]{6}"/);
  assert.doesNotMatch(tei, /validación humana externa como requisito operativo[^<]*pendiente/iu);

  assert.equal(cldf["dc:version"], "1.1.0-candidate");
  assert.ok(cldf.tables.some((table) => table.url === "typed-variants.csv"));
  assert.ok(cldf.tables.some((table) => table.url === "lexical-relations.csv"));
  assert.match(typedCsv, /variant_token_id,record_id,headword,form/);
  assert.match(relationsCsv, /relation_id,source_record_id,source_headword/);
  assert.match(policy, /no utilizará una etapa de validación humana externa como requisito operativo/i);
});
