# Esquema de datos / Data Schema

## Identidad y versiones

- Plataforma: `3.1.0`.
- Conjunto de datos: `1.0.0`.
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

Por procedencia de emisión, el inventario contiene:

- 54 formas secundarias procedentes de la misma celda del lema (`headword_secondary`);
- 168 anotaciones tomadas literalmente de corchetes en `comments_raw` (`bracket_annotation`);
- 2 remisiones capturadas por la expresión regular histórica (`cross_reference`).

Por naturaleza documental, esos 224 tokens se distribuyen en 54 formas co-presentadas con el lema, 156 anotaciones gramaticales etiquetadas regulares, 2 anotaciones gramaticales con separadores internos no canónicos, 3 relaciones gramaticales expresadas en frase, 6 referencias explícitas de fuente con la fórmula `variante de ...`, 1 anotación mixta con un segmento no etiquetado y 2 remisiones actualmente capturadas.

Estas categorías **no equivalen automáticamente a análisis lingüísticos**. Una forma co-presentada no se presume variante fonológica; una etiqueta gramatical se conserva como evidencia documental antes de normalizarla; y un segmento sin etiqueta no recibe función por inferencia.

El cotejo de fuente confirmó además que:

- la fuente contiene exactamente 6 fórmulas `variante de ...`; las seis apuntan a lemas existentes del corpus y deben modelarse como relaciones explícitas de fuente;
- hay 18 remisiones visibles `Véase/Vease` en los dos campos textuales principales, pero sólo 2 están actualmente representadas en `variants`;
- de las 16 remisiones faltantes, 13 están en `comments_raw` y se pierden porque la regex histórica no reconoce `Véase` con acento en la primera `e`, mientras 3 están en `translation_raw`, campo que el extractor de variantes no inspecciona;
- la fuente imprime literalmente `ad.` y `gut.` en sendas anotaciones; cualquier expansión o normalización es una decisión editorial separada;
- `RD-000034` y `RD-001023` contienen dos etiquetas gramaticales separadas de manera no canónica, mientras `RD-000726` contiene un segmento intermedio sin etiqueta que no debe completarse por conjetura.

En consecuencia, las remisiones deben modelarse como **relaciones lexicográficas separadas**, no como variantes lingüísticas. El dataset publicado `1.0.0` no se reescribe silenciosamente: la auditoría registra la deuda y prepara una migración reproducible.

Una revisión futura del esquema deberá tipar al menos:

- `variant_origin`: procedencia física/documental del dato;
- `variant_nature`: naturaleza editorial/estructural de la relación;
- `target_record_id`: destino resuelto cuando exista;
- `source_field`: campo fuente (`headword`, `comments_raw`, `translation_raw`, etc.);
- `source_page`: página de evidencia;
- `raw_evidence`: cadena documental intacta;
- `validation_status`: estado de validación lingüística/editorial.

`variants` podrá mantenerse como vista de compatibilidad durante la migración. El informe y los datos de control están en `VARIANT_ORIGIN_NATURE_AUDIT_V3.md` y `data/variant-origin-nature-audit-v3.json`.

## Relaciones

```text
source 1 ── n lexical_entry
lexical_entry 1 ── n sense
lexical_entry 1 ── n example
lexical_entry 1 ── n variant
lexical_entry 1 ── n lexical_relation
lexical_entry 1 ── n derived_record
product 1 ── n derived_record
```

Toda unidad derivada debe conservar, directamente o mediante `entry_id`/`entity_id`:

- identificador de entidad;
- identificador de producto;
- fuente y página;
- evidencia o contexto cuando corresponda;
- método de derivación;
- estado de validación.

## Identificadores derivados

- Pares paralelos: identificador estable de par más `entry_id`.
- Terminología: `term_id` más página PDF e impresa.
- Variantes: `variant_id` más lista de entradas relacionadas.
- Saltillo y acentos: identificador de ocurrencia, forma, campo fuente y entrada.
- Inventarios P-08–P-20: `inventory_id`, `product_id`, `entry_id`.
- Productos P-21–P-30: `advanced_id`, `product_id`, `entity_id`.

## Normalización

- La forma documental siempre permanece disponible.
- La normalización para búsqueda elimina diferencias de mayúsculas y, según el producto, unifica representaciones técnicas del saltillo.
- Los acentos se conservan en índices y publicaciones.
- No se infieren pronunciación, división silábica ni forma normativa.
- Ninguna corrección lingüística sobrescribe evidencia de la fuente.
- Las abreviaturas y etiquetas de la fuente se conservan antes de cualquier mapeo editorial; una normalización derivada debe quedar declarada como tal.

## Serializaciones

| Formato | Representación |
|---|---|
| XML | Jerarquía completa con metadatos y procedencia |
| JSON | Objeto de conjunto más arreglo de entradas |
| CSV | Una entrada por fila; arreglos serializados como JSON |
| SQL | Tablas normalizadas y llaves foráneas para SQLite 3 |
| TEI Lex-0 | Entradas, formas, gramática, sentidos, citas y notas de procedencia |
| OpenAPI | Contrato de consulta pública de entradas autorizadas |

## English summary

The canonical entity is a lexicographic entry with a persistent `RD-######` identifier. Source and normalized forms are kept separately. In dataset `1.0.0`, `variants` is a backward-compatible heterogeneous container: secondary headword forms, bracketed grammatical annotations, explicit source variant references, and captured cross-references must not be treated as one linguistic class. Cross-references should become separate lexical relations in a future reproducible migration. Every derived record must preserve source evidence and validation status, and documentary forms or labels must never be silently overwritten by normalized or inferred forms.
