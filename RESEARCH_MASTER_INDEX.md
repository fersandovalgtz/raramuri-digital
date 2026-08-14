# Índice maestro de investigación — Rarámuri Histórico Digital

**Estado de corte:** 2026-08-14  
**Repositorio:** `fersandovalgtz/raramuri-digital`  
**Documento canónico vigente de la línea diacrónica:** [`AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`](AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md)

## Propósito

Este archivo es el punto de entrada estable para la investigación filológica y diacrónica acumulada en el repositorio. Las versiones anteriores se conservan como historial epistemológico; la interpretación vigente debe partir siempre del documento canónico más reciente, de [`RESEARCH_EVIDENCE_STATUS.md`](RESEARCH_EVIDENCE_STATUS.md) y de la matriz maestra [`EVIDENCE_MASTER_MATRIX_V2.md`](EVIDENCE_MASTER_MATRIX_V2.md).

## 0. Política operativa vigente

- [`PROJECT_VALIDATION_POLICY_V1.md`](PROJECT_VALIDATION_POLICY_V1.md): validación documental, trazable y reproducible. La valoración humana externa no es requisito, bloqueo ni criterio de promoción. Cuando la fuente no permite decidir, el estado correcto es `no resuelto`.
- [`CANDIDATE_LAYER_PUBLICATION_V1.md`](CANDIDATE_LAYER_PUBLICATION_V1.md): frontera entre el dataset estable `1.0.0` y las capas experimentales `1.1.0-candidate`.
- [`INTEROPERABILITY_1_1_CANDIDATE_V1.md`](INTEROPERABILITY_1_1_CANDIDATE_V1.md): mapeo y validación automatizada de las capas candidatas en TEI Lex-0 y CLDF.

## 1. Síntesis canónica vigente

- [`AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`](AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md): síntesis vigente. Corrige la sobreextensión del mecanismo de Tellechea, incorpora el control `e~i/é~í` de Merrill y fortalece C04 sin promoverlo artificialmente a A.
- [`EVIDENCE_MASTER_MATRIX_V2.md`](EVIDENCE_MASTER_MATRIX_V2.md): jerarquía vigente A/B/C/D/N. C04 = B (`B+` interno); C09 = B fuerte pendiente de facsímil; N05 impide inferir cognación automática desde alternancia vocálica general.
- [`data/research/evidence_master_matrix_v2.json`](data/research/evidence_master_matrix_v2.json): representación legible por máquina de los cambios de v2.
- [`CANDIDATE_SOURCE_TESTS_V2.md`](CANDIDATE_SOURCE_TESTS_V2.md): pruebas fuente-basadas que justifican el fortalecimiento de C04 y la rebaja metodológica de C09.

Las versiones `V6`–`V17` deben tratarse como **instantáneas históricas del razonamiento**, no como estados vigentes.

## 2. Auditorías de fuente primaria o edición crítica

- [`STEFFEL_AMEKE_AME_AMI_SOURCE_AUDIT_V1.md`](STEFFEL_AMEKE_AME_AMI_SOURCE_AUDIT_V1.md): auditoría de Steffel/Merrill para `-ameke`, `-ame` y aparentes `-ami`.
- [`HISTORICAL_LI_AMEKE_CANDIDATE_AUDIT_V2.md`](HISTORICAL_LI_AMEKE_CANDIDATE_AUDIT_V2.md): depuración de candidatos históricos `X-li-ameke` y clasificación D1/D2/controles negativos.
- [`GUADALAXARA_1683_DIGITAL_ACCESS_RECON_V1.md`](GUADALAXARA_1683_DIGITAL_ACCESS_RECON_V1.md): localización y arquitectura documental de Rodríguez López 2010/Guadalaxara 1683.
- [`COLOR_BLACK_TSOCAMEC_DIACHRONIC_BRIDGE_V1.md`](COLOR_BLACK_TSOCAMEC_DIACHRONIC_BRIDGE_V1.md): puente cromático de `tsocamec/otsocamec` hacia Steffel y formas modernas.
- [`GUADALAXARA_1683_OKAMEK_INDEPENDENT_CONTROL_V1.md`](GUADALAXARA_1683_OKAMEK_INDEPENDENT_CONTROL_V1.md): control independiente `ookamek ~ okamek`.
- [`TELLECHEA_1826_PARTICIPIAL_VARIATION_BRIDGE_V1.md`](TELLECHEA_1826_PARTICIPIAL_VARIATION_BRIDGE_V1.md): incorporación de Tellechea 1826 como estrato intermedio.
- [`TELLECHEA_1826_INTERNAL_PARTICIPIAL_ALTERNATION_V2.md`](TELLECHEA_1826_INTERNAL_PARTICIPIAL_ALTERNATION_V2.md): alternancias de misma raíz `machi-`, `simi-`, `ati-`; sigue siendo el expediente temático más útil sobre C09.
- [`TELLECHEA_1826_FINAL_VELAR_DELETION_MECHANISM_V3.md`](TELLECHEA_1826_FINAL_VELAR_DELETION_MECHANISM_V3.md): **documento histórico parcialmente superado por v18**. Su evidencia sobre pérdida/truncación se conserva, pero la transferencia del pasaje `que/ca` de pretéritos a un mecanismo participial específico ya no es interpretación vigente.

