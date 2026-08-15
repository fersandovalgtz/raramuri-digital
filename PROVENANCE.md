# Procedencia y cadena de transformación — Rarámuri Digital

## Principio

Rarámuri Digital trata la **procedencia** como parte del dato científico. Una entrada no se considera suficientemente documentada si no puede relacionarse con el objeto de trabajo del que se extrajo, su localización, la transformación aplicada y la versión pública en la que fue publicada.

Este documento describe la cadena general. El inventario de objetos fuente y sus estados se mantiene en [`SOURCES.md`](SOURCES.md).

## Cadena de procedencia

```text
Hilton 1993 y registros bibliográficos verificables (`SRC-01`)
                         │
                         │ cotejo / contexto documental
                         ▼
            `DICCIONARIO raramuri.pdf` (`SRC-02`)
                         │
                         │ `scripts/extract_lexicon.py`
                         ▼
              extracción estructurada por página
                         │
                         ▼
             dataset maestro + identificadores RD
                         │
          ┌──────────────┼───────────────┐
          │              │               │
          ▼              ▼               ▼
     forma fuente   normalización   capas derivadas
          │              │               │
          └──────────────┼───────────────┘
                         ▼
        exportaciones y representaciones interoperables
       CSV · JSON · XML · SQL · TEI Lex-0 · CLDF · API
                         │
                         ▼
       validación automatizada · informes · checksums
                         │
                         ▼
             release versionada · Zenodo · DOI
```

## 1. Capa documental externa

### `SRC-01`

La edición de referencia es Hilton 1993, *Diccionario tarahumara de Samachique, Chihuahua, México*. Su identidad bibliográfica se documenta en [`docs/HILTON_SOURCE.md`](docs/HILTON_SOURCE.md).

`SRC-01` cumple una función de **referencia y cotejo**. No es correcto inferir que todos los registros del dataset se extrajeron directamente del facsímil de 1993.

### `SRC-02`

La extracción de producción se realiza sobre la representación estructurada denominada `DICCIONARIO raramuri.pdf`. El nombre del archivo se conserva como dato de procedencia, pero no sustituye una identificación bibliográfica.

La relación exacta entre `SRC-02` y las ediciones documentadas en la genealogía Hilton/Shoemaker debe mantenerse como cuestión verificable, no como supuesto.

## 2. Extracción

El script [`scripts/extract_lexicon.py`](scripts/extract_lexicon.py):

- procesa tablas de la representación PDF;
- omite las dos primeras páginas del objeto de trabajo;
- conserva la primera página en la que aparece cada entrada;
- fusiona filas de continuación cuando una entrada fluye a páginas posteriores;
- asigna identificadores persistentes con el patrón `RD-######`;
- conserva la forma documental en `headword_raw`;
- genera una forma de búsqueda separada en `headword_normalized`;
- registra `source_code`, `source_document`, `page_start`, `page_end` y `status`.

Esta separación permite distinguir **evidencia documental** de **transformación computacional**.

## 3. Normalización no destructiva

`headword_raw` conserva la forma procedente de la representación de trabajo. `headword_normalized` se utiliza para búsqueda y comparación y no debe reinterpretarse como corrección filológica.

La normalización puede, entre otras operaciones, homogeneizar apóstrofos, minúsculas y diacríticos para búsqueda. La existencia de una forma normalizada no elimina ni reemplaza la forma fuente.

Las acepciones, variantes, ejemplos y familias gramaticales derivadas deben conservar suficiente información para identificar si proceden de una marca explícita de la fuente o de una regla computacional.

## 4. Identificadores

Cada entrada del dataset recibe un identificador `RD-######`. Estos identificadores funcionan como anclas internas persistentes dentro de la serie de datos y permiten enlazar:

- registros maestros;
- exportaciones;
- API;
- productos derivados;
- incidencias y correcciones;
- análisis publicados.

Una corrección editorial no debe reutilizar un identificador para representar silenciosamente un objeto diferente. Los cambios sustantivos deben quedar registrados en la historia de versiones.

## 5. Productos derivados

Rarámuri Digital genera capas y productos derivados mediante scripts versionados. Entre ellos se encuentran inventarios, variantes, relaciones léxicas, productos avanzados, perfiles ortográficos, CLDF y representaciones TEI Lex-0.

