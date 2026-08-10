# Metadatos de descubrimiento: CLARIN VLO y OLAC

Este documento organiza los metadatos existentes de **Rarámuri Digital** para facilitar una futura incorporación a servicios especializados de descubrimiento de recursos lingüísticos. No implica que el recurso haya sido aceptado, certificado o cosechado todavía por CLARIN VLO u OLAC.

## Registro canónico del recurso

| Campo | Valor actual |
|---|---|
| Título | Rarámuri Digital: conjunto de datos lexicográficos rarámuri–español |
| Responsable | Fernando Sandoval Gutiérrez |
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

## Correspondencia de alto nivel

| Rarámuri Digital | Dublin Core / OLAC | CLARIN / CMDI | Observación |
|---|---|---|---|
| Título | `dc:title` | title/name del recurso | Disponible |
| Fernando Sandoval Gutiérrez | `dc:creator` | creator / resource actor | Disponible |
| 2026 | `dc:date` | publication/creation date | Disponible en DOI |
| DOI y URL | `dc:identifier` | ResourceProxy / PID | Usar DOI como identificador persistente principal |
| Dataset lexicográfico | `dc:type` + `olac:linguistic-type=lexicon` | resource type | Requiere serialización específica |
| Central Tarahumara | `dc:language` / `dc:subject` con ISO 639-3 `tar` | language | Disponible; conservar además el nombre Rarámuri/Tarahumara |
| Español | `dc:language` con `spa` | language | Disponible |
| México | `dc:coverage` | country/location | Disponible |
| CC BY-NC-SA 4.0 | `dc:rights` | licence / availability | Disponible |
| Descripción de Zenodo | `dc:description` | description | Disponible |
| Lexicografía, humanidades digitales, lenguas indígenas | `dc:subject` | subject / keywords | Disponible |
| CSV, JSON, XML, SQL, TEI Lex-0 | `dc:format` | resource format | Disponible |
| UACJ / instituciones participantes | `dc:publisher` o `dc:contributor`, según el rol documentado | organisation / actor | Confirmar rol exacto antes de serializar |
| Gobernanza y validación pendiente | `dc:rights` / `dc:description` | access/description | Debe conservarse como advertencia explícita |

## Ruta CLARIN VLO

CLARIN VLO descubre metadatos de recursos lingüísticos. Para colecciones con muchos registros o cambios frecuentes, la ruta preferente es un endpoint OAI-PMH, idealmente con CMDI; CLARIN también puede trabajar con OLAC. Para pocos registros estáticos, CLARIN indica como alternativa el **Language Resource Inventory (LRT)**, cuyos registros se convierten a CMDI antes de incorporarse al VLO.

Para Rarámuri Digital, por tratarse actualmente de un dataset versionado con un registro canónico, la ruta de menor complejidad operativa es evaluar primero el ingreso mediante LRT. Si el proyecto evoluciona hacia múltiples recursos/versiones que requieran cosecha periódica, convendría valorar OAI-PMH.

Un registro CMDI requiere, además de los componentes descriptivos, una cabecera administrativa con creador del archivo, fecha de creación, enlace persistente del propio registro y perfil CMDI; la sección de recursos debe enlazar al DOI, repositorio, dataset o servicios pertinentes.

## Ruta OLAC

OLAC utiliza metadatos basados en Dublin Core y vocabularios controlados para recursos lingüísticos. Para este recurso son especialmente relevantes:

- `dc:title`: título canónico;
- `dc:creator`: Fernando Sandoval Gutiérrez;
- `dc:identifier`: DOI y URL canónica;
- `dc:language`: `tar` y `spa`;
- `dc:subject`: Central Tarahumara / Rarámuri y términos temáticos;
- `dc:type`: recurso textual/dataset según la representación;
- `olac:linguistic-type`: `lexicon`;
- `dc:format`: tipos de medio de las exportaciones;
- `dc:coverage`: México;
- `dc:rights`: CC BY-NC-SA 4.0 y referencia a la gobernanza del proyecto.

La incorporación efectiva a OLAC requiere que los metadatos sean expuestos por un archivo/proveedor compatible con OAI-PMH y el formato OLAC, o que el recurso sea depositado en una infraestructura que ya funcione como proveedor. La presencia de este documento en GitHub no constituye registro en OLAC.

## Brechas actuales

1. No existe todavía un endpoint OAI-PMH propio del proyecto.
2. No existe todavía un registro CMDI ni un perfil CMDI seleccionado.
3. No consta todavía incorporación efectiva al LRT de CLARIN.
4. No consta todavía un proveedor OLAC que exponga este registro.
5. Debe confirmarse el papel editorial exacto de cada institución antes de mapear `publisher` y `contributor`.
6. Cualquier publicación especializada debe conservar la declaración de validación lingüística pendiente y las condiciones de gobernanza.

## Próximos pasos recomendados

1. Mantener Zenodo/DOI como registro canónico y sincronizar allí las versiones publicadas.
2. Solicitar o realizar el alta del recurso en el Language Resource Inventory de CLARIN si el formulario admite el recurso y sus condiciones de gobernanza.
3. Verificar con CLARIN si el registro DataCite asociado al DOI puede aprovecharse directamente o si recomiendan LRT/CMDI para este caso.
4. Identificar un repositorio o proveedor OAI-PMH compatible con OLAC antes de implementar infraestructura propia.
5. Solo si el volumen de registros públicos lo justifica, implementar un endpoint OAI-PMH reproducible a partir de los metadatos existentes.

## Referencias técnicas

- CLARIN VLO: guía para publicar metadatos y alternativas OAI-PMH/CMDI/OLAC/LRT: https://forum.clarin.eu/t/how-can-i-publish-my-metadata-to-the-virtual-language-observatory-vlo/474
- CLARIN CMDI: estructura de cabecera, recursos y componentes: https://forum.clarin.eu/t/what-parts-does-a-cmdi-metadata-file-have/447
- OLAC: https://www.language-archives.org/
- Glottolog, Central Tarahumara (`tar`): https://glottolog.org/resource/languoid/id/cent2131

## Criterio de gobernanza

La ampliación de descubrimiento no modifica el estatuto del recurso: la disponibilidad técnica no equivale a validación lingüística ni transfiere autoridad cultural. Los metadatos externos deben conservar procedencia, licencias, restricciones y el estado de validación documentado en `GOVERNANCE.md`.
