# Adjudicación de seis familias con numeración de homónimos mixta — v1

**Fecha:** 14 de agosto de 2026  
**Fuente:** `SRC-02` · `DICCIONARIO raramuri.pdf`  
**Método:** cotejo visual de la forma gráfica fuente antes de la normalización sin diacríticos.  
**Regla:** una coincidencia en `headword_normalized` no autoriza a modificar `homonym_number` si la fuente distingue las formas mediante acento, saltillo u otra grafía.

## Resultado ejecutivo

La auditoría había identificado seis claves normalizadas con mezcla de registros numerados y no numerados: `acara`, `cora`, `choquira`, `huica`, `machina` y `ori`. El cotejo de las páginas fuente resuelve las seis.

El resultado se divide en dos clases:

- **1 familia (`Acará`)** presenta numeración mixta en la propia fuente: una fila Acará sin número y, en la página siguiente, 1Acará y 2Acará. Debe conservarse como `source-confirmed mixed numbering`; no hay base para inventar un número para la fila no numerada.
- **5 familias (`Cora/Corá`, `Choquira/Choquirá`, `Huicá/Huica`, `Machiná/Machina`, `Orí/Ori`)** son colisiones creadas por una normalización que elimina acentos. No son errores de numeración de la fuente.

Por tanto, las seis familias quedan documentalmente adjudicadas y **ninguna autoriza una reparación automática de homonym_number**.

## Matriz de adjudicación

| Clave normalizada | Registros | Forma fuente | Dictamen |
|---|---|---|---|
| `acara` | RD-000009 / RD-000023 / RD-000024 | `Acará` / `1Acará` / `2Acará` | numeración mixta confirmada por fuente; conservar |
| `cora` | RD-000523 / RD-000524; contexto RD-000525 | `Cora` / `1Corá` / `2Corá, cohuara` | colisión por pérdida de acento; conservar distinción gráfica |
| `choquira` | RD-000776 / RD-000777 / RD-000778 | `1Choquira` / `2Choquira` / `Choquirá` | colisión por pérdida de acento |
| `huica` | RD-000953 / RD-000954 / RD-000955 | `1Huicá` / `2Huicá` / `Huica` | colisión por pérdida de acento |
| `machina` | RD-001235 / RD-001236 / RD-001237 | `1Machiná` / `2Machiná` / `Machina` | colisión por pérdida de acento |
| `ori` | RD-001765 / RD-001766 / RD-001767 / RD-001768 | `1Orí` / `2Orí` / `3Orí` / `Ori` | colisión por pérdida de acento |

## 1. Acará: mezcla real de fuente, no error del parser

SRC-02 muestra en la página PDF 3 una fila `Acará` Vi `Poner (huaraches)` sin número. En la página PDF 4 aparecen `1Acará` Vt `Herrar` y `2Acará` S `Rostro`.

Las tres formas léxicas se imprimen con la misma grafía `Acará`; la diferencia numerado/no numerado, por tanto, existe en la fuente. El corpus 1.0.0 la reproduce correctamente.

### Decisión

No se asigna `3` a RD-000009, no se desplazan los números 1/2 y no se fusionan registros. La familia se marca como inconsistencia o práctica editorial de la fuente confirmada, pendiente únicamente de interpretación filológica/lingüística si en el futuro se desea racionalizarla.

## 2. Cora / Corá: la normalización oculta una diferencia acentual

La página PDF 28 contiene:

- `Cora` Vt `Obsequiar`, sin acento;
- `1Corá` S `Peña`, con acento final;
- `2Corá, cohuara` S `Frente`, también con acento final.

`Cora` y `Corá` se reducen a la misma clave normalizada `cora`, de modo que el diagnóstico de numeración mixta no representa una inconsistencia de la fuente. La forma acentuada pertenece a una serie explícitamente numerada; la no acentuada no.

Existe, además, una cuestión secundaria de modelado: `2Corá, cohuara` conserva la variante `cohuara` dentro de `headword` y simultáneamente en `variants`. Esto no se corrige aquí porque requiere una política general para lemas con variantes en la misma celda fuente.

## 3. Choquira / Choquirá

SRC-02 imprime `1Choquira` Adj `Culpable` y `2Choquira` `Principio`, ambos sin acento final. A continuación aparece `Choquirá`, con acento final, que contiene dos valores internos, `vt pl` y `s`.

La clave `choquira` es adecuada para búsqueda tolerante a diacríticos, pero no para decidir homonimia editorial. Se conserva la serie 1/2 de `Choquira` y `Choquirá` permanece sin `homonym_number`.

## 4. Huicá / Huica

La página PDF 45 imprime `1Huicá` Vi `Perderse`, `2Huicá` Adj `Mucho` y después `Huica` S `Palo picudo (para sembrar maíz)`.

La oposición acentual es visible en la fuente. El diagnóstico mixto es un efecto de `headword_normalized = huica`. No se crea un supuesto `3Huicá`.

## 5. Machiná / Machina

La página PDF 54 contiene `1Machiná` Adv `Afuera` y `2Machiná` Adv `Claramente`; la página PDF 55 comienza con `Machina` Vi `Salir`.

De nuevo, la normalización elimina la diferencia gráfica. La numeración fuente es coherente dentro de `Machiná`; `Machina` se conserva como forma distinta no numerada.

## 6. Orí / Ori

La página PDF 68 contiene `1Orí` S `Táscate`, `2Orí` Adj `Español, mestizo`, `3Orí` Vt `Hacer así` y, enseguida, `Ori` Vt pret `Curar`.

La serie 1–3 pertenece a la forma acentuada `Orí`; el pretérito `Ori` carece de acento en la fuente. No existe base documental para convertirlo en `4Orí`.

## Consecuencia metodológica

La auditoría estaba mezclando dos operaciones legítimas pero distintas: normalización para recuperación y comparación gráfica para control editorial. A partir de este cotejo, los diagnósticos de homonimia deben conservar ambas capas:

1. `headword_normalized` puede seguir sirviendo para encontrar candidatos;
2. la adjudicación editorial debe consultar `headword_raw`/forma fuente y no debe borrar diacríticos antes de decidir si la numeración es inconsistente.

## Estado de la cola

- familias revisadas: **6/6**;
- colisiones debidas a pérdida de acento: **5**;
- numeración mixta realmente presente en SRC-02: **1 (`Acará`)**;
- familias aún sin adjudicar en esta cola: **0**;
- cambios automáticos de `homonym_number` autorizados: **0**.

Las decisiones estructuradas están en `data/mixed-homonym-decisions.json`.

## Siguiente frente

El siguiente movimiento debe separar la cola de **variantes incluidas en la celda del lema** de los verdaderos lemas múltiples. El caso `2Corá, cohuara` demuestra que una variante puede quedar simultáneamente en `headword` y `variants`, lo que contamina firmas normalizadas y puede inflar falsos positivos. La revisión debe hacerse de forma general, no corrigiendo sólo este caso.
