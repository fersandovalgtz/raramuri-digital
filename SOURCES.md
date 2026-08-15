# Registro canónico de fuentes — Rarámuri Digital

## Propósito

Este archivo es el **registro de autoridad documental** para las fuentes externas y representaciones de trabajo asociadas con Rarámuri Digital. Su función es impedir que una referencia bibliográfica, un facsímil, un PDF de trabajo y un dataset derivado se confundan entre sí.

Los códigos `SRC-*` identifican objetos que intervienen directamente en la cadena de procedencia del dataset. Los códigos `REF-*` identifican antecedentes o testimonios relacionados que contextualizan la genealogía documental, pero no constituyen por sí mismos la fuente de extracción de la versión vigente.

## Fuentes de producción y cotejo

| Código | Objeto | Función en Rarámuri Digital | Estado de identificación | Redistribución |
|---|---|---|---|---|
| `SRC-01` | Hilton, K. Simón. *Diccionario tarahumara de Samachique, Chihuahua, México* (1993) | Fuente bibliográfica y facsímil de referencia para cotejo | Identidad bibliográfica verificada | No se incorpora bajo la licencia del dataset |
| `SRC-02` | `DICCIONARIO raramuri.pdf` | Fuente estructurada de trabajo usada por el pipeline de extracción | Nombre de archivo y cobertura de extracción verificados; identidad exacta de edición debe mantenerse separada hasta ser demostrada | No se redistribuye como obra de terceros |

### `SRC-01` — Hilton 1993

**Referencia canónica de trabajo**

Hilton, K. Simón. 1993. *Diccionario Tarahumara de Samachique, Chihuahua, México*. Instituto Lingüístico de Verano.

Datos archivísticos verificados:

- edición especial corregida y actualizada;
- viii + 146 páginas;
- aproximadamente 2,500 entradas;
- tarahumara central / Samachique;
- secciones tarahumara–español y español–tarahumara;
- Serie de vocabularios y diccionarios indígenas «Mariano Silva y Aceves»;
- Archivo SIL México 10966.

Autoridades externas:

- SIL México: <https://mexico.sil.org/es/resources/archives/10966>
- WALS: <https://wals.info/refdb/record/Hilton-1993>

`SRC-01` es una **fuente de referencia y cotejo**. La existencia de `SRC-01` no autoriza a describir automáticamente todos los registros digitales como transcripciones directas de esa edición.

### `SRC-02` — `DICCIONARIO raramuri.pdf`

`SRC-02` es el archivo estructurado de trabajo consumido por [`scripts/extract_lexicon.py`](scripts/extract_lexicon.py). El pipeline:

- comienza la extracción en la página PDF 3;
- conserva las páginas inicial y final de cada entrada;
- asigna `source_code = SRC-02`;
- conserva `source_document` con el nombre del archivo procesado;
- produjo 2,581 entradas a partir de las páginas PDF 3–87 de la representación estructurada utilizada para la versión 1.0.0.

**Regla de rigor:** el nombre de archivo `DICCIONARIO raramuri.pdf` no es suficiente para identificar una edición. Hasta que se documente mediante cotejo bibliográfico y material su correspondencia exacta, el repositorio no afirmará que `SRC-02` sea idéntico a Hilton 1993, Shoemaker 2016 u otra edición.

Una futura fijación de identidad debe registrar, como mínimo:

1. título y responsabilidad tal como aparecen en el objeto;
2. fecha y edición;
3. extensión y paginación;
4. procedencia de adquisición;
5. relación con `SRC-01`;
6. checksum criptográfico cuando su conservación sea jurídicamente admisible;
7. fecha y persona responsable de la verificación.

## Genealogía y referencias relacionadas

| Código | Referencia | Relación | Uso permitido en la interpretación |
|---|---|---|---|
| `REF-1959` | Hilton, Kenneth Simon (comp.). *Tarahumara y español* (1959) | Antecedente bibliográfico de la tradición lexicográfica | Historia editorial y cotejo comparativo |
| `REF-2016` | Shoemaker, Wes. *Diccionario tarahumara actualizado* (2016) | Actualización posterior de VIMSA 101 con cambios ortográficos | Historia editorial, comparación ortográfica y cotejo |

### `REF-1959`

El Colegio de México registra *Tarahumara y español* (1959), compilado por **Kenneth Simon Hilton**, con **Ramón López B.** y **Emiliano Carrasco T.** como colaboradores, dentro de la Serie de vocabularios indígenas Mariano Silva y Aceves, núm. 1.

Identificador persistente: <https://hdl.handle.net/20.500.11986/COLMEX/10049271>

La relación textual exacta con Hilton 1993 requiere cotejo. No se presume equivalencia registro por registro.

### `REF-2016`

SIL México registra *Diccionario tarahumara actualizado*, preparado por **Wes Shoemaker** en 2016, como versión actualizada del diccionario VIMSA 101 (1993) con cambios ortográficos recientes. Consta de 95 páginas y aproximadamente 2,500 entradas y está catalogado como borrador sin revisión por pares.

Archivo: <https://mexico.sil.org/es/resources/archives/68110>

No es la autoridad normativa del dataset y no debe sobrescribir automáticamente formas documentales anteriores.

## Jerarquía de evidencia

Rarámuri Digital mantiene la siguiente separación:

```text
registro bibliográfico / testimonio externo
                ↓
       fuente de cotejo SRC-01
                ↓
 representación de trabajo SRC-02
                ↓
 extracción reproducible + páginas
                ↓
       dataset maestro versionado
                ↓
 normalizaciones y capas derivadas
                ↓
 CSV · JSON · XML · SQL · TEI Lex-0 · CLDF · API
                ↓
       release citable + DOI
```

Una capa inferior puede derivarse de una superior, pero **no adquiere automáticamente su autoridad**. Una normalización computacional no reemplaza la forma fuente; una actualización ortográfica no vuelve incorrecto el testimonio histórico; una coincidencia entre recursos no prueba identidad diacrónica.

## Reglas de actualización

Toda modificación de una fuente o de su identificación debe:

- conservar el código de fuente existente si el objeto material es el mismo;
- crear un nuevo código si cambia el objeto de origen;
- actualizar [`PROVENANCE.md`](PROVENANCE.md) cuando afecte la cadena de transformación;
- actualizar [`DATASHEET.md`](DATASHEET.md) cuando afecte cobertura, composición o limitaciones;
- registrar el cambio en [`CHANGELOG.md`](CHANGELOG.md) si altera una versión pública;
- evitar reescrituras silenciosas de registros ya citados;
- producir una nueva versión citable cuando cambie el contenido científico del dataset.

## Política de citación

Para evidencia atribuible a Hilton, cite la edición documental correspondiente. Para datos o transformaciones de Rarámuri Digital, cite además la versión del dataset y, cuando sea pertinente, el identificador `RD-######`.

Véase [`docs/HILTON_SOURCE.md`](docs/HILTON_SOURCE.md) para la nota documental ampliada y [`references.bib`](references.bib) para las referencias estructuradas.