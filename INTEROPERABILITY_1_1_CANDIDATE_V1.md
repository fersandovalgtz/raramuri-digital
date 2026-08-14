# Interoperabilidad candidata `1.1.0-candidate` — TEI Lex-0 y CLDF

**Fecha:** 2026-08-14  
**Dataset estable de base:** `1.0.0`  
**Estado:** candidato reproducible y validado automáticamente; no promovido todavía a versión estable.

## 1. Objetivo

La extensión `1.1.0-candidate` incorpora las capas documentales tipadas construidas sobre el dataset `1.0.0` sin modificar silenciosamente las exportaciones estables. El paquete candidato permite comprobar de manera independiente que `variants-typed` y `lexical-relations` pueden serializarse de forma interoperable y determinista en TEI Lex-0 y CLDF.

La política de validación aplicable es `PROJECT_VALIDATION_POLICY_V1.md`: el proyecto trabaja con evidencia documental trazable y reproducible y no utiliza una valoración humana externa como requisito operativo o de promoción.

## 2. Generador

El generador canónico es:

`node scripts/generate-candidate-interoperability.mjs --output <directorio>`

Produce:

- `raramuri-lex0-1.1.0-candidate.xml`;
- `cldf/cldf-metadata.json`;
- las cuatro tablas CLDF estables copiadas sin modificación semántica (`entries.csv`, `senses.csv`, `languages.csv`, `sources.bib`);
- `cldf/typed-variants.csv`;
- `cldf/lexical-relations.csv`;
- `manifest.json` con conteos, política de validación, correspondencias de modelado, tamaños y SHA-256.

El generador falla si las capas fuente no declaran `schema_version = 1.1.0-candidate` o si queda alguna relación lexicográfica documental ambigua o sin resolver.

## 3. Mapeo TEI Lex-0

La serialización candidata parte de la exportación TEI Lex-0 estable y añade estructuras tipadas:

| Capa documental | Representación candidata |
|---|---|
| forma secundaria explícita dentro del lema | `form[@type='variant']` anidado en el `form[@type='lemma']` |
| forma gramatical documentada en anotación | `entry/form[@type='inflected']` + `note[@type='sourceLabel']` |
| relación lexicográfica con destino resuelto | `entry/xr[@type='related']/ref[@type='entry'][@target='#RD-…']` |

Las etiquetas originales de la fuente (`pret.`, `fut.`, `pp.`, `gut.`, etc.) se conservan en `sourceLabel`; el serializador no corrige ni completa por inferencia las abreviaturas documentales.

La cabecera de la edición candidata identifica expresamente la extensión `1.1.0-candidate` y la política de validación documental del proyecto. La exportación TEI estable de `1.0.0` no se reescribe.

## 4. Mapeo CLDF

El paquete conserva las tablas del CLDF Dictionary estable y añade dos tablas documentales auxiliares declaradas por CSVW:

- `typed-variants.csv`: 224 tokens tipados, vinculados por `record_id` a `entries.csv#ID`;
- `lexical-relations.csv`: 28 relaciones documentales, con claves foráneas independientes `source_record_id → entries.csv#ID` y `target_record_id → entries.csv#ID`.

En `lexical-relations.csv` las dos referencias a entradas se modelan mediante claves foráneas CSVW ordinarias. No se asigna dos veces la misma propiedad CLDF `entryReference` dentro de una sola tabla, porque `pycldf` detecta esa duplicación como inválida. El significado fuente/destino queda explícito en los nombres de columnas y en ambas claves foráneas.

## 5. Resultado de validación automática

La corrida GitHub Actions **31835809358**, sobre el commit `a90fc80b7333cf120ad613dc6adc200bc0c9d9f8`, terminó completamente en verde.

El flujo comprobó:

- regeneración determinista de las capas tipadas;
- validación del CLDF estable con `pycldf`;
- determinismo del CLDF y del perfil ortográfico;
- validación del TEI Lex-0 estable contra el XSD oficial;
- generación doble del paquete candidato y comparación byte a byte;
- validación del `cldf-metadata.json` candidato con `pycldf`;
- validación del TEI candidato contra el XSD oficial de Lex-0;
- publicación temporal del paquete candidato como artefacto CI;
- auditoría profunda del corpus;
- reproducibilidad de datos versionados;
- determinismo del PDF;
- lint, compilación y pruebas de regresión;
- writeback de derivados deterministas.

Artefacto CI candidato:

- ID: `9232456376`;
- nombre: `raramuri-interoperability-1.1.0-candidate-a90fc80b7333cf120ad613dc6adc200bc0c9d9f8`;
- digest del ZIP: `sha256:efe5d0b1d6681e8b71304b05ffbd2f7d7fcceaddbc374d150916e28399288e07`;
- retención: 30 días desde la corrida.

## 6. Conteos canónicos del candidato

- `typed_variant_records = 224`;
- `lexical_relation_records = 28`;
- `documentary_adjudications = 4`;
- `unresolved_lexical_relations = 0`;
- `external_human_validation_required = false`.

Las cuatro adjudicaciones se consideran **resoluciones documentales del proyecto**, no “validaciones humanas”. La trazabilidad de cada una permanece en los archivos de adjudicación y en los productos derivados.

## 7. Frontera con `1.0.0`

Este hito no cambia `dataset_version = 1.0.0`. Tampoco sustituye las exportaciones públicas estables. La función del paquete es demostrar que el modelo candidato puede serializarse, validarse y reproducirse sin romper los contratos vigentes.

Las etiquetas heredadas de la edición `1.0.0` que hablan de “validación lingüística pendiente” se consideran metadatos históricos de esa edición y no definen la política vigente del proyecto. No se reescriben silenciosamente; en una eventual versión `1.1.0` deberán sustituirse de forma versionada por el vocabulario de `PROJECT_VALIDATION_POLICY_V1.md`.

## 8. Criterios restantes antes de una promoción formal a `1.1.0`

La validación humana queda excluida como criterio. Los controles que sí permanecen son: estabilidad del contrato de datos; trazabilidad completa; cero ambigüedades documentales no explicitadas; serializaciones estables y reproducibles; pruebas automatizadas; actualización coordinada de esquema, changelog, OpenAPI, manifiestos y documentación; y preservación explícita del límite entre dato documental, análisis publicado, inferencia del proyecto y caso no resuelto.
