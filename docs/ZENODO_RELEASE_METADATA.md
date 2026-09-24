# Metadatos de release y estrategia Zenodo — Rarámuri Digital

**Estado:** infraestructura preparada; no se ha creado una nueva versión estable ni un DOI nuevo.

## Propósito

Este documento fija el baseline reproducible para el próximo release estable del **dataset** de Rarámuri Digital y evita fragmentar la citación entre depósitos, releases y objetos distintos del ecosistema.

No sustituye a `CITATION.cff`, `codemeta.json` ni `project-metadata.json`. Su función es coordinar esos metadatos con el flujo de versionado de Zenodo.

## Baseline canónico verificado

- Objeto: dataset.
- Título: `Rarámuri Digital: conjunto de datos lexicográficos rarámuri–español`.
- Versión citable vigente: `1.0.0`.
- DOI de la versión vigente: `10.5281/zenodo.21483353`.
- Creador: `Sandoval Gutierrez, Fernando`.
- ORCID: `0000-0002-3168-6725`.
- Afiliación principal: Universidad Autónoma de Ciudad Juárez.
- Licencia del dataset: `CC BY-NC-SA 4.0`.
- Lenguas del registro vigente: Spanish + Central Tarahumara.
- Repositorio: https://github.com/fersandovalgtz/raramuri-digital
- Sitio: https://raramuri.ceees.mx
- DOI del objeto software/API relacionado: `10.5281/zenodo.21893632`.

La autoría, DOI, licencia y versión deben coincidir con `CITATION.cff` y `project-metadata.json`. El objeto software/API conserva su identidad separada en `codemeta.json`.

## Palabras clave para el próximo release estable

Usar como baseline las palabras clave ya normalizadas en `CITATION.cff`:

- Rarámuri
- Tarahumara
- Central Tarahumara
- Samachique
- lexicography
- digital humanities
- linguistic data
- data provenance
- open science
- TEI Lex-0
- CLDF
- corpus linguistics
- indigenous languages

No añadir términos sólo para inflar descubribilidad. Si se modifica esta lista, sincronizar `CITATION.cff`, el registro Zenodo y la documentación pertinente.

## Comunidades Zenodo

Al 24 de septiembre de 2026 no hay una comunidad Zenodo canónica verificada que deba añadirse automáticamente a este registro.

Regla: **no inventar identificadores de comunidad ni solicitar inclusión por defecto**. Una comunidad sólo se incorpora cuando su identificador exacto, pertinencia temática y condiciones de aceptación hayan sido verificadas.

## Relaciones

Conservar separados y relacionados los siguientes objetos:

1. Dataset Rarámuri Digital — objeto citable principal de los datos.
2. Software/API — DOI `10.5281/zenodo.21893632`.
3. Repositorio GitHub — código, documentación y desarrollo.
4. Sitio público — documentación, consulta y acceso.

Antes de publicar una nueva versión, revisar en Zenodo la dirección semántica de cada relación. No crear una relación del registro consigo mismo y no usar `IsIdenticalTo` entre dataset y software.

## Continuidad del DOI

Para una futura versión estable del dataset:

1. Partir del **registro existente** de Zenodo y usar la acción **New version**.
2. No crear un depósito nuevo independiente para el mismo dataset.
3. No activar un archivado automático de GitHub que pueda abrir una línea de DOI paralela sin verificar antes la continuidad del registro.
4. Una vez creado el borrador de nueva versión, actualizar versión, fecha, archivos y metadatos; revisar antes de publicar.
5. Tras publicar, registrar de forma inequívoca: versión, tag, release, commit, DOI de versión y linaje de Zenodo.

## Decisión sobre `.zenodo.json`

No se añade por ahora un `.zenodo.json` en la raíz.

Motivo: Zenodo da precedencia a `.zenodo.json` sobre `CITATION.cff` en el archivado de releases de GitHub. La incorporación prematura de ese archivo introduciría dos riesgos: desalinear metadatos ya normalizados y disparar un flujo de depósito distinto del registro canónico.

Si en una release futura se decide usar `.zenodo.json`, deberá:

- derivarse de este baseline;
- mantener creador, ORCID, licencia y palabras clave sincronizados;
- usar únicamente comunidades verificadas;
- preservar las lenguas del registro;
- validarse como JSON antes del release;
- comprobarse primero que el flujo elegido conserva la continuidad DOI del dataset.

## Puerta de release

Antes de una nueva versión estable:

- [ ] Definir nueva versión del dataset y alcance científico.
- [ ] Sincronizar `CITATION.cff`, `project-metadata.json`, README y notas de release.
- [ ] Verificar que `codemeta.json` siga describiendo el software/API y no suplante al dataset.
- [ ] Revisar autoría, ORCID, licencia, lenguas y keywords.
- [ ] Revisar relaciones dataset ↔ software ↔ repositorio ↔ sitio.
- [ ] Confirmar comunidades Zenodo sólo si existen identificadores verificados.
- [ ] Crear la nueva versión desde el registro Zenodo existente, no desde un depósito paralelo.
- [ ] Comprobar que los archivos del depósito corresponden exactamente al tag/commit publicado.
- [ ] Publicar sólo después de revisión final.
- [ ] Verificar el registro público y documentar DOI, versión, tag y commit.

## Regla de no acción

La preparación de metadatos **no justifica por sí sola** una nueva versión del dataset. Sólo se publicará un release estable cuando exista un cambio científico, documental o técnico que amerite una nueva versión citable y haya superado la puerta de release.
