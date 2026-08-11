# Estado de interoperabilidad CLDF

**Estado:** generador implementado; validación automática en CI pendiente de la ejecución del pull request.

El mapeo, las fuentes técnicas y las decisiones de no inferencia están documentados. `scripts/generate-cldf.mjs` produce de manera determinista un CLDF Dictionary con `EntryTable`, `SenseTable`, `LanguageTable`, `sources.bib` y metadatos CSVW/CLDF a partir de `data/lexicon-master.json`.

Los identificadores `RD-######`, la procedencia por fuente/página y los estados de publicación y validación se preservan. Los ejemplos documentales no se fuerzan a `ExampleTable` hasta contar con segmentación y revisión lingüística.
