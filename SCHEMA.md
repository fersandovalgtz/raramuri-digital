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
| `variants` | string[] | 0..n | Variantes o formas etiquetadas explícitamente |
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

## Relaciones

```text
source 1 ── n lexical_entry
lexical_entry 1 ── n sense
lexical_entry 1 ── n example
lexical_entry 1 ── n variant
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

The canonical entity is a lexicographic entry with a persistent `RD-######` identifier. Source and normalized forms are kept separately. Every derived record must preserve a link to the canonical entry or entity, product identifier, source, page, derivation method and validation status. Documentary forms are never silently overwritten by normalized or inferred forms.

