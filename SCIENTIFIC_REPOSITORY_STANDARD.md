# Estándar científico del repositorio — Rarámuri Digital

## Alcance

Este documento define el nivel de exigencia que Rarámuri Digital aplica a su publicación como **dataset, software de investigación e infraestructura de humanidades digitales**. No constituye una certificación externa. Es una matriz de prácticas implementadas, evidencia verificable y criterios de mejora continua.

El objetivo no es acumular insignias, sino asegurar que un tercero pueda **descubrir, citar, interpretar, auditar, reproducir y preservar** el recurso sin confundir fuente, transformación, dato derivado o autoridad lingüística.

## Matriz de prácticas

| Dimensión | Implementación | Evidencia |
|---|---|---|
| Identificador persistente | DOI de Zenodo | `CITATION.cff`, README |
| Preservación de software | Software Heritage + Git | badge SWH, historial del repositorio |
| Identidad de autor | ORCID | `CITATION.cff`, CodeMeta |
| Citación legible por máquina | Citation File Format 1.2 | `CITATION.cff` |
| Metadatos de investigación | CodeMeta + metadatos internos | `codemeta.json`, `project-metadata.json` |
| Registro de fuentes | códigos, funciones y estados separados | `SOURCES.md` |
| Procedencia | cadena fuente → transformación → release | `PROVENANCE.md` |
| Crítica documental | expediente Hilton y genealogía editorial | `docs/HILTON_SOURCE.md` |
| Esquema de datos | campos y semántica documentados | `SCHEMA.md` |
| Calidad | informe reproducible | `QUALITY_REPORT.md` |
| FAIR | autoevaluación explícita | `FAIR_ASSESSMENT.md` |
| Interoperabilidad lexicográfica | TEI Lex-0 | `public/downloads/raramuri-lex0.xml` |
| Interoperabilidad lingüística | CLDF | `public/downloads/cldf/` |
| API | OpenAPI 3.1 | endpoint y exportación OpenAPI |
| Integridad | SHA-256 | `public/downloads/manifest.json` |
| Reproducibilidad | scripts + CI + pruebas de determinismo | `.github/workflows/validate.yml` |
| Control de versiones | Git + releases + changelog | GitHub, `CHANGELOG.md` |
| Responsabilidad de contribuciones | CRediT | `CONTRIBUTORS.md` |
| Gobernanza | derechos lingüísticos y límites de autoridad | `GOVERNANCE.md` |
| Licenciamiento | separación código/datos/terceros | `LICENSE.md`, `DATA_LICENSE.md` |
| Seguridad y mantenimiento | políticas explícitas | `SECURITY.md`, `SUPPORT.md` |
| Conducta comunitaria | código de conducta | `CODE_OF_CONDUCT.md` |
| Contribuciones | flujo documentado | `CONTRIBUTING.md` |
| Descubribilidad | ecosistema, perfiles y enlaces persistentes | `docs/ECOSYSTEM.md` |

## 1. Findable — descubrible

Un objeto científico debe poder encontrarse sin depender de una sola interfaz. Rarámuri Digital utiliza DOI, ORCID, GitHub, Zenodo, Software Heritage, sitio público y metadatos legibles por máquina.

El DOI identifica la publicación citable; el repositorio conserva el historial de desarrollo; el sitio facilita consulta; los perfiles académicos aportan contexto y descubribilidad.

## 2. Accessible — accesible

Los productos derivados se ofrecen en formatos abiertos y mediante una API pública. La accesibilidad del dataset no se confunde con permisos sobre fuentes de terceros: un objeto fuente puede ser citable y verificable sin estar relicenciado por este proyecto.

## 3. Interoperable — interoperable

Rarámuri Digital publica proyecciones en formatos de uso general y especializado. TEI Lex-0, CLDF y OpenAPI permiten integración con ecosistemas lexicográficos, lingüísticos y de software.

La interoperabilidad debe conservar semántica y procedencia. Si un formato no representa todos los campos del modelo maestro, la exportación se considera una proyección explícita.

## 4. Reusable — reutilizable

La reutilización exige más que una licencia. El proyecto documenta:

- composición y limitaciones del dataset;
- fuente y procedencia;
- esquema;
- calidad;
- estados de validación;
- autoría y responsabilidades;
- licencias diferenciadas;
- reglas de gobernanza.

## 5. FAIR para datos y buenas prácticas para software de investigación

Rarámuri Digital combina un dataset con una plataforma de software. Por ello, las prácticas FAIR se complementan con criterios propios del software de investigación: versionado, dependencias declaradas, builds reproducibles, pruebas, CI, releases y preservación del código.

El archivo [`FAIR_ASSESSMENT.md`](FAIR_ASSESSMENT.md) es una **autoevaluación**, no una certificación externa.

## 6. Procedencia antes que volumen

La calidad científica no se mide por el número de productos derivados. Toda expansión del repositorio debe mantener una cadena explicable entre:

