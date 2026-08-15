# Índice maestro de investigación — Rarámuri Histórico Digital

**Estado de corte:** 2026-08-14  
**Repositorio:** `fersandovalgtz/raramuri-digital`  
**Síntesis global vigente:** [`AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md`](AMEKE_AME_AMI_DIACHRONIC_ASSESSMENT_V18.md)

## Estado canónico

- [`EVIDENCE_MASTER_MATRIX_V13.md`](EVIDENCE_MASTER_MATRIX_V13.md) + [`data/research/evidence_master_matrix_v13.json`](data/research/evidence_master_matrix_v13.json): matriz vigente.
- [`CANDIDATE_SOURCE_TESTS_V13.md`](CANDIDATE_SOURCE_TESTS_V13.md): pruebas vigentes.
- [`BUSCHMANN_1857_AME_PRIMARY_SOURCE_AUDIT_V1.md`](BUSCHMANN_1857_AME_PRIMARY_SOURCE_AUDIT_V1.md): lectura primaria de Buschmann 1857.
- [`BUSCHMANN_PIMENTEL_AME_KAME_HISTORIOGRAPHY_V1.md`](BUSCHMANN_PIMENTEL_AME_KAME_HISTORIOGRAPHY_V1.md): antecedente historiográfico v12.
- [`RESEARCH_EVIDENCE_STATUS.md`](RESEARCH_EVIDENCE_STATUS.md): síntesis consolidada.
- [`research-state.json`](research-state.json): estado de máquina.
- [`RESEARCH_DEPENDENCIES.md`](RESEARCH_DEPENDENCIES.md): bloqueos y reglas de reapertura.

## Cartera v13

- **A:** C01, C02, C07, C08.
- **B/B+:** C03, C04, C05, C06, C09.
- **C:** ninguno.

La fase continúa como `resolve_tier_B_structural_bottlenecks`.

## C02 · nuevo A

[`C02_CHIPER_DIACHRONIC_BRIDGE_V2.md`](C02_CHIPER_DIACHRONIC_BRIDGE_V2.md).

Buschmann 1857 incluye el lexema histórico de ‘delgado/fino; plano/liso’ en su sección de adjetivos derivados mediante `ame`, bajo la subforma `ameke`. Como su convención marca con asterisco las formas de Tellechea y deja sin asterisco las de Steffel, el ejemplo pertenece al material de Steffel y corresponde al `Tschipérameke / čipérameke` de la edición crítica moderna.

El requisito de análisis histórico token-específico queda resuelto. C02 pasa a **A**. La cognación histórico-moderna sigue siendo una afirmación distinta y no se declara automáticamente.

## Buschmann 1857 · teoría primaria recuperada

Buschmann usa `ame` como rótulo comparativo general, pero su análisis tarahumara es multicapa:

- `ame + ke → ameke`;
- reducción de `ke` a `c/Ø` según su interpretación;
- `me/meke`;
- expansiones `gameke/game`, `cameke/came`, `jameke/yame`, etc.;
- `me` descrito en otro pasaje como gran elemento participial.

### H15 refinada

La controversia con Pimentel se formula ahora como una **disputa sobre estructura interna** —núcleo, expansión o contracción— y no como un simple contraste gráfico `ame` vs. `kame`.

### N14

El nombre general de una familia morfológica no implica una segmentación interna uniforme.

## C03/C06

Buschmann refuerza la cautela histórica: en los colores advierte que no deben inventarse bases simples y que el `c` de `rosa-cameke` / `tscho-cameke` puede pertenecer al radical. C03 y C06 permanecen B+.

## C05

Buschmann alinea directamente Steffel `seli-ameke` y Tellechea `*seri-game`. El puente histórico formal se fortalece, pero C05 permanece B+ fuerte por la etimología dual gobierno↔lanza todavía no resuelta.

## C09

Permanece B fuerte+ OCR; la próxima ganancia exige facsímil.

## Prioridad

1. C06 → Rodríguez pp.162–164 / BL fol.35r / ejemplar NYPL.
2. C09 → facsímil Tellechea.
3. C03 → estructura histórica exacta.
4. C04 → comparación histórica directa.
5. C05 → adjudicación gobierno↔lanza.

No volver a búsquedas generales de semejanzas.

## Interoperabilidad

Dataset estable `1.0.0`; capas experimentales `1.1.0-candidate`. La promoción de C02 es un resultado de investigación y no transforma automáticamente el dataset estable en una lista de cognaciones adjudicadas.
