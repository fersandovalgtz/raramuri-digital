# CLDF Dictionary

Rarámuri Digital está incorporando una representación **CLDF Dictionary** para interoperabilidad con Dictionaria, Lexibank y otras herramientas del ecosistema Glottobank. La exportación conservará los identificadores persistentes `RD-######`, las acepciones, la procedencia documental y el estado de validación del proyecto.

La implementación seguirá la especificación oficial CLDF para `Dictionary`, que utiliza `EntryTable` y `SenseTable` como componentes mínimos. Los ejemplos documentales actuales no se convertirán automáticamente a `ExampleTable` porque muchas cadenas mezclan texto rarámuri, traducción española y notas; segmentarlas sin revisión introduciría una interpretación lingüística no validada.

## Mapeo previsto

- `EntryTable`: identificador, lengua, lema, parte de la oración y campos documentales propios del proyecto.
- `SenseTable`: acepciones españolas enlazadas a la entrada correspondiente.
- `LanguageTable`: rarámuri (`tar`) y español (`spa`).
- `sources.bib`: referencia local a la fuente documental conservando código y páginas.
- `cldf-metadata.json`: metadatos CSVW/CLDF, licencia, citación, relaciones y procedencia.

La correspondencia ISO 639-3 `tar` → Glottocode `cent2131` (Central Tarahumara) se documentará a partir de Glottolog, sin inferir automáticamente variantes internas ni equivalencias más finas.

## Principio de integridad

La exportación CLDF es una **serialización interoperable** de los datos ya publicados; no constituye una nueva validación lingüística. El estado de publicación y validación deberá permanecer visible en los archivos derivados.
