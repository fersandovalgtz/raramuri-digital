# Rarámuri Digital

[Versión en español](README.md)

A Rarámuri–Spanish lexicographic infrastructure for academic consultation, linguistic analysis, digital humanities, and application development.

**Public website:** [raramuri.ceees.mx](https://raramuri.ceees.mx)<br>
**Data and API:** [raramuri.ceees.mx/descargas](https://raramuri.ceees.mx/descargas)

## Project lead

**Dr. Fernando Sandoval Gutiérrez**<br>
Academic and technical coordination<br>
Universidad CEEES · Universidad Autónoma de Ciudad Juárez · Academic Group UACJ-113<br>
[fernando.sandoval@uacj.mx](mailto:fernando.sandoval@uacj.mx) · [ORCID 0000-0002-3168-6725](https://orcid.org/0000-0002-3168-6725)

## Institutions

- Universidad CEEES, Centro de Estudios Especializados en Educación Superior.
- Universidad Autónoma de Ciudad Juárez, Multidisciplinary Division at Cuauhtémoc.
- Academic Group UACJ-113, Studies on Educational Practices and Interculturality.

## Coverage

- 2,581 lexical entries with persistent identifiers.
- Lemma, source form, normalized form, and homonym number.
- Grammatical classification and category family.
- Translation, senses, examples, variants, and source comments.
- Source code, document, pages, and transcription status.
- 30 derived products: corpora, inventories, variants, indexes, thesaurus, ontology, and traceability.

## Interoperable formats

| Product | File | Intended use |
|---|---|---|
| Lexicographic XML | [`raramuri-lexico.xml`](public/downloads/raramuri-lexico.xml) | Digital humanities and XML transformations |
| JSON | [`raramuri-lexico.json`](public/downloads/raramuri-lexico.json) | Web and mobile applications |
| CSV | [`raramuri-lexico.csv`](public/downloads/raramuri-lexico.csv) | Research and statistical analysis |
| SQL | [`raramuri-lexico.sql`](public/downloads/raramuri-lexico.sql) | Normalized SQLite 3 database |
| TEI Lex-0 | [`raramuri-lex0.xml`](public/downloads/raramuri-lex0.xml) | Interoperable electronic dictionaries |
| OpenAPI | [`openapi-lexico.json`](public/downloads/openapi-lexico.json) | Client and service integration |

The [technical manifest](public/downloads/manifest.json) records each export’s size, media type, coverage, and SHA-256 checksum.

## Lexicographic API

Production endpoint:

```text
GET https://raramuri.ceees.mx/api/lexicon
```

Examples:

```text
GET /api/lexicon?id=RD-000001
GET /api/lexicon?q=agua&limit=25
GET /api/lexicon?pos=Vt&page=2
GET /api/lexicon?format=csv
```

Specification: [OpenAPI 3.1](https://raramuri.ceees.mx/api/openapi).

## Repository structure

```text
app/                 Website, pages, components, and API
data/                Master datasets and derived products
db/                  Relational schema
drizzle/             Migration and master database seed
lib/                 Product models and derivations
public/downloads/    XML, JSON, CSV, SQL, TEI Lex-0, and OpenAPI
scripts/             Reproducible extraction and generation
tests/               Coverage and integrity tests
```

## Development

Node.js 22.13 or later is required.

```bash
npm install
npm run data:exports
npm test
npm run dev
```

## Editorial status

- **Publication:** authorized for public dissemination.
- **Transcription:** structured with page-level traceability.
- **Linguistic validation:** pending.

Authorization for dissemination does not constitute linguistic validation. Corrections must preserve the entry identifier and documentary provenance.

## License

Project-produced data and documentation are released under the [Creative Commons Attribution–NonCommercial–ShareAlike 4.0 International License](LICENSE.md). Facsimiles, source texts, logos, and third-party materials retain their respective rights and are not redistributed through this repository.

## Citation

Use [`CITATION.cff`](CITATION.cff) to generate a bibliographic reference for the project.
