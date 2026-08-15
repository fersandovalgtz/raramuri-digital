# Lista de control de publicación

Una release científica sólo debe declararse citable cuando el objeto publicado, su procedencia, metadatos, archivos derivados y estados de validación sean coherentes entre sí.

## Versión y alcance

- [ ] Confirmar versión de plataforma y de datos en `project-metadata.json`.
- [ ] Definir si la publicación modifica datos, plataforma, documentación científica o una combinación de ellos.
- [ ] Confirmar que cualquier cambio sustantivo del contenido científico implica una versión citable nueva cuando corresponda.
- [ ] Comprobar que el estado de publicación, validación lingüística y validación comunitaria no se confundan entre sí.

## Fuente y procedencia

- [ ] Revisar `SOURCES.md` y confirmar que todos los objetos de entrada tienen código, función y estado de identificación explícitos.
- [ ] Revisar `PROVENANCE.md` y confirmar que la cadena fuente → extracción → dataset → producto → release sigue siendo correcta.
- [ ] Si cambia un objeto fuente, registrar su procedencia, edición, extensión, relación con fuentes previas y evidencia de identificación.
- [ ] Si cambia la relación entre `SRC-01` y `SRC-02`, documentar el cotejo y no reescribir silenciosamente la genealogía del dataset.
- [ ] Confirmar que una normalización o inferencia computacional no se presenta como forma documental de la fuente.
- [ ] Revisar `docs/HILTON_SOURCE.md` cuando la release altere una atribución, referencia, interpretación o relación documental con Hilton.
- [ ] Registrar checksums de objetos de trabajo cuando sea jurídicamente admisible y científicamente útil, sin redistribuir materiales de terceros sin autorización.

## Metadatos y citación

- [ ] Sincronizar `CITATION.cff`, `codemeta.json` y `project-metadata.json` con versión, fecha, DOI, responsable, URL y alcance de la release.
- [ ] Revisar `references.bib` si se incorporaron nuevas fuentes, ediciones o autoridades bibliográficas.
- [ ] Confirmar que la cita recomendada del dataset utiliza el DOI de la versión correcta.
- [ ] Confirmar la política de citación doble cuando una afirmación dependa tanto de la fuente histórica como de una transformación de Rarámuri Digital.
- [ ] Revisar que README en español e inglés no contradigan los metadatos estructurados.

## Generación y calidad

- [ ] Regenerar exportaciones con `npm run data:exports`.
- [ ] Regenerar el informe con `npm run data:quality`.
- [ ] Instalar `requirements-pdf.txt` y regenerar las ediciones con `npm run data:pdf`.
- [ ] Revisar `manifest-pdf.json`, abrir la edición completa y comprobar al menos una sección alfabética.
- [ ] Ejecutar `npm run validate`.
- [ ] Confirmar validación CLDF y TEI Lex-0 cuando esos productos formen parte de la release.
- [ ] Revisar `git diff` para detectar cambios no deterministas o artefactos generados inesperados.
- [ ] Confirmar que las exportaciones publicadas corresponden al mismo estado canónico del dataset.
- [ ] Confirmar que los manifiestos y sumas SHA-256 se regeneraron y corresponden a los archivos publicados.

## Gobernanza, licencias y terceros

- [ ] Confirmar licencia y exclusiones de terceros.
- [ ] Verificar que ninguna fuente, facsímil, logotipo o material de terceros haya quedado relicenciado implícitamente.
- [ ] Revisar `GOVERNANCE.md` si la release introduce nuevas categorías, reutilizaciones, datos culturales o mecanismos de contribución.
- [ ] Confirmar que las capas candidatas o no validadas siguen etiquetadas como tales.
- [ ] Registrar personas responsables de revisión documental, técnica, lingüística, cultural o jurídica cuando aplique.

## Publicación y preservación

- [ ] Actualizar `CHANGELOG.md` y las notas de release.
- [ ] Crear etiqueta Git anotada para la versión de datos cuando corresponda.
- [ ] Crear release de GitHub con manifiesto y archivos interoperables.
- [ ] Verificar que el release móvil `pdf-latest` corresponda al commit publicado y contenga PDF completo, ZIP alfabético y manifiesto.
- [ ] Depositar la misma versión en Zenodo u otro repositorio académico y registrar el DOI sin ambigüedad.
- [ ] Comprobar que el DOI resuelva hacia la versión publicada y que GitHub/Zenodo no describan versiones distintas como si fueran la misma.
- [ ] Confirmar preservación de código en Software Heritage cuando corresponda a una release mayor o científicamente significativa.

## Sitio, API y ecosistema

- [ ] Verificar sitio, API, descargas y dominio público.
- [ ] Comprobar que OpenAPI describe la API efectivamente desplegada.
- [ ] Revisar `docs/ECOSYSTEM.md` y propagar enlaces/DOI cuando una nueva release deba aparecer en repositorios hermanos o perfiles académicos.
- [ ] Confirmar enlaces desde el perfil científico de GitHub y, cuando sea pertinente, ORCID y otras redes académicas.
- [ ] Tratar redes sociales y páginas de difusión como capas de descubrimiento, no como sustitutos del objeto científico citable.

## Cierre

- [ ] Verificar el commit final de la release y registrar quién realizó la revisión.
- [ ] Confirmar que no existen cambios locales o del branch que debieron formar parte de la publicación.
- [ ] Conservar una referencia inequívoca entre versión, tag, release, DOI y commit.
