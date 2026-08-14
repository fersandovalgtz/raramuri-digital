# Esquema de datos / Data Schema

## Identidad y versiones

- Plataforma: `3.1.0`.
- Conjunto de datos publicado: `1.0.0`.
- Extensión de esquema en preparación: `1.1.0-candidate`.
- Identificador de entrada: `RD-######`, único y persistente.
- Codificación: UTF-8; normalización Unicode NFC en procesos que la requieren.
- Lenguas: `tar` para rarámuri/tarahumara y `es` para español.

## Entrada lexicográfica maestra

| Campo | Tipo | Cardinalidad | Regla |
|---|---|---:|---|
| `record_id` | string | 1 | Patrón `^RD-[0-9]{6}$`; llave primaria |
| `headword` | string | 1 | Lema de presentación |
| `headword_raw` | string | 1 | Forma conservada de la fuente |
| `headword_normalized` | string | 1 | Clave de búsqueda; no reemplaza la forma fuente |
| `homonym_number` | integer/null | 0..1 | Número explícito de homónimo |
| `classification` | string | 1 | Etiqueta gramatical exacta o cadena vacía si la fuente no la proporciona |
| `classification_family` | enum | 1 | Familia controlada |
| `translation_raw` | string | 1 | Traducción conservada; puede estar vacía cuando falta en la fuente |
| `senses` | string[] | 0..n | Acepciones españolas en orden documental |
| `examples` | string[] | 0..n | Ejemplos conservados en orden documental |
| `variants` | string[] | 0..n | Vista compatible de formas/anotaciones extraídas; en `1.0.0` es heterogénea y no implica que todos sus elementos sean variantes lingüísticas |
| `comments_raw` | string | 1 | Texto residual o contexto documental |
| `source_code` | string | 1 | Llave a catálogo de fuentes |
| `source_document` | string | 1 | Nombre controlado del documento |
| `page_start` | integer | 1 | Primera página PDF de evidencia |
| `page_end` | integer | 1 | Última página PDF; `page_end >= page_start` |
| `status` | enum | 1 | Estado de transcripción |

## Vocabularios controlados

`classification_family`: `Adj`, `Adv`, `Conj`, `Imper`, `Interj`, `Interr`, `Pp`, `Prep`, `Pron`, `S`, `Sin clasificar`, `V`, `Vi`, `Vr`, `Vt`.

Estados principales:

- Publicación: `Autorizada para difusión`.
- Validación lingüística: `Pendiente de validación lingüística`.
- Transcripción actual: `Transcrito`.

## Representación dual de formas secundarias del lema

En datos `1.0.0`, cuando la celda fuente contiene varias formas separadas por coma, el extractor conserva la cadena completa en `headword`/`headword_raw` y además copia las formas posteriores a la primera dentro de `variants`. Es una **representación dual deliberada**, no una doble attestación.

La auditoría del 14 de agosto de 2026 identificó 52 entradas multiformes y 54 formas secundarias. Las 54 aparecen también en `variants` y corresponden exactamente, una a una, a las 54 relaciones `Gráfica` con método `Explícita en el lema` generadas por `scripts/extract-graphic-variants.mjs`.

Reglas de consumo:

- `headword_raw` conserva la evidencia documental y nunca se reescribe para eliminar la forma secundaria;
- `headword` conserva la presentación vigente del lema;
- `variants` permite una consulta compatible de las formas/anotaciones extraídas;
- una misma forma reflejada en `headword`, `variants` y un producto derivado de variantes gráficas cuenta como **una sola evidencia documental**;
- los consumidores analíticos no deben sumar esas representaciones como attestaciones independientes.

La auditoría completa de esta representación está documentada en `HEADWORD_VARIANT_DUAL_REPRESENTATION_AUDIT_V1.md` y `data/headword-variant-dual-representation.json`.

## Procedencia y naturaleza de `variants`

La auditoría exhaustiva v3 del 14 de agosto de 2026 reconstruyó la procedencia de los **224 tokens** contenidos en `variants`, presentes en 221 entradas. Todos quedaron tipados: no hubo tokens sin origen ni casos de procedencia múltiple.

