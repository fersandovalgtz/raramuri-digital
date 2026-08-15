# Ecosistema científico de Rarámuri Digital

## Principio de integración

Rarámuri Digital se desarrolla como una **infraestructura interoperable dentro de un ecosistema de investigación**, no como un repositorio aislado. La integración se basa en enlaces explícitos, identificadores persistentes, responsabilidades diferenciadas, metadatos reutilizables y separación entre evidencia, interpretación, docencia y difusión.

Un enlace entre proyectos **no implica** que sus datos, licencias, cronologías, estados de validación o autoridades lingüísticas sean equivalentes.

## Núcleo rarámuri

### Rarámuri Digital

- Repositorio: <https://github.com/fersandovalgtz/raramuri-digital>
- Sitio público: <https://raramuri.ceees.mx>
- DOI: <https://doi.org/10.5281/zenodo.21483353>
- Objeto: infraestructura lexicográfica rarámuri–español, dataset, API, interoperabilidad y productos derivados.
- Fuente documental central de referencia: Hilton 1993, con procedencia diferenciada en [`SOURCES.md`](../SOURCES.md).

Rarámuri Digital es el nodo lexicográfico contemporáneo del ecosistema. Sus datos se publican con procedencia, versionado, estados de validación y límites explícitos de autoridad.

### Rarámuri Histórico Digital

- Repositorio: <https://github.com/fersandovalgtz/raramuri-historico>
- Sitio: <https://fersandovalgtz.github.io/raramuri-historico/>
- Concept DOI: <https://doi.org/10.5281/zenodo.21957212>
- Objeto: edición histórico-digital de fuentes rarámuri, procedencia documental y análisis diacrónico reproducible.
- Implementación de referencia: Corpus Steffel 1791/1809.

**Relación con Rarámuri Digital:** ambos proyectos pueden generar relaciones diacrónicas investigables. Una coincidencia gráfica, semántica o computacional entre Hilton/Rarámuri Digital y un testimonio histórico de Rarámuri Histórico Digital no demuestra por sí misma continuidad histórica, cognación, identidad semántica o validez lingüística contemporánea. Las relaciones deben permanecer tipadas, versionadas y revisables.

### Rarámuri · recursos educativos

- Repositorio: <https://github.com/fersandovalgtz/raramuri-recursos-educativos>
- Objeto: capa pedagógica para materiales, actividades y recursos educativos.

**Relación con Rarámuri Digital:** puede reutilizar datos o resultados cuando la licencia, procedencia y estado de validación lo permitan. Un producto educativo no debe transformar una hipótesis o capa candidata en conocimiento lingüístico confirmado.

## Humanidades digitales, educación e historia

### Libro de Texto Mexicano Digital

- Repositorio: <https://github.com/fersandovalgtz/libro-texto-mexicano-digital>
- Objeto: tratamiento digital de libros de texto y patrimonio documental educativo.

Comparte principios de preservación de fuente, trazabilidad, datos estructurados, versionado y reproducibilidad.

### Historia de la educación en Chihuahua

- Repositorio: <https://github.com/fersandovalgtz/historia-educacion-chihuahua>
- Objeto: archivo digital de investigación histórica sobre instituciones, fuentes, hemerografía y memoria educativa.

Su relación es metodológica: el documento debe conservar su procedencia y permanecer distinguible de las capas interpretativas derivadas.

### Recursos educativos abiertos

- Repositorio: <https://github.com/fersandovalgtz/recursos-educativos-abiertos>
- Objeto: curación, documentación y reutilización responsable de materiales educativos.

## Hub de identidad científica

El repositorio de perfil <https://github.com/fersandovalgtz/fersandovalgtz> funciona como puerta de entrada al ecosistema y conecta proyectos, publicaciones e identificadores académicos.

Los perfiles externos sirven para **descubribilidad**, pero no sustituyen los metadatos versionados ni los depósitos persistentes de cada objeto científico.

### Identificadores y redes académicas

- ORCID: <https://orcid.org/0000-0002-3168-6725>
- Google Scholar: <https://scholar.google.com/citations?user=zNZsYYAAAAAJ&hl=es>
- CATHI-UACJ: <https://cathi.uacj.mx/handle/20.500.11961/3028/browse?authority=0000-0002-3168-6725&type=author>
- ResearchGate: <https://www.researchgate.net/profile/Fernando-Sandoval-Gutierrez>
- ResearchID: <https://researchid.co/fersandovalg>
- Academia.edu: <https://uacj.academia.edu/FernandoSandoval>
- GitHub: <https://github.com/fersandovalgtz>

