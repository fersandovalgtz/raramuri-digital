# Metadatos de descubrimiento: CLARIN VLO y OLAC

Este documento organiza los metadatos existentes de **Rarámuri Digital** para facilitar su incorporación a servicios especializados de descubrimiento de recursos lingüísticos. No implica aceptación, certificación o cosecha por CLARIN VLO u OLAC hasta que exista evidencia externa verificable.

## Registro canónico del recurso

| Campo | Valor actual |
|---|---|
| Título | Rarámuri Digital: conjunto de datos lexicográficos rarámuri–español |
| Responsable | Fernando Sandoval Gutierrez |
| ORCID | 0000-0002-3168-6725 |
| Afiliación | Universidad Autónoma de Ciudad Juárez |
| Versión de datos | 1.0.0 |
| DOI | 10.5281/zenodo.21483353 |
| URL del repositorio | https://github.com/fersandovalgtz/raramuri-digital |
| URL del servicio | https://raramuri.ceees.mx |
| Tipo de recurso | dataset lexicográfico / lexicon |
| Lenguas | Central Tarahumara (ISO 639-3: `tar`) y español (`spa`) |
| País / cobertura | México (`MX`) |
| Licencia de datos | CC BY-NC-SA 4.0 |
| Estado lingüístico | Pendiente de validación lingüística |
| Formatos | CSV, JSON, XML, SQL, TEI Lex-0, OpenAPI |
| API | https://raramuri.ceees.mx/api/lexicon |
| Metadatos técnicos existentes | `CITATION.cff`, `codemeta.json`, `DATASHEET.md`, `SCHEMA.md`, `QUALITY_REPORT.md`, `manifest.json` |
| Indexación externa confirmada | OpenAIRE; CLARIAH-HiTZ; CLARIN VLO |
| DOI / PID CLARIAH-HiTZ | 10.71845/hitz-35 · Handle 20.500.14614/46 |
| Registro CLARIN VLO | https://vlo.clarin.eu/record/https_58__47__47_hdl.handle.net_47_20.500.14614_47_46_64_format_61_cmdi?1&fqType=nationalProject:or&fq=nationalProject:CLARIAH-ES&index=2&count=31 |

## Correspondencia de alto nivel

| Rarámuri Digital | Dublin Core / OLAC | CLARIN / CMDI | Observación |
|---|---|---|---|
| Título | `dc:title` | title/name del recurso | Disponible |
| Fernando Sandoval Gutierrez | `dc:creator` | creator / resource actor | Disponible |
| 2026 | `dc:date` | publication/creation date | Disponible en DOI |
| DOI y URL | `dc:identifier` | ResourceProxy / PID | Usar DOI como identificador persistente principal |
| Dataset lexicográfico | `dc:type` + `olac:linguistic-type=lexicon` | resource type | Requiere serialización específica |
| Central Tarahumara | `dc:language` / `dc:subject` con ISO 639-3 `tar` | language | Disponible; conservar además Rarámuri/Tarahumara |
| Español | `dc:language` con `spa` | language | Disponible |
| México | `dc:coverage` | country/location | Disponible |
| CC BY-NC-SA 4.0 | `dc:rights` | licence / availability | Disponible |
| Descripción de Zenodo | `dc:description` | description | Disponible |
| Lexicografía, humanidades digitales, lenguas indígenas | `dc:subject` | subject / keywords | Disponible |
| CSV, JSON, XML, SQL, TEI Lex-0 | `dc:format` | resource format | Disponible |
| UACJ / instituciones participantes | `dc:publisher` o `dc:contributor`, según rol | organisation / actor | Confirmar rol exacto antes de serializar |
| Gobernanza y validación pendiente | `dc:rights` / `dc:description` | access/description | Debe conservarse como advertencia explícita |

## Ruta CLARIN VLO

La ruta institucional ya quedó completada. El 11 de agosto de 2026, CLARIN ERIC recomendó depositar Rarámuri Digital mediante un centro CLARIAH-ES. El Centro B de CLARIAH-HiTZ aceptó el depósito; la copia especializada quedó publicada con DOI **10.71845/hitz-35** y Handle **20.500.14614/46**. El 23 de septiembre de 2026, HiTZ confirmó que el recurso ya es accesible desde **CLARIN VLO**.

Esta incorporación cierra la necesidad de construir infraestructura OAI-PMH propia para este recurso. El DOI de Zenodo **10.5281/zenodo.21483353** permanece como identificador canónico del dataset v1.0.0; el DOI/Handle de HiTZ identifican la copia especializada y el registro VLO aporta descubrimiento internacional. Ninguno de estos hechos equivale a validación lingüística o comunitaria.

