# Estado de interoperabilidad CLDF

**Estado:** generador implementado con validación automática y comprobación de determinismo en CI.

El mapeo, las fuentes técnicas y las decisiones de no inferencia están documentados. `scripts/generate-cldf.mjs` produce de manera determinista un CLDF Dictionary con `EntryTable`, `SenseTable`, `LanguageTable`, `sources.bib` y metadatos CSVW/CLDF a partir de `data/lexicon-master.json`.

Los identificadores `RD-######`, la procedencia por fuente/página y los estados de publicación y validación se preservan. Los ejemplos documentales no se fuerzan a `ExampleTable` hasta contar con segmentación y revisión lingüística.

El workflow de validación conserva durante 30 días un artefacto descargable con el CLDF y el perfil ortográfico generados para facilitar revisión técnica externa antes de versionarlos como productos publicados.
