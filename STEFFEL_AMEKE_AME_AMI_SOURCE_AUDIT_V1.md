# Auditoría fuente-específica de Steffel: `-ameke / -ame / -ami` — v1

**Fecha:** 14 de agosto de 2026  
**Estatus:** auditoría de investigación controlada contra el facsímil/OCR suministrado y la edición crítica de Merrill et al. (2020). No constituye todavía revisión humana especializada.

## 1. Objetivo y regla de trabajo

Esta auditoría se diseñó para evitar un error que se vuelve especialmente peligroso en el corpus de Steffel: **confundir una terminación gráfica con una segmentación morfológica**. El barrido automático se utiliza sólo para localizar candidatos. La clasificación lingüística se hace después, mediante contexto lexicográfico, comentarios metalingüísticos de Steffel y el análisis crítico de Merrill et al.

Sobre el TXT OCR suministrado se aplicó un barrido de tokens alfabéticos continuos, sin distinguir mayúsculas. Produjo 228 ocurrencias localizadoras y 193 cadenas normalizadas distintas terminadas gráficamente en `ameke`; 27/17 para `ame`; y 22/8 para `ami`. **Estos números no son frecuencias léxicas ni morfológicas.** El OCR contiene duplicación de las dos direcciones del diccionario, errores, palabras alemanas, homógrafos léxicos y formas partidas.

## 2. Lo que Steffel sí afirma explícitamente

En la sección tarahumara–alemán, Steffel explica que las sílabas finales `ameke` expresan el *Mittelwort* del presente de sentido activo y añade que los tarahumaras suelen omitir o “tragarse” la sílaba final `ke` en la pronunciación, aunque él decidió escribirla en esas palabras. Este comentario es evidencia histórica directa de una alternancia superficial con ausencia de `ke`.

Merrill et al. precisan además que el participial `-ameke` no lleva acento y que, cuando la base termina en `-á`, la secuencia `-á + -ameke` puede simplificarse gráficamente a `-á + -meke`.

## 3. `-ameke` no tiene una sola función

El Cuadro 3.8 de Merrill et al. obliga a separar varias construcciones. La misma cadena `-ameke` aparece con:

- base adjetiva y función nominalizadora (`ogué-ameke`);
- base nominal y función adjetivalizadora (`saaté-ameke`);
- base verbal y función adjetivalizadora/nominalizadora participial (`cotschimé-ameke`);
- numeral cardinal y función ordinal (`ossanaguó-ameke`).

Por tanto, una búsqueda computacional por sufijo puede construir un inventario documental, pero **no puede asignar automáticamente una misma estructura participial a todos sus miembros**.

## 4. Variación histórica `-ameke ~ -ame`

La edición crítica permite aislar al menos tres pares superficiales especialmente claros dentro de la misma obra:

- `rosácameke` ‘blanco’ ~ `rosácame` ‘blancos’;
- `tschócameke` ‘negro’ ~ `tschócame` ‘negros’;
- `pamaguéameke` ‘verde’ ~ `pamaguéame` ‘verde’.

El tercer caso es el más explícito: Merrill et al. señalan que la ausencia de `-ke` en `pamaguéame` documenta el uso opcional de la sílaba final. El segundo anexo contiene, además, `gueléame` ‘gruesas’, y Steffel registra `tamatsíame` ‘oscuro’. En estos dos últimos casos esta auditoría no recuperó una contraparte exacta `Xameke`, por lo que no se fabricó una pareja.

El resultado es fuerte para **variación histórica de superficie `-ameke ~ -ame`**, pero no autoriza a sostener que toda forma en `-ame` proceda mecánicamente de una forma subyacente en `-ameke`.

## 5. El barrido no recupera un `-ami` participial histórico directo

Las cadenas OCR que terminan en `ami` resultan, al controlarlas, mayoritariamente ajenas al problema participial. Entre los ejemplos están `Ami` ‘perder’, `pamí` ‘año’ y `guamí` ‘allá’. No se recuperó en este barrido una forma histórica cuya segmentación permita identificar directamente un participial `-ami` equivalente al `-ameke/-ame` histórico.

Éste es un **resultado negativo útil**: la abundancia moderna de formas en `-ami` puede compararse diacrónicamente, pero no debe proyectarse retrospectivamente sobre Steffel. En consecuencia, sigue prohibida una regla automática `-ameke > -ami`.

## 6. Auditoría específica de cadenas gráficas `li+ameke`

