# Registro de cambios

El proyecto utiliza versionamiento semántico independiente para la plataforma y el conjunto de datos.

## Próxima publicación

### Procedencia, fuentes y ciencia abierta

- Incorporación de un expediente documental específico para Kenneth Simon Hilton y el *Diccionario tarahumara de Samachique* de 1993.
- Ampliación del expediente de Hilton con producción verificable desde 1947, el artículo sobre tarahumara y guarijío, la genealogía 1947–1959–1993–2016 y preguntas de investigación abiertas.
- Corrección de la extensión bibliográfica de Hilton 1993 a `viii + 146 páginas`, conforme al registro archivístico de SIL México.
- Incorporación de ISBN `9789683102713`, OCLC `29182275`, serie 101 y clasificación documental contrastada con Glottolog y Google Books.
- Registro canónico de fuentes con separación explícita entre `SRC-01` (Hilton 1993, referencia/cotejo) y `SRC-02` (representación estructurada de trabajo consumida por el pipeline).
- Documentación explícita de atribuciones primarias y secundarias de colaboración para no convertir una referencia bibliográfica plausible en un hecho no cotejado.
- Nueva política de citación doble: fuente documental + objeto digital versionado cuando corresponda.
- Incorporación de `PROVENANCE.md` para documentar la cadena fuente → extracción → dataset → productos → release.
- Incorporación de `SCIENTIFIC_REPOSITORY_STANDARD.md` como matriz auditable de prácticas científicas y deuda documental visible.
- Bibliografía estructurada en `references.bib`, incluida la publicación de Hilton de 1947.
- Sincronización de `CITATION.cff`, CodeMeta y metadatos internos con fuente, procedencia y descubribilidad.
- Endurecimiento de `CONTRIBUTING.md` para exigir evidencia, códigos de fuente y estado de revisión en correcciones científicas.
- Conversión de `RELEASE_CHECKLIST.md` en una puerta formal de publicación para fuente, procedencia, metadatos, validación, licencias, preservación y ecosistema.

### Ecosistema y descubribilidad

- Nuevo mapa del ecosistema científico con enlaces a Rarámuri Histórico Digital, Rarámuri · recursos educativos, Libro de Texto Mexicano Digital, Historia de la educación en Chihuahua y Recursos educativos abiertos.
- Integración explícita con ORCID, Google Scholar, CATHI-UACJ, ResearchGate, ResearchID, Academia.edu y el perfil científico de GitHub.
- Documentación del principio de que redes, sitios y perfiles son capas de descubrimiento y no sustituyen DOI, release, procedencia o fuente de verdad.
- README en español e inglés alineados con la nueva arquitectura científica.
- Ampliación de `/documentacion` para exponer en el sitio público la fuente Hilton, `SRC-01`/`SRC-02`, procedencia, estándar científico, ecosistema y política de citación doble.
- Enriquecimiento de JSON-LD `Dataset` con versión, fecha, fuente, ISBN, DOI, GitHub, Zenodo, Software Heritage, perfiles académicos, formatos de descarga y citaciones relacionadas.
- Incorporación de `sitemap.xml` generado por Next.js y `robots.txt` con referencia explícita al sitemap para mejorar descubribilidad de las páginas científicas.

### Accesibilidad y consulta

- Generador reproducible de una edición PDF completa derivada de la base maestra.
- Secciones alfabéticas independientes y paquete ZIP para consulta, impresión y uso docente.
- Manifiesto PDF con conteos, tamaños y sumas SHA-256.
- Publicación automatizada de los productos en el release móvil `pdf-latest`.
- Documentación explícita de que los PDF son productos derivados y no sustituyen la base estructurada.

### Control de calidad

- Prueba de determinismo binario del PDF en integración continua.
- Verificación de estructura mediante `pdfinfo` y fuente Unicode embebida.
- Conservación del estado de publicación, validación lingüística, licencia y procedencia en cada edición.
- Corrección de badges de dependencias del README para mantenerlos sincronizados con `package.json`.

## Plataforma 3.1.0 / Datos 1.0.0 — 2026-07-21

### Datos

- Publicación de 2,581 entradas lexicográficas con trazabilidad por fuente y página.
- Materialización de 30 productos derivados.
- Exportaciones XML, JSON, CSV, SQL y TEI Lex-0.
- Especificación OpenAPI 3.1 y API pública.
- Manifiesto con conteos, tamaños y SHA-256.

### Documentación y calidad

- Ficha del conjunto de datos en español e inglés.
- Esquema de datos, gobernanza y protocolo de contribuciones.
- Informe reproducible de calidad estructural y documental.
- Metadatos centralizados y distinción explícita entre versión de plataforma y de datos.
- Depósito citable en Zenodo con DOI `10.5281/zenodo.21483353`.
- Flujo automatizado de validación y plantilla de corrección de datos.

### Estado

- Difusión autorizada.
- Validación lingüística pendiente.