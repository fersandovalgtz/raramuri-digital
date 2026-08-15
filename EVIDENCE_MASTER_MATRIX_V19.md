# Matriz maestra de evidencia histórico-moderna — v19

**Fecha:** 2026-08-14  
**Máquina:** `data/research/evidence_master_matrix_v19.json`  
**Síntesis global:** `AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`

## Cambio respecto de v18

Los grados no cambian. C06 incorpora una auditoría de procedencia de los ejemplares supervivientes de Guadalaxara 1683.

Una publicación de Marina Garone Gravier afirma que consultó un ejemplar en la Biblioteca Pública de Nueva York. Sin embargo, búsquedas dirigidas en el catálogo público actual de NYPL no recuperaron un registro verificable del impreso, mientras bibliografías especializadas identifican de forma estable el ejemplar British Museum/British Library `C.38.a.12`, descrito históricamente incluso como el único ejemplar conocido.

La mención NYPL se conserva como **fuente-atestiguada pero materialmente no identificada**. No puede contarse como un segundo original independiente hasta recuperar signatura, soporte y procedencia.

## Matriz vigente

| ID | Candidato | Nivel | Estado vigente | Abierto |
|---|---|---:|---|---|
| C01 | `Cotſchimé → Cotſchimeameke / Cochí → cochíami` | **A** | sin cambio | correspondencias residuales |
| C02 | `Tschipérameke / čipérameke ↔ Chipérami` | **A** | análisis histórico Buschmann | cognación etiquetada no necesaria para A |
| C03 | `Rosácameke ~ rosácame ↔ Rosácame / Rosácami` | **A** | familia `ame` histórica y continuidad | frontera histórica `c` |
| C04-core | `Nessé/Nesséameke ↔ nese-/nesame/Neseme` | **A** | núcleo adjudicado | subrama Nisé separada |
| C04-Nisé | `Nisé/Niséami` | **abierto** | evidencia insuficiente | mecanismo comparativo directo |
| C05-government-core | `selí → selíameke ↔ seri-/sir- → sirame/siríame` | **A** | núcleo lingüístico adjudicado | rama histórico-cultural separada |
| C05-historical-title | tradición `selígame` vinculada a otra familia | **abierto** | tradición documentada | relación etimológica con núcleo de gobierno |
| **C06** | `tsocamec/otsocamec → čókameke ~ čókame → chó-ka-me` | **B (B+ excepcional)** | único B principal; control histórico de kV fuerte; ejemplar BL identificado; NYPL reportado pero no identificado | valor token-específico de `<c>`; facsímil/regla grafemática |
| C07 | `tsane-li-ameke ↔ ani-lí-ame` | **A** | sin cambio | cognación de raíz |
| C08 | `Tschutschá → Tschutschelíameke` | **A** | análisis compuesto fuente-explícito | sin glosa única |
| C09-core | Tellechea `ati-/simi-/machi-` | **A** | facsímil directo | mecanismo común no incluido |
| C09-OCR-network | `netetu-/rejoíruga-/ayorigu-` | **abierto** | OCR fuerte/probable | facsímil propio |
| C09-mechanism | `-amec/-ameque/-ame` | **abierto** | alternancia observada | mecanismo histórico común |

## C06 · testigos materiales

### British Library

El ejemplar `C.38.a.12` está repetidamente identificado en bibliografías lingüísticas/históricas como testigo del impreso de 1683. Se trata del punto material estable para un futuro control del fol. 35r.

`British_Library_copy_independently_attested=true`.

### NYPL

Garone Gravier declara `Ejemplar consultado en la Biblioteca Pública de Nueva York` para el mismo título y edición.

`NYPL_copy_report_source_attested=true`.

Sin embargo:

- no se recuperó signatura NYPL;
- el catálogo público actual no devolvió un registro verificable del original;
- no se estableció si era original, microfilm, reproducción o material legado;
- no se estableció independencia respecto del ejemplar británico.

Por tanto:

`NYPL_copy_identity=unresolved`;  
`NYPL_second_original_witness=not_demonstrated`;  
`NYPL_independence_from_BL=not_demonstrated`.

## N20

**Una referencia publicada a un ejemplar consultado en una biblioteca no equivale a un testigo independiente verificado mientras no se recuperen identidad bibliográfica, soporte y procedencia.**

## Consecuencia práctica

La búsqueda de una “segunda copia NYPL” deja de ser la vía principal de C06. La prioridad queda:

1. facsímil o reproducción controlada del British Library `C.38.a.12`, especialmente fol. 35r;
2. Rodríguez López 2010 pp. 162–164, para reglas de /k/, reduplicación expletiva y letras equívocas;
3. NYPL sólo si aparece un registro/signatura que permita decidir la naturaleza del objeto citado por Garone.

## Estado de cartera v19

- **A:** C01, C02, C03, C04-core, C05-government-core, C07, C08, C09-core.
- **B/B+:** C06.
- **Abiertas:** C04-Nisé, C05-historical-title, C09-OCR-network, C09-mechanism.
- **C:** ninguna.

## Fase

`resolve_final_principal_B_candidate`.

La investigación deja de acumular nuevas similitudes. Todo esfuerzo principal debe dirigirse a adjudicar token-específicamente el material `<c>` de `tsocamec/otsocamec` o, en su defecto, demostrar que esa adjudicación no es recuperable con los testigos conservados.
