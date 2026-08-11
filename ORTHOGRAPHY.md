# Empirical orthography profile

Rarámuri Digital distinguishes documentary form, display form and technical normalized form. The repository does not currently claim that these transformations constitute a community-approved or linguistically validated orthographic standard.

The command below derives an empirical profile directly from the master lexicon:

```bash
npm run data:orthography
```

It produces `character-inventory.tsv`, which counts each observed Unicode code point separately across `headword_raw`, `headword` and `headword_normalized`, and `normalization-differences.tsv`, which records distinct raw-to-normalized headword pairs and their frequency.

This approach is intentionally conservative. It makes normalization behavior auditable without inferring phonemic values, grapheme inventories, dialect boundaries or preferred spellings. A future prescriptive orthography profile should be added only after documented linguistic and community review.
