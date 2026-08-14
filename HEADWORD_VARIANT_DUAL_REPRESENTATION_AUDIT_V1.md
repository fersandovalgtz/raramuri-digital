# Auditoría de representación dual `headword` ↔ `variants` — v1

**Fecha:** 14 de agosto de 2026  
**Corpus:** datos `1.0.0`, 2,581 registros  
**Alcance:** formas secundarias documentadas dentro de la celda del lema y su representación estructurada como variantes.

## Resultado ejecutivo

La aparente redundancia observada inicialmente en `RD-000525` (`2Corá, cohuara`) no es un error aislado. Es una característica **sistemática y deliberada del pipeline de extracción**.

La auditoría exhaustiva detectó:

| Indicador | Resultado |
|---|---:|
| Entradas con `headword` multiforme | **52** |
| Formas secundarias dentro de esos lemas | **54** |
| Formas secundarias repetidas exactamente en `variants` | **54/54** |
| Relaciones `Gráfica` con método `Explícita en el lema` | **54** |
| Correspondencia exacta entre ambos conjuntos | **sí, 54/54** |
| Formas sin contraparte | **0** |

Dos entradas contienen dos formas secundarias, por lo que 52 entradas producen 54 relaciones: `RD-001170` (`Ju, juco, jupá`) y `RD-001534` (`Naribochi, naríhuari, naríiri`).

## Origen del patrón

El comportamiento está codificado en dos etapas distintas del pipeline:

1. `scripts/extract_lexicon.py`, función `extract_variants`, conserva el lema completo y, cuando contiene comas, copia cada segmento posterior al primero dentro de `variants`.
2. `scripts/extract-graphic-variants.mjs` vuelve a separar `headword` y genera, para cada forma secundaria, una relación `Gráfica` con `derivation_method = "Explícita en el lema"`.

Por tanto, una forma como `cohuara` en `RD-000525` puede aparecer simultáneamente:

- dentro de `headword = "Corá, cohuara"`;
- dentro de `variants = ["cohuara"]`;
- como `form_b = "cohuara"` en el producto de variantes gráficas.

Esas tres representaciones **proceden de una sola evidencia documental**, no de tres attestaciones independientes.

## Control de consistencia

La auditoría v8 cruzó todos los tokens secundarios de `headword` que también aparecen en `variants` contra `data/graphic-variants.json`. La comparación fue conservadora: conservó diacríticos y sólo neutralizó diferencias de espacio, NFC, mayúsculas/minúsculas y representaciones equivalentes de apóstrofo/saltillo.

El resultado fue una **biyección exacta**:

- conjunto A: 54 formas secundarias reflejadas en `variants`;
- conjunto B: 54 relaciones gráficas `Explícita en el lema`;
- A − B: 0;
- B − A: 0.

Esto confirma que el producto de variantes gráficas es coherente con el extractor maestro en este dominio.

## Dictamen editorial

No se debe borrar ninguna de las representaciones en datos `1.0.0`.

`headword_raw` y `headword` preservan la estructura documental/de presentación de la fuente. `variants` proporciona una representación estructurada útil para consultas. `data/graphic-variants.*` transforma esa misma relación en un producto derivado con identificador y procedencia.

La corrección necesaria no es destructiva sino **semántica y de esquema**: los consumidores del corpus deben saber que estas capas comparten evidencia y no deben sumar cada aparición como una attestación independiente.

## Política vigente

1. Conservar `headword`, `headword_raw` y `variants` sin cambios en la publicación `1.0.0`.
2. No usar la coexistencia `headword` + `variants` como criterio de duplicación léxica.
3. No contabilizar la forma secundaria del lema, su token en `variants` y su relación gráfica derivada como tres evidencias independientes.
4. Mantener `record_id`, fuente y páginas intactos.
5. En una futura revisión de esquema, tipar la procedencia de cada variante, por ejemplo: `headword_secondary`, `bracket_annotation` y `cross_reference`.
6. Mantener una vista compatible de `variants` durante cualquier migración para no romper consumidores existentes.

## Consecuencia para la auditoría general

La cola de “variantes duplicadas dentro del lema” queda cerrada como **representación dual sistemática**, no como 52 errores de extracción.

Este resultado también explica por qué `data/graphic-variants-report.json` registra exactamente 54 relaciones gráficas explícitas en el lema: son las mismas 54 formas secundarias identificadas aquí.

## Siguiente frente

El siguiente problema ya no es decidir si estas 54 formas deben eliminarse. Es **tipar la procedencia y naturaleza de todos los tokens actualmente almacenados en `variants`**, separando al menos formas secundarias del lema, anotaciones flexivas/gramaticales entre corchetes y remisiones. Esa auditoría puede realizarse sin modificar el dataset `1.0.0` y permitirá diseñar una futura estructura de variantes sin pérdida documental.
