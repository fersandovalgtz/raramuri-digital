# Piloto Concepticon + Glottolog — v1

**Fecha:** 2026-08-29  
**Estado:** diseño de piloto no destructivo  
**Base local:** `public/downloads/cldf/senses.csv` y `public/downloads/cldf/languages.csv`  
**Referencias externas fijadas para el piloto:** Concepticon v3.4.0 y Glottolog 5.3

## 1. Decisión de arquitectura

El piloto se implementa como **capa externa de interoperabilidad**. No modifica `data/lexicon-master.*`, no sustituye formas rarámuri, glosas españolas, variedades, identificadores `RD-######`, estados editoriales ni estados de validación documental.

Concepticon y Glottolog cumplen funciones distintas y por ello no deben comprimirse en un solo campo:

- **Concepticon** se vincula a nivel de `Sense_ID`, porque el objeto comparable es la acepción/concepto, no el lema por sí solo.
- **Glottolog** se vincula a nivel de `Language_ID` y, en una fase posterior, únicamente a nivel de doculecto/variedad cuando exista evidencia documental suficiente. No se repetirá un Glottocode en cada acepción como si fuera una propiedad semántica.

Esta separación es compatible con el CLDF Dictionary actual, donde `entries.csv` y `senses.csv` ya están separados de `languages.csv`.

## 2. Archivos del piloto

- `data/interoperability/concepticon-pilot-v1.csv`: propuestas de correspondencia entre `Sense_ID` y Concepticon.
- `data/interoperability/glottolog-pilot-v1.csv`: verificación de identificadores lingüísticos ya usados por el proyecto.

Ambos archivos son auxiliares. Su presencia no implica promoción a una versión estable del dataset.

## 3. Contrato de datos — Concepticon

Campos mínimos:

| Campo | Función |
|---|---|
| `sense_id` | Identificador local inmutable de `senses.csv`. |
| `local_description` | Copia de contexto de la glosa española; no canónica. |
| `concepticon_id` | ID externo propuesto; vacío cuando no hay adjudicación uno-a-uno. |
| `concepticon_gloss` | Glosa canónica asociada al ID externo. |
| `mapping_status` | `proposed_1to1`, `composite_ambiguous`, `near_not_exact` o `unresolved_no_exact`. |
| `candidate_ids` | Alternativas cuando exista más de una posibilidad; separadas por `|`. |
| `candidate_glosses` | Glosas de las alternativas, en el mismo orden. |
| `evidence_level` | Para este piloto: `inferencia_del_proyecto`; no equivale a análisis lingüístico publicado. |
| `mapping_note` | Motivo breve de la adjudicación o de la reserva. |
| `concepticon_version` | Versión fijada para reproducibilidad. |

### Regla cardinal

Una correspondencia `proposed_1to1` sólo se registra cuando la acepción local puede relacionarse con **un** Concept Set sin borrar una distinción presente en la glosa. Si la acepción local combina dos conceptos —por ejemplo, `Cara, nariz` o `Reír, sonreír`— el piloto conserva intacto el `Sense_ID` y registra candidatos separados; no fuerza un ID único.

Concepticon no admite como solución editorial ordinaria un mapeo N-N. Cuando una lista fuente reúne conceptos distintos, su propia documentación recomienda separar/multiplicar la fila de la lista de mapeo. En Rarámuri Digital esa multiplicación, si se usa, ocurrirá sólo en la **capa de interoperabilidad**, nunca en la acepción documental original.

## 4. Contrato de datos — Glottolog

Campos mínimos:

| Campo | Función |
|---|---|
| `language_id` | Clave local de `languages.csv`. |
| `local_name` | Nombre empleado por Rarámuri Digital. |
| `iso639p3` | Código ISO cuando exista. |
| `glottocode` | Identificador persistente de Glottolog. |
| `glottolog_name` | Nombre del languoid en Glottolog. |
| `glottolog_level` | Nivel del registro (`language`, etc.). |
| `mapping_status` | Estado técnico de la correspondencia. |
| `mapping_scope` | Alcance de la afirmación; evita extrapolar a doculectos/variedades. |
| `glottolog_version` | Versión fijada para reproducibilidad. |
| `mapping_note` | Límite o cautela documental. |

Glottolog 5.3 identifica `cent2131` como **Central Tarahumara**, lengua L1 hablada, con ISO 639-3 `tar`; identifica `stan1288` como **Spanish**, con ISO 639-3 `spa`. Estos son los mismos identificadores que ya contiene `public/downloads/cldf/languages.csv`.