Por procedencia de emisión, el inventario contiene 54 formas secundarias del lema (`headword_secondary`), 168 anotaciones de corchetes (`bracket_annotation`) y 2 remisiones capturadas por la expresión regular histórica (`cross_reference`). Por naturaleza documental se distinguen formas co-presentadas, anotaciones gramaticales, relaciones gramaticales expresadas en frase, referencias explícitas `variante de ...`, una anotación mixta sin etiqueta y remisiones.

Estas categorías **no equivalen automáticamente a análisis lingüísticos**. Una forma co-presentada no se presume variante fonológica; una etiqueta gramatical se conserva como evidencia documental antes de normalizarla; y un segmento sin etiqueta no recibe función por inferencia.

El cotejo de fuente confirmó además 18 remisiones visibles `Véase/Vease` en los dos campos textuales principales, aunque sólo 2 están representadas actualmente en `variants`; seis fórmulas `variante de ...`; las etiquetas documentales `ad.` y `gut.`; dos casos con puntuación no canónica entre etiquetas; y un caso con segmento intermedio sin etiqueta.

`variants` se mantiene como vista heredada 1.0.0. La interpretación canónica futura se divide en las dos capas siguientes.

## Capa tipada de variantes — `1.1.0-candidate`

`data/variants-typed.json` es una capa derivada, reproducible y no destructiva sobre los 224 tokens heredados de `variants`. Cada token conserva su identificador de entrada y la evidencia documental, pero queda tipado por procedencia y naturaleza.

Campos nucleares por registro:

| Campo | Regla |
|---|---|
| `variant_token_id` | Identificador estable dentro de la entrada: `RD-######` + posición del token |
| `record_id` | Entrada maestra de procedencia |
| `form` | Cadena heredada exacta almacenada en `variants` |
| `variant_origin` | `headword_secondary`, `bracket_annotation`, `cross_reference` o `unresolved` |
| `variant_nature` | Naturaleza documental/estructural del token, sin imponer equivalencia lingüística |
| `source_field` | Campo del que se extrajo la evidencia |
| `source_page` | Página inicial de la entrada en la fuente |
| `raw_evidence` | Cadena fuente que justifica el token |
| `target_record_id` | Destino único cuando la relación resuelve inequívocamente; `null` en otro caso |
| `target_record_ids` | Conjunto de destinos candidatos cuando procede |
| `grammatical_features` | Grupos de etiqueta y formas reconocidos explícitamente dentro de una anotación |
| `validation_status` | Estado de validación; el análisis automático no sustituye cotejo lingüístico |

La capa conserva literalmente etiquetas documentales como `ad.` y `gut.`. No convierte `gut` en `fut` ni asigna función a segmentos sin etiqueta. La puntuación no canónica puede ser reconocida por el parser robusto, pero la evidencia original permanece en `raw_evidence`.

## Relaciones lexicográficas — `1.1.0-candidate`

`data/lexical-relations.json` separa relaciones documentales que no deben modelarse como variantes lingüísticas. Se generan desde `translation_raw` y `comments_raw` y conservan procedencia completa.

Tipos iniciales:

- `cross_reference`: remisiones `Véase`/`Vease`;
- `source_variant_reference`: expresiones donde la fuente dice literalmente `variante de ...`;
- `grammatical_relation`: expresiones documentales como `futuro de`, `pp de` o `pret de`.

Cada relación conserva `source_record_id`, `source_field`, `source_page`, `raw_evidence`, forma destino, número de homónimo cuando es explícito, candidatos `target_record_ids`, `target_record_id` cuando la resolución es única y `resolution_status` (`resolved_unique`, `resolved_ambiguous`, `unresolved`).

Las remisiones pueden seguir apareciendo dentro de `variants` y de productos derivados por compatibilidad con 1.0.0, pero **su interpretación canónica es relacional**, no varietal.

## Política de análisis morfológico derivado

