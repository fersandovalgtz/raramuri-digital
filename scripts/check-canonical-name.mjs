import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const canonical = "Fernando Sandoval Gutierrez";
const deprecated = "Fernando Sandoval Gutiérrez";

const requiredFiles = [
  "app/page.tsx",
  "scripts/generate-interoperability-exports.mjs",
  "scripts/generate-pdf-exports.py",
  "public/downloads/raramuri-lexico.xml",
  "public/downloads/raramuri-lexico.json",
  "public/downloads/raramuri-lex0.xml",
  "public/downloads/openapi-lexico.json",
];

const failures = [];
let canonicalOccurrences = 0;
for (const relativePath of requiredFiles) {
  const text = await readFile(join(projectRoot, relativePath), "utf8");
  const count = text.split(canonical).length - 1;
  canonicalOccurrences += count;
  if (count === 0) failures.push(`${relativePath}: canonical responsible name is missing`);
}

try {
  const hits = execFileSync(
    "git",
    [
      "grep",
      "-n",
      "--fixed-strings",
      deprecated,
      "--",
      ":!scripts/check-canonical-name.mjs",
    ],
    { cwd: projectRoot, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  if (hits.trim()) failures.push(`Deprecated responsible-name spelling remains:\n${hits.trim()}`);
} catch (error) {
  if (error.status !== 1) throw error; // git grep returns 1 when there are no matches.
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Canonical responsible name verified repository-wide: ${canonicalOccurrences} required-file occurrences and zero deprecated occurrences outside this regression test.`);
