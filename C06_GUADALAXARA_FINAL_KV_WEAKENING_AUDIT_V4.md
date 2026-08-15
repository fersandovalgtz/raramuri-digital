# C06 · Guadalaxara 1683: finales `kV`, debilitamiento dialectal y control de `tsocamec` — v4

**Fecha:** 14 de agosto de 2026  
**Candidato:** `tsocamec/otsocamec → čókameke ~ čókame → chó-ka-me`  
**Nivel formal:** **B**  
**Nota interna:** **B+ excepcional / cercano a A en Steffel→moderno**  
**Documento anterior:** `C06_BLACK_COLOR_GRAPHEMATIC_PROVENANCE_V3.md`

## Pregunta

Determinar si existe evidencia histórica interna, anterior a Steffel, de finales velares `kV` y de su debilitamiento, sin convertir automáticamente el `<c>` final de `tsocamec/otsocamec` en `-ke` ni en reduplicación expletiva.

## 1. Testimonio metalingüístico directo de Guadalaxara

Leopoldo Valiñas Coalla reproduce en su estudio de las lenguas guazapar y tarahumara coloniales un pasaje del prólogo del *Compendio* de Guadalaxara 1683. Guadalaxara advierte que, aunque considera una misma lengua el tarahumara y el habla de Guazapares, existen diferencias de tono, pronunciación y vocabulario, y añade que los guazapares:

- `diferencian en algunos trueques de letras`;
- `no pronuncian tanto las finales, ca, que, qui, co, cu`.

Esta observación es decisiva porque documenta **dentro de 1683** una serie final `k + vocal` cuya realización podía debilitarse dialectalmente.

### Adjudicación

`Guadalaxara_1683_final_kV_series_metalinguistic=true`;  
`Guadalaxara_1683_final_kV_weakening_in_Guazapar=true`;  
`Guadalaxara_1683_trueques_de_letras=true`.

No depende de una proyección desde Brambila ni de Steffel.

## 2. Control léxico independiente de velar final en 1683

Merrill & Burgess 2014 citan directamente a Guadalaxara (1683:27v):

`Pedro norugamek` — ‘hijo de Pedro’.

En el mismo estudio recuperan asimismo una forma no poseída registrada por Guadalaxara:

`šunú-k` — ‘maíz’ (normalización analítica de su forma histórica), junto con formas posesivas relacionadas.

Estos testimonios prueban que una **velar final** estaba realmente atestiguada en material de Guadalaxara en más de un entorno léxico/morfológico.

### Consecuencia

`Guadalaxara_final_velar_independently_attested=true`;  
`Guadalaxara_gamek_direct_attestation=true`.

La existencia de velar final deja de ser una posibilidad puramente inferida.

## 3. Control moderno de reduplicación expletiva

Brambila describe de manera explícita una reduplicación expletiva opcional:

- `gomá → gomáka`;
- `remé → reméke`;
- `muní → muniki`;
- `ganó → ganóko`;
- `sunú → sunúku`.

La regla añade `k` más una copia de la vocal final de la base. Este control moderno coincide formalmente con la serie que Guadalaxara enumera en 1683 (`ca, que, qui, co, cu`).

### Adjudicación

La relación histórica entre ambas descripciones es **plausible y fuertemente sugerida**, pero no se declara identidad diacrónica automática:

`modern_expletive_kV_control=true`;  
`1683_modern_expletive_identity=not_demonstrated`.

## 4. Control moderno independiente del color negro

Estrada Fernández 2020 analiza directamente una forma rarámuri contemporánea:

`tsok-ame` — `negro-NMLZ`, dentro de una construcción relativa.

Este análisis aporta una base moderna explícita `tsok-` para ‘negro’, independiente de la representación `čó-` empleada por Burgess en el sistema cromático.

### Consecuencia

`modern_black_tsok_root_direct_analysis=true`.

Este dato fortalece la continuidad lexical del dominio `tso/cho/čok-` pero **no resuelve** si la `c` interna/final de formas coloniales pertenece a la raíz, a material derivacional o a una expansión gráfica.

## 5. Control adversarial de Buschmann 1857

Buschmann, al discutir los colores tarahumaras, advierte que en `rosa-cameke/rosa-came` ‘blanco’ y `tscho-cameke/tscho-came` ‘negro’ la `c` **puede pertenecer al radical**.

Este análisis histórico temprano obliga a mantener abierta la frontera morfológica de C06.

