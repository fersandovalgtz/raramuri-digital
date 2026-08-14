# Publicación controlada de capas candidatas 1.1.0

Fecha: 2026-08-14

## Decisión

Las capas `data/variants-typed.json` y `data/lexical-relations.json` se exponen como interfaces públicas experimentales mediante API, sin promover todavía el conjunto de datos publicado `1.0.0` ni incorporar silenciosamente la extensión `1.1.0-candidate` a las serializaciones estables XML, CSV, SQL, TEI Lex-0 o CLDF.

La frontera de publicación se adopta para permitir inspección, reutilización y cotejo de las nuevas estructuras sin confundir una extensión documental reproducible con una nueva edición lingüísticamente validada.

La política vigente del proyecto está definida en `PROJECT_VALIDATION_POLICY_V1.md`: no existe una etapa de validación humana externa como requisito operativo. Las decisiones se clasifican por su base documental, análisis publicado, inferencia del proyecto o estado no resuelto.

## Interfaces

### `GET /api/typed-variants`

Expone los 224 tokens heredados de `variants` con procedencia y naturaleza tipadas. Admite búsqueda textual, filtros `origin` y `nature`, paginación y exportación completa en CSV o JSONL.

El estado `1.1.0-candidate` se devuelve explícitamente. Los registros conservan evidencia documental, campos de procedencia y estado de validación. No se presenta la capa como validación lingüística externa.

### `GET /api/lexical-relations`

Expone las 28 relaciones lexicográficas canónicas derivadas de remisiones, referencias de variante y relaciones gramaticales documentales. Admite búsqueda textual, filtros `type` y `method`, paginación y exportación completa en CSV o JSONL.

Las cuatro desambiguaciones documentales se identifican mediante `target_resolution_method = documentary_adjudication`. Se consideran **resueltas documentalmente para los fines del proyecto**; cualquier campo heredado `human_validation_status` se conserva sólo por compatibilidad histórica y no funciona como requisito de cierre.

## Estado de resolución

En la generación vigente:

- 224 tokens tipados; 0 orígenes sin resolver;
- 28 relaciones lexicográficas;
- 28 destinos documentales resueltos de forma única;
- 4 resoluciones obtenidas mediante adjudicación documental asistida;
- 0 relaciones ambiguas después de la adjudicación documental;
- 0 relaciones sin candidato.

## Exclusiones deliberadas

No se cambia `dataset_version = 1.0.0`. No se reescribe `data/lexicon-master.json`. No se elimina el campo heredado `variants`. Las capas candidatas sólo podrán entrar en TEI Lex-0/CLDF mediante serializaciones experimentales explícitamente separadas de las exportaciones estables hasta su promoción de versión.

## Criterio para el siguiente cambio

Antes de promover `1.1.0-candidate`, deberán evaluarse: estabilidad del contrato de ambas APIs; efecto en consumidores derivados; serialización candidata explícita para TEI Lex-0/CLDF; reproducibilidad y validaciones automatizadas; y actualización coordinada de esquema, changelog y metadatos. La promoción de versión será deliberada y no dependerá de una validación humana externa.
