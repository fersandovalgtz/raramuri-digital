# Auditoría editorial y estructural profunda del corpus público — 2,581 entradas (v1)

**Fecha:** 14 de agosto de 2026  
**Corpus:** `data/lexicon-master.json` / datos 1.0.0  
**Repositorio:** `fersandovalgtz/raramuri-digital`  
**Ejecución reproducible:** `scripts/audit-lexicon-corpus.mjs` → v3  
**CI de control:** commit `b739f6420063f78fa5f269c7ae5b57f96be15dcf`, workflow `Validar publicación`, ejecución exitosa.

## Alcance y regla de interpretación

Esta auditoría complementa `QUALITY_REPORT.md`. No corrige automáticamente el léxico y no sustituye validación lingüística. Su objetivo es separar problemas estructurales demostrables, candidatos editoriales que requieren cotejo con la fuente y limitaciones del modelo de datos.

La forma documental (`headword_raw`, `translation_raw`, `comments_raw`) debe preservarse. Una colisión de clave normalizada no equivale a duplicación, una ausencia de ejemplo no equivale a error y una categoría gramatical no se infiere a partir del significado español.

## 1. Integridad general: resultado positivo

El corpus mantiene 2,581 entradas, 2,758 acepciones, 622 ejemplos y 224 tokens en `variants`. El informe estructural base ya registraba cero identificadores duplicados, cero identificadores inválidos y cero rangos de página inválidos.

La auditoría profunda añade controles adicionales con resultado limpio:

- **0 grupos de duplicado exacto de contenido**;
- **0 inconsistencias** entre prefijo numérico del lema fuente y `homonym_number`;
- **0 problemas NFC** en los campos auditados;
- **0 espacios de borde**;
- **0 mayúsculas** en `headword_normalized`;
- **0 apóstrofos tipográficos** en la clave normalizada;
- **0 espacios repetidos** en `headword_normalized`.

Por tanto, el corpus es estructuralmente sólido en identificación, rangos de página y normalización técnica. Los problemas relevantes son principalmente de **modelado editorial**, no de corrupción del conjunto de datos.

## 2. Dos registros P0 sin traducción ni acepciones

El informe base señalaba dos entradas sin traducción y sin acepciones. La auditoría las identifica de manera individual.

### `RD-000120` — `Auchecho`

Página 8–9. No tiene clasificación, traducción estructurada ni acepciones, pero conserva material documental en ejemplo/comentario: `Auchecho siné, otra vez. Auchecho siné aní, repetir. Auchecho siné cu ‘ya, reponer.`

**Decisión:** no completar la traducción por inferencia. Debe cotejarse directamente con la página fuente y reconstruirse únicamente lo que el documento autorice.

### `RD-000860` — nota documental modelada como lema

El `headword_raw` es literalmente: `Nota: al principio de la palabra no siempre se pronuncia la hu.` No tiene traducción, acepciones, clasificación, ejemplos ni variantes, y aparece en la página 42 inmediatamente antes de la serie `Hua`.

**Diagnóstico estructural:** no parece una entrada léxica ordinaria, sino una **nota de la fuente incorporada al arreglo de entradas**.

**Decisión:** preservar íntegramente la nota y su procedencia, pero revisar su representación futura como nota documental/metadato de fuente en vez de lema consultable. No debe eliminarse la evidencia original.

## 3. Las 163 entradas sin clasificación esconden un problema de modelo

El corpus tiene **163 entradas sin clasificación exacta**. La auditoría conservadora buscó únicamente etiquetas gramaticales explícitas al inicio de traducciones/acepciones o inmediatamente después de números de acepción; no se clasificó por significado.

Resultado:

- **45 de 163** entradas sin clasificación contienen al menos una etiqueta gramatical explícita en la propia evidencia documental;
- **42 de esas 45** contienen **más de una categoría explícita**;
- sólo **3** contienen una categoría explícita única y son candidatas relativamente sencillas a recuperación tras cotejo:
  - `RD-000771` `Chopota` → `vi` explícito;
  - `RD-001078` `Ihuérami` → `adj` explícito;
  - `RD-001093` `Iná` → `vi` explícito.

Ejemplos multicategoría incluyen `Coráachi` (`s` + `adv`), `Córima` (`vt` + `s`), `Cosibera` (`s` + `vi`) y `Choquirá` (`vt` + `s`).

**Conclusión de arquitectura:** gran parte de la ausencia de `classification` no es simplemente un campo olvidado. En al menos 42 casos la fuente distribuye categorías por acepción, mientras el esquema actual dispone de una sola clasificación a nivel de entrada. La solución correcta es estudiar una **clasificación por acepción** o una relación entrada–categorías antes de rellenar masivamente el campo actual.

## 4. Las 35 colisiones de firma no son 35 duplicados

`QUALITY_REPORT.md` detecta 35 colisiones de la firma `headword_normalized + homonym_number + page_start`, que involucran **71 registros**. La auditoría profunda separa su causa:

- **10 grupos (28.57 %) mantienen exactamente la misma forma fuente**;
- **25 grupos (71.43 %) colisionan únicamente porque la normalización colapsa diferencias gráficas, principalmente acento/caja**;
- **0 grupos** presentan otro tipo de diferencia de forma fuente;
- **0 grupos** son duplicados exactos de contenido.

