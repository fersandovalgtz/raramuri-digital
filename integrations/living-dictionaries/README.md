# Piloto Rarámuri Digital → Living Dictionaries

Estado al 2-oct-2026: implementado y probado localmente; NO ejecutado contra un diccionario real. Requiere cuenta, diccionario privado de prueba y clave de lectura/escritura. No es una sincronización de producción ni un producto científico nuevo.

Fuente: `data/lexicon-master.json`, inspeccionada en commit `c0f6da67feb37b08539d9410d6c5587c1f53894b`. Datos publicados v1.0.0. Nunca se escribe en la fuente maestra.

## Lote y mapeo

Tres registros de complejidad mínima sin audio, ejemplos, variantes, datos de hablantes ni información personal:

| ID | Forma | Traducción literal | Página PDF | Categoría fuente → LD |
|---|---|---|---|---|
| RD-000031 | Achíami | Risueño | 4 | Adj → adj |
| RD-000046 | Amarúami | Entero | 5 | Adj → adj |
| RD-000054 | Anachapa | Aletear | 5 | Vi → vi |

- `headword` → `lexeme.default`; se conserva la forma fuente y categoría documental en `notes.es`.
- `senses[]` → `senses[].glosses.es`, sin dividir ni interpretar el texto.
- Fuente registrada una vez con slug `raramuri-digital`, DOI, autor y CC BY-NC-SA 4.0.
- Citas de entrada y acepción: locator `RD-###### v1.0.0; SRC-02; DICCIONARIO raramuri.pdf; PDF pp. X-X`.
- Namespace UUID5(URL, URL del repositorio); entry UUID5(namespace, record_id). Acepción UUID5(namespace, record_id + `/sense/1`). La posición sólo es estable en este piloto de una acepción: cambios de cantidad/identidad requieren revisión; no extender a reordenamientos sin IDs canónicos de acepción.
- No se usa `elicitation_id`: los registros no son datos de elicitación.
- Publicación técnica autorizada; validación lingüística comunitaria pendiente. La selección simple es una revisión documental, no certificación comunitaria.

## Ejecución

Python 3, biblioteca estándar. Desde la raíz del repositorio:

```sh
python3 integrations/living-dictionaries/sync.py stage --repo . --bundle integrations/living-dictionaries/pilot.bundle.json --out integrations/living-dictionaries/preview.txt
python3 -m unittest discover -s integrations/living-dictionaries -v
```

El gestor crea un diccionario dedicado PRIVADO, configura español como lengua de glosas y genera una clave en Agents. Proveer `LD_API_KEY` mediante secreto de ejecución/variable de entorno; nunca argumentos, código, chat, Notion o Drive. Para introducirla sin eco ni guardar en disco, este lanzador la pide en el terminal y la pasa sólo al proceso:

```sh
python3 - <<'PY'
import getpass, os, subprocess
secret = getpass.getpass('Clave Living Dictionaries (oculta): ')
dictionary = input('ID o slug del diccionario privado: ').strip()
env = dict(os.environ, LD_API_KEY=secret)
subprocess.run(['python3','integrations/living-dictionaries/sync.py','sync','--dictionary',dictionary,'--bundle','integrations/living-dictionaries/pilot.bundle.json','--state','integrations/living-dictionaries/private/state.json','--out','integrations/living-dictionaries/private/preflight.json'],env=env,check=True)
PY
```

Ese comando sólo inspecciona. Después de revisar el plan y confirmar el diccionario privado, el mismo lanzador puede invocar `sync` añadiendo `--apply --private-dictionary-confirmed --editors-paused --import-id rd-pilot-20261002-01`. No ejecutarlo sin pausar ediciones colaborativas durante la ventana del piloto. La API no documenta escrituras condicionales: existe una carrera entre la última lectura y PATCH; la relectura reduce el riesgo y NO elimina esa limitación.

## Controles y evidencia

El modo por defecto no escribe. Se limita a tres UUID permitidos; no admite medios ni campos extra. Antes de cualquier escritura se compara la huella completa de cada entrada con la última lectura verificada. Un ID existente sin bitácora de propiedad, una entrada desaparecida, un cambio local o una baja bloquean toda la corrida. Nuevas acepciones/reducciones requieren revisión.

Cada corrida aplicada tiene un import_id explícito y un journal con hash del bundle, estado previo y entradas completas previas. El import_id se envía en POST de altas. La API no admite import_id en PATCH: para actualizaciones la corrida se registra en el journal local, preservando las marcas del lote original. El journal conserva `pending` si hay respuesta ambigua. No se reanuda ciegamente: recuperar por UUID y cotejar antes de adoptar en el ledger. Un import_id usado no puede reutilizarse. Una corrida posterior idéntica produce no-op y cero escrituras de entradas.

Después de cada entrada: leer, verificar forma, glosas, categoría y citas; guardar estado atómicamente. `warnings` detiene la corrida, igual que resultados faltantes, estados inesperados, error HTTP o redirección. No se imprime el cuerpo de errores ni secretos. Una advertencia puede llegar DESPUÉS de una escritura: inspeccionar el UUID pendiente, no asumir rollback.

## Reversión: despublicar antes de borrar

El contrato actual no expone publicación en EntryInput/EntryPatch ni en DictionaryCatalogPatch. La publicación es decisión humana en la interfaz. Por tanto:

1. Ensayar en diccionario privado; no hacerlo público automáticamente.
2. Si un contenido publicado requiere retiro, mantener/poner privado el diccionario dedicado desde Settings, conservar historial y documentar alcance. No extrapolar esto a un diccionario comunitario compartido.
3. Para actualizaciones, revisar drift y restaurar contenido desde `before` del journal. Las citas históricas se conservan porque PATCH las acumula; no se promete restauración byte por byte del estado del servidor.
4. `rollback-plan --journal RUTA --out RUTA` genera instrucciones y evidencia, no borra nada. No existe borrado automático ni batch-delete operativo en este piloto.

La reversión remota y los controles de publicación aún NO están verificados con una cuenta real. Deben validarse antes de calificar el piloto como cerrado.

## Auditoría y criterio de aceptación remoto

Primera corrida: 3 altas/3 acepciones y cotejo de las tres lecturas. Segunda: mismos UUID, 0 altas/0 cambios. Actualización controlada: mismo UUID y lectura verificada; usar copia local experimental, nunca modificar la fuente canónica. Edición local: debe bloquear siguiente sincronización. Reversión: conservar privado/despublicar y cotejar contenido restaurado con snapshot previo.

SQLite público: `https://snapshots.livingdictionaries.app/dictionaries/{id}.db.gz`, con ID interno y apertura read-only. Puede retrasarse ~30 min; no usar para comprobar una escritura reciente. En diccionario privado puede no existir; usar lecturas API. No publicar el diccionario para obtener un snapshot.

## Fuentes consultadas

- https://livingdictionaries.app/api/v1
- https://livingdictionaries.app/api/v1/guides/importing
- https://livingdictionaries.app/api/v1/guides/api-basics
- https://livingdictionaries.app/api/v1/guides/consume
- https://livingdictionaries.app/api/v1/openapi.json?view=full
- Respuestas de Diego Córdova, 1-oct-2026, expediente privado existente en Drive.

Sin scheduler, despliegue, publicación masiva ni gasto de servicios. Prioridad baja frente a cobranza, matrícula, deuda y obligaciones críticas.
