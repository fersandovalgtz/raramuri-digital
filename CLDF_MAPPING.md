# Mapeo Rarámuri Digital → CLDF Dictionary

| Rarámuri Digital | CLDF | Tratamiento |
|---|---|---|
| `record_id` | `EntryTable.ID` | Se conserva `RD-######` sin renumeración. |
| `headword` | `EntryTable.Headword` | Lema principal. |
| `classification` | `EntryTable.Part_Of_Speech` | Etiqueta documental original. |
| `senses[]` | `SenseTable.Description` | Una fila por acepción, en orden documental. |
| `source_code` + páginas | `Source` + `sources.bib` | Referencia CLDF con contexto de página. |
| `headword_raw` | columna adicional | Forma de la fuente. |
| `headword_normalized` | columna adicional | Clave técnica de búsqueda; no sustituye la forma fuente. |
| `homonym_number` | columna adicional | Número explícito cuando existe. |
| `classification_family` | columna adicional | Familia controlada del proyecto. |
| `translation_raw` | columna adicional | Traducción documental sin procesar. |
| `variants[]` | columna adicional JSON | No se reinterpretan como entradas independientes. |
| `examples[]` | columna adicional JSON | Se conservan sin segmentar; no se fuerzan a `ExampleTable`. |
| `comments_raw` | `Comment` | Contexto residual/documental. |
| estados del proyecto | columnas adicionales | Publicación, transcripción y validación permanecen explícitas. |

## Lenguas

`LanguageTable` incluirá una fila para rarámuri con ISO 639-3 `tar` y Glottocode `cent2131`, correspondencia verificada en Glottolog; y una fila para español con ISO 639-3 `spa` como metalengua de las acepciones.

## No inferencias

No se asignarán automáticamente identificadores Concepticon, segmentaciones morfológicas, pronunciaciones, variantes dialectales ni traducciones separadas de los ejemplos documentales. Esas capas requieren revisión lingüística específica.