Esto obliga a distinguir `collision` de `duplicate`. Las 25 colisiones inducidas por normalización no deben considerarse evidencia de duplicación.

### Diez grupos con la misma forma fuente: cola P1

| Forma fuente | Registros | Diferencia documental |
|---|---|---|
| `Acajihua` | RD-000018 / RD-000019 | S `Correa` / Vr `Ponerse correas a los huaraches` |
| `Ané` | RD-000064 / RD-000065 | Vt `Decir` / Vi `Sonar fuerte` |
| `Aparocha` | RD-000078 / RD-000079 | S `Abuelo materno` / S `Nieto (del abuelo materno)` |
| `Basú` | RD-000206 / RD-000207 | Vi `Cocer, hervir` / sin clasificación `Derretir` |
| `Bichíhuari` | RD-000235 / RD-000236 | S `La verdad` / Adv `Cierto, verdad` |
| `Binera` | RD-000257 / RD-000258 | Vt `Enseñar, instruir` / sin clasificación `Amansar` |
| `Buchuhuí` | RD-000327 / RD-000328 | Vi `Estar lleno` / Adv `Completamente` |
| `1ca` | RD-000357 / RD-000358 | Vi `Llevar (en la mano)` / Vi `Traer` |
| `Chipó` | RD-000712 / RD-000713 | Vi `Palpitar` / Vi `Salpicar, brincar...` |
| `Ri’nahuí` | RD-002047 / RD-002049 | Vr `Voltearse` / Vi `Caerse (de espaldas)` |

**Cautela:** estos diez grupos tampoco son duplicados demostrados. Pueden ser homógrafos legítimos, polisemia separada o segmentación/numeración editorial incompleta. Requieren cotejo con la fuente antes de fusionar, numerar o modificar.

## 5. Seis familias con numeración de homónimos mixta

Se detectan seis claves normalizadas donde conviven registros numerados y no numerados: `ori`, `acara`, `choquira`, `huica`, `machina` y `cora`.

Este resultado es una **cola de revisión**, no una declaración de error. La normalización elimina acentos, por lo que algunos miembros pueden ser formas gráficamente distintas y no deben recibir numeración sólo por compartir la clave de búsqueda.

Además, todos los lemas cuyo `headword_raw` sí incluye un prefijo numérico explícito son coherentes con `homonym_number`: **0 discrepancias**.

## 6. `variants` está semánticamente sobrecargado

Los 224 tokens almacenados en `variants` se distribuyen, usando únicamente marcas explícitas del propio token, así:

| Tipo detectado | Tokens |
|---|---:|
| Tiempo/aspecto explícito (`pret.:`, `fut.:`, etc.) | 103 |
| Número/valencia (`pl.:`, `sing.:`, `trans.:`, etc.) | 32 |
| Otra marca gramatical (`pp.:`, `ad.:`, etc.) | 23 |
| `variante de ...` explícito | 6 |
| Léxico o no clasificable automáticamente | 60 |
| **Total** | **224** |

En consecuencia, **158 de 224 tokens (70.54 %)** contienen marcas gramaticales o flexivas explícitas. El campo `variants` no representa únicamente variantes léxicas.

**Recomendación:** conservar cada token documental, pero introducir un subtipo o estructura derivada que distinga al menos `lexical_variant` de `grammatical_or_inflectional_form`. La reclasificación debe basarse en las marcas de la fuente; no debe reanalizarse automáticamente la morfología.

## 7. Dos traducciones con numeración posiblemente incompleta

Dos registros comienzan con `1.` pero sólo producen una acepción estructurada:

- `RD-000721` `Chi’ré`: `1. pasar (un tiempo), pernoctar`;
- `RD-002074` `Riqué`: `1. vt Pisar`.

Pueden ser numeraciones residuales y no necesariamente acepciones faltantes. Se recomienda cotejo visual antes de modificar el parser o el dato.

## 8. Orden de corrección recomendado

**P0 — fuente y estructura:** cotejar `RD-000120` y `RD-000860`; resolver la representación de notas documentales sin destruir procedencia.

**P1 — homonimia/editorial:** cotejar los diez grupos con idéntica forma fuente y, después, las seis familias de numeración mixta.

**P1 — clasificación:** diseñar primero clasificación por acepción/multicategoría; después procesar los 45 registros con etiquetas explícitas. No rellenar 42 casos multicategoría en un campo singular sin resolver el modelo.

**P2 — variantes:** tipar los 224 tokens sin alterar el contenido fuente; 158 ya poseen marcas explícitas que permiten una primera clasificación documental.

**P3 — cobertura:** las 1,959 entradas sin ejemplos y las 2,360 sin variantes siguen siendo indicadores de cobertura de la fuente, no errores automáticos.

## 9. Cambios aplicados en esta fase

No se modificó ninguna entrada lexicográfica. Se añadió una auditoría reproducible al CI y se publicó su artefacto técnico. Antes de cualquier corrección sustantiva debe existir cotejo documental para los registros P0/P1.

**Resultado de fase:** el problema dominante ya no es la integridad informática del corpus, que es buena, sino la fidelidad del **modelo editorial** a entradas multicategoría, notas de fuente, homonimia y formas gramaticales actualmente agrupadas bajo `variants`.
