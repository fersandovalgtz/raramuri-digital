# Índice maestro de investigación — Rarámuri Histórico Digital

**Estado de corte:** 2026-08-14  
**Repositorio:** `fersandovalgtz/raramuri-digital`  
**Documento canónico vigente de la línea diacrónica:** [`AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`](AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md)

## Propósito

Este archivo es el punto de entrada estable para la investigación filológica y diacrónica acumulada en el repositorio. Las versiones anteriores se conservan como historial epistemológico; la interpretación vigente debe partir del documento canónico general, de [`RESEARCH_EVIDENCE_STATUS.md`](RESEARCH_EVIDENCE_STATUS.md) y de la matriz [`EVIDENCE_MASTER_MATRIX_V5.md`](EVIDENCE_MASTER_MATRIX_V5.md).

## 0. Política operativa vigente

- [`PROJECT_VALIDATION_POLICY_V1.md`](PROJECT_VALIDATION_POLICY_V1.md): validación documental, trazable y reproducible. La valoración humana externa no es requisito; cuando la fuente no permite decidir, el estado correcto es `no resuelto`.
- [`CANDIDATE_LAYER_PUBLICATION_V1.md`](CANDIDATE_LAYER_PUBLICATION_V1.md): frontera entre dataset estable `1.0.0` y capas `1.1.0-candidate`.
- [`INTEROPERABILITY_1_1_CANDIDATE_V1.md`](INTEROPERABILITY_1_1_CANDIDATE_V1.md): TEI Lex-0 y CLDF candidatos.

## 1. Síntesis y matriz vigentes

- [`AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`](AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md): síntesis general vigente; no se crea v19 porque las últimas rondas fortalecen candidatos concretos sin cambiar el modelo global.
- [`EVIDENCE_MASTER_MATRIX_V5.md`](EVIDENCE_MASTER_MATRIX_V5.md) y [`data/research/evidence_master_matrix_v5.json`](data/research/evidence_master_matrix_v5.json): matriz vigente.
- [`CANDIDATE_SOURCE_TESTS_V5.md`](CANDIDATE_SOURCE_TESTS_V5.md): pruebas fuente-basadas vigentes.
- [`C02_CHIPER_DIACHRONIC_BRIDGE_V1.md`](C02_CHIPER_DIACHRONIC_BRIDGE_V1.md): auditoría focal de C02.
- [`C04_NES_FAMILY_MORPHOLOGICAL_CONTROL_V3.md`](C04_NES_FAMILY_MORPHOLOGICAL_CONTROL_V3.md): auditoría focal de C04.
- [`TELLECHEA_1826_SHORT_AME_TARGETED_AUDIT_V5.md`](TELLECHEA_1826_SHORT_AME_TARGETED_AUDIT_V5.md): auditoría focal vigente de C09.

Las versiones anteriores se conservan como **instantáneas históricas del razonamiento**, no como estados vigentes.

## 2. Hallazgo focal C02

La edición crítica de Merrill et al. documenta `Tschipérameke` ‘fino, delgado, llano’ y proporciona la transcripción `tschipérameke || čipérameke`. Steffel usa además `Guenomí tschipérameke` para ‘un metal delgado’.

El moderno Samachique 2016 registra `chipérami adj. plano` y `walú chipérami` ‘como una tabla ancha’; SRC-02 registra `Chipérami` ‘Plano’ como Pp. *Cazador de palabras rarámuri* documenta `chiperami` en contexto de tablilla.

C02 pasa a **B+ fuerte**: la raíz histórica `čipér-` y moderna `chipér-` y el campo semántico ‘delgado/llano/plano’ se alinean de modo muy fuerte. No sube a A porque no se recuperó base/paradigma histórico `čiper-` ni parse token-específico del histórico `čipérameke`.

## 3. Hallazgo focal C04

La cadena documentada incluye `Nessé/Nesséameke`, la familia moderna `nesema/nesbonama/nesame/neser/neserichi`, `Neseme` Baja/Western y `Nisé/Niséami/nise’ami`.

Cinco controles internos `Xema ~ Xame` (`benema ~ bename`, `natogema ~ natogame`, `ne’ogema ~ ne’ogame`, `nichugema ~ nichugame`, `semema ~ semame`) permiten tratar la pertenencia de `nesame` al patrón participial/agentivo como **alta confianza interna de fuente**.

C04 sigue formalmente en **B+ excepcional / cercano a A** porque falta parse token-específico y una identificación histórica directa `Nessé ~ nes-/Nisé`.

## 4. Hallazgo focal C09 · Tellechea

La auditoría v4 depuró 24 ocurrencias crudas largas. La auditoría v5 revisó 168 ocurrencias crudas / 111 cadenas breves únicamente alrededor de raíces justificadas o paralelos españoles pertinentes.

Redes fuertes OCR + contexto: `ati-`, `simi-`, `machi-`, `netetu-`, `rejoíruga-`. `ayorigu-` permanece probable; `yumága-` conserva forma larga OCR corrupta. Los falsos pares `gayénameque ~ gayéname` y `natámeque ~ natáme` fueron eliminados por reconstrucción de saltos de línea.

