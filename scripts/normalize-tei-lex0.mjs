import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(projectRoot, "public", "downloads");
const teiPath = join(outputDir, "raramuri-lex0.xml");
const manifestPath = join(outputDir, "manifest.json");

let tei = await readFile(teiPath, "utf8");

const historicalSchema = /<\?xml-model href="https:\/\/raw\.githubusercontent\.com\/DARIAH-ERIC\/lexicalresources\/master\/Schemas\/TEILex0\/out\/TEILex0\.rng" type="application\/xml" schematypens="http:\/\/relaxng\.org\/ns\/structure\/1\.0"\?>/g;
const entryExtent = /<extent>(\d+) entradas lexicográficas<\/extent>/g;
const pageExtent = /<extent>(\d+) páginas<\/extent>/g;

const historicalSchemaMatches = tei.match(historicalSchema)?.length ?? 0;
const entryExtentMatches = tei.match(entryExtent)?.length ?? 0;
const pageExtentMatches = tei.match(pageExtent)?.length ?? 0;

if (historicalSchemaMatches !== 1) {
  throw new Error(`Expected exactly one historical TEI Lex-0 schema processing instruction; found ${historicalSchemaMatches}.`);
}
if (entryExtentMatches !== 1) {
  throw new Error(`Expected exactly one dataset extent; found ${entryExtentMatches}.`);
}
if (pageExtentMatches !== 2) {
  throw new Error(`Expected exactly two source page extents; found ${pageExtentMatches}.`);
}

tei = tei
  .replace(historicalSchema, '<?xml-model href="https://lex-0.org/schema/lex-0.rng" type="application/xml" schematypens="http://relaxng.org/ns/structure/1.0"?>')
  .replace(entryExtent, '<extent><measure unit="entries" quantity="$1">$1 entradas lexicográficas</measure></extent>')
  .replace(pageExtent, '<extent><measure unit="pages" quantity="$1">$1 páginas</measure></extent>');

await writeFile(teiPath, tei, "utf8");

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const teiManifest = manifest.files.find((file) => file.file === "raramuri-lex0.xml");
if (!teiManifest) throw new Error("raramuri-lex0.xml is missing from manifest.json");

teiManifest.bytes = (await stat(teiPath)).size;
teiManifest.sha256 = createHash("sha256").update(await readFile(teiPath)).digest("hex");
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(`Normalized TEI Lex-0 0.9.5 metadata: ${entryExtentMatches} dataset extent, ${pageExtentMatches} source extents; SHA-256 ${teiManifest.sha256}.`);
