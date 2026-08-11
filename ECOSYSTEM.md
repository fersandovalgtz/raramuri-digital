# Ecosistema, interoperabilidad y colaboración

Rarámuri Digital no pretende funcionar como una infraestructura aislada. Esta página documenta proyectos, estándares y comunidades con los que comparte problemas científicos o técnicos y señala rutas concretas de interoperabilidad. La inclusión en esta lista no implica afiliación, aprobación recíproca ni transferencia automática de datos.

## Punto de partida

**Rarámuri Digital** publica un recurso lexicográfico rarámuri–español (ISO 639-3 `tar`) con 2,581 entradas y 30 productos derivados. La infraestructura combina API pública, exportaciones CSV/JSON/XML/SQL, TEI Lex-0, OpenAPI 3.1, DOI, CodeMeta, Citation File Format, manifiestos SHA-256, preservación en Zenodo y Software Heritage y documentación explícita de procedencia y gobernanza lingüística.

La publicación técnica no se presenta como equivalente a autoridad lingüística. La validación lingüística comunitaria más amplia permanece documentada como pendiente y cualquier interoperabilidad futura debe conservar esa distinción.

## Proyectos y comunidades relacionados

### Dictionaria y CLDF

[Dictionaria](https://dictionaria.clld.org/) publica diccionarios como datasets estructurados y versionados, con repositorios GitHub y releases archivados en Zenodo. Un ejemplo especialmente cercano es el [Iquito dictionary](https://github.com/dictionaria/iquito), un diccionario de una lengua indígena amazónica que publica sus datos subyacentes como **CLDF Dictionary**.

**Conexión posible:** producir una exportación CLDF Dictionary o CLDF Wordlist de Rarámuri Digital sin sustituir TEI Lex-0. CLDF ampliaría la interoperabilidad con herramientas de lingüística comparativa y repositorios del ecosistema Glottobank.

### Lexibank

[Lexibank](https://github.com/lexibank) es una colección curada de datasets léxicos que utiliza CLDF Wordlists y `pylexibank` para procesamiento reproducible. Sus datasets suelen vincular formas con Glottolog, conceptos con Concepticon y releases con Zenodo.

**Conexión posible:** preparar un subconjunto o una representación CLDF de Rarámuri Digital y consultar a los mantenedores sobre condiciones de incorporación o enlace, especialmente por la licencia actual CC BY-NC-SA 4.0 y la necesidad de preservar procedencia y gobernanza.

### Living Dictionaries

[Living Dictionaries](https://livingdictionaries.app/) es una plataforma de Living Tongues Institute para lenguas subrepresentadas y en riesgo. Integra edición colaborativa, audio, imágenes, video, ejemplos, dominios semánticos, importación/exportación y API.

**Conexión posible:** intercambio de experiencia sobre API, multimedia, revisión comunitaria, variantes y gobernanza. No se propone importar automáticamente Rarámuri Digital a otra plataforma ni otorgar derechos adicionales sobre sus datos; cualquier integración requeriría revisar licencias, consentimiento y control comunitario.

### Mother Tongues Dictionaries

[Mother Tongues Dictionaries](https://mothertongues.org/) es una infraestructura abierta y adaptable para diccionarios de lenguas indígenas y amenazadas, con búsqueda aproximada, funcionamiento web/móvil y soporte para despliegues comunitarios.

**Conexión posible:** comparar modelos de búsqueda, funcionamiento offline, adaptación para variantes ortográficas y empaquetado de un frontend pedagógico que consuma la API de Rarámuri Digital sin duplicar la fuente de verdad lexicográfica.

### TEI Lex-0

[TEI Lex-0](https://lex-0.org/) ofrece recomendaciones comunitarias para codificar diccionarios legibles por máquina de forma estable e interoperable. Rarámuri Digital ya publica una exportación TEI Lex-0.

**Conexión posible:** convertir la implementación rarámuri en un caso de uso documentado, validar sistemáticamente la exportación contra los esquemas oficiales y compartir problemas específicos encontrados al representar fuentes, variantes, ejemplos y acepciones.

### PanLex

[PanLex](https://panlex.org/) desarrolla una base léxica panlingüe orientada a relaciones de traducción entre miles de lenguas y mantiene herramientas abiertas en [longnow/panlex-tools](https://github.com/longnow/panlex-tools).

**Conexión posible:** evaluar correspondencias de identificadores lingüísticos y posibilidades de enlace semántico, sin transferir datos mientras no exista claridad sobre compatibilidad de licencias, atribución, procedencia y gobernanza.

### Awesome Low Resource Languages

[RichardLitt/low-resource-languages](https://github.com/RichardLitt/low-resource-languages) mantiene una lista curada de herramientas y recursos para lenguas con baja representación digital y acepta propuestas mediante issues y pull requests.

**Conexión inmediata:** proponer la inclusión de Rarámuri Digital como infraestructura lexicográfica de una lengua indígena del norte de México. Este es el mecanismo de visibilidad externa de menor fricción.

## Matriz de interoperabilidad prioritaria

| Ecosistema | Afinidad | Trabajo previo requerido | Resultado esperado |
|---|---|---|---|
| Awesome Low Resource Languages | Muy alta | Ninguno | Descubribilidad y enlace externo |
| TEI Lex-0 | Muy alta | Validación formal del XML | Caso de uso / retroalimentación al estándar |
| Dictionaria / CLDF | Muy alta | Exportación CLDF | Interoperabilidad con diccionarios científicos |
| Lexibank | Alta | CLDF + mapeo Glottolog/Concepticon + revisión de licencia | Dataset enlazable/comparable |
| Living Dictionaries | Alta | Definir alcance de colaboración | Intercambio sobre comunidad, multimedia y API |
| Mother Tongues Dictionaries | Alta | Adaptador o prototipo de consumo de API | Frontend/offline y búsqueda aproximada |
| PanLex | Media-alta | Revisión de licencia y mapeo | Enlace hacia ecosistema panlingüe |

## Siguiente objeto técnico: CLDF

El salto de interoperabilidad con mayor retorno científico es añadir una representación **CLDF**. TEI Lex-0 y CLDF no son sustitutos: TEI Lex-0 conserva una representación lexicográfica rica y XML; CLDF facilita análisis tabular, vinculación con Glottolog/Concepticon y reutilización por herramientas comparativas.

Una primera exportación debería preservar al menos `ID`, `Language_ID`, `Parameter_ID`, `Form`, `Source`, `Comment` y campos de procedencia propios del proyecto. Antes de asignar conceptos de Concepticon o una variante lingüística a un Glottocode se debe verificar manualmente la correspondencia; no se inferirán identificadores externos por semejanza automática.

## Principios para colaboración externa

1. No presentar a Rarámuri Digital como lingüísticamente validado cuando esa validación no existe.
2. No transferir datos a una plataforma externa solo para aumentar visibilidad.
3. Mantener DOI, identificadores de entrada, atribución y procedencia en cualquier derivación.
4. Revisar compatibilidad de licencias antes de crear copias o datasets derivados.
5. Separar interoperabilidad técnica de autoridad lingüística y cultural.
6. Favorecer contribuciones que regresen mejoras al recurso y puedan auditarse públicamente.

## Invitación

Se reciben propuestas técnicas o académicas sobre interoperabilidad, validación de formatos, mapeo de metadatos, CLDF, TEI Lex-0, APIs, preservación y modelos responsables de colaboración con comunidades lingüísticas. Las propuestas pueden abrirse como issues en este repositorio siempre que no incluyan materiales culturales restringidos ni datos personales.

**Responsable:** Fernando Sandoval Gutierrez · [ORCID 0000-0002-3168-6725](https://orcid.org/0000-0002-3168-6725)
