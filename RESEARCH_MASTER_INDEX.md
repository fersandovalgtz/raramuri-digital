# Índice maestro de investigación — Rarámuri Histórico Digital

**Estado de corte:** 2026-08-14  
**Repositorio:** `fersandovalgtz/raramuri-digital`  
**Documento canónico vigente de la línea diacrónica:** [`AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V17.md`](AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V17.md)

## Propósito

Este archivo es el punto de entrada estable para la investigación filológica y diacrónica acumulada en el repositorio. Su función es evitar que las sucesivas auditorías, versiones y artefactos reproducibles se lean como documentos independientes o equivalentes. Las versiones antiguas se conservan como historial epistemológico; la interpretación vigente debe partir siempre del documento canónico más reciente y del estado de evidencia resumido en [`RESEARCH_EVIDENCE_STATUS.md`](RESEARCH_EVIDENCE_STATUS.md).

## Jerarquía documental

### 1. Síntesis canónica vigente

- [`AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V17.md`](AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V17.md): síntesis actual del dominio histórico `*-ame ~ -ameke ~ -ame ~ -ami`, con control de Guadalaxara 1683, Steffel, Tellechea 1826 y datos modernos.

Las versiones `V6`–`V16` deben tratarse como **instantáneas históricas del razonamiento**, no como estados vigentes. Se conservan para trazabilidad de cambios, rectificaciones y fortalecimiento/debilitamiento de hipótesis.

### 2. Auditorías de fuente primaria o edición crítica

- [`STEFFEL_AMEKE_AME_AMI_SOURCE_AUDIT_V1.md`](STEFFEL_AMEKE_AME_AMI_SOURCE_AUDIT_V1.md): auditoría de Steffel/Merrill para `-ameke`, `-ame` y aparentes `-ami`.
- [`HISTORICAL_LI_AMEKE_CANDIDATE_AUDIT_V2.md`](HISTORICAL_LI_AMEKE_CANDIDATE_AUDIT_V2.md): depuración de candidatos históricos `X-li-ameke` y clasificación D1/D2/controles negativos.
- [`GUADALAXARA_1683_DIGITAL_ACCESS_RECON_V1.md`](GUADALAXARA_1683_DIGITAL_ACCESS_RECON_V1.md): localización y arquitectura documental de la edición Rodríguez López 2010 y controles externos de 1683.
- [`COLOR_BLACK_TSOCAMEC_DIACHRONIC_BRIDGE_V1.md`](COLOR_BLACK_TSOCAMEC_DIACHRONIC_BRIDGE_V1.md): puente cromático de `tsocamec/otsocamec` hacia Steffel y formas modernas.
- [`GUADALAXARA_1683_OKAMEK_INDEPENDENT_CONTROL_V1.md`](GUADALAXARA_1683_OKAMEK_INDEPENDENT_CONTROL_V1.md): control independiente `ookamek ~ okamek` atribuido a Guadalaxara 1683.
- [`TELLECHEA_1826_PARTICIPIAL_VARIATION_BRIDGE_V1.md`](TELLECHEA_1826_PARTICIPIAL_VARIATION_BRIDGE_V1.md): incorporación de Tellechea 1826 como estrato intermedio.
- [`TELLECHEA_1826_INTERNAL_PARTICIPIAL_ALTERNATION_V2.md`](TELLECHEA_1826_INTERNAL_PARTICIPIAL_ALTERNATION_V2.md): alternancias de misma raíz `machi-`, `simi-`, `ati-`.
- [`TELLECHEA_1826_FINAL_VELAR_DELETION_MECHANISM_V3.md`](TELLECHEA_1826_FINAL_VELAR_DELETION_MECHANISM_V3.md): observaciones históricas sobre pérdida/truncación de material final.

### 3. Puentes morfológicos modernos e históricos

- [`COLOR_KAMEKE_KAME_PARTICIPIAL_BRIDGE.md`](COLOR_KAMEKE_KAME_PARTICIPIAL_BRIDGE.md): continuidad cromática `-kameke ~ -kame` ↔ moderno `-ka-me` con cautela segmental.
- [`ANI_LI_AME_CROSSVARIETY_EVIDENCE_V1.md`](ANI_LI_AME_CROSSVARIETY_EVIDENCE_V1.md): evidencia transvariedad para `ani-lí-ame`.
- [`BINI_LEARNING_DERIVATIONAL_FAMILY_AUDIT.md`](BINI_LEARNING_DERIVATIONAL_FAMILY_AUDIT.md): auditoría de la familia derivacional `bini-/bene-`.
- [`BLUE_GREEN_SIYO_FORMAL_CORRESPONDENCE_AUDIT.md`](BLUE_GREEN_SIYO_FORMAL_CORRESPONDENCE_AUDIT.md): control formal del dominio azul/verde.
- [`CANDIDATE_EVIDENCE_INDEPENDENCE_MATRIX_V4.md`](CANDIDATE_EVIDENCE_INDEPENDENCE_MATRIX_V4.md): matriz de independencia de evidencia para evitar contar repetidamente una misma raíz/fuente.

### 4. Artefactos reproducibles

Las auditorías principales tienen contrapartes JSON cuando el análisis requiere registrar candidatos, grados de evidencia o decisiones reproducibles. Entre ellas:

- `steffel_ameke_ame_ami_source_audit_v1.json`
- `historical_li_ameke_candidate_audit_v2.json`
- `guadalaxara_1683_digital_access_recon_v1.json`
- `color_black_tsocamec_diachronic_bridge_v1.json`
- `guadalaxara_1683_okamek_independent_control_v1.json`
- `tellechea_1826_internal_participial_alternation_v2.json`
- `tellechea_1826_final_velar_deletion_mechanism_v3.json`
- [`research-state.json`](research-state.json), estado compacto y legible por máquina de las hipótesis vigentes.

## Lectura recomendada

Para reconstruir el estado actual sin rehacer toda la historia del proyecto:

1. leer `RESEARCH_EVIDENCE_STATUS.md`;
2. leer `AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V17.md`;
3. consultar la auditoría temática correspondiente sólo cuando se necesite revisar procedencia, tokens, grados D1/D2 o controles negativos;
4. revisar `RESEARCH_DEPENDENCIES.md` antes de abrir nuevas búsquedas, para no duplicar frentes ya bloqueados o pre-registrados.

## Regla de mantenimiento

Cada avance que cambie una conclusión debe:

- conservar la versión anterior;
- crear una nueva síntesis versionada cuando cambie el modelo general;
- actualizar `RESEARCH_EVIDENCE_STATUS.md` si cambia el grado de alguna hipótesis;
- actualizar `RESEARCH_DEPENDENCIES.md` si se resuelve o aparece una dependencia documental;
- actualizar `research-state.json` para mantener un estado de máquina coherente;
- registrar el hito correspondiente en Notion.

No debe elevarse una hipótesis por semejanza gráfica aislada, por repetición de la misma raíz en fuentes dependientes ni por inferencia retrospectiva desde la morfología moderna.