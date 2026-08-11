# Interoperability and external reuse

Rarámuri Digital is designed as open research infrastructure for structured Rarámuri language data. Interoperability work must increase reproducibility, citation, technical reuse or community usefulness without presenting technical publication as linguistic validation.

## CLDF Dictionary

The repository contains a deterministic generator for a CLDF Dictionary package based on `data/lexicon-master.json`. The package preserves `RD-######` identifiers, source codes, page context, publication status and linguistic-validation status. It generates `entries.csv`, `senses.csv`, `languages.csv`, `sources.bib` and `cldf-metadata.json`.

Documentary examples are retained in serialized form but are not promoted to CLDF `ExampleTable` because the current strings may combine Rarámuri text, Spanish translation and documentary notes. Creating structured examples would require linguistic segmentation and review.

The language table records ISO 639-3 `tar` with Glottocode `cent2131` for Central Tarahumara and ISO 639-3 `spa` with Glottocode `stan1288` for Spanish.

Generate and validate locally with:

```bash
npm run data:cldf
python -m pycldf validate public/downloads/cldf/cldf-metadata.json
```

CI validates the generated package with the reference `pycldf` implementation and also compares two independently generated CLDF directories to detect non-deterministic output.

## Python/API reuse

A zero-dependency Python example is available in `examples/python/raramuri_api.py`. It demonstrates query and persistent-ID lookup against the public API rather than copying the master dataset into a separate software package.

## Empirical orthography profile

`npm run data:orthography` derives two technical tables from the published lexicon: an observed Unicode character inventory and a frequency table of source-to-normalized headword differences. These outputs are descriptive evidence about the current dataset. They are not a normative orthography and do not replace review by speakers or linguists.

## External collaboration sequence

The preferred collaboration sequence is technical and contribution-led: obtain review of the CLDF mapping from Dictionaria/related dictionary projects; make the API easy to consume from Python and discuss interoperability with Elotl; seek inclusion in curated low-resource-language resource lists; then prepare bounded computational reuse for AmericasNLP or comparable NLP research. Community audio, variant and speaker-contribution workflows should be developed only with an explicit consent and governance model.

External repositories are comparators and potential collaborators, not endorsements. Data should not be bulk-copied to third-party services merely for visibility, particularly where licensing, attribution or Indigenous data-governance terms differ.
