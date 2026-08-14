# Lexical relation target adjudication v1

Fecha de revisión: 2026-08-14  
Esquema: `1.1.0-candidate`  
Base: `1.0.0`

## Objetivo

Resolver documentalmente las cuatro relaciones que la coincidencia automática de forma dejó como `resolved_ambiguous` en `data/lexical-relations.json`, sin convertir esta adjudicación estructural en validación lingüística. Las decisiones se codifican de forma reproducible en `data/lexical-relation-target-adjudications.json` y el generador sólo puede aplicar una adjudicación cuando el `target_record_id` elegido pertenece al conjunto de candidatos recuperado automáticamente.

## Resultado

### LRA-000001 · RD-000086 Aqué → acá

La fuente registra `Aqué` como verbo intransitivo con el significado **Tener huaraches** y la remisión `Véase acá` en la página 7. Los candidatos automáticos eran los cuatro homónimos `Acá`: `RD-000006` ‘Cara, nariz’, `RD-000007` ‘Tener sal / estar dulce o sabroso’, `RD-000008` ‘Huarache’ y `RD-000012` ‘Embotarse, quitarse el filo’. La correspondencia documental directa es `RD-000008`, `3Acá`, ‘Huarache’.

**Adjudicación:** `RD-000086 → RD-000008`.

### LRA-000002 · RD-000495 Cohuí → cochi

La fuente registra `1Cohuí` como **(Pamachi) marrano, véase cochi** en la página 27. Los candidatos automáticos eran `RD-000481` ‘Perro’, `RD-000482` ‘Hermana mayor’, `RD-000483` ‘Dormir’ y `RD-000484` `Cochi, cohuí`, **Marrano**. El último candidato contiene además literalmente la forma `cohuí` como segunda forma del lema.

**Adjudicación:** `RD-000495 → RD-000484`.

### LRA-000003 · RD-000728 Chi’rimea → chi’rá

La fuente registra `Chi’rimea` con la traducción **Amanecerá** y la anotación `[futuro de chi’rá]` en la página 36. Los candidatos automáticos eran los tres homónimos `Chi’rá`: `RD-000716` ‘Amanecer (el día)’, `RD-000717` ‘Estar tierno (elote, calabaza)’ y `RD-000718` ‘aplastar’. `RD-000716` documenta además explícitamente el futuro `chi’riméa`.

**Adjudicación:** `RD-000728 → RD-000716`.

### LRA-000004 · RD-000877 Huachíami → huatoná

La fuente registra `Huachíami` como adjetivo **Derecho (recto)** con la remisión `Véase huatoná` en la página 42. La forma normalizada producía dos candidatos: `RD-000934` `Huatoná`, con las acepciones `vt Estirar` y `adj Derecho, lado derecho, mano derecha`, y `RD-000935` `Huatona`, `Vt Hacer atole`. La correspondencia semántica y la acentuación documental identifican `RD-000934`.

**Adjudicación:** `RD-000877 → RD-000934`.

## Estado resultante

Con estas cuatro adjudicaciones, las 28 relaciones de `data/lexical-relations.json` quedan con destino único estructural: 28 `resolved_unique`, 0 `resolved_ambiguous` y 0 `unresolved`. Cuatro de las 28 se distinguen mediante `target_resolution_method = documentary_adjudication` y conservan `target_adjudication_id` y `documentary_basis`.

## Cautela epistemológica

Estas decisiones resuelven la identidad **documental y estructural del destino** de la remisión o relación gramatical. No constituyen validación lingüística de la entrada, de la traducción, de la morfología ni de la equivalencia dialectal. `validation_status` y `human_validation_status` permanecen en `Pendiente de cotejo lingüístico`. El procedimiento está declarado como `machine-assisted_documentary_adjudication` para no atribuir falsamente la revisión a una persona.
