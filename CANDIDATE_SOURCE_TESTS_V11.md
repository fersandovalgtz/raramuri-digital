# Pruebas fuente-basadas de candidatos — v11

**Fecha:** 14 de agosto de 2026  
**Síntesis general:** `AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`  
**Matriz previa:** `EVIDENCE_MASTER_MATRIX_V10.md`

## Cambio de esta ronda

La prueba se concentró en el estrato 1683 de C06 y en la procedencia de `tsocamec/otsocamec`.

C06 **no cambia de grado**: permanece B formal, B+ excepcional / cercano a A en Steffel→moderno. La ganancia es grafemática y de procedencia documental.

## Test C06-G1 · ¿`tsocamec/otsocamec` aparece en ambos testigos de Guadalaxara?

**No.** Rodríguez López cotejó el manuscrito zapopano y el impreso conservado en la British Library y señala que `tsocamec/otsocamec` (fol. 35r), ‘oscuro/negro’, es el único término rarámuri del impreso que no aparece en el manuscrito.

**Decisión:** `printed_1683_black_form_unique_to_print=true`; `zapopan_manuscript_doublet=false`.

## Test C06-G2 · ¿El `<c>` final es una modernización editorial de 2010?

**No.** Los criterios de edición declaran que la transcripción del impreso respeta los términos escritos y signos del ejemplar de la British Library. Las sustituciones tipográficas introducidas por Rodríguez se diseñan para no alterar el valor fonético de los grafemas originales.

**Decisión:** `printed_final_c_editorially_faithful=true`.

## Test C06-G3 · ¿Eso prueba que `<c>` final = /k/ o `-ke`?

**No.** Fidelidad diplomática no equivale a análisis fonológico ni morfológico.

**Decisión:**

- `final_c_phonetic_value=unresolved`;
- `final_c_expletive_status=unresolved`;
- `final_c_to_Steffel_ke_relation=not_demonstrated`.

## Test C06-G4 · ¿La edición de Rodríguez trata /k/ y la reduplicación expletiva como problema del documento histórico?

**Sí.** La edición incluye el apartado “El fonema oclusivo velar /k/ del tarahumar y la reduplicación expletiva” (p. 162), seguido de “Las letras equívocas” (p. 163).

**Pero** el texto completo de esas páginas no se recuperó de manera estable en la ruta digital consultada. No se atribuye al autor una regla específica para `tsocamec` sin leer el pasaje.

**Decisión:** `Rodriguez_k_expletive_section_exists=true`; `token_specific_application=not_demonstrated`.

## Test C06-G5 · ¿La reduplicación expletiva moderna resuelve el `<c>` de 1683?

**No.** Brambila y otras descripciones modernas documentan el patrón opcional K + repetición de la vocal final (`gomá~gomáka`, `remé~reméke`, etc.), pero este dato sólo genera una hipótesis histórica que debe probarse en el documento colonial.

**Decisión:** `modern_expletive_reduplication=hypothesis_generating_only`.

## Test C06-G6 · ¿Existe otra copia del impreso susceptible de cotejo?

Una publicación de historia del libro reporta haber consultado un ejemplar de Guadalaxara 1683 en la New York Public Library. En esta ronda no se recuperó todavía el registro digital ni el folio 35r.

**Decisión:** `NYPL_second_print_copy_reported=true`; `NYPL_visual_control=false`.

## Nuevo control N12

**N12. Fidelidad diplomática de un grafema no equivale a identificación fonológica o morfológica.**

Para `tsocamec/otsocamec`, `<c>` final no se convierte automáticamente en /k/, reduplicación expletiva, `-ke` ni equivalente de Steffel.

## Adjudicación

C06 conserva:

`C06_tier=B`;  
`C06_strength=B+_exceptional_near_A_Steffel_to_modern`.

El cuello de botella pasa a formularse como **control grafemático/facsimilar del impreso**, no como necesidad de más evidencia moderna.

## Próximo test permitido

Sólo una de estas rutas justifica reabrir C06:

1. pp. 162–164 completas de Rodríguez 2010;
2. fol. 35r del ejemplar de British Library;
3. cotejo del ejemplar reportado de NYPL;
4. análisis histórico token-específico publicado.
