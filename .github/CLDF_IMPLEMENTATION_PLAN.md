# CLDF implementation plan

This file records the technical implementation sequence for the CLDF Dictionary export.

1. Generate `EntryTable`, `SenseTable`, `LanguageTable`, `sources.bib` and `cldf-metadata.json` from `data/lexicon-master.json`.
2. Preserve `RD-######` identifiers, source page references and validation/publication state.
3. Do not force documentary examples into CLDF `ExampleTable` until they are linguistically segmented and reviewed.
4. Validate the generated package with `pycldf==2.0.2` in CI.
5. Add deterministic generation to the existing `data:exports` pipeline.
6. Publish CLDF metadata and tables under `public/downloads/cldf/` when the generated output passes validation.
7. Link the package from README, manifest and interoperability documentation.
