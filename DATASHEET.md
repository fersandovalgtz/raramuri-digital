# Ficha del conjunto de datos — Rarámuri Digital 1.0.0

Documento basado en el modelo *Datasheets for Datasets*. Describe el conjunto publicado; no certifica su validación lingüística.

## Motivación

- **Objetivo:** estructurar y publicar datos lexicográficos rarámuri–español para investigación, humanidades digitales, enseñanza y desarrollo de aplicaciones.
- **Responsable:** Dr. Fernando Sandoval Gutiérrez, coordinación académica y técnica.
- **Instituciones:** Universidad CEEES, Universidad Autónoma de Ciudad Juárez y Cuerpo Académico UACJ-113, Estudios sobre Prácticas Educativas e Interculturalidad.
- **Población beneficiaria prevista:** comunidades y personas hablantes de rarámuri, especialistas en lingüística, educación intercultural, lexicografía, documentación y tecnologías del lenguaje.

## Composición

- **Unidad canónica:** entrada lexicográfica identificada mediante `RD-######`.
- **Volumen:** 2,581 entradas procedentes de 85 páginas de la sección rarámuri–español estructurada.
- **Contenido:** lema, forma fuente, forma normalizada, número de homónimo, clasificación, familia gramatical, traducción, acepciones, ejemplos, variantes, comentarios y procedencia.
- **Productos:** 30 conjuntos derivados, incluidos corpus, inventarios, índices, tesauro, ontología inicial, recursos docentes y matriz de trazabilidad.
- **Lenguas:** rarámuri/tarahumara (`tar`) como lengua objeto y español (`es`) como lengua de traducción y trabajo.
- **Formatos de publicación:** XML, JSON, CSV, SQL para SQLite, TEI Lex-0 y OpenAPI 3.1.
- **Datos personales:** no se pretende incluir información personal identificable. Las entradas corresponden a materiales lexicográficos publicados.

## Fuentes

| Código | Documento | Función | Cobertura utilizada |
|---|---|---|---|
| `SRC-01` | K. Simón Hilton, *Diccionario tarahumara de Samachique* (1993) | Facsímil de cotejo | Obra de 156 páginas |
| `SRC-02` | *DICCIONARIO raramuri.pdf* | Fuente textual estructurada | Páginas PDF 3–87; 2,581 entradas |

Los facsímiles y textos fuente no se redistribuyen en este repositorio y conservan sus derechos propios.

## Procesamiento

1. Extracción de filas lexicográficas desde `SRC-02`.
2. Conservación de la forma documental en `headword_raw`.
3. Normalización conservadora para búsqueda en `headword_normalized`.
4. Separación de acepciones, ejemplos y variantes cuando existe evidencia explícita.
5. Asignación secuencial de identificadores persistentes.
6. Registro de fuente, documento, página inicial, página final y estado de transcripción.
7. Derivación reproducible de P-02 a P-30 mediante reglas documentadas en código.
8. Generación de formatos interoperables, manifiesto y sumas SHA-256.

No se corrigen silenciosamente las formas rarámuri ni el español regional de la fuente. Las inferencias automáticas se distinguen de las anotaciones explícitas mediante método y estado de validación.

## Calidad y validación

- La publicación está **autorizada para difusión**.
- La **validación lingüística está pendiente**.
- Las pruebas automatizadas verifican conteos, identificadores, páginas, exportaciones, trazabilidad y sumas de comprobación.
- El [informe de calidad](QUALITY_REPORT.md) cuantifica completitud e integridad.
- Una corrección no debe sustituir el registro fuente: debe conservar identificador, procedencia, versión y justificación.

## Usos previstos

- Consulta lexicográfica y terminológica.
- Lingüística de corpus y análisis documental.
- Preparación de materiales educativos sujetos a revisión comunitaria y pedagógica.
- Desarrollo de aplicaciones web, móviles y servicios de datos.
- Investigación sobre variación gráfica, morfología, semántica y traducción.

## Usos fuera de alcance o que requieren precaución

- No debe tratarse como norma ortográfica oficial.
- No es una muestra equilibrada ni exhaustiva de todas las variantes rarámuri.
- No debe utilizarse para atribuir identidad, competencia, ubicación o conducta a personas o comunidades.
- Las categorías y relaciones derivadas no deben presentarse como decisiones comunitarias sin validación.
- Los materiales docentes requieren revisión de hablantes, especialistas y responsables educativos.
- La licencia abierta no elimina derechos colectivos, obligaciones de atribución ni restricciones aplicables a materiales de terceros.

## Distribución y mantenimiento

- **Sitio:** <https://raramuri.ceees.mx>
- **Repositorio:** <https://github.com/fersandovalgtz/raramuri-digital>
- **Depósito y DOI:** <https://doi.org/10.5281/zenodo.21483353>
- **Licencia del proyecto:** CC BY-NC-SA 4.0, con exclusiones documentadas.
- **Contacto:** <fernando.sandoval@uacj.mx>
- **Versiones:** datos 1.0.0; plataforma 3.1.0.
- **Correcciones:** mediante incidencias de GitHub o contacto con el responsable, conforme a `CONTRIBUTING.md` y `GOVERNANCE.md`.

## Limitaciones conocidas

- 163 entradas carecen de clasificación exacta y se conservan como `Sin clasificar` en la familia derivada.
- Dos entradas carecen de traducción en la fuente estructurada.
- La segmentación automática de ejemplos rarámuri–español produce pares con diferentes niveles de confianza.
- Las variantes gráficas candidatas, campos semánticos, niveles didácticos y relaciones ontológicas requieren revisión especializada.
- El cotejo sistemático contra `SRC-01` y la validación por personas hablantes están pendientes.
