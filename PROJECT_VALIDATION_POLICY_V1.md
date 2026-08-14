# Política de validación del proyecto

Fecha: 2026-08-14
Estado: vigente

## Decisión

Rarámuri Digital no utilizará una etapa de validación humana externa como requisito operativo, de publicación o de promoción de versiones. El proyecto no dispone de acceso estable a una persona especialista que pueda fungir como validador independiente, por lo que esa condición deja de formar parte de la ruta crítica.

Esta decisión no autoriza a elevar automáticamente la certeza de análisis lingüísticos o filológicos. En su lugar, el proyecto adopta una política de **validación documental y reproducible basada en fuente**, donde cada afirmación debe conservar el tipo de evidencia que la sustenta y sus límites.

## Niveles operativos

1. **Transcripción o dato documental**: reproducción controlada de lo que la fuente efectivamente contiene, con página/folio y procedencia.
2. **Resolución documental**: decisión entre alternativas cuando la propia fuente, su estructura interna o evidencia convergente del mismo expediente permite resolverlas de manera reproducible.
3. **Análisis publicado**: segmentación, función o interpretación respaldada explícitamente por una fuente académica identificable.
4. **Inferencia del proyecto**: hipótesis derivada por comparación o modelado; debe conservar cautela explícita y no presentarse como análisis publicado.
5. **No resuelto**: caso para el que la evidencia disponible no permite una adjudicación responsable.

## Regla de promoción

Una estructura puede pasar de candidata a estable cuando cumple simultáneamente: reproducibilidad determinista; trazabilidad hasta la fuente; ausencia de ambigüedades documentales no explicitadas; contrato de datos estable; pruebas automatizadas; compatibilidad con las serializaciones públicas que corresponda; y documentación de cualquier inferencia que permanezca abierta.

La ausencia de validación humana externa no bloquea la promoción. Tampoco debe sustituirse por una declaración falsa de “validación lingüística”. Cuando corresponda, el estado debe describirse como **validación documental del proyecto**, **análisis publicado**, **inferencia del proyecto** o **no resuelto**.

## Aplicación inmediata a 1.1.0-candidate

Las cuatro antiguas ambigüedades de destino en `data/lexical-relations.json` ya están resueltas por adjudicación documental reproducible. No requieren una segunda aprobación humana para ser utilizadas como relaciones documentales del proyecto. Sus campos heredados `human_validation_status` se conservan únicamente por compatibilidad y trazabilidad histórica; dejan de ser un requisito de cierre.

La promoción futura de `1.1.0-candidate` dependerá de estabilidad del contrato, serialización TEI Lex-0/CLDF candidata, pruebas y documentación, no de una validación humana externa.
