# C08 · Adjudicación morfológica de `tschutschelíameke` — v1

**Fecha:** 14 de agosto de 2026  
**Candidato:** `Tschutschá → Tschutschelíameke` ‘ungir → ungido’  
**Decisión:** **A**  
**Tipo de evidencia A:** análisis morfológico explícito compuesto dentro de una misma edición crítica  
**Política:** `PROJECT_VALIDATION_POLICY_V1.md`

## Pregunta

C08 permanecía en B porque no se había recuperado una sola línea que imprimiera el token como `tschutsch-e-li-ameke`. La prueba correcta no es exigir necesariamente una glosa interlineal única, sino determinar si la misma fuente publicada identifica de manera explícita y convergente todos los componentes y vincula el token exacto con la construcción analizada.

## 1. El paradigma está directamente documentado

La edición crítica de Merrill et al. 2020 conserva en Steffel:

- `Tschutschá` — ‘ungir’;
- `Tschutschelíameke` — ‘ungido’;
- `Tschutschelíla` — ‘unción’.

La transcripción normalizada del mismo volumen registra:

- `tschutschá || čučá`;
- `tschutschelíameke || čučelíameke`;
- `tschutschelíla || čučelíla`.

Por tanto, la relación léxica entre base y derivados no es una reconstrucción del proyecto.

## 2. Merrill identifica explícitamente la base aplicativa `tschutsch-e-`

En el análisis fonológico/morfológico del corpus, Merrill et al. escriben que el aplicativo `-e ~ -je` está documentado por Steffel en verbos transitivos y dan como ejemplo exacto:

`tschutsch-e-` ‘ungirle’ (`< tschutschá`, ‘ungir’).

Este pasaje aísla directamente para la familia de C08:

`tschutsch- + -e`.

La `e` interna de `tschutschelíameke` deja así de ser material opaco.

## 3. La cadena `-li + -ameke` es analizada explícitamente y C08 es el comparando publicado

En la entrada analítica de `tsanelíameke`, Merrill et al. describen paso por paso:

1. base verbal;
2. aplicativo `-e`;
3. sufijo pasivo `-li`;
4. sufijo participial `-ameke`.

El análisis dice que la adición de `-li` produce una base pasiva y que `-ameke` convierte ese verbo en adjetivo. Inmediatamente después, al discutir la forma esperada y la acentuación, los autores remiten explícitamente a:

`cf. tschutschelíameke, ‘ungido’`.

Este `cf.` no es una semejanza descubierta por el proyecto: es la comparación morfológica publicada por los editores dentro del análisis de la misma secuencia `-e-li-ameke`.

## 4. `-ameke` está identificado independientemente como participial

La entrada metalingüística `-ameke` de la edición crítica lo identifica explícitamente como **sufijo participial**. Numerosas entradas analíticas del apéndice muestran además su adición a bases verbales.

Así, el extremo final de C08 tampoco depende de una segmentación inferida por forma superficial.

## 5. Reconstrucción analítica permitida

La evidencia publicada permite representar la estructura de C08 como:

`tschutsch- + -e + -li + -ameke`

con las funciones:

`ungir` + aplicativo + pasivo + participial → ‘ungido’.

### Por qué esta representación es válida

No se obtiene por una regla automática aplicada por el proyecto. Cada pieza está anclada en la misma edición crítica:

- `tschutschá` y `tschutschelíameke`: paradigma fuente;
- `tschutsch-e-`: análisis explícito de la familia exacta;
- `-li`: sufijo pasivo explícitamente analizado en la construcción comparada;
- `-ameke`: sufijo participial explícito;
- `tschutschelíameke`: citado por Merrill como comparando directo de la secuencia `-e-li-ameke` analizada.

## 6. Qué NO se afirma

La edición no imprime una única línea interlineal `tschutsch-e-li-ameke`. Por ello se registra:

`single_line_token_parse=false`.

Pero esto no invalida el análisis: la política A exige evidencia fuente-directa más análisis gramatical explícito de la construcción pertinente, no necesariamente que todos los morfemas aparezcan separados con guiones en una sola oración.

Tampoco se utiliza C08 para afirmar que cualquier subcadena superficial `liameke` contenga automáticamente pasivo `-li` + participial `-ameke`. Los controles negativos `ganelíameke`, `uilíameke` y `selíameke` siguen vigentes.

## 7. Decisión de grado

C08 pasa de **B fuerte** a **A**.

`C08_tier=A`;  
`source_direct_paradigm=true`;  
`exact_family_applicative_e_analysis=true`;  
`passive_li_analysis=true`;  
`participial_ameke_analysis=true`;  
`published_direct_comparison_to_parsed_e_li_ameke=true`;  
`morpheme_chain_source_constrained=true`;  
`single_line_token_parse=false`;  
`automatic_surface_liameke_segmentation=false`.

## 8. Consecuencia para la hipótesis construccional

C08 se convierte en un **segundo testigo histórico A** de la arquitectura interna `X + -li + -ameke`, independiente de `tsanelíameke` a nivel de raíz léxica.

Esto modifica el estado de la hipótesis histórica:

antes: `one_D1 + one_strong_D2`;

ahora: **`two_A/source-explicit historical roots`**: `tsanelíameke` y `tschutschelíameke`.

La ganancia es construccional, no una licencia para segmentar automáticamente todo `liameke` histórico.

## Fuentes

Merrill, William L. et al. 2020. *El Diccionario Tarahumara–Alemán de Matthäus Steffel: Lengua y Cultura Rarámuri en el Siglo XVIII*. Universidad de Sonora. Especialmente la entrada E-0967, el índice de transcripciones, el análisis de `tschutsch-e-`, la entrada `-ameke` y la observación analítica de `tsanelíameke` que remite a `tschutschelíameke`.
