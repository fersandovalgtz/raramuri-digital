# Registro canónico de fuentes — Rarámuri Digital

## Propósito

Este archivo es el **registro de autoridad documental** para las fuentes externas y representaciones de trabajo asociadas con Rarámuri Digital. Su función es impedir que una referencia bibliográfica, un facsímil, una representación estructurada de trabajo y un dataset derivado se confundan entre sí.

Los códigos `SRC-*` identifican objetos que intervienen directamente en la cadena de procedencia del dataset. Los códigos `REF-*` identifican antecedentes o testimonios relacionados que contextualizan la genealogía documental, pero no constituyen por sí mismos la fuente de extracción de la versión vigente.

## Fuentes de producción y cotejo

| Código | Objeto | Función en Rarámuri Digital | Estado de identificación | Derechos y redistribución |
|---|---|---|---|---|
| `SRC-01` | Hilton, K. Simón. *Diccionario tarahumara de Samachique, Chihuahua, México* (1993) | Fuente bibliográfica y facsímil de referencia; fuente documental de `SRC-02` | Identidad bibliográfica verificada | Reutilización académica y no lucrativa autorizada por el ILV; uso comercial no autorizado; el facsímil completo no se incorpora bajo la licencia general del dataset |
| `SRC-02` | `DICCIONARIO raramuri.pdf` | Representación estructurada de trabajo derivada de `SRC-01` y usada por el pipeline | Identidad documental fijada el 2-sep-2026 mediante preliminares del propio archivo | Productos derivados autorizados para usos académicos y no lucrativos; deben conservar atribución y aviso de derechos |

### `SRC-01` — Hilton 1993

**Referencia canónica de trabajo**

Hilton, K. Simón. 1993. *Diccionario Tarahumara de Samachique, Chihuahua, México*. Edición especial corregida y actualizada. Instituto Lingüístico de Verano. Archivo SIL 10966.

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

`SRC-01` es la fuente documental de referencia. El 12 de agosto de 2026, mediante comunicación formal recibida por el proyecto el 18 de agosto de 2026, el Instituto Lingüístico de Verano, A. C., por conducto de Lydia Good, autorizó su reutilización dentro de Rarámuri Digital para fines académicos y no lucrativos.

La autorización comprende transcripción estructurada, consulta web gratuita, descargas en formatos de datos, incorporación a una API, materiales educativos y publicación académica impresa o digital. Deben conservarse los créditos y observarse los lineamientos del ILV. El uso comercial no está autorizado.

### `SRC-02` — `DICCIONARIO raramuri.pdf`

`SRC-02` es la representación estructurada de trabajo consumida por [`scripts/extract_lexicon.py`](scripts/extract_lexicon.py). El pipeline:

- comienza la extracción en la página PDF 3;
- conserva las páginas inicial y final de cada entrada;
- asigna `source_code = SRC-02`;
- conserva `source_document` con el nombre del archivo procesado;
- produjo 2,581 entradas a partir de las páginas PDF 3–87 de la representación estructurada utilizada para la versión 1.0.0.

### Fijación de identidad documental — 2 de septiembre de 2026

La antigua condición de «identidad exacta de edición pendiente» queda cerrada. La inspección de los preliminares de `SRC-02` verifica que el propio objeto consigna:

- *Diccionario tarahumara de Samachique, Chihuahua, México*;
- K. Simón Hilton;
- Instituto Lingüístico de Verano;
- primera edición 1959;
- «Edición especial corregida y actualizada 1993»;
- las advertencias editoriales que describen la revisión de la primera edición con hablantes de Samachique.

Además, la documentación metodológica del proyecto identifica `SRC-02` como un ejercicio de sistematización elaborado a partir del diccionario de Hilton. En consecuencia, `SRC-02` se registra canónicamente como **representación estructurada de trabajo derivada de `SRC-01`**, no como una edición independiente ni como un facsímil integral.

Esta fijación no modifica el estado de validación lingüística. Que la procedencia documental esté establecida no convierte la transcripción o las normalizaciones digitales en una validación lingüística contemporánea.

## Autorización y atribución canónica

**Atribución:** Hilton, K. Simón (1993). *Diccionario tarahumara de Samachique, Chihuahua, México*, edición especial corregida y actualizada. Instituto Lingüístico de Verano, archivo SIL 10966. Reutilización académica y no lucrativa en Rarámuri Digital autorizada por el Instituto Lingüístico de Verano, A. C., mediante comunicación de Lydia Good fechada el 12 de agosto de 2026.

**Aviso corto:** Fuente Hilton 1993 / SIL 10966. Reutilización académica y no lucrativa autorizada por el Instituto Lingüístico de Verano, A. C. Uso comercial no autorizado.

La regla operativa completa se mantiene en [`docs/SAMACHIQUE_RIGHTS.md`](docs/SAMACHIQUE_RIGHTS.md) y en forma estructurada en [`project-metadata.json`](project-metadata.json).

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
Hilton 1993 / SRC-01
        ↓
representación estructurada SRC-02
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

Una capa inferior puede derivarse de una superior, pero **no adquiere automáticamente autoridad lingüística contemporánea**. Una normalización computacional no reemplaza la forma fuente y una actualización ortográfica no vuelve incorrecto el testimonio histórico.

## Reglas de actualización

Toda modificación de una fuente o de su identificación debe:

- conservar el código de fuente existente si el objeto material es el mismo;
- crear un nuevo código si cambia el objeto de origen;
- actualizar [`PROVENANCE.md`](PROVENANCE.md) cuando afecte la cadena de transformación;
- actualizar [`DATASHEET.md`](DATASHEET.md) cuando afecte cobertura, composición o limitaciones;
- registrar el cambio en [`CHANGELOG.md`](CHANGELOG.md) si altera una versión pública;
- evitar reescrituras silenciosas de registros ya citados;
- producir una nueva versión citable cuando cambie el contenido científico del dataset;
- preservar la atribución y el aviso de uso académico/no lucrativo en las exportaciones derivadas de Hilton 1993.

## Política de citación

Para evidencia atribuible a Hilton, cite la edición documental correspondiente. Para datos o transformaciones de Rarámuri Digital, cite además la versión del dataset y, cuando sea pertinente, el identificador `RD-######`.

Véase [`docs/HILTON_SOURCE.md`](docs/HILTON_SOURCE.md) para la nota documental ampliada, [`docs/SAMACHIQUE_RIGHTS.md`](docs/SAMACHIQUE_RIGHTS.md) para derechos y atribución, y [`references.bib`](references.bib) para las referencias estructuradas.
