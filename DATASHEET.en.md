# Dataset Datasheet — Rarámuri Digital 1.0.0

This document follows the *Datasheets for Datasets* approach. It describes the published dataset; it does not certify linguistic validation.

## Motivation

- **Purpose:** structure and publish Rarámuri–Spanish lexicographic data for research, digital humanities, teaching, and application development.
- **Lead:** Dr Fernando Sandoval Gutierrez, academic and technical coordination.
- **Institutions:** Universidad CEEES, Universidad Autónoma de Ciudad Juárez, and Academic Group UACJ-113, Studies on Educational Practices and Interculturality.
- **Intended beneficiaries:** Rarámuri communities and speakers, and specialists in linguistics, intercultural education, lexicography, documentation, and language technology.

## Composition

- **Canonical unit:** one lexicographic entry identified as `RD-######`.
- **Size:** 2,581 entries from 85 pages of the structured working representation `SRC-02`.
- **Content:** headword, source and normalized forms, homonym number, grammatical classification and family, translation, senses, examples, variants, comments, and provenance.
- **Derived products:** 30 datasets covering corpora, inventories, indexes, a thesaurus, an initial ontology, teaching resources, and a traceability matrix.
- **Languages:** Rarámuri/Tarahumara (`tar`) as object language and Spanish (`es`) as target and working language.
- **Distribution formats:** XML, JSON, CSV, SQLite SQL, TEI Lex-0, CLDF, and OpenAPI 3.1.
- **Personal data:** no identifiable personal information is intended. Records derive from published lexicographic materials or working representations derived from them.

## Sources

Rarámuri Digital distinguishes between the **bibliographic/facsimile reference source** and the **structured working representation consumed by the extraction pipeline**.

| Code | Document | Function | Coverage / status |
|---|---|---|---|
| `SRC-01` | K. Simón Hilton, *Diccionario tarahumara de Samachique, Chihuahua, México* (1993) | Bibliographic reference and collation facsimile | Special corrected and updated edition; viii + 146 pages; approx. 2,500 entries |
| `SRC-02` | `DICCIONARIO raramuri.pdf` | Structured working source consumed by the pipeline | PDF pages 3–87; 2,581 entries; exact edition identity kept separate pending documentary verification |

SIL Mexico identifies the 1993 work as a special corrected and updated edition compiled by Kenneth S. Hilton and others, with viii + 146 pages and approximately 2,500 entries. WALS records it as a reference for Central Tarahumara.

The bibliographic genealogy also includes:

- **`REF-1959`:** *Tarahumara y español* (1959), compiled by Kenneth Simon Hilton with Ramón López B. and Emiliano Carrasco T. as collaborators, preserved by El Colegio de México.
- **`REF-2016`:** Wes Shoemaker, *Diccionario tarahumara actualizado* (2016), described by SIL Mexico as an update of VIMSA 101 (1993) with recent spelling changes; publication status Draft, without peer review.

The fact that `SRC-01` is the principal bibliographic reference **does not authorize automatic identification of `SRC-02` with Hilton 1993**. The production pipeline explicitly records `SRC-02`. Edition-level identity of the working PDF must be established through documentary evidence before equivalence is claimed.

Source texts and facsimiles are not redistributed and retain their own rights.

Expanded documentation: [`SOURCES.md`](SOURCES.md) · [`PROVENANCE.md`](PROVENANCE.md) · [`docs/HILTON_SOURCE.md`](docs/HILTON_SOURCE.md).

## Processing

1. Extract lexicographic rows from `SRC-02`.
2. Preserve documentary forms in `headword_raw`.
3. Apply conservative search normalization in `headword_normalized`.
4. Split senses, examples, and variants only where explicit evidence exists.
5. Assign sequential persistent identifiers.
6. Record source, document, first and last page, and transcription status.
7. Derive products through reproducible coded rules.
8. Generate interoperable files, a manifest, and SHA-256 checksums.
9. Validate CLDF, TEI Lex-0, deterministic transformations, and other technical invariants in CI.

Rarámuri forms and regional Spanish are not silently corrected. Automatic inferences are distinguished from explicit annotations through method and validation fields.

## Quality and validation

- Publication is **authorized for dissemination**.
- **Linguistic validation is pending**.
- Technical publication and successful automated checks **do not constitute community validation**.
- Automated checks cover counts, identifiers, pages, exports, traceability, interoperability, and checksums.
- The [quality report](QUALITY_REPORT.md) quantifies completeness and integrity.
- Corrections must retain record identifiers, provenance, version, and rationale.

## Intended uses

- Lexicographic and terminological consultation.
- Corpus linguistics and documentary analysis.
- Research on lexicographic history and editorial genealogy, with source criticism.
- Preparation of educational materials subject to community and pedagogical review.
- Web, mobile, and data-service development.
- Research on spelling variation, morphology, semantics, and translation.
- Controlled comparison with historical sources in [Rarámuri Histórico Digital](https://github.com/fersandovalgtz/raramuri-historico), while keeping diachronic relations typed and reviewable.

## Out-of-scope or cautionary uses

- The dataset is not an official orthographic standard.
- It is neither balanced nor exhaustive across all Rarámuri varieties.
- Documentary coverage of Samachique/Central Tarahumara must not be automatically generalized to other varieties.
- It must not be used to infer identity, proficiency, location, or behaviour of people or communities.
- Derived categories must not be presented as community decisions before validation.
- Teaching materials require review by speakers, specialists, and educational authorities.
- Open licensing does not remove collective rights, attribution duties, or third-party restrictions.
- The dataset must not be cited as a substitute for Hilton 1993 when a claim depends directly on evidence from that work.

## Distribution and maintenance

- **Website:** <https://raramuri.ceees.mx>
- **Repository:** <https://github.com/fersandovalgtz/raramuri-digital>
- **Archive and DOI:** <https://doi.org/10.5281/zenodo.21483353>
- **Data/original documentation license:** CC BY-NC-SA 4.0, with documented exclusions.
- **Code:** MIT.
- **Contact:** <fernando.sandoval@uacj.mx>
- **Versions:** dataset 1.0.0; platform 3.1.0.
- **Corrections:** GitHub issues or direct contact, following `CONTRIBUTING.md` and `GOVERNANCE.md`.
- **Ecosystem:** [`docs/ECOSYSTEM.md`](docs/ECOSYSTEM.md).

## Known limitations

- 163 entries lack an exact grammatical label and are retained as `Sin clasificar` in the derived family field.
- Two entries lack a translation in the structured source.
- Automated Rarámuri–Spanish example segmentation has varying confidence.
- Candidate graphic variants, semantic fields, teaching levels, and ontology relations require expert review.
- Systematic collation against `SRC-01` and validation by speakers remain pending.
- The exact bibliographic identity and edition-level relationship of `SRC-02` must still be fixed documentary evidence; the repository does not infer it from the filename.

## Evidence citation policy

When a result depends on a form, gloss, example, or classification attributable to Hilton, cite **Hilton 1993 and, where possible, the page**. When it depends on a Rarámuri Digital representation, normalization, API, or transformation, also cite **the specific dataset version and the `RD-######` identifier when relevant**.

This dual-citation policy separates documentary responsibility for the source from the project's editorial and computational responsibility.