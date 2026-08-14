# Índice maestro de investigación — Rarámuri Histórico Digital

**Estado de corte:** 2026-08-14  
**Repositorio:** `fersandovalgtz/raramuri-digital`  
**Documento canónico vigente de la línea diacrónica:** [`AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`](AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md)

## Propósito

Este archivo es el punto de entrada estable para la investigación filológica y diacrónica acumulada en el repositorio. Las versiones anteriores se conservan como historial epistemológico; la interpretación vigente debe partir del documento canónico general, de [`RESEARCH_EVIDENCE_STATUS.md`](RESEARCH_EVIDENCE_STATUS.md) y de la matriz [`EVIDENCE_MASTER_MATRIX_V3.md`](EVIDENCE_MASTER_MATRIX_V3.md).

## 0. Política operativa vigente

- [`PROJECT_VALIDATION_POLICY_V1.md`](PROJECT_VALIDATION_POLICY_V1.md): validación documental, trazable y reproducible. La valoración humana externa no es requisito, bloqueo ni criterio de promoción. Cuando la fuente no permite decidir, el estado correcto es `no resuelto`.
- [`CANDIDATE_LAYER_PUBLICATION_V1.md`](CANDIDATE_LAYER_PUBLICATION_V1.md): frontera entre el dataset estable `1.0.0` y las capas experimentales `1.1.0-candidate`.
- [`INTEROPERABILITY_1_1_CANDIDATE_V1.md`](INTEROPERABILITY_1_1_CANDIDATE_V1.md): mapeo y validación automatizada en TEI Lex-0 y CLDF.

## 1. Síntesis y matriz vigentes

- [`AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`](AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md): síntesis general vigente. Corrige la sobreextensión del mecanismo de Tellechea e incorpora control `e~i/é~í`.
- [`EVIDENCE_MASTER_MATRIX_V3.md`](EVIDENCE_MASTER_MATRIX_V3.md): matriz A/B/C/D/N vigente. C04 permanece B con fuerza `B+ excepcional / cercano a A`; C09 permanece B fuerte pendiente de facsímil; N06 distingue replicación documental de independencia genealógica.
- [`data/research/evidence_master_matrix_v3.json`](data/research/evidence_master_matrix_v3.json): estado legible por máquina.
- [`CANDIDATE_SOURCE_TESTS_V3.md`](CANDIDATE_SOURCE_TESTS_V3.md): pruebas fuente-basadas de la familia `nes-`.
- [`C04_NES_FAMILY_MODERN_BRIDGE_V1.md`](C04_NES_FAMILY_MODERN_BRIDGE_V1.md): expediente focal de C04 con Márquez 1999, Tarahumara Baja/Western, Compendio 1997, SRC-02 y Balleza.
- [`C04_NES_FAMILY_MORPHOLOGICAL_CONTROL_V2.md`](C04_NES_FAMILY_MORPHOLOGICAL_CONTROL_V2.md): control morfológico de cierre. La lectura participial de `nesame` está fuertemente predicha por la gramática de la misma fuente, pero la segmentación token-específica y `nesema ↔ nesame` siguen abiertas.
- [`TELLECHEA_1826_AME_TOKEN_AUDIT_V4.md`](TELLECHEA_1826_AME_TOKEN_AUDIT_V4.md): auditoría exhaustiva del OCR largo de Tellechea; clasifica 24 hits, reconstruye saltos de línea, confirma tres familias fuertes y registra dos nuevas candidatas OCR.
- [`data/research/tellechea_1826_ame_token_audit_v4.json`](data/research/tellechea_1826_ame_token_audit_v4.json): contraparte reproducible de la auditoría C09.

Las versiones V6–V17, matrices v1/v2 y source tests v1/v2 se conservan como **instantáneas históricas del razonamiento**, no como estado vigente.

## 2. Auditorías de fuente primaria o edición crítica

- [`STEFFEL_AMEKE_AME_AMI_SOURCE_AUDIT_V1.md`](STEFFEL_AMEKE_AME_AMI_SOURCE_AUDIT_V1.md)
- [`HISTORICAL_LI_AMEKE_CANDIDATE_AUDIT_V2.md`](HISTORICAL_LI_AMEKE_CANDIDATE_AUDIT_V2.md)
- [`GUADALAXARA_1683_DIGITAL_ACCESS_RECON_V1.md`](GUADALAXARA_1683_DIGITAL_ACCESS_RECON_V1.md)
- [`COLOR_BLACK_TSOCAMEC_DIACHRONIC_BRIDGE_V1.md`](COLOR_BLACK_TSOCAMEC_DIACHRONIC_BRIDGE_V1.md)
- [`GUADALAXARA_1683_OKAMEK_INDEPENDENT_CONTROL_V1.md`](GUADALAXARA_1683_OKAMEK_INDEPENDENT_CONTROL_V1.md)
- [`TELLECHEA_1826_PARTICIPIAL_VARIATION_BRIDGE_V1.md`](TELLECHEA_1826_PARTICIPIAL_VARIATION_BRIDGE_V1.md)
- [`TELLECHEA_1826_INTERNAL_PARTICIPIAL_ALTERNATION_V2.md`](TELLECHEA_1826_INTERNAL_PARTICIPIAL_ALTERNATION_V2.md)
- [`TELLECHEA_1826_FINAL_VELAR_DELETION_MECHANISM_V3.md`](TELLECHEA_1826_FINAL_VELAR_DELETION_MECHANISM_V3.md) — histórico parcialmente superado por v18: conservar evidencia, no la transferencia causal a participios.
- [`TELLECHEA_1826_AME_TOKEN_AUDIT_V4.md`](TELLECHEA_1826_AME_TOKEN_AUDIT_V4.md) — auditoría OCR contextual vigente; no equivale a cotejo facsimilar.

