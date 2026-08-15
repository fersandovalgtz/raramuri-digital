# Kenneth Simon Hilton y el *Diccionario tarahumara de Samachique*: expediente documental

## Propósito

Este documento describe la principal referencia lexicográfica histórica asociada con **Rarámuri Digital** y fija una distinción metodológica indispensable entre cinco objetos que no deben confundirse:

1. la trayectoria documental de los trabajos lexicográficos de Kenneth Simon Hilton sobre el tarahumara de Samachique;
2. el antecedente bibliográfico de 1959, *Tarahumara y español*;
3. la edición especial corregida y actualizada de 1993, *Diccionario tarahumara de Samachique, Chihuahua, México*;
4. el manuscrito actualizado por Wes Shoemaker en 2016;
5. las fuentes de trabajo, transformaciones computacionales y productos digitales creados por Rarámuri Digital en 2026.

Rarámuri Digital no atribuye a Hilton la autoría de sus transformaciones digitales, ni presenta sus datos derivados como reproducción facsimilar de una edición impresa. La fuente documental, la representación de trabajo y el dataset son objetos distintos y deben conservar identificadores, responsabilidades y estados de validación separados.

## 1. Kenneth Simon Hilton: perfil documental verificable

Los catálogos y repertorios consultados registran al compilador bajo formas como **Kenneth Simon Hilton**, **Kenneth S. Hilton** y **K. Simón Hilton**. Para evitar una biografía especulativa, este repositorio limita su descripción personal a lo que puede sostenerse mediante registros bibliográficos y de archivo verificables.

La documentación pública localizada permite identificar una trayectoria lexicográfica de varias décadas vinculada con el tarahumara de Samachique. El registro de El Colegio de México conserva *Tarahumara y español* (1959), compilado por Kenneth Simon Hilton con Ramón López B. y Emiliano Carrasco T. como colaboradores. La edición de 1993 aparece en el archivo de SIL México como una «edición especial corregida y actualizada», compilada por Kenneth S. Hilton y otras personas. El repertorio WALS la cita bajo la forma «Hilton, K. Simón» y la utiliza como referencia para tarahumara central.

La evidencia disponible es considerablemente más sólida para reconstruir **su producción bibliográfica** que para establecer con precisión datos biográficos como fechas de nacimiento y muerte, formación o una cronología institucional completa. Mientras esos datos no estén sustentados por una fuente de autoridad fiable, Rarámuri Digital no los afirmará.

## 2. Antecedente: *Tarahumara y español* (1959)

El catálogo digital de El Colegio de México registra:

> Hilton, Kenneth Simon (comp.). 1959. *Tarahumara y español*. México, D. F. Serie de vocabularios indígenas Mariano Silva y Aceves, núm. 1. Colaboradores: Ramón López B. y Emiliano Carrasco T.

Este registro es relevante porque muestra que la edición de 1993 no surgió como un objeto aislado. Existe una genealogía editorial previa dentro de la misma tradición de vocabularios del Instituto Lingüístico de Verano.

La relación exacta entre las entradas de 1959 y las de 1993 debe estudiarse mediante cotejo documental, no suponerse a partir del título o de la continuidad institucional. En consecuencia, Rarámuri Digital trata la obra de 1959 como **antecedente bibliográfico y objeto potencial de comparación**, no como fuente de producción del dataset vigente.

Registro persistente: <https://hdl.handle.net/20.500.11986/COLMEX/10049271>

## 3. Edición de referencia: *Diccionario tarahumara de Samachique* (1993)

El archivo de SIL México describe la obra de 1993 con los siguientes datos:

- **Título:** *Diccionario tarahumara de Samachique, Chihuahua, México*.
- **Título alternativo:** *Central Tarahumara Dictionary, Samachique, Chihuahua, Mexico*.
- **Responsabilidad:** Kenneth S. Hilton y otras personas, compiladores.
- **Edición:** edición especial corregida y actualizada.
- **Editorial:** Instituto Lingüístico de Verano.
- **Serie:** Serie de vocabularios y diccionarios indígenas «Mariano Silva y Aceves».
- **Año:** 1993.
- **Extensión:** viii + 146 páginas.
- **Volumen aproximado:** 2,500 entradas.
- **Lengua objeto:** tarahumara central (`tar`).

El repertorio WALS registra bibliográficamente la misma obra como Hilton, K. Simón (1993), *Diccionario Tarahumara de Samachique, Chihuahua, México*, y la utiliza como fuente para datos tipológicos de tarahumara central.

Archivo de SIL México: <https://mexico.sil.org/es/resources/archives/10966>  
WALS: <https://wals.info/refdb/record/Hilton-1993>

### Microestructura y contenido

Según la descripción archivística de SIL México, el diccionario es bilingüe y comprende secciones **tarahumara–español** y **español–tarahumara**. Sus entradas pueden contener categorías gramaticales, varias acepciones, formas derivadas y ejemplos; además incorpora notas gramaticales y listas semánticas.

Esta riqueza importa para el modelo de datos: una entrada no debe reducirse automáticamente a un par `lema = traducción`. La clasificación gramatical, las acepciones, las variantes, los ejemplos y los comentarios constituyen capas documentales diferenciables.

## 4. Samachique y el alcance lingüístico de la fuente

La obra se presenta explícitamente como un diccionario del **tarahumara de Samachique** y los registros lingüísticos internacionales la relacionan con **Central Tarahumara [tar]**. Por ello, Rarámuri Digital evita generalizar automáticamente sus formas a todas las variedades rarámuri.

La cobertura geográfica y lingüística de una fuente lexicográfica no equivale a una norma general de la lengua. Las formas documentadas deben conservar su procedencia y, cuando sea necesario, contrastarse con documentación de otras variedades y con conocimiento de personas hablantes.

