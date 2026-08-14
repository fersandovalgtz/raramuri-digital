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

## 3. Hallazgo focal vigente: C04

La cadena documentada de C04 incluye ahora tres capas modernas además de Steffel:

`Nessé/Nesséameke` histórico  
→ familia moderna `nes-` de Márquez (`nesema`, `nesbonama`, `nesame`, `neser`, `neserichi`)  
→ `Neseme` Baja/Western  
↔ `Nisé/Niséami/nise’ami` en SRC-02 y Balleza.

El *Compendio básico de la gramática ralámuli* de 1997 documenta `-ame/-me` participial regionalmente, lo que vuelve estructuralmente plausible `nesame/neseme`. No se registra todavía un parse token-específico ni una declaración histórica directa `Nessé ~ nes-/Nisé`; por eso C04 sigue en B.

La replicación Western/Lowland relacionada con Don Burgess se conserva como apoyo intravariedad, no como varias fuentes independientes.

## 4. Puentes morfológicos modernos e históricos

- [`COLOR_KAMEKE_KAME_PARTICIPIAL_BRIDGE.md`](COLOR_KAMEKE_KAME_PARTICIPIAL_BRIDGE.md)
- [`ANI_LI_AME_CROSSVARIETY_EVIDENCE_V1.md`](ANI_LI_AME_CROSSVARIETY_EVIDENCE_V1.md)
- [`BINI_LEARNING_DERIVATIONAL_FAMILY_AUDIT.md`](BINI_LEARNING_DERIVATIONAL_FAMILY_AUDIT.md)
- [`BLUE_GREEN_SIYO_FORMAL_CORRESPONDENCE_AUDIT.md`](BLUE_GREEN_SIYO_FORMAL_CORRESPONDENCE_AUDIT.md)
- [`CANDIDATE_EVIDENCE_INDEPENDENCE_MATRIX_V4.md`](CANDIDATE_EVIDENCE_INDEPENDENCE_MATRIX_V4.md)

## 5. Artefactos reproducibles

La referencia de máquina vigente es [`data/research/evidence_master_matrix_v3.json`](data/research/evidence_master_matrix_v3.json) junto con [`research-state.json`](research-state.json). Los JSON anteriores se conservan para trazabilidad.

## 6. Interoperabilidad y publicación candidata

El dataset estable sigue en `1.0.0`; las capas experimentales siguen en `1.1.0-candidate`. La investigación C04 permanece en expediente y **no se integra como segmentación asentada en el corpus estable**.

## Lectura recomendada

1. `PROJECT_VALIDATION_POLICY_V1.md`;
2. `RESEARCH_EVIDENCE_STATUS.md`;
3. `EVIDENCE_MASTER_MATRIX_V3.md`;
4. `AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`;
5. `C04_NES_FAMILY_MODERN_BRIDGE_V1.md`;
6. `CANDIDATE_SOURCE_TESTS_V3.md`;
7. `RESEARCH_DEPENDENCIES.md` antes de abrir nuevas búsquedas.

## Regla de mantenimiento

No elevar una hipótesis por cantidad de apariciones, semejanza gráfica, alternancia fonológica documentada en otros lexemas ni repetición dentro de una misma tradición editorial. Para C04, el próximo cambio de nivel exige una segmentación publicada de `nesame/neseme` o una identificación histórica directa de `Nessé ~ nes-/Nisé`. Una cuestión no resuelta permanece explícitamente **no resuelta**.
