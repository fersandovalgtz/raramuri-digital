# C06 · Conflicto de procedencia: supuesto ejemplar NYPL de Guadalaxara 1683 — v5

**Fecha:** 14 de agosto de 2026  
**Candidato afectado:** C06 `tsocamec/otsocamec → čókameke ~ čókame → chó-ka-me`  
**Nivel de C06:** B, B+ excepcional  
**Objetivo:** decidir si la mención de un ejemplar consultado en la New York Public Library puede utilizarse como segundo testigo material independiente del impreso de 1683.

## 1. Mención publicada de un ejemplar en Nueva York

Marina Garone Gravier, en *Una Babel sobre el papel. Trazos para una historia de los libros en lenguas indígenas en la Nueva España*, cita:

`Thomas de Guadalajara, Compendio del arte de la lengua de los tarahumaras y guazapanes, Puebla, Diego Fernández de León, 1683.`

Y añade en nota:

`Ejemplar consultado en la Biblioteca Pública de Nueva York.`

### Adjudicación

`NYPL_copy_report_source_attested=true`.

La afirmación está publicada y no debe descartarse por ausencia de un resultado inmediato de catálogo.

## 2. El catálogo público actual no permitió identificar ese testigo

Búsquedas dirigidas en el Research Catalog de NYPL por:

- Thomas/Thomás de Guadalaxara/Guadalajara;
- título completo o abreviado del *Compendio*;
- `tarahumares`, `guazapares` y fecha 1683;

no recuperaron un registro verificable del impreso de 1683.

### Adjudicación

`NYPL_catalog_record_recovered=false`.

Este resultado negativo **no prueba inexistencia del material**. Puede corresponder a:

- un microfilm o reproducción;
- un registro legado no indexado por los términos buscados;
- una copia descrita bajo otra forma de autor/título;
- consulta de material prestado o de reproducción externa;
- error bibliográfico en la nota publicada.

Ninguna de estas posibilidades se selecciona sin evidencia adicional.

## 3. British Library: testigo bibliográficamente estable

Diversas referencias especializadas identifican el impreso de Guadalaxara 1683 en Londres:

- British Museum/British Library, signatura `C.38.a.12`;
- ejemplar incompleto, de alrededor de 35–36 folios según la referencia.

Una bibliografía lingüística histórica, remitiendo a González Rodríguez, llega a formular que es “el único ejemplar que se conoce”. Otras publicaciones posteriores citan también el mismo ejemplar londinense.

### Adjudicación

`British_Library_copy_independently_attested=true`;  
`British_Library_shelfmark=C.38.a.12`.

La afirmación antigua de “único ejemplar” se registra como **estado bibliográfico histórico**, no como prueba definitiva de unicidad actual.

## 4. Conflicto que debe preservarse

Las dos líneas documentales son:

### Línea A

Garone: `ejemplar consultado en la Biblioteca Pública de Nueva York`.

### Línea B

Bibliografías lingüísticas/históricas: ejemplar conocido en British Museum/British Library `C.38.a.12`, a veces descrito históricamente como único ejemplar conocido.

Con la información recuperada no puede determinarse si la mención NYPL corresponde a:

1. un segundo original de 1683;
2. una reproducción/microfilm/facsímil del ejemplar londinense;
3. otro soporte bibliográfico derivado;
4. un registro hoy no recuperable en catálogo;
5. una referencia errónea.

## 5. Consecuencia para C06

La pista NYPL **no puede usarse todavía como segundo testigo independiente** para cotejar `tsocamec/otsocamec` del fol. 35r.

Se conserva:

`NYPL_copy_identity=unresolved`;  
`NYPL_second_original_witness=not_demonstrated`;  
`NYPL_independence_from_BL=not_demonstrated`.

Por ello no debe afirmarse:

- que existen dos ejemplares originales controlados;
- que el `<c>` final fue cotejado independientemente en Londres y Nueva York;
- que una eventual lectura NYPL confirma el grafema del ejemplar británico.

## 6. Nuevo control negativo N20

**N20. Una mención publicada de “ejemplar consultado en X biblioteca” no equivale a un testigo material independiente verificado mientras no se recupere su identidad bibliográfica, soporte y procedencia.**

Esto es especialmente importante cuando la bibliografía histórica reporta a la vez un ejemplar conocido en otra institución y la posibilidad de reproducciones/microfilmes es real.

## 7. Cambio de prioridad para C06

La investigación deja de tratar NYPL como una vía corta para obtener un segundo original.

La ruta de mayor rendimiento pasa a ser:

1. recuperar imagen/facsímil del fol. 35r del ejemplar British Library `C.38.a.12`, directamente o a través de reproducción controlada;
2. recuperar el cuerpo de Rodríguez López 2010, pp. 162–164, sobre /k/, reduplicación expletiva y letras equívocas;
3. identificar documentalmente el objeto consultado por Garone sólo si aparece un catálogo, signatura, microfilm o referencia de soporte que permita decidir su independencia.

## 8. Grado

C06 **no cambia de grado**:

`C06_tier=B`;  
`C06_strength=B+_exceptional_near_A`.

La ganancia es metodológica: se elimina una falsa sensación de disponibilidad de un segundo testigo y se precisa la dependencia material real.

## Fuentes

- Garone Gravier, Marina. *Una Babel sobre el papel. Trazos para una historia de los libros en lenguas indígenas en la Nueva España*.
- Guadalaxara, Thomas de. 1683. *Compendio del arte de la lengua de los tarahumares y guazapares*. Puebla: Diego Fernández de León.
- Bibliografía de *Révoltes des indiens Tarahumaras (1626–1724)*, referencia al ejemplar British Museum `C.38.a.12`.
- Bibliografía lingüística de Rice University que reproduce la noticia histórica de González Rodríguez sobre el “único ejemplar” conocido en British Museum.
- NYPL Research Catalog, búsquedas dirigidas realizadas el 14 de agosto de 2026 sin registro identificado del impreso de 1683.