## 5. Actualización de 2016: Wes Shoemaker

SIL México conserva además el *Diccionario tarahumara actualizado*, preparado por **Wes Shoemaker** en 2016. El registro lo describe como una versión actualizada del diccionario VIMSA 101 de 1993 con cambios ortográficos recientes.

El documento tiene 95 páginas y aproximadamente 2,500 entradas. Su estado archivístico es **Draft**, publicado «as is» y sin revisión por pares. Por ello, Rarámuri Digital lo trata como un testimonio posterior relevante para estudiar actualización ortográfica y genealogía editorial, pero no como una autoridad que deba sustituir automáticamente las formas de 1993.

Archivo: <https://mexico.sil.org/es/resources/archives/68110>

## 6. Cómo se relaciona Hilton 1993 con Rarámuri Digital

La documentación del proyecto distingue actualmente:

- **`SRC-01` — Hilton 1993:** fuente bibliográfica y facsímil de referencia para cotejo.
- **`SRC-02` — `DICCIONARIO raramuri.pdf`:** representación estructurada de trabajo de la que el pipeline de extracción obtiene las entradas del dataset vigente; la extracción cubre las páginas PDF 3–87.

Esta distinción es deliberada. El script [`scripts/extract_lexicon.py`](../scripts/extract_lexicon.py) asigna `source_code = SRC-02`, conserva el nombre del documento de trabajo y registra `page_start` y `page_end` para cada entrada. Por tanto, **el dataset 1.0.0 no debe describirse como una transcripción directa de Hilton 1993 mientras la identidad bibliográfica exacta de `SRC-02` no haya sido fijada y demostrada documentalmente**.

La relación entre `SRC-01` y `SRC-02` debe establecerse mediante cotejo de edición, contenido, paginación y, cuando sea jurídicamente posible, huellas criptográficas del archivo de trabajo. La nomenclatura completa y los estados de verificación se mantienen en [`SOURCES.md`](../SOURCES.md) y [`PROVENANCE.md`](../PROVENANCE.md).

## 7. Crítica de fuente

Rarámuri Digital adopta una lectura documental, no normativa, del diccionario. Esto implica:

- conservar la forma registrada por la fuente antes de cualquier normalización;
- distinguir forma documental y forma normalizada de búsqueda;
- no convertir una categoría editorial de Hilton en una categoría lingüística contemporánea sin evaluación;
- no extrapolar automáticamente Samachique al conjunto de variedades rarámuri;
- no sustituir revisión lingüística y comunitaria por autoridad bibliográfica o por procesamiento computacional;
- mantener las decisiones, inferencias y productos derivados en capas trazables.

El valor histórico y lingüístico del diccionario no elimina la necesidad de estudiar las condiciones de producción del conocimiento, las prácticas editoriales del periodo ni la participación de colaboradores. La genealogía de 1959 demuestra, además, que la historia documental del recurso es colectiva y no debe reducirse a un único nombre de autor.

## 8. Derechos y redistribución

La presencia de una referencia bibliográfica o el uso de una fuente para cotejo no transfieren a Rarámuri Digital derechos sobre obras de terceros. El proyecto aplica licencias separadas a su código, datos derivados y documentación original; los facsímiles y textos fuente conservan su estatus jurídico propio.

El repositorio no debe incorporar una copia completa de Hilton 1993 o de Shoemaker 2016 bajo la licencia del dataset salvo que exista una base jurídica explícita para hacerlo. Los enlaces a archivos externos se ofrecen con fines de procedencia y verificabilidad.

## 9. Política de citación doble

Cuando un argumento dependa de una forma, glosa, ejemplo o clasificación atribuible a la **obra de Hilton**, debe citarse la fuente bibliográfica correspondiente y, cuando sea posible, la página.

Cuando el argumento dependa de un registro estructurado, normalización, producto derivado, API o transformación de **Rarámuri Digital**, debe citarse además la versión específica del dataset mediante su DOI.

Ejemplo conceptual:

> Hilton 1993, p. X → evidencia documental.  
> Rarámuri Digital 1.0.0, `RD-######` → representación digital versionada.

Esta doble citación mantiene separadas la responsabilidad histórica de la fuente y la responsabilidad editorial/computacional del proyecto.

## 10. Referencias verificadas

### Fuente de referencia

- Hilton, K. Simón. 1993. *Diccionario Tarahumara de Samachique, Chihuahua, México*. Instituto Lingüístico de Verano. Archivo SIL México 10966: <https://mexico.sil.org/es/resources/archives/10966>.
- WALS Online. «Hilton 1993»: <https://wals.info/refdb/record/Hilton-1993>.

### Antecedente

- Hilton, Kenneth Simon (comp.). 1959. *Tarahumara y español*. México, D. F. Serie de vocabularios indígenas Mariano Silva y Aceves, núm. 1. Colaboradores: Ramón López B. y Emiliano Carrasco T. El Colegio de México: <https://hdl.handle.net/20.500.11986/COLMEX/10049271>.

### Testimonio posterior

- Shoemaker, Wes. 2016. *Diccionario tarahumara actualizado*. Manuscrito, borrador. SIL México 68110: <https://mexico.sil.org/es/resources/archives/68110>.

### Dataset digital

- Sandoval Gutierrez, Fernando. 2026. *Rarámuri Digital: conjunto de datos lexicográficos rarámuri–español*, versión 1.0.0. Zenodo. <https://doi.org/10.5281/zenodo.21483353>.

La bibliografía estructurada correspondiente se mantiene en [`references.bib`](../references.bib).