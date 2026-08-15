# Ficha del conjunto de datos — Rarámuri Digital 1.0.0

Documento basado en el modelo *Datasheets for Datasets*. Describe el conjunto publicado; no certifica su validación lingüística.

## Motivación

- **Objetivo:** estructurar y publicar datos lexicográficos rarámuri–español para investigación, humanidades digitales, enseñanza y desarrollo de aplicaciones.
- **Responsable:** Dr. Fernando Sandoval Gutierrez, coordinación académica y técnica.
- **Instituciones:** Universidad CEEES, Universidad Autónoma de Ciudad Juárez y Cuerpo Académico UACJ-113, Estudios sobre Prácticas Educativas e Interculturalidad.
- **Población beneficiaria prevista:** comunidades y personas hablantes de rarámuri, especialistas en lingüística, educación intercultural, lexicografía, documentación y tecnologías del lenguaje.

## Composición

- **Unidad canónica:** entrada lexicográfica identificada mediante `RD-######`.
- **Volumen:** 2,581 entradas procedentes de 85 páginas de la representación estructurada de trabajo `SRC-02`.
- **Contenido:** lema, forma fuente, forma normalizada, número de homónimo, clasificación, familia gramatical, traducción, acepciones, ejemplos, variantes, comentarios y procedencia.
- **Productos:** 30 conjuntos derivados, incluidos corpus, inventarios, índices, tesauro, ontología inicial, recursos docentes y matriz de trazabilidad.
- **Lenguas:** rarámuri/tarahumara (`tar`) como lengua objeto y español (`es`) como lengua de traducción y trabajo.
- **Formatos de publicación:** XML, JSON, CSV, SQL para SQLite, TEI Lex-0, CLDF y OpenAPI 3.1.
- **Datos personales:** no se pretende incluir información personal identificable. Las entradas corresponden a materiales lexicográficos publicados o representaciones de trabajo derivadas de ellos.

## Fuentes

Rarámuri Digital distingue entre **fuente bibliográfica/facsímil de referencia** y **representación estructurada usada por el pipeline de extracción**.

| Código | Documento | Función | Cobertura / estado |
|---|---|---|---|
| `SRC-01` | K. Simón Hilton, *Diccionario tarahumara de Samachique, Chihuahua, México* (1993) | Fuente bibliográfica y facsímil de cotejo | Edición especial corregida y actualizada; viii + 146 páginas; aprox. 2,500 entradas |
| `SRC-02` | `DICCIONARIO raramuri.pdf` | Fuente estructurada de trabajo consumida por el pipeline | Páginas PDF 3–87; 2,581 entradas; identidad exacta de edición mantenida separada hasta su verificación documental |

El archivo de SIL México identifica la obra de 1993 como una edición especial corregida y actualizada compilada por Kenneth S. Hilton y otras personas, con viii + 146 páginas y aproximadamente 2,500 entradas. WALS la registra como referencia para tarahumara central.

La genealogía bibliográfica incluye además:

- **`REF-1959`:** *Tarahumara y español* (1959), compilado por Kenneth Simon Hilton, con Ramón López B. y Emiliano Carrasco T. como colaboradores, conservado por El Colegio de México.
- **`REF-2016`:** Wes Shoemaker, *Diccionario tarahumara actualizado* (2016), descrito por SIL México como actualización de VIMSA 101 (1993) con cambios ortográficos recientes; estado Draft, sin revisión por pares.

El hecho de que `SRC-01` sea la referencia bibliográfica central **no autoriza a identificar automáticamente `SRC-02` con Hilton 1993**. El pipeline vigente registra explícitamente `SRC-02` como fuente de producción. La identidad edición-a-edición del PDF de trabajo debe fijarse mediante evidencia documental antes de afirmar equivalencia.

Los facsímiles y textos fuente no se redistribuyen en este repositorio y conservan sus derechos propios.

Documentación ampliada: [`SOURCES.md`](SOURCES.md) · [`PROVENANCE.md`](PROVENANCE.md) · [`docs/HILTON_SOURCE.md`](docs/HILTON_SOURCE.md).

## Procesamiento

1. Extracción de filas lexicográficas desde `SRC-02`.
2. Conservación de la forma documental en `headword_raw`.
3. Normalización conservadora para búsqueda en `headword_normalized`.
4. Separación de acepciones, ejemplos y variantes cuando existe evidencia explícita.
5. Asignación secuencial de identificadores persistentes.
6. Registro de fuente, documento, página inicial, página final y estado de transcripción.
7. Derivación reproducible de productos mediante reglas documentadas en código.
8. Generación de formatos interoperables, manifiesto y sumas SHA-256.
9. Validación automatizada de CLDF, TEI Lex-0, determinismo de capas y otras invariantes técnicas mediante CI.

