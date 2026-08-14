# Tellechea 1826 · auditoría OCR de `-amec/-ameque/-ame` — v4

**Fecha:** 14 de agosto de 2026  
**Fuente:** Miguel Tellechea, *Compendio gramatical para la inteligencia del idioma Tarahumar* (1826)  
**Base de esta auditoría:** OCR DjVu completo, 11,286 líneas / 295,047 caracteres  
**Alcance:** auditoría textual reproducible; **no equivale a nuevo cotejo facsimilar**  
**Relación:** C09 en `EVIDENCE_MASTER_MATRIX_V3.md`

## Resultado principal

La búsqueda con vocal acentuada/no acentuada recupera **24 ocurrencias crudas** que terminan superficialmente en `-amec/-ameque`, correspondientes a **22 cadenas OCR exactas distintas**. El inventario bruto no es un inventario morfológico: contiene participios explícitos, material metalingüístico, construcciones verbales no participiales, palabras funcionales que sólo coinciden gráficamente y fragmentos creados por saltos de línea del OCR.

La auditoría confirma tres familias ya centrales (`ati-`, `simi-`, `machi-`) y recupera **dos familias OCR adicionales plausibles de extensión larga/breve** (`ayorigu-`, `rejoíruga-`) que deben cotejarse visualmente antes de incorporarse como evidencia de primer nivel. También corrige un falso par: `gayéname` en la plática del Pater Noster no es una forma breve independiente, sino el primer segmento de `gayéname-que` partido por salto de línea.

**Consecuencia:** C09 se fortalece como red interna de variación documental, pero **permanece B fuerte**. El OCR por sí solo no justifica devolverlo a A.

## 1. Regla de clasificación

Cada hit se clasifica por función y contexto. La mera cadena final no autoriza segmentación.

- `explicit_participle`: Tellechea lo presenta explícitamente bajo *De los participios* o en un paradigma rotulado como participio.
- `bilingual_participial*`: la función relativa/agentiva/adjetival está sostenida por el paralelo español.
- `ocr_wrap_fragment*`: el hit superficial es un fragmento de una palabra dividida entre líneas.
- `metalinguistic*`: etiqueta o material descrito por el gramático, no token léxico.
- `other_verbal_construction`: construcción verbal explícitamente distinta.
- `nonparticipial_or_function_word`: coincidencia superficial sin evidencia participial.
- `uncertain`: requiere sintaxis/facsímil antes de decidir.

## 2. Inventario exhaustivo de las 24 ocurrencias largas

El campo “página-marcador” usa el último número de página impresa recuperado antes del token en el OCR; sirve para navegación, no sustituye la paginación facsimilar.

