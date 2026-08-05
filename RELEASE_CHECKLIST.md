# Lista de control de publicación

- [ ] Confirmar versión de plataforma y de datos en `project-metadata.json`.
- [ ] Regenerar exportaciones con `npm run data:exports`.
- [ ] Regenerar el informe con `npm run data:quality`.
- [ ] Instalar `requirements-pdf.txt` y regenerar las ediciones con `npm run data:pdf`.
- [ ] Revisar `manifest-pdf.json`, abrir la edición completa y comprobar una sección alfabética.
- [ ] Ejecutar `npm run validate`.
- [ ] Revisar `git diff` para detectar cambios no deterministas.
- [ ] Confirmar estado de publicación y validación lingüística.
- [ ] Confirmar licencia y exclusiones de terceros.
- [ ] Crear etiqueta Git anotada para la versión de datos.
- [ ] Crear release de GitHub con manifiesto y archivos interoperables.
- [ ] Verificar que el release móvil `pdf-latest` corresponda al commit publicado y contenga PDF completo, ZIP alfabético y manifiesto.
- [ ] Depositar la misma versión en un repositorio académico y registrar el DOI sin ambigüedad.
- [ ] Verificar sitio, API, descargas y dominio público.
- [ ] Registrar cambios y responsables de revisión.
