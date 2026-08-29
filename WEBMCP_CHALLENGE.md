# Rarámuri Digital — WebMCP Challenge 2026

Rarámuri Digital is an existing provenance-aware Rarámuri–Spanish lexicographic research infrastructure. For the OpenAI WebMCP Challenge, the project is being **meaningfully extended with a browser-native, read-only agent interface** so humans and agents can investigate lexical evidence together without creating a second backend or changing the scientific corpus.

## Challenge window and auditable baseline

The WebMCP Challenge submission period began on **August 25, 2026**.

The last Rarámuri Digital commit before the challenge window was:

- Baseline SHA: `38dd3bc3343548db20e2a1a19e7fd35a47ea7996`
- Timestamp: 2026-08-15 20:56:31 UTC
- Message: `Elevate scientific provenance, Hilton documentation, and ecosystem integration (#32)`

Before this WebMCP branch was created, three unrelated Concepticon/Glottolog pilot commits were added to `main` on August 29. They are **not claimed as Challenge work**. The branch `feat/webmcp-challenge-2026` was created from the then-current `main` only to preserve the repository's current scientific state. Challenge novelty is isolated in the WebMCP-specific commits and files documented here.

## What WebMCP adds

The human-facing website and public APIs already existed. The Challenge extension registers four browser-native WebMCP tools through `document.modelContext.registerTool()`:

| Tool | Existing API reused | Agent capability |
| --- | --- | --- |
| `search_raramuri_lexicon` | `/api/lexicon` | Find Rarámuri or Spanish lexical evidence with senses, variants, examples, source pages, and validation status. |
| `search_spanish_terminology` | `/api/terminology` | Start from a Spanish term and locate documented Rarámuri equivalents with extraction and validation metadata. |
| `get_lexical_relations` | `/api/lexical-relations` | Traverse documented lexical relations while preserving resolution method, evidence, and provenance. |
| `search_parallel_corpus` | `/api/parallel-corpus` | Verify claims against Rarámuri–Spanish bilingual examples with alignment status, confidence, and page-level provenance. |

All four tools are explicitly marked `readOnlyHint: true` and `untrustedContentHint: true`. Tool execution performs only same-origin `GET` requests. The WebMCP layer does not write to the database, modify the 2,581 lexicographic entries, or change editorial decisions.

## Progressive enhancement

`app/components/WebMCPTools.tsx` is mounted once from the root layout. It feature-detects `document.modelContext`; browsers without WebMCP continue to use the site normally.

An `AbortController` owns the registration lifecycle. Aborting its signal unregisters the tools when the component unmounts. Each tool also forwards the execution `AbortSignal` to its underlying `fetch()` request so agent/user cancellation stops network work cleanly.

A minimal local declaration in `types/webmcp.d.ts` types only the experimental surface used by this project. This intentionally avoids adding a runtime dependency for a small API surface.

## Scientific guardrails

WebMCP exposes evidence; it does not manufacture linguistic authority.

- Documentary source codes, source documents, and page ranges are preserved in tool results.
- Publication, transcription, extraction, alignment, and linguistic-validation states remain visible when the underlying endpoint provides them.
- Candidate or review-required material is never relabeled as validated by the WebMCP layer.
- Agent synthesis remains separate from corpus evidence.
- Result limits are capped at 25 per tool call to keep interactions bounded and inspectable.

## Why WebMCP is a strong fit

Before this extension, an agent could navigate Rarámuri Digital as a human-readable website or manually infer how to call its APIs. WebMCP makes the site's own capabilities directly discoverable and invocable by the browser agent with explicit schemas and safety annotations.

This enables a genuine multi-step research workflow:

1. discover candidate vocabulary in the lexicon;
2. contrast Spanish-to-Rarámuri terminology;
3. inspect documented lexical relationships;
4. verify several forms against bilingual corpus evidence;
5. synthesize findings while preserving provenance and flagging evidence that still requires review.

The important change is not another search box. The web application itself now declares a compact research interface to agents while retaining the same human experience and scientific source of truth.

## Implementation files

Challenge-specific implementation is intentionally small:

- `app/components/WebMCPTools.tsx` — four read-only WebMCP tools and their lifecycle.
- `types/webmcp.d.ts` — minimal TypeScript declarations for the experimental browser API.
- `tests/webmcp-registration.test.mjs` — static contract and safety checks.
- `app/layout.tsx` — one progressive-enhancement mount point.
- `package.json` — includes the WebMCP test in the existing test suite.
- `WEBMCP_CHALLENGE.md` — auditable before/after, testing, and demo notes.
- `README.en.md` — short public explanation for judges and developers.

No corpus or derived scientific dataset is changed by these files.

## Testing and verification

The repository's existing CI remains authoritative. The WebMCP-specific test checks:

- exactly four intended tool names;
- all four tools are read-only and treat returned corpus content as untrusted;
- all tools reuse the four canonical APIs;
- only `GET` is used by the shared request helper;
- registration and execution use `AbortSignal`;
- the root layout mounts the progressive enhancement;
- the pre-challenge baseline is documented.

The full repository workflow continues to run linting, build, existing scientific/API tests, reproducibility checks, CLDF validation, and TEI Lex-0 validation.

## Browser verification

Judges can test the live site using the ChatGPT in-app browser with WebMCP support or Google Chrome 149+ with WebMCP testing enabled, as specified by the Challenge rules.

Expected tools:

```text
get_lexical_relations
search_parallel_corpus
search_raramuri_lexicon
search_spanish_terminology
```

A useful manual check in a compatible browser is to inspect `await document.modelContext.getTools()` and confirm that the four same-origin tools are discoverable.

## Demo scenario

The public demonstration should use a coherent semantic field for which the repository contains sufficiently rich evidence. The agent should perform more than one tool call and visibly distinguish documentary evidence from its own synthesis.

Suggested prompt:

> Using Rarámuri Digital, investigate vocabulary in a coherent semantic field. Find relevant Rarámuri entries, explain their Spanish meanings, identify documented lexical relationships, and verify several forms against bilingual corpus examples. Preserve provenance and flag any evidence that requires review.

The final video must be **less than three minutes**, include audio, show the live application working, and make the WebMCP-mediated multi-step interaction clear.

## Submission checklist

- [x] Existing project and pre-challenge baseline documented.
- [x] Challenge work isolated on `feat/webmcp-challenge-2026`.
- [x] Four read-only WebMCP tools implemented against existing APIs.
- [x] Progressive enhancement and cancellation lifecycle implemented.
- [x] WebMCP-specific tests added.
- [ ] GitHub Actions passes for the completed branch.
- [ ] Compatible-browser live verification completed.
- [ ] Challenge branch merged/deployed to the public site.
- [ ] Public YouTube demo recorded with audio and kept under three minutes.
- [ ] Devpost description, repository URL, live URL, and video URL entered.
- [ ] Submission confirmation archived before the September 3, 2026 deadline.

## Official references

- WebMCP Challenge: https://webmcp.devpost.com/
- Challenge rules: https://webmcp.devpost.com/rules
- Chrome WebMCP Imperative API: https://developer.chrome.com/docs/ai/webmcp/imperative-api
- WebMCP explainer: https://github.com/webmachinelearning/webmcp
