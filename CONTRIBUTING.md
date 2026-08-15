# Contribuir y reportar correcciones

## Alcance

Se reciben reportes sobre transcripción, estructura de datos, trazabilidad, documentación, interfaz, API, licencias y propuestas lingüísticas. Una propuesta lingüística no se incorpora como validada sin revisión adecuada.

Antes de proponer cambios a datos o fuentes, revise [`SOURCES.md`](SOURCES.md), [`PROVENANCE.md`](PROVENANCE.md) y, cuando corresponda, [`docs/HILTON_SOURCE.md`](docs/HILTON_SOURCE.md). El objetivo es corregir sin borrar la historia documental del registro.

## Primeras contribuciones

Si desea colaborar por primera vez, revise las incidencias etiquetadas como [`good first issue`](https://github.com/fersandovalgtz/raramuri-digital/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) o [`help wanted`](https://github.com/fersandovalgtz/raramuri-digital/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22). Hay tareas acotadas de documentación, ejemplos de uso, accesibilidad e interoperabilidad que no requieren modificar el contenido lingüístico.

Para conocer la API sin instalar el proyecto completo, consulte los ejemplos reproducibles en [`examples/python-api`](examples/python-api/) y [`examples/r-api`](examples/r-api/).

## Reporte mínimo

1. Identificador de entrada o producto.
2. URL o archivo afectado.
3. Código de fuente (`SRC-*` o `REF-*`) y página, cuando apliquen.
4. Comportamiento o contenido actual.
5. Corrección propuesta.
6. Evidencia verificable: facsímil, registro bibliográfico, publicación, test, checksum u otra fuente pertinente.
7. Tipo de revisión requerida: técnica, documental, lingüística, cultural o jurídica.
8. Si la propuesta cambia procedencia, indicar qué relación fuente → representación → registro se modifica.

No incluya información personal o culturalmente sensible en una incidencia pública. En esos casos escriba a <fernando.sandoval@uacj.mx>.

## Correcciones de fuente y procedencia

Una corrección documental debe tratar el objeto existente como evidencia histórica, no como texto desechable.

- **No cambie `SRC-01`, `SRC-02` u otro código para hacer coincidir retrospectivamente una hipótesis.** Si el objeto material cambia, normalmente corresponde un código nuevo.
- Si propone identificar `SRC-02` con una edición conocida, aporte evidencia de edición, paginación, preliminares, contenido y, cuando sea posible y jurídicamente admisible, checksum.
- Si una fuente secundaria atribuye autoría o colaboración que no aparece en la fuente primaria consultada, indíquelo explícitamente como atribución secundaria.
- No convierta una forma normalizada en forma fuente ni una relación computacional en anotación documental.
- Las correcciones deben conservar el identificador persistente del registro cuando el objeto científico sigue siendo el mismo y deben quedar asociadas a una versión.
- Una modificación que cambie el significado científico de datos ya publicados debe reflejarse en changelog, notas de release y versión citable cuando corresponda.

## Cambios lingüísticos

Una corrección lingüística requiere distinguir la clase de evidencia. Como mínimo, indique si la propuesta se fundamenta en:

- lectura o cotejo documental;
- juicio de una persona hablante y variedad pertinente;
- revisión de una persona especialista;
- comparación con otra fuente publicada;
- regla o inferencia computacional.

Estas categorías no son intercambiables. Una inferencia automática puede ser útil para generar candidatos, pero no debe marcarse como validación lingüística humana.

## Flujo de revisión

`RECIBIDO → CLASIFICADO → VERIFICACIÓN DOCUMENTAL → REVISIÓN ESPECIALIZADA → DECISIÓN → VERSIÓN`

- Los cambios técnicos deben superar las pruebas automatizadas.
- Los cambios documentales deben conservar fuente, página e identificadores.
- Los cambios de procedencia deben actualizar `SOURCES.md` y/o `PROVENANCE.md` cuando corresponda.
- Los cambios lingüísticos deben registrar quién revisó, con qué competencia y bajo qué alcance.
- Toda decisión debe quedar asociada a una versión.
- Una prueba automatizada satisfactoria no sustituye la revisión lingüística o comunitaria.

## Pull requests

Un pull request que modifique contenido científico debe explicar:

1. qué objeto cambia;
2. por qué cambia;
3. qué evidencia respalda el cambio;
4. qué archivos derivados deben regenerarse;
5. qué impacto tiene sobre versiones, citación y procedencia;
6. qué validaciones técnicas y humanas se realizaron.

Antes de publicar una release, utilice [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md).

## Licencia de las contribuciones

Al enviar una contribución, la persona colaboradora declara que tiene derecho a aportarla y acepta que se distribuya bajo la licencia correspondiente al componente modificado:

- las contribuciones al **código fuente o componentes de software**, bajo la [Licencia MIT](LICENSE.md);
- las contribuciones a **datos, exportaciones, productos derivados o documentación producida por el proyecto**, bajo [CC BY-NC-SA 4.0](DATA_LICENSE.md);
- los materiales de terceros o sujetos a restricciones culturales, jurídicas o comunitarias no se incorporarán sin autorización y documentación suficientes.

La aceptación de una contribución no implica validación lingüística ni transferencia de autoridad cultural. La procedencia, las restricciones y el alcance de la revisión deben quedar documentados.

## Desarrollo

```bash
npm install
npm run data:exports
npm run data:quality
npm test
npm run dev
```

Utilice UTF-8, no modifique archivos fuente sin justificación y no elimine trazabilidad para simplificar un registro.

## English

Reports may address transcription, data structure, provenance, documentation, interface, API, licensing, and linguistic proposals. Before changing data or source assertions, review [`SOURCES.md`](SOURCES.md), [`PROVENANCE.md`](PROVENANCE.md), and where relevant [`docs/HILTON_SOURCE.md`](docs/HILTON_SOURCE.md).

A minimum report should include the entry/product identifier, affected file or URL, `SRC-*`/`REF-*` code and page where applicable, current content, proposed correction, verifiable evidence, required review type, and any change to the source → representation → record relationship. Do not post personal or culturally sensitive information publicly; contact the project lead instead.

Source codes must not be rewritten merely to make a later hypothesis look retrospective. Documentary changes must retain provenance; linguistic changes must state whether they derive from documentary collation, speaker judgment, expert review, published comparison, or computational inference. These evidence classes are not interchangeable, and automated validation does not constitute human linguistic or community validation.

Technical changes must pass automated checks. Changes to scientific content should explain their evidence, derived files, version/citation impact, and validation. Before a release, use [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md).

By submitting a contribution, the contributor states that they have the right to provide it and agrees that it may be distributed under the license applicable to the modified component: source code and software under the [MIT License](LICENSE.md); project-produced data, exports, derived products, and documentation under [CC BY-NC-SA 4.0](DATA_LICENSE.md). Third-party or culturally, legally, or community-restricted materials will not be incorporated without sufficient authorization and documentation.