`scripts/extract-graphic-variants.mjs` reconoce etiquetas morfológicas explícitas aun cuando la puntuación interna sea irregular. La regla epistemológica es conservadora:

- una etiqueta explícita puede asociarse sólo con el material anterior a un segmento semicolon no etiquetado o a la siguiente etiqueta reconocida;
- un segmento sin etiqueta no hereda automáticamente la etiqueta anterior;
- `gut.` permanece `gut` en la capa documental;
- `ad.` permanece `ad`;
- `raw_evidence` conserva la cadena completa de la fuente;
- la interpretación lingüística posterior requiere validación independiente.

## Relaciones

```text
source 1 ── n lexical_entry
lexical_entry 1 ── n sense
lexical_entry 1 ── n example
lexical_entry 1 ── n typed_variant
lexical_entry 1 ── n lexical_relation
lexical_entry 1 ── n derived_record
product 1 ── n derived_record
```

Toda unidad derivada debe conservar, directamente o mediante `entry_id`/`entity_id`, identificador de entidad, producto, fuente y página, evidencia o contexto, método de derivación y estado de validación.

## Identificadores derivados

- Pares paralelos: identificador estable de par más `entry_id`.
- Terminología: `term_id` más página PDF e impresa.
- Variantes heredadas: `variant_id` más lista de entradas relacionadas.
- Variantes tipadas: `variant_token_id` más `record_id`.
- Relaciones lexicográficas: `REL-######` más `source_record_id` y destino(s) resueltos.
- Saltillo y acentos: identificador de ocurrencia, forma, campo fuente y entrada.
- Inventarios P-08–P-20: `inventory_id`, `product_id`, `entry_id`.
- Productos P-21–P-30: `advanced_id`, `product_id`, `entity_id`.

## Normalización

- La forma documental siempre permanece disponible.
- La normalización para búsqueda elimina diferencias de mayúsculas y, según el producto, unifica representaciones técnicas del saltillo.
- Los acentos se conservan en índices y publicaciones.
- No se infieren pronunciación, división silábica ni forma normativa.
- Ninguna corrección lingüística sobrescribe evidencia de la fuente.
- Las abreviaturas y etiquetas se conservan antes de cualquier mapeo editorial.
- La resolución de destinos puede normalizar para búsqueda, pero nunca modifica `target_raw` ni `raw_evidence`.

## Serializaciones

| Formato | Representación |
|---|---|
| XML | Jerarquía completa con metadatos y procedencia |
| JSON | Objeto de conjunto más arreglo de entradas |
| CSV | Una entrada por fila; arreglos serializados como JSON |
| SQL | Tablas normalizadas y llaves foráneas para SQLite 3 |
| TEI Lex-0 | Entradas, formas, gramática, sentidos, citas y notas de procedencia |
| OpenAPI | Contrato de consulta pública de entradas autorizadas |

## Política de migración 1.0.0 → 1.1.0

La extensión tipada es aditiva y está diseñada para ser compatible con consumidores 1.0.0. Durante la fase candidata:

- `data/lexicon-master.json` y sus `RD-######` no se reescriben;
- `variants` permanece como vista heredada;
- `data/variants-typed.json` y `data/lexical-relations.json` se regeneran determinísticamente desde la entrada maestra;
- los productos derivados deben consumir las capas tipadas cuando la semántica requiera distinguir variante, flexión o remisión;
- no se publica `1.1.0` como versión estable hasta que validaciones, exportaciones y documentación sean coherentes con la nueva capa.

## English summary

The canonical entity remains a lexicographic entry with a persistent `RD-######` identifier. Dataset `1.0.0` keeps a backward-compatible heterogeneous `variants` array. The `1.1.0-candidate` extension adds a typed variant layer and a separate lexical-relations layer, preserving raw evidence, source page, target resolution and validation status. Cross-references are canonically relations rather than linguistic variants. Documentary labels such as `gut.` and `ad.` are preserved rather than silently normalized. No published 1.0.0 record is destructively rewritten during this migration.
