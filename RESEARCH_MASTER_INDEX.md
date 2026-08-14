# Índice maestro de investigación — Rarámuri Histórico Digital

**Estado de corte:** 2026-08-14  
**Repositorio:** `fersandovalgtz/raramuri-digital`  
**Documento canónico vigente de la línea diacrónica:** [`AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`](AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md)

## Propósito

Este archivo es el punto de entrada estable para la investigación filológica y diacrónica acumulada en el repositorio. Las versiones anteriores se conservan como historial epistemológico; la interpretación vigente debe partir del documento canónico general, de [`RESEARCH_EVIDENCE_STATUS.md`](RESEARCH_EVIDENCE_STATUS.md) y de la matriz [`EVIDENCE_MASTER_MATRIX_V4.md`](EVIDENCE_MASTER_MATRIX_V4.md).

## 0. Política operativa vigente

- [`PROJECT_VALIDATION_POLICY_V1.md`](PROJECT_VALIDATION_POLICY_V1.md): validación documental, trazable y reproducible. La valoración humana externa no es requisito, bloqueo ni criterio de promoción. Cuando la fuente no permite decidir, el estado correcto es `no resuelto`.
- [`CANDIDATE_LAYER_PUBLICATION_V1.md`](CANDIDATE_LAYER_PUBLICATION_V1.md): frontera entre el dataset estable `1.0.0` y las capas experimentales `1.1.0-candidate`.
- [`INTEROPERABILITY_1_1_CANDIDATE_V1.md`](INTEROPERABILITY_1_1_CANDIDATE_V1.md): mapeo y validación automatizada en TEI Lex-0 y CLDF.

## 1. Síntesis y matriz vigentes

- [`AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`](AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md): síntesis general vigente; no se crea v19 porque las últimas rondas fortalecen candidatos concretos sin cambiar el modelo global.
- [`EVIDENCE_MASTER_MATRIX_V4.md`](EVIDENCE_MASTER_MATRIX_V4.md) y [`data/research/evidence_master_matrix_v4.json`](data/research/evidence_master_matrix_v4.json): matriz vigente.
- [`CANDIDATE_SOURCE_TESTS_V4.md`](CANDIDATE_SOURCE_TESTS_V4.md): pruebas fuente-basadas vigentes.
- [`C04_NES_FAMILY_MORPHOLOGICAL_CONTROL_V3.md`](C04_NES_FAMILY_MORPHOLOGICAL_CONTROL_V3.md): control morfológico vigente de C04; cinco pares internos `Xema ~ Xame` vuelven de alta confianza interna la pertenencia de `nesame` al patrón participial/agentivo, sin convertirla en parse token-específico ni cognación histórica.
- [`TELLECHEA_1826_SHORT_AME_TARGETED_AUDIT_V5.md`](TELLECHEA_1826_SHORT_AME_TARGETED_AUDIT_V5.md): auditoría focal vigente de C09.
- [`data/research/tellechea_1826_short_ame_targeted_audit_v5.json`](data/research/tellechea_1826_short_ame_targeted_audit_v5.json): contraparte reproducible de C09 v5.

Las versiones anteriores se conservan como **instantáneas históricas del razonamiento**, no como estados vigentes.

## 2. Auditorías de fuente primaria o edición crítica

- [`STEFFEL_AMEKE_AME_AMI_SOURCE_AUDIT_V1.md`](STEFFEL_AMEKE_AME_AMI_SOURCE_AUDIT_V1.md)
- [`HISTORICAL_LI_AMEKE_CANDIDATE_AUDIT_V2.md`](HISTORICAL_LI_AMEKE_CANDIDATE_AUDIT_V2.md)
- [`GUADALAXARA_1683_DIGITAL_ACCESS_RECON_V1.md`](GUADALAXARA_1683_DIGITAL_ACCESS_RECON_V1.md)
- [`COLOR_BLACK_TSOCAMEC_DIACHRONIC_BRIDGE_V1.md`](COLOR_BLACK_TSOCAMEC_DIACHRONIC_BRIDGE_V1.md)
- [`GUADALAXARA_1683_OKAMEK_INDEPENDENT_CONTROL_V1.md`](GUADALAXARA_1683_OKAMEK_INDEPENDENT_CONTROL_V1.md)
- [`TELLECHEA_1826_PARTICIPIAL_VARIATION_BRIDGE_V1.md`](TELLECHEA_1826_PARTICIPIAL_VARIATION_BRIDGE_V1.md)
- [`TELLECHEA_1826_INTERNAL_PARTICIPIAL_ALTERNATION_V2.md`](TELLECHEA_1826_INTERNAL_PARTICIPIAL_ALTERNATION_V2.md)
- [`TELLECHEA_1826_FINAL_VELAR_DELETION_MECHANISM_V3.md`](TELLECHEA_1826_FINAL_VELAR_DELETION_MECHANISM_V3.md) — histórico parcialmente superado por v18: conservar evidencia, no transferencia causal a participios.
- [`TELLECHEA_1826_AME_TOKEN_AUDIT_V4.md`](TELLECHEA_1826_AME_TOKEN_AUDIT_V4.md) y [`data/research/tellechea_1826_ame_token_audit_v4.json`](data/research/tellechea_1826_ame_token_audit_v4.json): inventario exhaustivo de las formas largas OCR.
- [`TELLECHEA_1826_SHORT_AME_TARGETED_AUDIT_V5.md`](TELLECHEA_1826_SHORT_AME_TARGETED_AUDIT_V5.md): auditoría dirigida de las formas breves y estado focal vigente.