No se corrigen silenciosamente las formas rarámuri ni el español regional de la fuente. Las inferencias automáticas se distinguen de las anotaciones explícitas mediante método y estado de validación.

## Calidad y validación

- La publicación está **autorizada para difusión**.
- La **validación lingüística está pendiente**.
- La publicación técnica y la superación de pruebas automatizadas **no equivalen a validación comunitaria**.
- Las pruebas automatizadas verifican conteos, identificadores, páginas, exportaciones, trazabilidad, interoperabilidad y sumas de comprobación.
- El [informe de calidad](QUALITY_REPORT.md) cuantifica completitud e integridad.
- Una corrección no debe sustituir el registro fuente: debe conservar identificador, procedencia, versión y justificación.

## Usos previstos

- Consulta lexicográfica y terminológica.
- Lingüística de corpus y análisis documental.
- Estudios de historia lexicográfica y genealogía editorial, con crítica de fuente.
- Preparación de materiales educativos sujetos a revisión comunitaria y pedagógica.
- Desarrollo de aplicaciones web, móviles y servicios de datos.
- Investigación sobre variación gráfica, morfología, semántica y traducción.
- Comparación controlada con fuentes históricas de [Rarámuri Histórico Digital](https://github.com/fersandovalgtz/raramuri-historico), manteniendo relaciones diacrónicas como hipótesis tipadas y revisables.

## Usos fuera de alcance o que requieren precaución

- No debe tratarse como norma ortográfica oficial.
- No es una muestra equilibrada ni exhaustiva de todas las variedades rarámuri.
- La cobertura documental de Samachique/tarahumara central no debe generalizarse automáticamente a otras variedades.
- No debe utilizarse para atribuir identidad, competencia, ubicación o conducta a personas o comunidades.
- Las categorías y relaciones derivadas no deben presentarse como decisiones comunitarias sin validación.
- Los materiales docentes requieren revisión de hablantes, especialistas y responsables educativos.
- La licencia abierta no elimina derechos colectivos, obligaciones de atribución ni restricciones aplicables a materiales de terceros.
- No debe citarse el dataset como sustituto de Hilton 1993 cuando una afirmación dependa directamente de la evidencia de esa obra.

## Distribución y mantenimiento

- **Sitio:** <https://raramuri.ceees.mx>
- **Repositorio:** <https://github.com/fersandovalgtz/raramuri-digital>
- **Depósito y DOI:** <https://doi.org/10.5281/zenodo.21483353>
- **Licencia de datos/documentación original:** CC BY-NC-SA 4.0, con exclusiones documentadas.
- **Código:** MIT.
- **Contacto:** <fernando.sandoval@uacj.mx>
- **Versiones:** datos 1.0.0; plataforma 3.1.0.
- **Correcciones:** mediante incidencias de GitHub o contacto con el responsable, conforme a `CONTRIBUTING.md` y `GOVERNANCE.md`.
- **Ecosistema:** [`docs/ECOSYSTEM.md`](docs/ECOSYSTEM.md).

## Limitaciones conocidas

- 163 entradas carecen de clasificación exacta y se conservan como `Sin clasificar` en la familia derivada.
- Dos entradas carecen de traducción en la fuente estructurada.
- La segmentación automática de ejemplos rarámuri–español produce pares con diferentes niveles de confianza.
- Las variantes gráficas candidatas, campos semánticos, niveles didácticos y relaciones ontológicas requieren revisión especializada.
- El cotejo sistemático contra `SRC-01` y la validación por personas hablantes están pendientes.
- La identidad bibliográfica exacta y relación edición-a-edición de `SRC-02` debe fijarse documentalmente; el repositorio no la infiere del nombre del archivo.

## Política de citación de evidencia

Cuando un resultado dependa de una forma, glosa, ejemplo o clasificación atribuible a Hilton, debe citarse **Hilton 1993 y, cuando sea posible, la página**. Cuando dependa de una representación, normalización, API o transformación de Rarámuri Digital, debe citarse además **la versión específica del dataset y el identificador `RD-######` cuando corresponda**.

Esta política de citación doble separa la responsabilidad documental de la fuente de la responsabilidad editorial y computacional del proyecto.