# Pruebas fuente-basadas e historiográficas — v13

**Fecha:** 14 de agosto de 2026  
**Síntesis general:** `AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`  
**Matriz previa:** `EVIDENCE_MASTER_MATRIX_V12.md`

## Cambio de esta ronda

El texto primario de Buschmann 1857 fue recuperado mediante el volumen completo de las *Abhandlungen der Königlichen Akademie der Wissenschaften in Berlin* digitalizado en Internet Archive (`abhandlungenderk1856deut`).

La recuperación produce dos cambios:

1. **C02 `Tschipérameke / čipérameke ↔ Chipérami` pasa de B+ fuerte a A** por análisis histórico token-específico publicado.
2. **H15 se refina**: la controversia Buschmann–Pimentel no es simplemente `ame` frente a `kame`, sino una disputa sobre la estructura interna de la familia (`ame`, `me`, `ke`, `kame` y expansiones).

## Test BUS-1 · ¿Buschmann realmente trata `ame` como formación morfológica y no sólo como rótulo del título?

**Sí.** En el texto primario desarrolla una sección especial sobre la amplitud de la formación, que puede extenderse de participios a sustantivos y adjetivos.

En tarahumara propone como forma simple `ame`, a la cual se agrega generalmente `ke`, obteniendo `ameke`; reconoce reducción de `ke` a `c` o cero y una red de variantes/expansiones `me/meke`, `gameke/game`, `cameke/came`, `jameke/yame`, `iameke`, etc.

**Decisión:** `Buschmann_primary_text_recovered=true`; `Buschmann_Tarahumara_analysis=multi_layered`.

## Test BUS-2 · ¿Buschmann aporta nuevos datos primarios tarahumaras?

**No.** Explica su genealogía documental:

- formas con asterisco = Tellechea;
- formas sin asterisco = Steffel.

Su independencia es comparativa/analítica, no de corpus primario.

**Decisión:** `Buschmann_primary_Tarahumara_data_independence=false`; `Buschmann_interpretive_independence=true`.

## Test C02-1 · ¿Buschmann analiza el token histórico pertinente?

**Sí.** En §176, dentro de los adjetivos formados mediante `ame`, bajo la subforma `ameke`, incluye una forma OCR `ischiper-ameke` con la glosa ‘delgado, fino; plano, liso’.

La forma no lleva asterisco y, según su propia convención, procede de Steffel. La identidad con `Tschipérameke / čipérameke` está asegurada por la fuente, el perfil fonográfico y la coincidencia semántica.

El análisis no depende sólo del guion OCR: el lexema está clasificado por Buschmann dentro de la formación `ameke` en una sección explícitamente derivacional.

**Decisión:** `C02_historical_token_specific_analysis=true`.

## Test C02-2 · ¿C02 satisface ya el criterio A?

**Sí.** El bloqueo histórico estructural desaparece. El extremo moderno conserva `chipérami` ‘plano’, con uso lexicográfico y discursivo independiente, y la raíz histórica/moderna es formalmente muy cercana.

**C02 = A.**

### Restricción

A no significa que una fuente haya declarado la cognación histórica-moderna ni que exista una ley universal `-ameke > -ami`.

## Test C03/C06 · ¿Buschmann autoriza segmentar retrospectivamente `-ca/-ka` en los colores?

**No; hace lo contrario.** Al discutir `rosa-cameke/rosa-came` ‘blanco’ y `tscho-cameke/tscho-came` ‘negro’, advierte que no debe inventarse un simplex/base no documentado y que el `c` puede pertenecer al radical.

**Decisión:** C03 y C06 conservan B+; se fortalece la cautela estructural.

## Test C05 · ¿Buschmann fortalece el puente `selíameke ~ seri-game`?

**Sí, pero no hasta A.** En la sección de nombres de agente yuxtapone explícitamente Steffel `seli-ameke` y Tellechea `*seri-game` como formas de ‘gobernante’.

Esto añade una comparación histórica publicada `l~r` específica del lexema, pero C05 conserva B+ fuerte porque:

- la continuidad moderna no está etimológicamente adjudicada;
- subsiste la tradición competidora ‘portador de lanza’;
- no se resuelve la relación histórica gobierno↔lanza.

## H15 refinada

### Buschmann

- rótulo comparativo general `ame`;
- tarahumara `ame + ke → ameke` en su análisis;
- `ke → c/Ø` como reducción que él propone;
- reconoce `me/meke` y múltiples expansiones;
- en otro pasaje llama `me` el gran elemento participial.

### Pimentel

- critica la primacía de `ame`;
- propone `kame`;
- trata `ame/me` como contracciones.

**Nueva formulación:** `H15_19c_internal_structure_dispute=directly_documented`.

## N14

**El rótulo general de una familia morfológica no equivale a una teoría uniforme de su segmentación interna.**

El título de Buschmann dice `ame`, pero su análisis real distingue `ame + ke`, `me/meke` y numerosas expansiones. No reducir su teoría al título.

## Estado de cartera v13

- **A:** C01, C02, C07, C08.
- **B/B+:** C03, C04, C05, C06, C09.
- **C:** ninguno.

## Próxima prueba

Con C02 resuelto, los mayores cuellos siguen siendo:

1. C06: Rodríguez pp.162–164 / BL fol.35r / ejemplar NYPL;
2. C09: facsímil Tellechea;
3. C03: estructura histórica exacta;
4. C04: parse/comparación histórica directa;
5. C05: adjudicación gobierno↔lanza / comparación etimológica directa.