## 3. Hallazgo focal C04

La cadena documentada de C04 incluye:

`Nessé/Nesséameke` histórico  
→ familia moderna `nes-` de Márquez (`nesema`, `nesbonama`, `nesame`, `neser`, `neserichi`)  
→ `Neseme` Baja/Western  
↔ `Nisé/Niséami/nise’ami` en SRC-02 y Balleza.

El control morfológico v3 añade cinco controles internos dentro del mismo diccionario: `benema ~ bename`, `natogema ~ natogame`, `ne’ogema ~ ne’ogame`, `nichugema ~ nichugame` y `semema ~ semame`. Combinados con las reglas de la misma obra, permiten tratar la pertenencia de `nesame` al patrón participial/agentivo como **alta confianza interna de fuente**.

C04 sigue formalmente en B+ excepcional porque no se ha recuperado un parse impreso morfema por morfema del token exacto ni una declaración histórica directa `Nessé ~ nes-/Nisé`.

## 4. Hallazgo focal C09 · Tellechea

La auditoría v4 depuró las 24 ocurrencias crudas largas. La auditoría v5 revisó las 168 ocurrencias crudas / 111 cadenas breves únicamente alrededor de raíces justificadas o paralelos españoles pertinentes.

### Redes largas/breves fuertes por OCR + contexto

- `atígameque ~ atígame/atigame`;
- `simiámec ~ simíame`;
- `machiámec ~ machiámeque ~ machíameque ~ machíame`;
- `netetugameque ~ netétugame`;
- `rejoírugameque ~ rejoírugame/rejóirugame`.

### Pendientes de facsímil

- probable `ayoriguámeque ~ ayoriguáme`;
- candidato `yumága-`: largo OCR `yumctvameque` frente a breves `yumágame`, todos en contexto “Todopoderoso”; no reconstruir la forma larga sin lectura visual.

### Controles negativos OCR

- `gayéname` no es breve: es `gayéname-que` partido por línea;
- `natáme` no es breve: es `natáme-ra` / `natámera` partido por línea;
- `gameque` no es lema independiente: reconstruye `netetu-gameque`;
- `támeque` no es lema independiente: reconstruye `na-támeque`.

C09 permanece **B fuerte+**. La búsqueda OCR general queda cerrada después de v5; el siguiente salto exige facsímil y control grafemático.

## 5. Puentes morfológicos modernos e históricos

- [`COLOR_KAMEKE_KAME_PARTICIPIAL_BRIDGE.md`](COLOR_KAMEKE_KAME_PARTICIPIAL_BRIDGE.md)
- [`ANI_LI_AME_CROSSVARIETY_EVIDENCE_V1.md`](ANI_LI_AME_CROSSVARIETY_EVIDENCE_V1.md)
- [`BINI_LEARNING_DERIVATIONAL_FAMILY_AUDIT.md`](BINI_LEARNING_DERIVATIONAL_FAMILY_AUDIT.md)
- [`BLUE_GREEN_SIYO_FORMAL_CORRESPONDENCE_AUDIT.md`](BLUE_GREEN_SIYO_FORMAL_CORRESPONDENCE_AUDIT.md)
- [`CANDIDATE_EVIDENCE_INDEPENDENCE_MATRIX_V4.md`](CANDIDATE_EVIDENCE_INDEPENDENCE_MATRIX_V4.md)

## 6. Artefactos reproducibles

Las referencias de máquina vigentes son:

- [`data/research/evidence_master_matrix_v4.json`](data/research/evidence_master_matrix_v4.json);
- [`data/research/tellechea_1826_ame_token_audit_v4.json`](data/research/tellechea_1826_ame_token_audit_v4.json);
- [`data/research/tellechea_1826_short_ame_targeted_audit_v5.json`](data/research/tellechea_1826_short_ame_targeted_audit_v5.json);
- [`research-state.json`](research-state.json).

## 7. Interoperabilidad y publicación candidata

El dataset estable sigue en `1.0.0`; las capas experimentales siguen en `1.1.0-candidate`. C04 y las redes OCR de C09 permanecen en expediente y **no se integran como cognaciones o segmentaciones asentadas en el corpus estable**.

## Lectura recomendada

1. `PROJECT_VALIDATION_POLICY_V1.md`;
2. `RESEARCH_EVIDENCE_STATUS.md`;
3. `EVIDENCE_MASTER_MATRIX_V4.md`;
4. `AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`;
5. `C04_NES_FAMILY_MORPHOLOGICAL_CONTROL_V3.md`;
6. `TELLECHEA_1826_SHORT_AME_TARGETED_AUDIT_V5.md`;
7. `TELLECHEA_1826_AME_TOKEN_AUDIT_V4.md` para procedencia de hits largos;
8. `RESEARCH_DEPENDENCIES.md` antes de abrir nuevas búsquedas.

## Regla de mantenimiento

No elevar una hipótesis por cantidad de apariciones, semejanza gráfica, alternancia fonológica documentada en otros lexemas ni repetición dentro de una misma tradición editorial. Un patrón morfológico interno de alta confianza no debe presentarse como un parse token-específico que la fuente no imprime. Tampoco deben tratarse cortes de línea OCR como límites léxicos. Para Tellechea, la fase de búsqueda OCR queda cerrada después de v5: una nueva promoción exige evidencia facsimilar/grafemática.
