# Dataset Datasheet — Rarámuri Digital 1.0.0

This document follows the *Datasheets for Datasets* approach. It describes the published dataset; it does not certify linguistic validation.

## Motivation

- **Purpose:** structure and publish Rarámuri–Spanish lexicographic data for research, digital humanities, teaching and application development.
- **Lead:** Dr Fernando Sandoval Gutiérrez, academic and technical coordination.
- **Institutions:** Universidad CEEES, Universidad Autónoma de Ciudad Juárez and Academic Group UACJ-113, Studies on Educational Practices and Interculturality.
- **Intended beneficiaries:** Rarámuri communities and speakers, and specialists in linguistics, intercultural education, lexicography, documentation and language technology.

## Composition

- **Canonical unit:** one lexicographic entry identified as `RD-######`.
- **Size:** 2,581 entries from 85 pages of the structured Rarámuri–Spanish section.
- **Content:** headword, source and normalized forms, homonym number, grammatical classification and family, translation, senses, examples, variants, comments and provenance.
- **Derived products:** 30 datasets covering corpora, inventories, indexes, a thesaurus, an initial ontology, teaching resources and a traceability matrix.
- **Languages:** Rarámuri/Tarahumara (`tar`) as object language and Spanish (`es`) as target and working language.
- **Distribution formats:** XML, JSON, CSV, SQLite SQL, TEI Lex-0 and OpenAPI 3.1.
- **Personal data:** no identifiable personal information is intended. Records derive from published lexicographic materials.

## Sources

| Code | Document | Function | Used coverage |
|---|---|---|---|
| `SRC-01` | K. Simón Hilton, *Diccionario tarahumara de Samachique* (1993) | Collation facsimile | 156-page work |
| `SRC-02` | *DICCIONARIO raramuri.pdf* | Structured textual source | PDF pages 3–87; 2,581 entries |

Source texts and facsimiles are not redistributed and retain their own rights.

## Processing

1. Extract lexicographic rows from `SRC-02`.
2. Preserve documentary forms in `headword_raw`.
3. Apply conservative search normalization in `headword_normalized`.
4. Split senses, examples and variants only where explicit evidence exists.
5. Assign sequential persistent identifiers.
6. Record source, document, first and last page, and transcription status.
7. Derive P-02 through P-30 with reproducible, coded rules.
8. Generate interoperable files, a manifest and SHA-256 checksums.

Rarámuri forms and regional Spanish are not silently corrected. Automatic inferences are distinguished from explicit annotations through method and validation fields.

## Quality and validation

- Publication is **authorized for dissemination**.
- **Linguistic validation is pending**.
- Automated checks cover counts, identifiers, pages, exports, traceability and checksums.
- The [quality report](QUALITY_REPORT.md) quantifies completeness and integrity.
- Corrections must retain record identifiers, provenance, version and rationale.

## Intended uses

Lexicographic and terminological consultation; corpus linguistics; preparation of educational materials subject to community and pedagogical review; application development; and research on spelling variation, morphology, semantics and translation.

## Out-of-scope or cautionary uses

- The dataset is not an official orthographic standard.
- It is neither balanced nor exhaustive across all Rarámuri varieties.
- It must not be used to infer identity, proficiency, location or behaviour of people or communities.
- Derived categories must not be presented as community decisions before validation.
- Teaching materials require review by speakers, specialists and educational authorities.
- Open licensing does not remove collective rights, attribution duties or third-party restrictions.

## Distribution and maintenance

- **Website:** <https://raramuri.ceees.mx>
- **Repository:** <https://github.com/fersandovalgtz/raramuri-digital>
- **Project license:** CC BY-NC-SA 4.0, with documented exclusions.
- **Contact:** <fernando.sandoval@uacj.mx>
- **Versions:** dataset 1.0.0; platform 3.1.0.
- **Corrections:** GitHub issues or direct contact, following `CONTRIBUTING.md` and `GOVERNANCE.md`.

## Known limitations

The source contains 163 entries without an exact grammatical label and two without a translation. Automated example alignment has varying confidence. Candidate graphic variants, semantic fields, teaching levels and ontology relations require expert review. Systematic collation with `SRC-01` and validation by speakers remain pending.