C09 permanece **B fuerte+**. La búsqueda OCR general queda cerrada después de v5; el siguiente salto exige facsímil y control grafemático.

## 5. Auditorías de fuente primaria o edición crítica

- [`STEFFEL_AMEKE_AME_AMI_SOURCE_AUDIT_V1.md`](STEFFEL_AMEKE_AME_AMI_SOURCE_AUDIT_V1.md)
- [`HISTORICAL_LI_AMEKE_CANDIDATE_AUDIT_V2.md`](HISTORICAL_LI_AMEKE_CANDIDATE_AUDIT_V2.md)
- [`GUADALAXARA_1683_DIGITAL_ACCESS_RECON_V1.md`](GUADALAXARA_1683_DIGITAL_ACCESS_RECON_V1.md)
- [`COLOR_BLACK_TSOCAMEC_DIACHRONIC_BRIDGE_V1.md`](COLOR_BLACK_TSOCAMEC_DIACHRONIC_BRIDGE_V1.md)
- [`GUADALAXARA_1683_OKAMEK_INDEPENDENT_CONTROL_V1.md`](GUADALAXARA_1683_OKAMEK_INDEPENDENT_CONTROL_V1.md)
- [`TELLECHEA_1826_PARTICIPIAL_VARIATION_BRIDGE_V1.md`](TELLECHEA_1826_PARTICIPIAL_VARIATION_BRIDGE_V1.md)
- [`TELLECHEA_1826_INTERNAL_PARTICIPIAL_ALTERNATION_V2.md`](TELLECHEA_1826_INTERNAL_PARTICIPIAL_ALTERNATION_V2.md)
- [`TELLECHEA_1826_FINAL_VELAR_DELETION_MECHANISM_V3.md`](TELLECHEA_1826_FINAL_VELAR_DELETION_MECHANISM_V3.md) — histórico parcialmente superado por v18.
- [`TELLECHEA_1826_AME_TOKEN_AUDIT_V4.md`](TELLECHEA_1826_AME_TOKEN_AUDIT_V4.md) — inventario largo OCR.
- [`TELLECHEA_1826_SHORT_AME_TARGETED_AUDIT_V5.md`](TELLECHEA_1826_SHORT_AME_TARGETED_AUDIT_V5.md) — auditoría breve dirigida.

## 6. Puentes morfológicos modernos e históricos

- [`COLOR_KAMEKE_KAME_PARTICIPIAL_BRIDGE.md`](COLOR_KAMEKE_KAME_PARTICIPIAL_BRIDGE.md)
- [`ANI_LI_AME_CROSSVARIETY_EVIDENCE_V1.md`](ANI_LI_AME_CROSSVARIETY_EVIDENCE_V1.md)
- [`BINI_LEARNING_DERIVATIONAL_FAMILY_AUDIT.md`](BINI_LEARNING_DERIVATIONAL_FAMILY_AUDIT.md)
- [`BLUE_GREEN_SIYO_FORMAL_CORRESPONDENCE_AUDIT.md`](BLUE_GREEN_SIYO_FORMAL_CORRESPONDENCE_AUDIT.md)
- [`CANDIDATE_EVIDENCE_INDEPENDENCE_MATRIX_V4.md`](CANDIDATE_EVIDENCE_INDEPENDENCE_MATRIX_V4.md)

## 7. Artefactos reproducibles

Referencias de máquina vigentes:

- [`data/research/evidence_master_matrix_v5.json`](data/research/evidence_master_matrix_v5.json);
- [`data/research/tellechea_1826_ame_token_audit_v4.json`](data/research/tellechea_1826_ame_token_audit_v4.json);
- [`data/research/tellechea_1826_short_ame_targeted_audit_v5.json`](data/research/tellechea_1826_short_ame_targeted_audit_v5.json);
- [`research-state.json`](research-state.json).

## 8. Interoperabilidad y publicación candidata

El dataset estable sigue en `1.0.0`; las capas experimentales siguen en `1.1.0-candidate`. C02, C04 y C09 permanecen en expediente y **no se integran como cognaciones o segmentaciones asentadas en el corpus estable**.

## Lectura recomendada

1. `PROJECT_VALIDATION_POLICY_V1.md`;
2. `RESEARCH_EVIDENCE_STATUS.md`;
3. `EVIDENCE_MASTER_MATRIX_V5.md`;
4. `AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`;
5. `C02_CHIPER_DIACHRONIC_BRIDGE_V1.md`;
6. `C04_NES_FAMILY_MORPHOLOGICAL_CONTROL_V3.md`;
7. `TELLECHEA_1826_SHORT_AME_TARGETED_AUDIT_V5.md`;
8. `RESEARCH_DEPENDENCIES.md` antes de abrir nuevas búsquedas.

## Regla de mantenimiento

No elevar una hipótesis por cantidad de apariciones, semejanza gráfica o repetición dentro de una misma tradición editorial. Una correspondencia formal-semántica muy fuerte no sustituye un parse histórico ni una cognación demostrada. Para C02 sólo reabrir búsqueda ante base/paradigma histórico o análisis token-específico; para C04, ante parse o comparación histórica directa; para C09, ante facsímil/grafemática.
