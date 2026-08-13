# Auditoría de seguridad de dependencias npm — 2026-08-13

## Alcance

Auditoría del árbol npm de Rarámuri Digital 3.1.0 con Node.js 22.13.0 y npm 10.9.2. Se ejecutó en una rama aislada y sin usar `npm audit fix --force`.

## Resultado base

- Árbol completo: **21 vulnerabilidades** — 1 baja, 4 moderadas, 16 altas, 0 críticas.
- Árbol de producción (`npm audit --omit=dev`): **4 vulnerabilidades altas**, 0 críticas.
- El CI funcional de `main` permanece en verde; el hallazgo de auditoría no implica por sí mismo explotación efectiva en producción.

## Vulnerabilidades que alcanzan producción

El árbol de producción identifica cuatro paquetes vulnerables:

- `next` 16.2.6 — dependencia directa; existen correcciones posteriores dentro de la línea 16.x.
- `nanoid` 3.3.12 — dependencia transitiva.
- `postcss` — dependencia transitiva utilizada por Next.
- `sharp` 0.34.5 — dependencia transitiva utilizada por Next.

La prioridad de remediación es actualizar Next dentro de la misma línea mayor y regenerar el lockfile, verificando después que las dependencias transitivas de producción queden corregidas.

## Hallazgos de build/desarrollo

Las restantes vulnerabilidades están fuera del árbol que npm clasifica como producción. Las cadenas principales incluyen `@cloudflare/vite-plugin`, `wrangler`, `miniflare`, `undici`, `ws`, `vite`, `esbuild`, `drizzle-kit`, `@esbuild-kit/*`, Babel, `js-yaml`, `fast-uri`, `brace-expansion`, `react-server-dom-webpack`, `vinext` e `image-size`.

La simulación de correcciones compatibles (`npm audit fix --dry-run`) identificó actualizaciones transitivas sin `--force`, entre ellas `nanoid`, `postcss`, `js-yaml`, `fast-uri`, `brace-expansion`, Babel y `esbuild`.

## Actualizaciones directas candidatas

Sin saltos mayores, npm reporta versiones posteriores para componentes relevantes de seguridad:

- `next`: 16.2.6 → 16.3.0
- `react`: 19.2.6 → 19.2.8
- `react-dom`: 19.2.6 → 19.2.8
- `react-server-dom-webpack`: 19.2.6 → 19.2.8
- `eslint-config-next`: 16.2.6 → 16.3.0
- `@cloudflare/vite-plugin`: 1.37.1 → 1.52.0
- `@vitejs/plugin-react`: 6.0.2 → 6.0.5
- `@vitejs/plugin-rsc`: 0.5.26 → 0.5.34
- `vite`: 8.0.13 → 8.2.1
- `wrangler`: 4.92.0 → 4.122.0

No se recomienda resolver esta auditoría mediante downgrades automáticos de `drizzle-kit` o `vinext`, ni mediante `npm audit fix --force`. `vinext` ya dispone de una línea 1.0.0-beta, pero migrar a una beta constituye un cambio de plataforma que debe evaluarse por separado.

## Criterio de remediación

1. Regenerar `package-lock.json` junto con cualquier cambio de `package.json`.
2. Ejecutar `npm audit` y `npm audit --omit=dev` sobre el árbol resultante.
3. Exigir **0 vulnerabilidades altas en producción** antes de aceptar el PR.
4. Ejecutar el CI completo: build, pruebas, lint, CLDF, TEI Lex-0, reproducibilidad y generación PDF.
5. Documentar cualquier vulnerabilidad residual exclusivamente de build/desarrollo con su cadena y justificación.

## Estado

La auditoría y clasificación están completas. La remediación debe permanecer en PR separado. No se modifican datos lingüísticos ni productos lexicográficos en esta rama.