## Ruta OLAC

OLAC utiliza metadatos basados en Dublin Core y vocabularios controlados para recursos lingüísticos. Para este recurso son especialmente relevantes:

- `dc:title`: título canónico;
- `dc:creator`: Fernando Sandoval Gutierrez;
- `dc:identifier`: DOI y URL canónica;
- `dc:language`: `tar` y `spa`;
- `dc:subject`: Central Tarahumara / Rarámuri y términos temáticos;
- `dc:type`: recurso textual/dataset según la representación;
- `olac:linguistic-type`: `lexicon`;
- `dc:format`: tipos de medio de las exportaciones;
- `dc:coverage`: México;
- `dc:rights`: CC BY-NC-SA 4.0 y referencia a la gobernanza del proyecto.

La incorporación efectiva a OLAC requiere que los metadatos sean expuestos por un archivo/proveedor compatible con OAI-PMH y el formato OLAC, o que el recurso sea depositado en una infraestructura que ya funcione como proveedor. No conviene construir infraestructura propia sólo para obtener un distintivo: primero debe intentarse una ruta de depósito/cosecha externa mantenible.

## Software Heritage

El repositorio de código puede archivarse en Software Heritage mediante **Save Code Now**. Para repositorios públicos alojados en GitHub, Software Heritage indica que las solicitudes se programan automáticamente. Una vez archivado, el proyecto puede documentar su **SWHID** como identificador persistente de una instantánea del código. Esta es una señal externa de preservación y reproducibilidad distinta del DOI del dataset.

## Publicación revisada por pares del software

JOSS constituye una meta de mayor autoridad porque revisa externamente tanto el software como el artículo y asigna un DOI al trabajo aceptado. Sin embargo, sus criterios 2026 exigen evidencia de impacto, desarrollo abierto sostenido y, para proyectos desarrollados privadamente antes de abrirse, al menos seis meses de historia pública antes de someter. Rarámuri Digital debe tratar JOSS como objetivo de maduración, no como trámite inmediato.

## Brechas actuales

1. No existe todavía un proveedor OLAC que exponga este registro.
2. JOSS requiere maduración de la historia pública, adopción y evidencia de impacto antes de una eventual presentación.
3. La prioridad científica posterior a la incorporación en CLARIN VLO es demostrar **reutilización, citación, adopción y colaboración externa**, no acumular depósitos equivalentes.
4. Cualquier publicación especializada debe conservar la declaración de validación lingüística pendiente y las condiciones de gobernanza.

## Próximos pasos recomendados

1. Mantener Zenodo como registro canónico del dataset y CLARIAH-HiTZ/CLARIN VLO como capa especializada de descubrimiento.
2. Registrar usos, citas, integraciones y reutilizaciones externas verificables.
3. Resolver la ruta OLAC mediante un proveedor externo antes de valorar infraestructura propia.
4. Acumular uso externo, citas, contribuciones e historia pública antes de evaluar JOSS.
5. No abrir otro ciclo de infraestructura para CLARIN: la ruta de incorporación ya está cumplida.

## Referencias técnicas

- CLARIN, FAQ de julio de 2026 sobre cosecha desde Zenodo/DataVerse/FigShare/GitHub/Hugging Face: https://forum.clarin.eu/t/can-you-harvest-my-data-from-zenodo-dataverse-figshare-github-hugging-face/1490
- CLARIN VLO: guía para publicar metadatos y alternativas OAI-PMH/CMDI/OLAC/LRT: https://forum.clarin.eu/t/how-can-i-publish-my-metadata-to-the-virtual-language-observatory-vlo/474
- CLARIN CMDI: estructura de cabecera, recursos y componentes: https://forum.clarin.eu/t/what-parts-does-a-cmdi-metadata-file-have/447
- Software Heritage: Save Code Now y preservación de repositorios públicos.
- JOSS: criterios de alcance y presentación 2026.
- OLAC: https://www.language-archives.org/
- Glottolog, Central Tarahumara (`tar`): https://glottolog.org/resource/languoid/id/cent2131

## Criterio de gobernanza

La ampliación de descubrimiento no modifica el estatuto del recurso: la disponibilidad técnica no equivale a validación lingüística ni transfiere autoridad cultural. Los metadatos externos deben conservar procedencia, licencias, restricciones y el estado de validación documentado en `GOVERNANCE.md`.