### Consecuencia

`Buschmann_color_c_may_belong_to_stem=true`.

La evidencia de finales `kV` en Guadalaxara no debe usarse para borrar esta alternativa estructural.

## 6. Qué cambia para `tsocamec/otsocamec`

Antes de esta auditoría, el estado era:

`final_c_phonetic_value=unresolved` con escaso control histórico del entorno velar.

Después de esta auditoría:

- el `<c>` final sigue sin valor fonético token-específico adjudicado;
- pero **finales velares y finales `kV` están directamente documentadas en Guadalaxara**;
- Guadalaxara documenta además debilitamiento dialectal de `ca/que/qui/co/cu`;
- la reduplicación expletiva moderna ofrece un paralelo formal exacto de la serie `kV`;
- Buschmann obliga a mantener abierta la posibilidad de que una `c` del complejo cromático pertenezca a la raíz.

La subhipótesis grafemática pasa de “velar histórica sólo hipotética” a:

**“velar final históricamente disponible y serie `kV` metalingüísticamente documentada; identidad del `<c>` de `tsocamec` todavía no demostrada”.**

## 7. Relación con Steffel

Steffel documenta `čókameke ~ čókame` y observa de manera general que `ke` final suele omitirse en pronunciación.

Guadalaxara 1683 y Steffel ofrecen ahora **dos testimonios históricos metalingüísticos distintos** de debilitamiento/perdida de material periférico velar:

- 1683: los guazapares “no pronuncian tanto” finales `ca/que/qui/co/cu`;
- siglo XVIII: Steffel observa omisión frecuente de `ke` final en pronunciación.

No se formula una ley única ni se equiparan automáticamente los procesos, pero la recurrencia histórica del debilitamiento periférico velar queda reforzada.

`historical_peripheral_velar_weakening_cross_source=strong_direct_metalinguistic_support`.

## 8. Decisión C06

**C06 no sube a A.**

Se conserva:

`C06_tier=B`;  
`C06_strength=B+_exceptional_near_A_Steffel_to_modern`.

Se añaden:

`Guadalaxara_final_kV_weakening_direct=true`;  
`Guadalaxara_final_velar_independently_attested=true`;  
`tsocamec_final_c_phonetic_value=unresolved`;  
`tsocamec_final_c_morpheme_identity=unresolved`;  
`tsocamec_c_to_Steffel_ke=not_demonstrated`;  
`tsocamec_c_as_stem_material=live_competing_analysis`.

## 9. Nuevo control negativo N17

**N17. Disponibilidad histórica de una serie fonológica/morfológica no identifica automáticamente un grafema ambiguo dentro de un token concreto.**

Que Guadalaxara documente finales `ca/que/qui/co/cu` debilitadas y otras formas con velar final no permite concluir que el `<c>` de `tsocamec` sea `-ke`, reduplicación expletiva o el mismo segmento de Steffel.

## 10. Umbral restante para A

C06 sólo debe promoverse si aparece al menos una de estas piezas:

1. regla grafemática de Rodríguez/Guadalaxara aplicable de forma token-específica a `tsocamec/otsocamec`;
2. facsímil legible del fol. 35r con contexto suficiente para adjudicar la grafía;
3. análisis histórico publicado que segmente específicamente la forma de 1683;
4. comparación histórica que resuelva de manera explícita si la `c` pertenece a raíz, derivación o final periférica.

## Fuentes

- Guadalaxara, Thomas de. 1683. *Compendio del arte de la lengua de los tarahumares y guazapares*.
- Valiñas Coalla, Leopoldo. 2002. “Reflexiones en torno a las lenguas guazapar y tarahumara coloniales”. *Anales de Antropología* 36: 249–282.
- Merrill, William L. & Don Burgess. 2014. “Ralámuli Kinship Terminology: A Diachronic Perspective on Diversity in the Sierra Tarahumara of Northwestern Mexico”. *Anthropological Linguistics* 56(3–4): 229–293.
- Buschmann, Johann Karl Eduard. 1857. *Die Lautveränderung aztekischer Wörter in den sonorischen Sprachen und die sonorische Endung ame*.
- Brambila, David. *Diccionario rarámuri-castellano*.
- Estrada Fernández, Zarina. 2020. “Construcciones relativas en lenguas yuto-aztecas de la Sierra Tarahumara: una panorámica intra-genética con atención al yaqui”. *Lexis* 44(1): 269–298.