| OCR crudo | Forma reconstruida | Línea OCR | Página-marcador | Clasificación | Confianza | Paralelo/glosa | Nota |
|---|---|---:|---:|---|---|---|---|
| `Taraijámeque` | `Taraijámeque` | 1448 | 15 | `explicit_participle` | high | El que cuenta | In paradigm under heading participios; exact medial OCR spelling remains pending facsimile. |
| `inochameque` | `inochameque` | 1887 | 25 | `other_verbal_construction` | high | tu habías de haber trabajado | Occurs in pluperfect/future-infinitive discussion; not countable as participial solely by ending. |
| `Yamec` | `Yamec` | 1969 | 26 | `metalinguistic_ending_label` | high |  | Part of OCR-corrupt list of present-participle endings; not a lexical token. |
| `simiámec` | `simiámec` | 1969 | 26 | `explicit_participle` | high | el que va | Explicit example in De los participios. |
| `rumgamec` | `rumgamec` | 1970 | 26 | `explicit_participle` | high | el que está grueso y tupido | Explicit example in De los participios; OCR spelling needs facsimile for diplomatic form. |
| `machiámec` | `machiámec` | 1971 | 26 | `explicit_participle` | high | el que sabe, o ve | Explicit example in De los participios. |
| `yameque` | `yameque` | 2389 | 37 | `metalinguistic_participial_material` | high |  | Tellechea explicitly refers to participios que tienen ya o yameque; metalinguistic, not lexical. |
| `rorobuségamec` | `rorobuségamec` | 2609 | 42 | `compound_modifier_uncertain` | medium_low | ojos de toro | Occurs in discussion of compounds serving as genitives; do not count as participle without analysis. |
| `atígameque` | `atígameque` | 2891 | 49 | `bilingual_participial_nominal_adjectival` | high | morador (en el cielo) | Pater Noster bilingual parallel. |
| `ayoriguámeque` | `ayoriguámeque` | 2927 | 49 | `bilingual_participial_probable` | medium_high | context of nuestros ofensores / lo malo | Prayer context supports agent/adjectival function; exact alignment should be facsimile-controlled. |
| `rejoírugameque` | `rejoírugameque` | 2952 | 50 | `bilingual_participial_probable` | medium_high | context: en tu vientre hombre fue hecho | Ave María; later short form rejoíruga-me occurs in Creed exposition. |
| `yumctvameque` | `yumctvameque` | 3001 | 51 | `bilingual_adjectival_participial_probable` | medium | Todopoderoso / hacedor (Creed context) | OCR token itself is corrupt-looking; function likely adjectival but diplomatic form pending. |
| `machiámeque` | `machiámeque` | 4894 | 75 | `bilingual_participial` | high | el que todo lo sabe | Spanish parallel lines 4928-4931. |
| `gameque` | `netetugameque` | 4895 | 75 | `ocr_wrap_fragment_reconstructed_participial` | high | el que todo lo ha hecho | Raw gameque is not independent: previous line ends netetu-. Reconstruct netetugameque. |
| `raméque` | `raméque` | 5065 | 75 | `nonparticipial_or_function_word` | medium_high |  | Occurs in discourse with ramejé and mamachique; no participial evidence. |
| `támeque` | `natámeque` | 5126 | 78 | `ocr_wrap_fragment_reconstructed_participial` | high | los que bien piensan | Previous line ends na-; Spanish parallel says Padre de todos los que bien piensan. |
| `rameque` | `rameque` | 6383 | 93 | `nonparticipial_or_function_word` | medium_high |  | Surface ending alone is insufficient; occurs among pronominal/discourse material. |
| `raméque` | `raméque` | 6385 | 93 | `nonparticipial_or_function_word` | medium_high |  | Second occurrence in same passage; no participial alignment. |
| `orámeque` | `orámeque` | 7189 | 105 | `verbal_or_participial_uncertain` | medium | nosotros nada pensamos (parallel context) | Spanish parallel is finite-like; do not count as participle absent syntactic analysis. |
| `rameque` | `rameque` | 7209 | 105 | `nonparticipial_or_function_word` | medium_high |  | No participial evidence in aligned passage. |
| `tamachiámeque` | `tamachiámeque` | 7817 | 112 | `bilingual_participial` | high | los que a Dios no conocen | Spanish parallel lines 7862-7864; negative/relative participial function. |
| `beserágameque` | `beserágameque` | 7819 | 112 | `bilingual_participial` | high | los que bien se confiesan | Spanish parallel lines 7865-7867. |
| `machíameque` | `machíameque` | 7820 | 112 | `bilingual_participial` | high | los que bien saben de Dios los Mandamientos | Spanish parallel lines 7867-7869. |
| `gayénameque` | `gayénameque` | 9470 | 143 | `bilingual_participial_adjectival` | high | hacedor de todas las cosas | Spanish parallel lines 9501-9504. Earlier p.75 occurrence is split gayéname + que and is not a short variant. |

## 3. Familias de extensión larga/breve

| Familia | Forma(s) larga(s) | Forma breve | Estado | Confianza | Continuidad semántica | Cautela |
|---|---|---|---|---|---|---|
| `ati-` | atígameque (L2891) | atígame (L4891) | `strong_same_root_long_short_ocr` | high | morador / morador | facsimile control still required in current audit |
| `simi-` | simiámec (L1969) | simíame (L7323) | `strong_same_root_long_short_ocr` | high | el que va / caminante | accent/graphic difference; facsimile control pending |
| `machi-` | machiámec (L1971); machiámeque (L4894); machíameque (L7820) | machíame (L7365) | `strong_same_root_extension_network_ocr` | high | el que sabe/ve; el que todo lo sabe; los que bien saben | multiple discourse contexts; facsimile control pending |
| `ayorigu-` | ayoriguámeque (L2927) | [tamú] ayoriguáme (L5059, OCR merged as tamuayoriguáme) | `probable_same_root_long_short_ocr` | medium_high | offender/one who hates context | spacing and exact bilingual alignment pending facsimile |
| `rejoíruga-` | rejoírugameque (L2952) | rejoíruga-me (L5174–5175, explicit OCR line wrap) | `probable_same_root_long_short_ocr` | medium_high | incarnation/birth context in Ave/Credo | exact gloss-to-form alignment pending facsimile |
| `gayéna-` | gayénameque (L9470); gayéname + que (L4895–4896 line wrap) | — | `rejected_short_pair` | high | hacedor / el que todo lo acaba | L4895 gayéname is not evidence of a short form because next line begins que |

### 3.1. `ati-`

`atígameque` aparece en el *Pater Noster* y el español lo traduce como “morador”; más adelante `atígame` aparece en la explicación del mismo pasaje, nuevamente en la construcción “nuestro Padre arriba en el cielo morador”. Es el par OCR largo/breve más limpio fuera de Steffel.

### 3.2. `simi-`

La gramática da `simiámec` = “el que va”. En una plática posterior, `simíame` aparece en el pasaje cuya traducción española denomina a la Iglesia terrenal “caminante”. La coincidencia de raíz y función es fuerte; la diferencia acentual/gráfica se conserva tal cual y no se normaliza retrospectivamente.

### 3.3. `machi-`

La red incluye `machiámec` = “el que sabe, o ve”, `machiámeque` = “el que todo lo sabe”, `machíameque` = “los que bien saben de Dios los Mandamientos” y `machíame` en otro pasaje traducido igualmente mediante “los que bien saben...”. Esta es la familia de extensión más densa del OCR.

