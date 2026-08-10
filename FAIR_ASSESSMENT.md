# Evaluación FAIR — Rarámuri Digital

Este documento registra una **preauditoría reproducible** del conjunto de datos frente a las métricas de F-UJI/FAIRsFAIR. **No constituye certificación FAIR ni sustituye una ejecución oficial de F-UJI.** El badge FAIR sólo debe mostrar un resultado numérico o una condición de evaluación cuando exista una salida pública y verificable del servicio.

## Objeto evaluado

- Dataset: **Rarámuri Digital: conjunto de datos lexicográficos rarámuri–español**
- Versión: **1.0.0**
- DOI: <https://doi.org/10.5281/zenodo.21483353>
- Depósito: <https://zenodo.org/records/21483353>
- Repositorio: <https://github.com/fersandovalgtz/raramuri-digital>
- Metadatos FAIR adicionales: [`metadata/fair-dataset.jsonld`](metadata/fair-dataset.jsonld)
- Estado lingüístico: **validación lingüística comunitaria pendiente**

## Marco de evaluación

La preauditoría sigue las métricas de F-UJI disponibles públicamente. La ejecución oficial prevista utiliza F-UJI 3.5.1 con métricas v0.8 y soporte DataCite sobre el DOI del dataset.

| Métrica | Criterio | Evidencia actual | Estado de preauditoría |
|---|---|---|---|
| FsF-F1-01D | Identificador globalmente único | DOI DataCite/Zenodo | Fuerte |
| FsF-F1-02D | Identificador persistente | DOI resoluble | Fuerte |
| FsF-F2-01M | Metadatos descriptivos básicos | creador, título, fecha, publisher, descripción, keywords, DOI | Fuerte |
| FsF-F3-01M | Metadatos contienen identificador del objeto | DOI y enlaces de distribución | Verificar en F-UJI |
| FsF-F4-01M | Metadatos recuperables por máquinas | DataCite, Zenodo y JSON-LD | Fuerte |
| FsF-A1-01M | Nivel/condiciones de acceso | depósito público y licencia declarada | Verificar vocabulario machine-readable |
| FsF-A1-02M | Acceso a metadatos por protocolo estándar | HTTPS/DOI/DataCite | Fuerte |
| FsF-A1-03D | Acceso a datos por protocolo estándar | archivos HTTPS en Zenodo/GitHub | Fuerte |
| FsF-A2-01M | Persistencia de metadatos tras pérdida de datos | propiedad del repositorio, no evaluable plenamente a nivel de objeto | No aplicable directamente |
| FsF-I1-01M | Lenguaje formal de representación | DataCite JSON/XML y JSON-LD del proyecto | Fuerte |
| FsF-I1-02M | Uso de recursos semánticos | Schema.org, DC Terms, DCAT, PROV-O, ISO 639-3; TEI Lex-0 en datos | Mejorado; verificar detección |
| FsF-I3-01M | Relaciones tipadas con entidades relacionadas | DOI, ORCID, repositorio y sitio; faltan relaciones DataCite más explícitas en Zenodo | Mejorable |
| FsF-R1-01MD | Contenido y propiedades técnicas descritas | tipo Dataset, formatos, tamaños, manifiesto e inventario | Fuerte |
| FsF-R1.1-01M | Licencia machine-readable | CC BY-NC-SA 4.0 | Fuerte |
| FsF-R1.2-01M | Proveniencia machine-readable | creador, versión, fechas, fuentes documentadas y PROV-O añadido | Mejorado; verificar detección |
| FsF-R1.3-01M | Estándar de metadatos recomendado por comunidad | DataCite es transversal; OLAC/CMDI aún pendientes | Brecha actual |
| FsF-R1.3-02D | Formatos recomendados/abiertos | CSV, JSON, XML, TEI Lex-0 y SQL | Fuerte |

## Mejoras realizadas antes del test oficial

Se añadió [`metadata/fair-dataset.jsonld`](metadata/fair-dataset.jsonld) con metadatos estructurados en Schema.org, Dublin Core Terms, DCAT y PROV-O; identifica DOI, ORCID, afiliación, licencia, lenguas, distribuciones, versión, procedencia y estándares de conformidad. Esta capa complementa los metadatos depositados en Zenodo y la documentación existente (`DATASHEET.md`, `SCHEMA.md`, `QUALITY_REPORT.md`, `GOVERNANCE.md`, `CITATION.cff`, `codemeta.json`).

## Brechas prioritarias

La mejora con mayor efecto potencial sobre una evaluación automatizada es enriquecer el registro Zenodo/DataCite con relaciones tipadas y persistentes hacia el repositorio, el sitio y la documentación pertinente, y mantener ORCID, licencia, lenguas y versión en campos estructurados. La segunda brecha es disponer de un estándar de metadatos especializado de comunidad —por ejemplo OLAC o CMDI/CLARIN— una vez que la vía de incorporación haya sido confirmada por esas infraestructuras.

## Política de badges FAIR

No usar `FAIR compliant`, `FAIR certified` ni expresiones equivalentes sin una certificación externa que las sustente. Tras ejecutar F-UJI, el README podrá mostrar un badge del tipo **`FAIR assessed · F-UJI · <porcentaje>`**, enlazado a una evaluación pública o a un resultado archivado reproducible que identifique versión de F-UJI, versión de métricas, DOI y fecha de evaluación.

## Referencias

- F-UJI: <https://www.f-uji.net/>
- Métodos y métricas F-UJI: <https://www.f-uji.net/index.php?action=methods>
- Implementación F-UJI: <https://github.com/pangaea-data-publisher/fuji>
- DOI del dataset: <https://doi.org/10.5281/zenodo.21483353>