La correspondencia `tar → cent2131` se mantiene como **identificación lingüística de nivel proyecto/LanguageTable**, no como afirmación automática de que cada fuente, entrada o ejemplo representa exactamente el mismo dialecto. Glottolog advierte que su clasificación dialectal es menos sistemática; por ello no se inferirán glottocodes de dialecto a partir de nombres locales no documentados.

## 5. Reglas de mapeo

1. El `Sense_ID` local es la clave primaria para Concepticon; el `Language_ID` local es la clave primaria para Glottolog.
2. Nunca se cambia una glosa española para hacerla coincidir con una glosa inglesa de Concepticon.
3. Una traducción de trabajo al inglés puede utilizarse para buscar candidatos, pero debe permanecer fuera del dato documental canónico.
4. Las coincidencias automáticas o por similitud son **candidatos**, no adjudicaciones. Concepticon puede utilizarse para generar candidatos mediante `pyconcepticon`, pero la decisión del piloto conserva explícitamente su nivel de evidencia.
5. Si una glosa contiene coordinación, polisemia explícita o una descripción etnográfica específica, se privilegia `composite_ambiguous`, `near_not_exact` o `unresolved_no_exact` antes que perder información.
6. Los cambios de versión de Concepticon y Glottolog deben quedar registrados; ningún identificador externo se tratará como dato local inmutable.
7. Glottolog no se utiliza para deducir dialecto, ubicación o identidad comunitaria cuando la fuente local no lo documenta.
8. La capa se considera interoperabilidad técnica/semántica. No constituye “validación lingüística”. Su vocabulario debe respetar `PROJECT_VALIDATION_POLICY_V1.md`.

## 6. Muestra piloto Concepticon

Se tomó una **muestra deliberada de 24 acepciones** de la zona inicial de `senses.csv`, combinando glosas simples y casos deliberadamente difíciles. No es una muestra aleatoria y, por tanto, su porcentaje no debe extrapolarse al corpus completo.

Resultado: **19 de 24 acepciones (79.2 %) admiten una propuesta uno-a-uno de alta plausibilidad en el piloto**; 5 de 24 (20.8 %) se mantienen abiertas por composición semántica, exceso de especificidad o ausencia de una correspondencia exacta localizada.

Casos que justifican la política conservadora:

- `RD-000006-S01 — Cara, nariz`: candidatos `FACE (1560)` y `NOSE (1221)`; no se sacrifica una de las dos lecturas.
- `RD-000008-S01 — Huarache`: `STRAW SANDAL (2047)` es cercano, pero su definición especifica un tipo de sandalia y no debe hacerse equivalente automáticamente a *huarache*.
- `RD-000013-S02 — Dulce`: no se fija un ID genérico sólo por semejanza léxica; queda abierto en el piloto.
- `RD-000030-S01 — Reír, sonreír`: candidatos `LAUGH (1355)` y `SMILE (1451)`; la glosa local conserva ambos.
- `RD-000057-S01 — Medir, pesar`: `WEIGH (1098)` cubre una parte de la glosa, pero no autoriza a reducir `medir` a `pesar`.

El detalle reproducible queda en `data/interoperability/concepticon-pilot-v1.csv`.

## 7. Resultado Glottolog

La comprobación produce **2/2 correspondencias técnicas verificables** en la `LanguageTable` actual:

- `tar` → `cent2131` → Central Tarahumara.
- `spa` → `stan1288` → Spanish.

No se crea por ahora una tabla de dialectos/doculectos. Antes de hacerlo se requiere extraer de cada fuente la denominación de variedad, localidad, autor, fecha y alcance documental; en ausencia de esos elementos, el caso debe permanecer sin adjudicación dialectal.

## 8. Criterio de escalamiento

**Decisión: PROTOTIPAR, no desplegar todavía sobre todo el corpus.**

El resultado de 79.2 % en una muestra deliberada demuestra utilidad comparativa, pero también evidencia que una automatización masiva produciría pérdidas o falsos equivalentes en glosas compuestas y culturalmente específicas. El siguiente escalón razonable es ampliar a una muestra estratificada de 100–150 acepciones, generar candidatos de manera reproducible y medir por separado: propuestas uno-a-uno, compuestos, cercanos no exactos y no resueltos.

Sólo después de esa segunda muestra conviene decidir si la capa Concepticon entra en la serialización candidata `1.1.x`. Glottolog, en cambio, ya puede conservarse como metadato de `LanguageTable`, porque el repositorio actual ya lo usa y la correspondencia de sus dos filas fue verificada.

## 9. Criterio de cierre del piloto v1

Este diseño se considera cerrado cuando existen: contrato de campos, reglas de no sobrescritura, tratamiento explícito de ambigüedades, muestra reproducible con tasa de mapeo, verificación de Glottolog y decisión de escalamiento. La implementación masiva queda fuera de este hito.