La CI comprueba determinismo para varias de estas capas y compara ejecuciones independientes. Los productos candidatos y los resultados de auditorías profundas se publican como artefactos de GitHub Actions para inspección técnica.

Una relación computacional derivada no se presenta automáticamente como conocimiento lingüístico validado. El método y el estado de validación deben acompañar la interpretación.

## 6. Interoperabilidad

Las representaciones publicadas incluyen CSV, JSON, XML, SQL, TEI Lex-0, CLDF y una API documentada con OpenAPI.

La interoperabilidad no debe introducir pérdida silenciosa de procedencia. Cuando un formato no pueda expresar toda la riqueza del modelo maestro, debe entenderse como una **proyección** del conjunto de datos, no como un sustituto del registro canónico.

## 7. Validación automatizada

El workflow [`/.github/workflows/validate.yml`](.github/workflows/validate.yml) integra controles de reproducibilidad e integridad que incluyen, entre otros:

- regeneración de exportaciones;
- pruebas de determinismo de capas derivadas;
- validación CLDF mediante `pycldf`;
- validación de TEI Lex-0 contra el esquema oficial;
- regeneración del informe de calidad;
- auditoría profunda del corpus;
- comprobación de que las exportaciones versionadas son reproducibles;
- pruebas deterministas de exportación PDF;
- lint, compilación y pruebas automatizadas.

Estos controles verifican propiedades técnicas. **No equivalen a validación lingüística humana o comunitaria.**

## 8. Integridad

El manifiesto de descargas registra sumas SHA-256 para productos publicados. Estas huellas permiten verificar que una exportación corresponde al objeto que declara ser.

Para materiales fuente de terceros no redistribuidos, una futura mejora deseable es mantener un registro controlado de checksums del objeto efectivamente procesado, siempre que su conservación no implique redistribución no autorizada. Ese registro debería documentar algoritmo, hash, fecha de verificación y responsable.

## 9. Versionado y preservación

Rarámuri Digital separa:

- **versión del dataset**, actualmente 1.0.0;
- **versión de la plataforma**, actualmente 3.1.0;
- estado vivo de la rama `main`;
- releases de GitHub;
- depósito persistente en Zenodo;
- preservación del código en Software Heritage.

Una URL viva puede cambiar; una release y su DOI representan un objeto citable fijado. Para investigación reproducible debe preferirse la versión específica usada en el análisis.

## 10. Correcciones

Las correcciones deben conservar:

1. identificador de entrada;
2. valor anterior;
3. valor propuesto o corregido;
4. justificación;
5. evidencia o referencia;
6. responsable de la decisión;
7. versión en que entra en vigor.

La política general de contribuciones y gobernanza se encuentra en [`CONTRIBUTING.md`](CONTRIBUTING.md) y [`GOVERNANCE.md`](GOVERNANCE.md).

## 11. Reproducción técnica

La ruta estándar documentada por el proyecto es:

```bash
npm install
npm run data:exports
npm run data:quality
npm run validate
```

La extracción desde un PDF fuente requiere explícitamente el objeto de entrada y un directorio de salida:

```bash
python scripts/extract_lexicon.py /ruta/al/fuente.pdf /ruta/a/salida
```

El hecho de que una extracción sea técnicamente reproducible no concede permisos de redistribución sobre el PDF fuente.

## 12. Citación y responsabilidad

Cuando una afirmación depende de la fuente lexicográfica, debe citarse la fuente documental correspondiente. Cuando depende de una transformación, normalización, API o producto derivado, debe citarse además Rarámuri Digital y la versión empleada.

La procedencia completa se articula con:

- [`SOURCES.md`](SOURCES.md): registro de autoridad de fuentes;
- [`docs/HILTON_SOURCE.md`](docs/HILTON_SOURCE.md): historia y crítica de la fuente Hilton;
- [`DATASHEET.md`](DATASHEET.md): composición, usos y limitaciones del dataset;
- [`SCHEMA.md`](SCHEMA.md): estructura de datos;
- [`QUALITY_REPORT.md`](QUALITY_REPORT.md): métricas de calidad;
- [`FAIR_ASSESSMENT.md`](FAIR_ASSESSMENT.md): autoevaluación FAIR;
- [`SCIENTIFIC_REPOSITORY_STANDARD.md`](SCIENTIFIC_REPOSITORY_STANDARD.md): matriz de prácticas de repositorio científico.