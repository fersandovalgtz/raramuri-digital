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
| Indexación externa confirmada | OpenAIRE, a través del registro Zenodo |

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

La guía de CLARIN de julio de 2026 indica que repositorios generales con **OAI-PMH y metadatos ricos**, entre ellos Zenodo, son candidatos razonables para cosecha, aunque la incorporación no es automática ni está garantizada. CLARIN recomienda depositar en un centro CLARIN cuando sea posible porque esa vía garantiza la compatibilidad de cosecha. GitHub por sí mismo no es un candidato natural porque no expone OAI-PMH.

Rarámuri Digital ya dispone de un registro Zenodo con DOI y metadatos ricos. La ruta prioritaria es, por tanto:

1. corregir y enriquecer el registro Zenodo/DataCite, incluida la forma canónica `Fernando Sandoval Gutierrez`, ORCID, lenguas, licencia, palabras clave y relaciones persistentes;
2. solicitar a CLARIN una evaluación concreta del registro Zenodo para determinar si puede ser cosechado por el VLO;
3. si no se acepta la cosecha directa, utilizar el Language Resource Inventory (LRT) para este registro estático o depositar una copia/registro en un centro CLARIN compatible;
4. reservar un endpoint OAI-PMH propio para el momento en que existan múltiples recursos o versiones públicas que justifiquen mantenimiento continuo.

Para colecciones con muchos registros o cambios frecuentes, CLARIN prefiere OAI-PMH y, de ser posible, CMDI; también puede trabajar con OLAC. Para pocos registros estáticos, la documentación de CLARIN contempla LRT, cuyos registros se convierten a CMDI antes de aparecer en el VLO.

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

1. El registro Zenodo todavía debe normalizar el apellido del responsable a `Gutierrez` y revisar metadatos DataCite.
2. OpenAIRE ya está confirmado; falta reflejar esa evidencia en la cabecera del repositorio.
3. No consta todavía incorporación efectiva al VLO de CLARIN.
4. No existe todavía un proveedor OLAC que exponga este registro.
5. No consta todavía archivado del repositorio en Software Heritage ni SWHID documentado.
6. JOSS requiere maduración de la historia pública, adopción y evidencia de impacto antes de una eventual presentación.
7. Cualquier publicación especializada debe conservar la declaración de validación lingüística pendiente y las condiciones de gobernanza.

## Próximos pasos recomendados

1. Corregir y enriquecer Zenodo/DataCite; mantener el DOI como registro canónico del dataset.
2. Añadir al README un badge de `OpenAIRE indexed` únicamente porque la indexación ya está confirmada externamente.
3. Solicitar evaluación de cosecha del registro Zenodo por CLARIN VLO; usar LRT o un centro CLARIN si la cosecha directa no procede.
4. Solicitar archivado en Software Heritage; después documentar el SWHID y añadir el distintivo correspondiente.
5. Resolver la ruta OLAC mediante un proveedor externo antes de valorar OAI-PMH propio.
6. Acumular uso externo, citas, contribuciones y al menos seis meses de historia pública antes de evaluar JOSS.

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
