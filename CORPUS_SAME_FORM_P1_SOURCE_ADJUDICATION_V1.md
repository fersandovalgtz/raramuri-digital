# Cotejo de los diez grupos P1 con idéntica forma fuente — v1

**Fecha:** 14 de agosto de 2026  
**Fuente:** `SRC-02` · `DICCIONARIO raramuri.pdf`  
**Método:** cotejo visual de las filas de la tabla fuente.  
**Regla:** una repetición de forma no equivale a duplicado; se conserva la estructura documental salvo evidencia explícita de agrupación.

## Resultado

Los diez grupos señalados por la auditoría no corresponden a diez duplicados. El cotejo directo los divide en dos clases:

- **9 grupos** son filas independientes y deliberadamente separadas en SRC-02. Deben conservarse sin fusión ni numeración inferida.
- **1 grupo (`1ca`)** está explícitamente marcado por la fuente como el mismo homónimo número 1 en dos filas consecutivas, seguido por `2ca`. Es un candidato fuerte a modelarse en una futura versión como un solo homónimo con dos acepciones, pero no debe fusionarse silenciosamente en datos 1.0.0.

## Matriz de adjudicación

| Forma fuente | Registros | Evidencia de SRC-02 | Dictamen |
|---|---|---|---|
| `Acajihua` | RD-000018 / RD-000019 | dos filas: S `Correa` / Vr `Ponerse correas a los huaraches` | conservar separadas |
| `Ané` | RD-000064 / RD-000065 | dos filas: Vt `Decir` / Vi `Sonar fuerte` | conservar separadas |
| `Aparocha` | RD-000078 / RD-000079 | dos filas S: `Abuelo materno` / `Nieto (del abuelo materno)` | conservar separadas; no reinterpretar relación de parentesco |
| `Basú` | RD-000206 / RD-000207 | Vi `Cocer, hervir` / fila sin clasificación `Derretir` | conservar separadas; no inferir clase al segundo |
| `Bichíhuari` | RD-000235 / RD-000236 | S `La verdad.` / Adv `Cierto, verdad` | conservar separadas |
| `Binera` | RD-000257 / RD-000258 | Vt `Enseñar, instruir` / fila sin clasificación `Amansar` | conservar separadas; no inferir clase al segundo |
| `Buchuhuí` | RD-000327 / RD-000328 | Vi `Estar lleno` / Adv `Completamente` | conservar separadas |
| `1ca` | RD-000357 / RD-000358 | dos filas consecutivas explícitamente rotuladas `1ca`; luego `2ca` `Hacer sombra` | **candidato a un homónimo 1 con dos acepciones** |
| `Chipó` | RD-000712 / RD-000713 | dos filas Vi: `Palpitar` / `Salpicar, brincar...` | conservar separadas |
| `Ri’nahuí` | RD-002047 / RD-002049 | Vr `Voltearse` y, tras `Ri’nagápura`, Vi `Caerse (de espaldas)` | conservar separadas |

## 1. Nueve grupos que dejan de ser candidatos a duplicación

En los nueve casos de conservación separada, el parser reprodujo filas realmente existentes en la fuente. La colisión de firma ocurre porque el modelo usa la misma forma normalizada, no porque haya replicado accidentalmente una fila.

Este resultado permite reclasificar estos grupos de `possible duplicate` a `source-verified separate rows`.

No se asignan números de homónimo donde SRC-02 no los imprime. Tampoco se decide automáticamente si las parejas representan homografía, polisemia, derivación cero, alternancia categorial u otra relación lingüística.

## 2. El caso estructuralmente distinto: 1ca

La página PDF 21 muestra la secuencia:

- `1ca` · Vi · `Llevar (en la mano)`;
- `1ca` · Vi · `Traer`;
- `2ca` · Vi · `Hacer sombra`.

Aquí la fuente no sólo repite la forma: **repite explícitamente el mismo número de homónimo 1**. Por ello, RD-000357 y RD-000358 son dos registros fuente, pero conceptualmente pertenecen al mismo grupo numerado por la propia fuente.

### Decisión

En datos 1.0.0 se conservan los dos `record_id` para no alterar una publicación existente. Para una siguiente versión, el modelo debe evaluar representar `1ca` como una sola entrada con al menos dos acepciones documentales, preservando RD-000357 y RD-000358 como identificadores heredados o vínculos de procedencia.

La recomendación es estructural y se apoya en el número `1` impreso; no implica afirmar que `Llevar` y `Traer` sean semánticamente idénticos.

## 3. Consecuencia para la calidad del corpus

Tras este cotejo:

- grupos con idéntica forma fuente aún sin revisar dentro de esta cola P1: **0/10**;
- grupos demostrados como duplicados accidentales de extracción: **0/10**;
- grupos de filas fuente independientes que deben conservarse: **9/10**;
- grupos con señal estructural explícita para posible consolidación versionada: **1/10 (`1ca`)**.

Las decisiones están codificadas en `data/editorial-decisions.json` para que futuras auditorías no vuelvan a tratar estas diez colisiones como una cola indiferenciada.

## 4. Siguiente cola

El siguiente frente editorial son las seis familias con numeración de homónimos mixta (`ori`, `acara`, `choquira`, `huica`, `machina`, `cora`). Deben cotejarse visualmente antes de modificar cualquier `homonym_number`, porque la normalización elimina acentos y puede reunir formas que la fuente distingue gráficamente.