```text
fuente → representación de trabajo → extracción → transformación → producto → release
```

Si no puede explicarse de dónde proviene un valor o qué regla lo produjo, debe tratarse como deuda documental.

## 7. Fuente antes que normalización

Las formas originales se preservan y las normalizaciones se almacenan por separado. Una normalización de búsqueda no es una emendación filológica. Una inferencia automática no es una observación de la fuente.

La documentación de Hilton y el registro `SRC-01`/`SRC-02` materializan esta regla.

## 8. Estado de validación explícito

Rarámuri Digital distingue al menos:

- disponibilidad técnica;
- transcripción o estructuración;
- validación automática de integridad;
- cotejo documental;
- validación lingüística especializada;
- validación o participación comunitaria.

Superar pruebas automatizadas **no convierte** un recurso en lingüísticamente validado. El README y los metadatos deben mantener visible esta diferencia.

## 9. Reproducibilidad

La CI debe verificar no sólo que el software compile, sino que las transformaciones científicas relevantes sean deterministas cuando se espera determinismo.

El workflow actual valida, entre otros componentes:

- regeneración de exportaciones;
- determinismo de capas tipadas;
- CLDF;
- TEI Lex-0 contra esquema oficial;
- perfiles ortográficos;
- informes de calidad;
- auditorías del corpus;
- exportaciones PDF deterministas;
- lint, build y tests.

Toda nueva capa científica que pueda regenerarse debería integrarse progresivamente a este sistema.

## 10. Integridad y preservación

Las exportaciones publicadas deben llevar checksums. Las versiones citables deben depositarse en infraestructura persistente. El código debe conservar historial y, cuando sea posible, archivarse en repositorios de preservación independientes de GitHub.

Zenodo y Software Heritage cumplen funciones complementarias: publicación citable y preservación del desarrollo.

## 11. Gobernanza y CARE

En datos vinculados con lenguas y pueblos indígenas, FAIR es insuficiente si se aplica sin atención a gobernanza, contexto, autoridad y beneficios. Rarámuri Digital incorpora una política específica de derechos lingüísticos y evita equiparar apertura técnica con disponibilidad cultural irrestricta.

El proyecto utiliza los principios CARE como **marco ético de orientación**, sin afirmar certificación o cumplimiento comunitariamente validado. La implementación concreta debe crecer con participación de personas hablantes y comunidades.

## 12. Licencias separadas

El repositorio diferencia:

- código original;
- datos y documentación original del proyecto;
- obras, facsímiles, logotipos y materiales de terceros.

Una licencia sobre una capa no se propaga automáticamente a otra. Esta separación debe mantenerse en futuras releases.

## 13. Citación de fuente y dataset

Cuando una conclusión dependa de Hilton, la cita del dataset no sustituye la referencia a Hilton. Cuando dependa de una transformación de Rarámuri Digital, la cita a Hilton no sustituye la cita del dataset.

El estándar preferido es **citación doble** cuando corresponda:

```text
fuente documental + objeto digital versionado
```

## 14. Ecosistema y descubribilidad

Los repositorios hermanos se enlazan sin fusionar responsabilidades. Rarámuri Digital, Rarámuri Histórico Digital y los recursos educativos forman capas distintas.

La integración con ORCID, Google Scholar, CATHI, ResearchGate y otras redes académicas busca mejorar descubribilidad; ninguna de ellas sustituye DOI, release o procedencia como fuente de verdad del objeto científico.

## 15. Puerta de publicación de una release científica

Antes de declarar una nueva release de datos como citable debe comprobarse, como mínimo:

- [ ] versión actualizada de dataset y metadatos;
- [ ] `CITATION.cff` sincronizado;
- [ ] CodeMeta sincronizado;
- [ ] fuente y procedencia sin contradicciones;
- [ ] datasheet actualizado;
- [ ] esquema compatible o cambio documentado;
- [ ] calidad regenerada;
- [ ] exportaciones deterministas;
- [ ] validaciones TEI Lex-0 y CLDF superadas cuando apliquen;
- [ ] checksums regenerados;
- [ ] changelog y notas de release;
- [ ] licencias revisadas;
- [ ] estado de validación lingüística explícito;
- [ ] DOI de versión depositado y comprobado;
- [ ] enlaces del ecosistema sincronizados.

## Deuda científica visible

Un repositorio de alto nivel debe declarar lo que todavía no sabe. Entre las deudas documentales que requieren seguimiento están:

- fijar de manera concluyente la identidad bibliográfica exacta del archivo de trabajo `SRC-02`;
- ampliar el cotejo sistemático entre `SRC-01` y los registros digitales;
- incorporar validación lingüística humana y comunitaria documentada;
- mantener sincronizados perfiles académicos externos con cada nueva release importante.

Hacer visible esta deuda aumenta la auditabilidad y evita convertir supuestos en hechos.