## 3. Hallazgo focal C04

La cadena documentada de C04 incluye:

`Nessé/Nesséameke` histórico  
→ familia moderna `nes-` de Márquez (`nesema`, `nesbonama`, `nesame`, `neser`, `neserichi`)  
→ `Neseme` Baja/Western  
↔ `Nisé/Niséami/nise’ami` en SRC-02 y Balleza.

El control morfológico v2 añade que los verbos se citan mediante el futuro, el participio presente se deriva del correspondiente indicativo con `-ame`, `-me/-mi` se clasifica como material adjetival/participial y los nombres de persona definidos por una actividad suelen ser participios. La lectura participial de `nesame` es por ello **fuertemente predicha**, no token-específicamente publicada.

C04 sigue en B+ excepcional: no se ha recuperado `nes-ame` como parse impreso ni una declaración histórica directa `Nessé ~ nes-/Nisé`.

## 4. Hallazgo focal C09 · Tellechea

La auditoría OCR v4 identifica 24 hits crudos en `-amec/-ameque` y demuestra que no todos son morfológicamente comparables. Las familias fuertes siguen siendo:

- `atígameque ~ atígame`;
- `simiámec ~ simíame`;
- `machiámec ~ machiámeque ~ machíameque ~ machíame`.

Se añaden como **candidatos OCR pendientes de facsímil**:

- `ayoriguámeque ~ ayoriguáme`;
- `rejoírugameque ~ rejoírugame`.

La auditoría corrige además límites falsos creados por OCR: `gameque` pertenece a `netetu-gameque`, `támeque` a `na-támeque`, y la supuesta forma breve `gayéname` es en realidad `gayéname-que` partido por salto de línea. Esta última no debe volver a usarse como par largo/breve.

C09 permanece **B fuerte** hasta cotejo facsimilar; no se modifica la matriz v3 porque no cambió de nivel.

## 5. Puentes morfológicos modernos e históricos

- [`COLOR_KAMEKE_KAME_PARTICIPIAL_BRIDGE.md`](COLOR_KAMEKE_KAME_PARTICIPIAL_BRIDGE.md)
- [`ANI_LI_AME_CROSSVARIETY_EVIDENCE_V1.md`](ANI_LI_AME_CROSSVARIETY_EVIDENCE_V1.md)
- [`BINI_LEARNING_DERIVATIONAL_FAMILY_AUDIT.md`](BINI_LEARNING_DERIVATIONAL_FAMILY_AUDIT.md)
- [`BLUE_GREEN_SIYO_FORMAL_CORRESPONDENCE_AUDIT.md`](BLUE_GREEN_SIYO_FORMAL_CORRESPONDENCE_AUDIT.md)
- [`CANDIDATE_EVIDENCE_INDEPENDENCE_MATRIX_V4.md`](CANDIDATE_EVIDENCE_INDEPENDENCE_MATRIX_V4.md)

## 6. Artefactos reproducibles

Las referencias de máquina vigentes son [`data/research/evidence_master_matrix_v3.json`](data/research/evidence_master_matrix_v3.json), [`data/research/tellechea_1826_ame_token_audit_v4.json`](data/research/tellechea_1826_ame_token_audit_v4.json) y [`research-state.json`](research-state.json). Los JSON anteriores se conservan para trazabilidad.

## 7. Interoperabilidad y publicación candidata

El dataset estable sigue en `1.0.0`; las capas experimentales siguen en `1.1.0-candidate`. C04 y las nuevas familias OCR de C09 permanecen en expediente y **no se integran como segmentaciones asentadas en el corpus estable**.

## Lectura recomendada

1. `PROJECT_VALIDATION_POLICY_V1.md`;
2. `RESEARCH_EVIDENCE_STATUS.md`;
3. `EVIDENCE_MASTER_MATRIX_V3.md`;
4. `AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`;
5. `C04_NES_FAMILY_MORPHOLOGICAL_CONTROL_V2.md`;
6. `TELLECHEA_1826_AME_TOKEN_AUDIT_V4.md`;
7. `CANDIDATE_SOURCE_TESTS_V3.md`;
8. `RESEARCH_DEPENDENCIES.md` antes de abrir nuevas búsquedas.

## Regla de mantenimiento

No elevar una hipótesis por cantidad de apariciones, semejanza gráfica, alternancia fonológica documentada en otros lexemas ni repetición dentro de una misma tradición editorial. Tampoco convertir una derivación fuertemente predicha por la gramática general en un parse token-específico que la fuente no imprime, ni tratar cortes de línea OCR como límites léxicos. Una cuestión no resuelta permanece explícitamente **no resuelta**.