## Entornos institucionales y públicos

- Universidad Autónoma de Ciudad Juárez: <https://www.uacj.mx/>
- Universidad CEEES: <https://ceees.mx/>
- Rarámuri Digital: <https://raramuri.ceees.mx>
- Rarámuri Histórico Digital: <https://fersandovalgtz.github.io/raramuri-historico/>

Las afiliaciones describen el contexto académico del responsable. No deben interpretarse automáticamente como autoría, financiación, edición, depósito o aval institucional de cada afirmación del repositorio; cualquier función institucional específica debe registrarse explícitamente.

## Arquitectura del ecosistema

```text
                   ORCID · Scholar · CATHI · redes académicas
                                  │
                                  ▼
                  perfil científico / hub GitHub
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
     Rarámuri Digital     Rarámuri Histórico   proyectos de historia,
      lexicografía           Digital (RHD)       educación y patrimonio
              │                   │                   │
              │                   │                   │
              └──── relaciones tipadas/revisables ───┘
                                  │
                                  ▼
                    recursos educativos rarámuri
                                  │
                                  ▼
                         difusión y docencia
```

## Capas y fuentes de verdad

| Necesidad | Fuente de verdad preferente |
|---|---|
| Citar una versión del dataset | DOI de Zenodo + `CITATION.cff` |
| Examinar código y cambios | GitHub + commit/tag |
| Verificar preservación | Zenodo + Software Heritage |
| Consultar datos vivos | API/sitio de Rarámuri Digital |
| Verificar procedencia | `SOURCES.md` + `PROVENANCE.md` |
| Comprender Hilton | `docs/HILTON_SOURCE.md` |
| Revisar calidad | `QUALITY_REPORT.md` + CI |
| Revisar gobernanza | `GOVERNANCE.md` |
| Descubrir otros proyectos | perfil científico + este documento |

## Integración con redes y páginas

La difusión pública debe funcionar como una **capa de descubrimiento**, no como una fuente alternativa de autoridad. Toda publicación en redes académicas, sitios institucionales o redes sociales que anuncie Rarámuri Digital debería dirigir, según el objetivo, a uno de estos objetos:

1. **DOI** para citar una versión fija;
2. **repositorio** para auditar código, datos y documentación;
3. **sitio público** para consulta y uso;
4. **ORCID/perfil científico** para conectar el recurso con la trayectoria académica;
5. **Rarámuri Histórico Digital** cuando el contenido sea diacrónico o histórico.

Las métricas sociales, publicaciones promocionales y páginas de divulgación no deben reemplazar la procedencia, el versionado ni los registros persistentes.

## Reglas para mantener coherente el ecosistema

1. **Un proyecto, una responsabilidad definida.** Evitar duplicar datasets canónicos sin una razón documentada.
2. **Enlazar antes que fusionar.** Las relaciones entre datasets deben ser explícitas y tipadas.
3. **Versionar los objetos citables.** Una página viva y una release científica cumplen funciones distintas.
4. **Propagar identificadores persistentes.** DOI, ORCID y URLs canónicas deben mantenerse sincronizados.
5. **Separar evidencia de difusión.** Las redes remiten al objeto científico; no lo sustituyen.
6. **Separar docencia de validación.** La reutilización pedagógica no modifica el estado científico del dato original.
7. **No crear autoridad lingüística por agregación tecnológica.** La suma de repositorios, algoritmos o formatos no reemplaza a las comunidades hablantes ni la revisión especializada.
8. **Mantener reciprocidad de enlaces.** Los repositorios hermanos deben enlazarse cuando la relación sea estable y relevante.

## Próximas integraciones recomendadas

- mantener visible Rarámuri Digital en el perfil científico de GitHub;
- incorporar enlaces recíprocos con Rarámuri Histórico Digital y Rarámuri · recursos educativos;
- registrar el dataset en ORCID como producto de investigación con su DOI;
- propagar la URL canónica y el DOI en perfiles académicos donde sea posible;
- emplear el DOI, no una URL efímera, en publicaciones académicas;
- mantener una página pública que explique la diferencia entre datos, plataforma, fuente histórica y estado de validación;
- sincronizar metadatos de versiones futuras entre GitHub, Zenodo, CFF y CodeMeta.

La integración del ecosistema debe crecer por **trazabilidad y enlaces persistentes**, no por duplicación de contenidos.