# Dependencias y bloqueos de investigación — Rarámuri Histórico Digital

**Corte:** 2026-08-14

Este documento registra qué falta para elevar de grado las hipótesis vigentes. Su función es impedir búsquedas redundantes y distinguir entre problemas conceptuales, documentales y técnicos.

## D1. Rodríguez López 2010 / Guadalaxara 1683

**Objetivo:** ingerir de forma estable la edición completa de *Gramática Tarahumara de Thomas de Guadalaxara (1683)*, Abel Rodríguez López, 2010.

**Estado:** localizada digitalmente; ingestión completa no lograda en el entorno actual.

**Prioridad:** control directo de grafías coloniales, distribución de `ame(+c/k)`, posible segunda evidencia histórica para `li + ame` y mejor evaluación del puente cromático del siglo XVII.

## D2. Tellechea 1826

**Objetivo:** convertir la red OCR de variantes participiales/adjetivales en evidencia diplomática controlada.

### OCR completado

`TELLECHEA_1826_AME_TOKEN_AUDIT_V4.md` clasifica las 24 ocurrencias crudas en `-amec/-ameque`.

`TELLECHEA_1826_SHORT_AME_TARGETED_AUDIT_V5.md` revisa 168 ocurrencias crudas / 111 cadenas breves sólo alrededor de raíces justificadas y paralelos bilingües. El frente OCR queda **cerrado** después de v5.

### Redes OCR fuertes

- `atígameque ~ atígame/atigame`;
- `simiámec ~ simíame`;
- `machiámec ~ machiámeque ~ machíameque ~ machíame`;
- `netetugameque ~ netétugame`;
- `rejoírugameque ~ rejoírugame/rejóirugame`.

`ayorigu-` permanece probable y `yumága-` conserva un largo OCR corrupto (`yumctvameque`). Los falsos pares `gayénameque ~ gayéname` y `natámeque ~ natáme` se eliminaron por reconstrucción de saltos de línea.

### Bloqueo restante

**Facsímil:** localizado, pero la ruta técnica de cotejo visual estable no está disponible en el entorno actual.

**Regla:** no abrir más búsquedas OCR generales de `-ame/-ameque`. La siguiente ganancia de C09 depende del facsímil y la grafemática.

## D3. Grafemática colonial `<c>/<k>/<que>/<ke>`

**Objetivo:** determinar cuándo estas grafías representan valores comparables y cuándo responden a convenciones distintas.

**Dependencias:** D1 + D2 y descripciones ortográficas explícitas de Guadalaxara, Steffel y Tellechea.

## D4. Segunda raíz histórica D1 para `X-li-ame(ke)`

**Objetivo:** encontrar una segunda raíz histórica con segmentación publicada o evidencia equivalente para `X + -li + -ame(ke)`.

**Estado:** no encontrada. D1 `tsanelíameke`; D2 fuerte `tschutschelíameke`; controles negativos `ganelíameke`, `uilíameke`, `selíameke`.

## D5. Relación moderna `-ame ~ -me ~ -ami`

**Objetivo:** separar variación regional/sincrónica, condicionamiento fonológico y posible cambio diacrónico.

**Estado:** *Compendio básico de la gramática ralámuli* 1997 documenta `-ame/-me` participial regional; otras fuentes apoyan `-ame ~ -ami`. Merrill y Márquez documentan alternancias `e~i`, sin demostrar ley general.

## D6. C02 `Tschipérameke / čipérameke ↔ Chipérami`

**Estado:** B formal, **B+ fuerte**.

### Resuelto

- Steffel/Merrill: `Tschipérameke` ‘fino, delgado, llano’.
- Merrill normaliza/transcribe `tschipérameke || čipérameke`, por lo que `<tsch>~<ch>` deja de ser una discrepancia formal sustantiva.
- Steffel: `Guenomí tschipérameke` = ‘un metal delgado’.
- Samachique 2016: `chipérami adj. plano`; `walú chipérami` = ‘como una tabla ancha’.
- SRC-02: `Chipérami` ‘Plano’, Pp.
- *Cazador de palabras rarámuri*: `chiperami` en contexto de tablilla.

La continuidad formal `čipér- ~ chipér-` y semántica ‘fino/delgado/llano/plano’ es **muy fuerte**.

### Cuello de botella

C02 sólo puede subir a A si aparece alguno de estos controles:

1. base/paradigma histórico independiente `čiper-`;
2. parse publicado del token histórico `čipérameke`;
3. identificación publicada directa de la continuidad/cognación del lexema.

**No buscar más ocurrencias modernas genéricas de `chipérami`**: ya existe control lexicográfico, fraseológico y discursivo suficiente. Nuevas apariciones sólo son útiles si aportan análisis morfológico/etimológico.

## D7. C04 `Nessé/Nesséameke ↔ nes-/Neseme ↔ Nisé/Niséami`

**Estado:** B formal, **B+ excepcional / cercano a A**.

### Evidencia resuelta

La cadena histórica/moderna contiene `Nessé`, `Nesséameke`, `pouguá nesséameke`, la familia moderna `nesema/nesbonama/nesame/neser/neserichi`, `Neseme` Baja/Western, `Nisé/Niséami` y `nise’ami/niseami`.

Cinco controles `Xema ~ Xame` (`benema ~ bename`, `natogema ~ natogame`, `ne’ogema ~ ne’ogame`, `nichugema ~ nichugame`, `semema ~ semame`) y las reglas de Márquez permiten tratar `nesame` como miembro participial/agentivo de `nes-` con **alta confianza interna de fuente**.

### Cuello de botella

Para A falta:

1. parse/paradigma token-específico de `nesame/neseme`; o
2. fuente que identifique directamente `Nessé` y `nes-/Nisé` como variantes/cognados históricos.

**No buscar más controles genéricos `Xema ~ Xame` ni más ocurrencias de `neseme`.**

## D8. Genealogía de fuentes modernas

**Objetivo:** evitar que replicaciones editoriales se cuenten como evidencia independiente.

**Estado:** Márquez depende parcialmente de Brambila/Hilton y varias fuentes Lowland/Western comparten tradición de Don Burgess. La independencia se audita sólo si puede afectar una promoción de grado.

**Regla:** `document_replication != source_independence`.

## D9. Integración al corpus/producto público

**Objetivo:** decidir qué hallazgos pasan del expediente de investigación a datos visibles o notas metodológicas.

**Precondición:** cada hallazgo debe etiquetarse como hecho documental, análisis publicado, inferencia del proyecto o hipótesis no resuelta. C02, C04 y C09 no deben integrarse todavía como cognaciones/segmentaciones asentadas en el dataset estable.

## Priorización vigente

**C02:** cerrado para acumulación moderna; reabrir sólo con base/paradigma o análisis histórico.  
**C04:** cerrado para búsquedas generales; reabrir sólo con parse/paradigma o comparación histórica directa.  
**C09:** OCR cerrado; reabrir sólo con facsímil/grafemática.  
**Siguiente prioridad documental:** D1 Guadalaxara.  
**Prioridad analítica:** otro candidato B/C con prueba capaz de cambiar nivel; D4 sigue siendo estructuralmente valioso.  
**Control metodológico:** D8 genealogía.  
**Prioridad editorial:** D9.

No abrir búsquedas generales sobre `-ameke/-ami`, `e~i`, `neseme`, `chipérami`, nuevos pares `Xema~Xame` ni nuevas cadenas OCR de Tellechea; sólo pruebas capaces de mover un candidato, depurar falsos positivos o falsar una hipótesis concreta.
