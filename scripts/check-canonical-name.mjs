import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const canonical = "Fernando Sandoval Gutierrez";
const deprecated = "Fernando Sandoval Gutiérrez";

const files = [
  "scripts/generate-interoperability-exports.mjs",
  "scripts/generate-pdf-exports.py",
  "public/downloads/raramuri-lexico.xml",
  "public/downloads/raramuri-lexico.json",
  "public/downloads/raramuri-lex0.xml",
  "public/downloads/openapi-lexico.json",
];

let canonicalOccurrences = 0;
const failures = [];
for (const relativePath of files) {
  const text = await readFile(join(projectRoot, relativePath), "utf8");
  if (text.includes(deprecated)) failures.push(`${relativePath}: deprecated responsible-name spelling found`);
  canonicalOccurrences += text.split(canonical).length - 1;
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
if (canonicalOccurrences < 6) {
  console.error(`Expected canonical responsible name in generated/source metadata; found only ${canonicalOccurrences} occurrences.`);
  process.exit(1);
}

console.log(`Canonical responsible name verified: ${canonicalOccurrences} occurrences, zero deprecated occurrences.`);
