# Evaluación diacrónica `*-ame ~ -ameke ~ -ame ~ -ami` — v13

**Fecha:** 14 de agosto de 2026

## Cambio central respecto de v12

La v12 había localizado la edición digital de Rodríguez López (2010) de Thomas de Guadalaxara (1683), pero todavía sin ingestión integral del PDF. La v13 añade dos avances concretos.

Primero, se identificó el control de descarga real de Academia.edu para el documento 35779351 y el identificador de adjunto 55656172. La descarga firmada fue ofrecida por el sitio, pero el runtime actual devolvió `cache miss`; por ello la obra sigue sin poder ingerirse íntegramente de manera programática en esta sesión. El problema ya no es de localización bibliográfica ni de existencia de un archivo descargable, sino de acceso técnico estable a los bytes del adjunto.

Segundo, el texto accesible de la edición revela un candidato diacrónico de alto valor que no estaba integrado: `tsocamec, otsocamec` (Guadalaxara 1683, fol. 35r), ‘oscuro’ o ‘negro’. Rodríguez López señala que ésta es la única forma tarahumara del impreso que no aparece en el manuscrito zapopano. La forma puede compararse con Steffel `tschócameke ~ tschócame` ‘negro(s)’ y con el moderno `chó-ka-me` y variantes.

## 1. Acceso digital: estado corregido

La edición de Rodríguez López está en Academia.edu y la página institucional del autor ofrece un botón `Download`. El control resolvió al adjunto `55656172`, pero la solicitud del archivo falló en el entorno actual por un error de caché del servidor/intermediario.

Por tanto:

- `public_digital_page_found = true`;
- `download_attachment_identified = true`;
- `download_bytes_retrieved = false`;
- `full_text_ingested = false`.

No se intentan mecanismos de elusión de autenticación, pago o restricciones de acceso. La siguiente ingestión debe realizarse mediante una ruta legítima que entregue el PDF de manera estable.

## 2. Nuevo antecedente cromático de 1683

Rodríguez López informa, al comparar el impreso de 1683 con el manuscrito zapopano, que el vocabulario es casi el mismo y que una sola forma del impreso no aparece en el manuscrito: `tsocamec, otsocamec` (fol. 35r), ‘oscuro’ o ‘negro’.

Este dato tiene dos valores independientes:

1. documenta una forma cromática del siglo XVII en la capa impresa de Guadalaxara;
2. ofrece un comparador formal y semántico muy próximo a la familia negra documentada posteriormente por Steffel.

No se toma la ausencia en el manuscrito como prueba de innovación de 1683; sólo como control de procedencia documental.

## 3. Comparación con Steffel

La edición crítica de Merrill et al. (2020) confirma:

- `Tschócameke. Negro.` {T-0869};
- múltiples atestaciones `tschócameke` en la versión publicada y el manuscrito de Brno;
- `tschócame` en una oración donde las plumas son negras;
- apéndice: `tschócameke, 1. negro`; `tschócame, 1. negros`;
- normalización: `tschócame || čókame`; `tschócameke || čókameke`.

El puente 1683 → Steffel queda así formalmente motivado a nivel de palabra completa y semántica. La relación exacta entre el `<c>` final de `tsocamec` y el `-ke` de Steffel no está demostrada.

## 4. Comparación moderna

El proyecto ya había establecido para negro el moderno `chó-ka-me`, con variantes regionales `chó-ka-mi` y `chó-ko-m`, y el análisis moderno del material `-ka/-ga/-cha` + `-ame/-me` dentro del sistema cromático.

La cadena de trabajo es ahora:

`1683 tsocamec/otsocamec` → `Steffel tschócameke ~ tschócame` → moderno `chó-ka-me`.

La continuidad léxico-semántica se evalúa **alta** y la continuidad formal global **moderada-alta**. La segmentación histórica se mantiene **no adjudicada**.

## 5. Lo que la v13 no permite afirmar

No se formula ninguna de estas reglas:

- `tsocamec = tso-ca-me-c`;
- `<c> final 1683 > -ke`;
- `-camec > -cameke`;
- `ca` histórico = `-ka` cromático moderno;
- `-amec/-ameke > -ami`;
- cognación demostrada sólo por semejanza gráfica.

La sección 3.5 de Rodríguez López sobre /k/ y reduplicación expletiva, la sección 3.6 sobre “letras equívocas”, el contexto directo de fol. 35r y la entrada del vocabulario final son los controles obligatorios antes de cualquier segmentación más fuerte.

## 6. Consecuencia para el modelo `*-ame`

La v13 fortalece la profundidad histórica del dominio cromático. Junto con el independiente `Pedro norugamek` de Guadalaxara 1683:27v, ya no sólo existe evidencia del siglo XVII para una arquitectura estativa `ru/ga + ame(+k)`, sino también una forma cromática negra cuya estructura gráfica se aproxima notablemente a la familia de Steffel y al moderno.

Estos dos testimonios de 1683 deben mantenerse separados: `norugamek` tiene análisis morfológico comparativo explícito en Merrill y Burgess (2014); `tsocamec/otsocamec` todavía no. El primero es evidencia morfológica fuerte; el segundo es, por ahora, evidencia léxico-formal de prioridad alta.

## 7. Estado del puente `li + ame`

No cambia:

- histórico D1: `tsanelíameke`;
- histórico D2 fuerte: `tschutschelíameke`;
- moderno D1: `ani-lí-ame`, `rihói-li-ame`;
- segundo D1 histórico independiente: no recuperado.

El nuevo hallazgo cromático no se cuenta como evidencia de `li + ame`.

## 8. Próximo frente pre-registrado

La prioridad inmediata es obtener por vía legítima el PDF completo de Rodríguez López 2010 y extraer cuatro bloques: §3.5, §3.6, fol. 35r y la entrada de vocabulario `tsocamec/otsocamec`. En cuanto esas páginas sean ingeribles, debe ejecutarse una auditoría ortográfico-morfológica restringida a la pregunta `<c> final / k / reduplicación / -ke`, usando controles ajenos al candidato.

En paralelo debe mantenerse el barrido del Libro Segundo de los verbos para `ame`, `amec/amek`, `game`, `gamec/gamek`, `liame`, `liamec/liamek`.

**Regla epistemológica v13:** una cadena lexical que atraviesa tres siglos puede ser un excelente candidato de continuidad aun cuando la historia interna de sus morfemas siga abierta. La continuidad de la palabra, la correspondencia fonológica y la identidad morfológica son tres niveles distintos.

`rodriguez_2010_public_digital_page_found=true`; `academia_attachment_identified=true`; `rodriguez_full_text_ingested=false`; `guadalaxara_1683_tsocamec_found=true`; `black_color_17c_18c_modern_chain=true`; `black_chain_lexical_semantic_confidence=high`; `black_chain_global_form_confidence=moderate_high`; `black_chain_morphological_segmentation=unresolved`; `direct_historical_li_ameke_D1_roots=1`; `universal_ameke_to_ami_rule=false`.
