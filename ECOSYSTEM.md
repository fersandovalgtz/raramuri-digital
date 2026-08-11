# Ecosistema, interoperabilidad y colaboración

Rarámuri Digital no pretende funcionar como una infraestructura aislada. Esta página documenta proyectos, estándares y comunidades con los que comparte problemas científicos o técnicos, registra acciones de vinculación ya realizadas y señala rutas concretas de interoperabilidad. La inclusión en esta lista no implica afiliación, aprobación recíproca ni transferencia automática de datos.

## Punto de partida

**Rarámuri Digital** publica un recurso lexicográfico rarámuri–español (ISO 639-3 `tar`) con 2,581 entradas y productos derivados reproducibles. La infraestructura combina API pública, exportaciones CSV/JSON/XML/SQL, TEI Lex-0, OpenAPI 3.1, DOI, CodeMeta, Citation File Format, manifiestos SHA-256, preservación en Zenodo y Software Heritage y documentación explícita de procedencia y gobernanza lingüística.

Desde agosto de 2026 el repositorio incorpora además un generador determinista de **CLDF Dictionary**, validación con `pycldf`, comprobación de determinismo, un perfil ortográfico empírico generado desde los datos y un ejemplo mínimo de consumo de la API desde Python. El CLDF todavía no se presenta como release estable: primero se busca revisión técnica externa. La publicación técnica tampoco se presenta como equivalente a autoridad lingüística; la validación lingüística y comunitaria más amplia continúa diferenciada explícitamente.

El proyecto dispone asimismo de un protocolo operativo para futuras contribuciones de hablantes y multimedia, una plantilla base de consentimiento y un esquema de metadatos públicos. Estos instrumentos preparan un piloto pequeño y reversible; no significan que el corpus haya recibido validación comunitaria general.

## Proyectos y comunidades relacionados

### Dictionaria y CLDF

