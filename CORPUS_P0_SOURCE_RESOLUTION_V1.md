# Resolución documental de los casos P0 del corpus — v1

**Fecha:** 14 de agosto de 2026  
**Corpus publicado:** datos 1.0.0  
**Fuente controlada:** `SRC-02` · `DICCIONARIO raramuri.pdf`  
**Método:** cotejo visual de las páginas fuente; ninguna inferencia lingüística sustituye campos ausentes.

## Resultado ejecutivo

Los dos registros que la auditoría profunda había señalado como P0 no corresponden al mismo problema.

- `RD-000120` (`Auchecho`) es una **entrada documentada con campos vacíos en la propia fuente**. No hay evidencia para completar automáticamente clasificación o traducción.
- `RD-000860` es una **nota documental de la fuente que el proceso de extracción representó como si fuera una entrada léxica**. Debe preservarse por trazabilidad, pero en una futura versión de datos/esquema debe migrarse a una entidad de nota de fuente y dejar de contarse como lexema.

La resolución es deliberadamente no destructiva: no se modifica `data/lexicon-master.*` en la versión publicada 1.0.0. Las decisiones verificadas se materializan en `data/editorial-decisions.json`.

## 1. RD-000120 · Auchecho

### Evidencia de la fuente

En la página PDF 8, la tabla muestra `Auchecho` en la primera columna. Las columnas `Clasif` y `Traducción` están vacías. En `Ejemplos y comentarios` aparece `Auchecho siné, otra vez.`. La entrada continúa al inicio de la página PDF 9 con `Auchecho siné aní, repetir.` y `Auchecho siné cu ‘ya, reponer.`.

### Dictamen

**Tipo:** `source_confirmed_blank_fields`.

El registro maestro no perdió una traducción visible ni una clasificación visible durante la extracción: esos campos están vacíos en la fuente controlada. Por tanto:

1. se conserva `RD-000120` como entrada;
2. no se infiere una categoría gramatical;
3. no se transforma `otra vez`, `repetir` o `reponer` en una traducción de lema sin respaldo explícito de la columna correspondiente;
4. deja de considerarse un P0 de extracción y pasa a ser un vacío documental confirmado por fuente.

## 2. RD-000860 · nota sobre hu-

### Evidencia de la fuente

En la página PDF 42, después de `Garé` y antes de `1Hua`, aparece la línea completa:

`Nota: al principio de la palabra no siempre se pronuncia la hu.`

La disposición visual es la de una nota transversal de la tabla. No ocupa una fila lexicográfica ordinaria distribuida en las columnas `Palabra en rarámuri`, `Clasif`, `Traducción` y `Ejemplos y comentarios`.

### Dictamen

**Tipo:** `source_note_misclassified_as_lexical_entry`.

`RD-000860` no debe interpretarse como un lema rarámuri. El error es de modelado/extracción, no de contenido de la fuente.

### Política de corrección

El dataset 1.0.0 ya fue publicado y sus identificadores/conteos forman parte de la trazabilidad del proyecto. En consecuencia, no se elimina silenciosamente `RD-000860` de la versión vigente. La corrección se divide en dos niveles:

- **versión actual:** conservar el registro físico, anotarlo como nota de fuente mal clasificada y excluirlo de diagnósticos que presuponen que es un lexema ordinario;
- **siguiente versión de datos/esquema:** crear una entidad `source_note` o equivalente, migrar allí el texto con su procedencia y retirar este registro del conteo lexicográfico mediante un cambio versionado y documentado.

## 3. Efecto sobre la auditoría

Los dos P0 quedan **resueltos documentalmente**, aunque sólo uno requiere migración futura del modelo:

- P0 por traducción/acepción realmente faltante debido a extracción demostrada: **0**;
- vacíos documentales confirmados por fuente: **1** (`RD-000120`);
- notas de fuente modeladas como entradas léxicas confirmadas: **1** (`RD-000860`).

Esto no implica que el conjunto de datos 1.0.0 deba cambiar inmediatamente de 2,581 registros. Implica que, semánticamente, uno de esos registros no representa un lexema y su migración debe realizarse de manera versionada.

## 4. Cautelas

- No se asigna significado léxico a `Auchecho` a partir de sus contextos.
- No se asigna categoría gramatical a `Auchecho`.
- No se borra `RD-000860` sin una migración reproducible.
- La nota sobre `hu-` se conserva íntegramente y con página de procedencia.
- El cotejo aquí resuelve la fidelidad a `SRC-02`; no equivale a una validación lingüística comunitaria o experta.

## 5. Próximo frente

Con los P0 cerrados, la siguiente cola P1 es cotejar los diez grupos que comparten exactamente la misma forma fuente y decidir, caso por caso, si representan homógrafos legítimos, polisemia separada o numeración editorial incompleta. Ningún grupo debe fusionarse automáticamente.