## 3. Puentes morfológicos modernos e históricos

- [`COLOR_KAMEKE_KAME_PARTICIPIAL_BRIDGE.md`](COLOR_KAMEKE_KAME_PARTICIPIAL_BRIDGE.md): continuidad cromática `-kameke ~ -kame` ↔ moderno `-ka-me` con cautela segmental.
- [`ANI_LI_AME_CROSSVARIETY_EVIDENCE_V1.md`](ANI_LI_AME_CROSSVARIETY_EVIDENCE_V1.md): evidencia transvariedad para `ani-lí-ame`.
- [`BINI_LEARNING_DERIVATIONAL_FAMILY_AUDIT.md`](BINI_LEARNING_DERIVATIONAL_FAMILY_AUDIT.md): familia derivacional `bini-/bene-`.
- [`BLUE_GREEN_SIYO_FORMAL_CORRESPONDENCE_AUDIT.md`](BLUE_GREEN_SIYO_FORMAL_CORRESPONDENCE_AUDIT.md): control formal del dominio azul/verde.
- [`CANDIDATE_EVIDENCE_INDEPENDENCE_MATRIX_V4.md`](CANDIDATE_EVIDENCE_INDEPENDENCE_MATRIX_V4.md): independencia de evidencia para evitar contar varias veces la misma raíz/fuente.

## 4. Hallazgos nuevos incorporados en v18

### Alternancia vocálica histórica

Merrill et al. 2020, cuadro 7.10, documentan en Steffel `síneví ~ síniví`, `taitéke ~ taitéki` y `¢elé ~ ¢elí`. La alternancia `e~i/é~í` es, por tanto, históricamente posible, pero los propios autores señalan que las alternancias vocálicas son limitadas y no siguen patrones evidentes.

### Familia `Nessé/Nisé`

C04 reúne ahora la cadena histórica `Nessé → Nesséameke → pouguá nesséameke` y la moderna `Nisé → Niséami`, más el testimonio narrativo `Echi nise’ami / niseami` en *Awilichi bawi / El origen del agua*. La correspondencia vocálica es plausible, no demostrada como regular; la cognación permanece no resuelta.

## 5. Artefactos reproducibles

- `steffel_ameke_ame_ami_source_audit_v1.json`
- `historical_li_ameke_candidate_audit_v2.json`
- `guadalaxara_1683_digital_access_recon_v1.json`
- `color_black_tsocamec_diachronic_bridge_v1.json`
- `guadalaxara_1683_okamek_independent_control_v1.json`
- `tellechea_1826_internal_participial_alternation_v2.json`
- `tellechea_1826_final_velar_deletion_mechanism_v3.json` — histórico, interpretar bajo las restricciones de v18
- [`data/research/evidence_master_matrix_v2.json`](data/research/evidence_master_matrix_v2.json)
- [`research-state.json`](research-state.json)

## 6. Interoperabilidad y publicación candidata

- `data/variants-typed.json`: 224 tokens tipados por origen/naturaleza documental.
- `data/lexical-relations.json`: 28 relaciones lexicográficas con destino documental resuelto.
- `scripts/generate-candidate-interoperability.mjs`: genera el paquete TEI Lex-0/CLDF `1.1.0-candidate` sin modificar las exportaciones estables.
- La corrida CI `31835809358` validó determinismo, `pycldf`, XSD Lex-0, lint, build y pruebas; detalle en `INTEROPERABILITY_1_1_CANDIDATE_V1.md`.

## Lectura recomendada

1. `PROJECT_VALIDATION_POLICY_V1.md`;
2. `RESEARCH_EVIDENCE_STATUS.md`;
3. `EVIDENCE_MASTER_MATRIX_V2.md`;
4. `AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`;
5. `CANDIDATE_SOURCE_TESTS_V2.md`;
6. auditoría temática correspondiente cuando se necesiten tokens o procedencia;
7. `RESEARCH_DEPENDENCIES.md` antes de abrir nuevas búsquedas.

## Regla de mantenimiento

Cada avance que cambie una conclusión debe conservar la versión anterior, crear una nueva síntesis versionada si cambia el modelo general, actualizar `RESEARCH_EVIDENCE_STATUS.md`, la matriz vigente y su JSON, `RESEARCH_DEPENDENCIES.md` cuando cambien bloqueos, `research-state.json` y el hito de investigación correspondiente.

No debe elevarse una hipótesis por semejanza gráfica aislada, por repetición de una fuente dependiente, por una alternancia fonológica documentada en otros lexemas ni por inferencia retrospectiva desde la morfología moderna. Cuando la evidencia documental no resuelva una cuestión, permanece explícitamente **no resuelta**.
