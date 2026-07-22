# Contribuir y reportar correcciones

## Alcance

Se reciben reportes sobre transcripción, estructura de datos, trazabilidad, documentación, interfaz, API, licencias y propuestas lingüísticas. Una propuesta lingüística no se incorpora como validada sin revisión adecuada.

## Reporte mínimo

1. Identificador de entrada o producto.
2. URL o archivo afectado.
3. Fuente y página, si aplican.
4. Comportamiento o contenido actual.
5. Corrección propuesta y evidencia.
6. Tipo de revisión requerida: técnica, documental, lingüística, cultural o jurídica.

No incluya información personal o culturalmente sensible en una incidencia pública. En esos casos escriba a <fernando.sandoval@uacj.mx>.

## Flujo de revisión

`RECIBIDO → CLASIFICADO → VERIFICACIÓN DOCUMENTAL → REVISIÓN ESPECIALIZADA → DECISIÓN → VERSIÓN`

- Los cambios técnicos deben superar las pruebas automatizadas.
- Los cambios documentales deben conservar fuente, página e identificadores.
- Los cambios lingüísticos deben registrar quién revisó, con qué competencia y bajo qué alcance.
- Toda decisión debe quedar asociada a una versión.

## Desarrollo

```bash
npm install
npm run data:exports
npm run data:quality
npm test
npm run dev
```

Utilice UTF-8, no modifique archivos fuente sin justificación y no elimine trazabilidad para simplificar un registro.

## English

Reports may address transcription, data structure, provenance, documentation, interface, API, licensing and linguistic proposals. Include the entry or product identifier, affected file or URL, source page, current content, proposed correction, evidence and required review type. Do not post personal or culturally sensitive information publicly; contact the project lead instead. Technical changes must pass automated checks, documentary changes must retain provenance, and linguistic changes require an explicitly recorded qualified review.