### 3.4. `ayorigu-` — nuevo candidato de control

El *Pater Noster* contiene `tamú ayoriguámeque` en el tramo español de “nuestros ofensores / lo malo”. En otra plática el OCR fusiona `tamú` con `ayoriguáme` y el español habla de quien “aborrezca a los próximos”. La relación larga/breve es plausible y semánticamente coherente, pero la separación gráfica y el alineamiento exacto requieren facsímil.

### 3.5. `rejoíruga-` — nuevo candidato de control

El *Ave María* contiene `rejoírugameque` en el contexto del vientre de María. En la explicación del *Credo* aparece `rejoíruga-` al final de una línea y `me` al inicio de la siguiente, en el pasaje español “se hizo hombre en el vientre de María virgen nació”. Es un probable segundo par largo/breve adicional, pendiente de cotejo visual.

## 4. Correcciones importantes del OCR

### `gameque` no es un token independiente

En L4894–4895 el OCR parte:

`machiámeque yomá netetu-`  
`gameque ...`

Por contexto y continuidad gráfica debe tratarse como **`netetugameque`**, que el paralelo español alinea con “el que todo lo ha hecho”. Contar `gameque` como palabra falsearía el inventario.

### `támeque` no es un token independiente

L5125 termina en `na-` y L5126 comienza `támeque`. La reconstrucción textual es **`natámeque`**. El español paralelo contiene “Padre es de todos los que bien piensan”, compatible con una construcción relativa/participial.

### `gayéname` no prueba una variante breve

En L4895 el OCR termina `gayéname` y L4896 comienza `que`. Esa ocurrencia es **`gayénameque` partida por salto de línea**, no una forma breve. Una segunda aparición continua `gayénameque` (L9470) se alinea con “hacedor de todas las cosas”. Por tanto:

`gayénameque ~ gayéname` **no debe usarse como par largo/breve** con la evidencia actual.

Esta corrección es un control negativo útil contra la generación mecánica de pares por OCR.

## 5. Controles negativos y dudosos

- `inochameque` aparece en la explicación del pluscuamperfecto/futuro: “tú habías de haber trabajado”; no se cuenta automáticamente como participio.
- `rorobuségamec` aparece en una explicación de compuestos/genitivos con “ojos de toro”; su análisis morfológico queda abierto.
- `rameque/raméque` aparece en material discursivo/pronominal y no aporta evidencia participial por la sola terminación.
- `orámeque` se alinea con una traducción finita “nosotros nada pensamos”; queda como verbal/participial incierto.
- `Yamec` y `yameque` son material metalingüístico, no lemas.

## 6. Qué cambia para C09

### Se fortalece

1. `ati-`, `simi-` y `machi-` sobreviven una auditoría contextual y no son artefactos de una búsqueda por sufijo.
2. Hay dos nuevas familias OCR plausibles (`ayorigu-`, `rejoíruga-`) con formas largas/breves y continuidad semántica.
3. Los paralelos españoles confirman que varias formas largas cumplen función agentiva, relativa o adjetival.
4. La reconstrucción de saltos de línea reduce falsos positivos y hace el inventario más fiable.

### No cambia de nivel

1. Las dos familias nuevas no tienen cotejo facsimilar en esta auditoría.
2. El inventario OCR no resuelve la relación grafemática exacta `<c>/<que>/<k>/<ke>`.
3. No demuestra una dirección universal `-ámeque > -ámec > -áme`.
4. La observación de Tellechea sobre pérdida de `que/ca` continúa restringida a los pretéritos y **no se transfiere automáticamente** a estos participios.

**Decisión:** `C09_tier=B`; `C09_strength=strong`; `C09_additional_ocr_long_short_candidates=2`; `C09_facsimile_required_for_promotion=true`.

## 7. Resultado reproducible

Conteos mecánicos del OCR completo:

- `-amec` (incluyendo `-ámec`): 5 ocurrencias;
- `-ameque` (incluyendo `-ámeque`): 19 ocurrencias;
- total largo crudo: 24;
- cadenas OCR exactas distintas: 22;
- `-ame/-áme` crudo: 168 ocurrencias / 111 cadenas distintas, **no interpretables como 111 morfemas o participios**.

El subconjunto `-ame` debe auditarse por familias y paralelos, no por frecuencia bruta.

## 8. Próximo paso pre-registrado

El siguiente trabajo útil no es buscar más terminaciones generales. Es:

1. cotejar facsimilarmente, cuando la ruta técnica lo permita, `ayoriguámeque ~ ayoriguáme` y `rejoírugameque ~ rejoírugame`;
2. confirmar visualmente los saltos `netetu-gameque`, `na-támeque` y `gayéname-que`;
3. después, sólo si esos controles sobreviven, actualizar la matriz de C09;
4. auditar `-ame` únicamente alrededor de raíces ya justificadas o de paralelos españoles que indiquen función participial.

**Regla epistemológica v4:** el OCR genera candidatos y permite control contextual reproducible; no reemplaza la lectura diplomática cuando una diferencia de letras o límites de palabra determina la conclusión morfológica.