[Dictionaria](https://dictionaria.clld.org/) publica diccionarios como datasets estructurados y versionados, con repositorios GitHub y releases archivados en Zenodo. El repositorio de Tseltal y otros diccionarios de Dictionaria fueron referentes directos para la nueva capa CLDF.

**Estado:** implementado un CLDF Dictionary determinista con `EntryTable`, `SenseTable`, `LanguageTable`, `sources.bib` y metadatos. El 11 de agosto de 2026 se solicitó a Gilles Polian una revisión técnica acotada del mapeo y orientación sobre una futura ruta hacia Dictionaria. No se ha solicitado incorporación formal mientras la validación lingüística continúe pendiente.

### Comunidad Elotl / Py-Elotl

[Comunidad Elotl](https://github.com/ElotlMX) desarrolla infraestructura de PLN para lenguas originarias de México. [Py-Elotl](https://github.com/ElotlMX/py-elotl) facilita acceso programático a corpus y herramientas lingüísticas.

**Estado:** Rarámuri Digital ya contiene un cliente Python mínimo, sin dependencias externas, que consume la API pública y recupera registros mediante identificadores persistentes. El 11 de agosto de 2026 se contactó a desarrolladores de Py-Elotl para preguntar si resulta útil un loader o adaptador que consuma la API o una distribución interoperable sin duplicar innecesariamente el dataset.

### AmericasNLP

[AmericasNLP](https://github.com/AmericasNLP) articula investigación en procesamiento de lenguas indígenas de las Américas; el rarámuri (`tar`) ha aparecido en tareas previas de traducción automática.

**Estado:** el 11 de agosto de 2026 se consultó al equipo qué representación, subconjunto o metadatos de un recurso lexicográfico podrían resultar útiles para futuros experimentos con `tar`. Rarámuri Digital no se presenta como corpus paralelo y no convertirá automáticamente ejemplos documentales en pares de entrenamiento.

### MayanV

[MayanV](https://github.com/transducens/mayanv) es un comparador relevante por su trabajo con corpus paralelos mesoamericanos, control de errores, versiones y experimentación de traducción automática de bajos recursos.

**Estado:** el 11 de agosto de 2026 se abrió un intercambio metodológico para preguntar cómo puede un recurso léxico estructurado complementar experimentos de MT sin ser presentado indebidamente como corpus paralelo.

### Lexibank

[Lexibank](https://github.com/lexibank) es una colección curada de datasets léxicos basada principalmente en CLDF Wordlists y `pylexibank`, con vínculos a Glottolog, Concepticon y CLTS.

**Estado:** el 11 de agosto de 2026 se consultó a los mantenedores sobre tres puntos antes de crear cualquier derivado: compatibilidad de la licencia CC BY-NC-SA 4.0, conveniencia de enlace frente a ingestión y pertinencia de producir un Wordlist pequeño, revisado y mapeado manualmente a Concepticon en lugar de transformar automáticamente el CLDF Dictionary. El piloto de Concepticon se rastrea por separado y no presupone aceptación por Lexibank.

### Living Dictionaries

[Living Dictionaries](https://livingdictionaries.app/) es una plataforma de Living Tongues para documentación colaborativa con audio, imágenes, video y herramientas de contribución.

**Estado:** después de incorporar a Rarámuri Digital un protocolo explícito de consentimiento, atribución, retiro, sensibilidad cultural y reciprocidad, el 11 de agosto de 2026 se contactó a Living Tongues para un intercambio metodológico sobre metadatos de hablantes, cambios de permiso y posibilidades de interoperabilidad mediante API o enlaces. No se propone migración masiva de datos.

### TEI Lex-0

[TEI Lex-0](https://lex-0.org/) ofrece recomendaciones comunitarias y esquemas oficiales para codificar diccionarios legibles por máquina. Rarámuri Digital ya genera una exportación etiquetada como TEI Lex-0 0.9.5.

**Estado:** se está incorporando validación automática contra el esquema oficial vigente. La instrucción `xml-model` del generador todavía conserva una referencia histórica al antiguo repositorio DARIAH y deberá actualizarse junto con las salidas versionadas una vez terminado el diagnóstico de conformidad.

### PanLex

[PanLex](https://panlex.org/) desarrolla una base léxica panlingüe orientada a relaciones de traducción entre miles de lenguas y conserva procedencia por fuente.

**Estado:** se revisó su documentación de adquisición y licenciamiento. Como las páginas públicas consultadas no ofrecen una lectura suficientemente inequívoca para decidir por nuestra cuenta la compatibilidad con CC BY-NC-SA 4.0, el 11 de agosto de 2026 se solicitó aclaración expresa a PanLex. No se transferirán datos antes de resolver licencia, atribución, procedencia y gobernanza.

### Awesome Low Resource Languages

[RichardLitt/low-resource-languages](https://github.com/RichardLitt/low-resource-languages) mantiene una lista curada de herramientas y recursos para lenguas con baja representación digital y acepta propuestas mediante issues y pull requests.

**Estado:** se preparó una propuesta de incorporación de Rarámuri Digital y se verificó que la lista no contiene actualmente una entrada Rarámuri/Tarahumara. La integración de GitHub disponible en este proyecto no tiene permiso de escritura sobre ese repositorio externo y devolvió `403`; por ello la propuesta no se registra como enviada hasta que pueda publicarse efectivamente.

### GiellaLT y Divvun

[GiellaLT](https://github.com/giellalt) y [Divvun](https://github.com/divvun) muestran una trayectoria de largo plazo desde recursos léxicos hacia analizadores morfológicos, correctores, teclados y otras tecnologías lingüísticas de producción.

**Conexión de largo plazo:** sirven como horizonte arquitectónico, no como lista inmediata de funcionalidades. Rarámuri Digital debe consolidar primero datos revisables, normalización documentada, participación de hablantes y reutilización externa antes de intentar herramientas normativas o morfológicas complejas.

## Matriz de interoperabilidad prioritaria

| Ecosistema | Estado actual | Próximo hito |
|---|---|---|
| Dictionaria / CLDF | Generador y CI implementados; consulta enviada | Revisión técnica externa y posterior release CLDF versionado |
| Elotl / Py-Elotl | Ejemplo Python/API implementado; consulta enviada | Definir si conviene loader/adaptador |
| AmericasNLP | Consulta enviada | Identificar un derivado computacional acotado y metodológicamente defendible |
| MayanV | Consulta enviada | Precisar usos léxicos complementarios a MT |
| Living Dictionaries | Gobernanza multimedia implementada; consulta enviada | Diseñar piloto con hablantes antes de cualquier integración |
| TEI Lex-0 | Exportación existente; validación oficial en implementación | Corregir conformidad y referencia de esquema si procede |
| Lexibank / Concepticon | Consulta enviada; piloto manual planificado | Evaluar 30–50 sentidos de alta transparencia |
| PanLex | Licencia/procedencia revisadas; aclaración solicitada | Decidir enlace, registro o no integración según respuesta |
| Awesome Low Resource Languages | Propuesta preparada; envío externo bloqueado por permisos | Publicar issue/PR cuando exista una vía autorizada |
| GiellaLT / Divvun | Referentes de largo plazo | Reconsiderar tras madurez lingüística y comunitaria |

## Principios para colaboración externa

1. No presentar a Rarámuri Digital como lingüísticamente validado cuando esa validación no existe.
2. No transferir datos a una plataforma externa solo para aumentar visibilidad.
3. Mantener DOI, identificadores de entrada, atribución y procedencia en cualquier derivación.
4. Revisar compatibilidad de licencias antes de crear copias o datasets derivados.
5. Separar interoperabilidad técnica de autoridad lingüística y cultural.
6. Favorecer contribuciones que regresen mejoras al recurso y puedan auditarse públicamente.
7. Preferir preguntas técnicas concretas y aportes útiles frente a mensajes genéricos de promoción.

## Invitación

Se reciben propuestas técnicas o académicas sobre interoperabilidad, validación de formatos, mapeo de metadatos, CLDF, TEI Lex-0, APIs, preservación y modelos responsables de colaboración con comunidades lingüísticas. Las propuestas pueden abrirse como issues en este repositorio siempre que no incluyan materiales culturales restringidos ni datos personales.

**Responsable:** Fernando Sandoval Gutierrez · [ORCID 0000-0002-3168-6725](https://orcid.org/0000-0002-3168-6725)