El barrido de la fuente histórica y el control con Merrill permiten ordenar los casos relevantes en una escala mucho más estricta.

### D1 — `tsanelíameke`

Es el benchmark histórico. Merrill analiza directamente `tsaní` ‘afirmar’ + aplicativo `-e` + pasivo `-li` + participial `-ameke`. Aquí la secuencia `li + ameke` no es inferida de la ortografía: está segmentada en la fuente crítica.

### Control dependiente — `galetsanelíameke`

Merrill usa `galetsanelíameke` ‘bendito’ para apoyar la forma y acentuación esperadas de `tsanelíameke`. Es evidencia adicional de la misma familia construccional, pero **no cuenta como una segunda raíz independiente**.

### D2 — `tschutschelíameke`

Steffel registra el paradigma `tschutschá` ‘ungir’ / `tschutschelíla` ‘unción’ / `tschutschelíameke` ‘ungido’. Más importante aún, Merrill cita `tschutschelíameke` directamente como comparador en el párrafo donde segmenta `tsanelíameke`. Esto eleva el caso: ya no es una semejanza descubierta por búsqueda automática, sino un **análogo estructural señalado por la propia edición crítica**.

Sin embargo, Merrill no presenta allí un segundo parse morfema por morfema de `tschutschelíameke`. Por ello debe permanecer D2: confirmación estructural fuerte, no segunda demostración D1.

### D3 — `ganelíameke`

`ganelíameke` aparece repetidamente con valores como ‘sano’, ‘el que está bien’ y ‘feliz’, y pertenece a una familia que incluye `ganiléliki`, `ganiléruje` y `ganilíle`. Merrill analiza `ganilíle` como `ga-` más un verbo estativo `-nilíle`, pero esta auditoría no recuperó una segmentación explícita que permita identificar el `li` de `ganelíameke` con el pasivo `-li` de `tsanelíameke`.

Por tanto, `ganelíameke` queda como **candidato D3 para análisis dedicado**. No se promueve desde su cadena gráfica.

### Controles negativos — `uilíameke` y `selíameke`

`uilíameke` demuestra directamente por qué la búsqueda de subcadenas puede engañar: Merrill deriva ‘parado’ del verbo lexical `uilí`; el `li` pertenece a la raíz. Del mismo modo, `selíameke` ‘gobernante’ está explícitamente derivado del verbo `selí` ‘gobernar’. En ambos, la secuencia visual `liameke` **no demuestra** una capa independiente `-li + -ameke`.

## 7. Adjudicación

La auditoría fortalece tres conclusiones y restringe una cuarta.

**Primero**, la alternancia histórica `-ameke ~ -ame` está directamente apoyada por la metalingüística de Steffel y por formas internas controladas. **Segundo**, `-ameke` es funcionalmente heterogéneo según la clase de base; no puede etiquetarse automáticamente como participial en todo el corpus. **Tercero**, el puente histórico `li + ameke` conserva un D1 indiscutible (`tsanelíameke`) y gana un D2 particularmente fuerte (`tschutschelíameke`), pero todavía no una segunda raíz con parse directo. **Cuarto**, el barrido no recupera un `-ami` participial histórico directo; la relación con las formas modernas en `-ami` sigue siendo una cuestión diacrónica que debe demostrarse, no presuponerse.

## 8. Consecuencia para la siguiente búsqueda

Ya no conviene seguir ampliando una lista indiferenciada de formas terminadas en `ameke`. El frente más informativo es intentar **convertir un D2/D3 en D1 mediante evidencia publicada de segmentación**, comenzando por `tschutschelíameke` y `ganelíameke`, y buscar paralelamente otra raíz histórica independiente `X-li-ameke`. En moderno, el criterio debe ser el mismo: una nueva raíz sólo cuenta como D1 si la fuente segmenta directamente `li + ame`.

`ocr_locator_sweep_complete_under_declared_tokenization=true`; `source_control_applied=true`; `ameke_polyfunctionality_controlled=true`; `historical_ameke_ame_variation=strong`; `historical_participial_ami_recovered=false`; `tsaneliameke=D1`; `tschutscheliameke=D2`; `ganeliameke=D3`; `uiliameke=negative_control`; `seliameke=negative_control_for_internal_li`; `automatic_morpheme_assignment=false`; `universal_ameke_to_ami_rule=false`; `human_reviewed_by_project=false`.
