# Devpost submission draft — Rarámuri Digital WebMCP

This file contains the English submission copy and live-demo script for the OpenAI WebMCP Challenge 2026. Replace only the bracketed evidence placeholders after deployment/video upload; do not inflate claims beyond verified behavior.

## Project title

**Rarámuri Digital WebMCP — provenance-aware Indigenous language research for humans and agents**

## One-line description

Rarámuri Digital exposes a provenance-aware Rarámuri–Spanish lexicon, terminology layer, lexical relations, and bilingual corpus as four read-only WebMCP tools for multi-step agent research.

## Project URL

https://raramuri.ceees.mx

## Public repository

https://github.com/fersandovalgtz/raramuri-digital

## Challenge implementation evidence

- Challenge branch: `feat/webmcp-challenge-2026`
- Pull request: https://github.com/fersandovalgtz/raramuri-digital/pull/33
- Pre-challenge baseline: `38dd3bc3343548db20e2a1a19e7fd35a47ea7996`
- Challenge implementation notes: `WEBMCP_CHALLENGE.md`
- License: MIT for software; data licensing remains separately documented in `DATA_LICENSE.md`.

## What we built

Rarámuri Digital already existed as a public Rarámuri–Spanish lexicographic research infrastructure with 2,581 documented entries, public APIs, provenance metadata, derived datasets, CLDF and TEI Lex-0 exports, and reproducibility controls.

For the WebMCP Challenge, we added a deliberately thin browser-native agent layer instead of building a parallel service. The application now registers four read-only tools through `document.modelContext.registerTool()`:

1. `search_raramuri_lexicon` — searches lexical entries and returns senses, examples, variants, source pages, publication status, and linguistic-validation status.
2. `search_spanish_terminology` — starts from Spanish terminology and returns documented Rarámuri equivalents with extraction/validation metadata and provenance.
3. `get_lexical_relations` — explores documented lexical relations while preserving resolution method, evidence, target records, and validation state.
4. `search_parallel_corpus` — verifies forms against Rarámuri–Spanish bilingual examples with alignment status, confidence, and page-level provenance.

Each tool reuses an existing same-origin API endpoint and performs only GET requests. No challenge code writes to the corpus or changes editorial decisions.

## Why WebMCP

A normal website asks an agent to infer actions from visible UI or reverse-engineer endpoints. WebMCP lets the website declare its capabilities directly, with explicit JSON schemas, descriptions, safety annotations, lifecycle controls, and structured outputs.

That matters particularly for a research resource. The goal is not simply to let an agent “search a dictionary.” The goal is to let the agent coordinate several evidence layers while keeping the documentary source, page range, validation state, and uncertainty attached to the result.

The same site therefore serves two audiences without forking the source of truth:

- humans retain the existing visual interface and downloads;
- compatible agents discover a compact research interface declared by the page itself.

Browsers without WebMCP continue to use the site normally because the layer is a progressive enhancement.

## How humans and agents collaborate

A researcher can ask an open-ended question about a semantic field or term. The agent can then decide which WebMCP tools to call and in what order. A useful flow is:

1. locate candidate Rarámuri vocabulary;
2. contrast Spanish-to-Rarámuri terminology;
3. inspect documented lexical relationships;
4. verify selected forms against bilingual examples;
5. synthesize the evidence while explicitly flagging material that remains pending review.

The human contributes the research question and evaluates the interpretation. The WebMCP agent handles discovery and orchestration across structured evidence. Rarámuri Digital remains responsible for the underlying documentary provenance and editorial states.

## Implementation details

The implementation is intentionally small and auditable:

- `app/components/WebMCPTools.tsx` registers the four tools in a React client component.
- `document.modelContext` is feature-detected, so no WebMCP support is required for normal use.
- An `AbortController` controls registration lifetime; its signal unregisters tools on unmount.
- Each execution forwards the WebMCP execution `AbortSignal` to `fetch()`.
- Tool results are capped at 25 records per call.
- `readOnlyHint: true` and `untrustedContentHint: true` are declared on all four tools.
- `types/webmcp.d.ts` provides minimal local TypeScript declarations without adding a runtime dependency.
- `tests/webmcp-registration.test.mjs` checks tool names, safety annotations, canonical endpoint reuse, GET-only behavior, cancellation, and layout mounting.

The repository's broader validation workflow also verifies build, lint, tests, CLDF, TEI Lex-0, deterministic exports, corpus integrity, and reproducibility.

## Scientific and safety guardrails

This project intentionally does not turn agent output into linguistic authority.

The tools return the source codes, source documents, page ranges, transcription/extraction/alignment states, and linguistic-validation status available in the underlying resource. Candidate or review-required evidence stays labeled as such. Agent-generated synthesis is kept conceptually separate from corpus evidence.

This is especially important because technical publication of an Indigenous-language resource is not equivalent to community or linguistic validation.

## What changed during the Challenge

The last repository commit before the Challenge window was `38dd3bc3343548db20e2a1a19e7fd35a47ea7996` on August 15, 2026. The WebMCP work is isolated in the challenge branch/PR and documented file-by-file.

Three Concepticon/Glottolog pilot commits entered `main` on August 29 before the WebMCP branch was created. They are unrelated scientific work and are explicitly excluded from the Challenge novelty claim.

## Verification

Automated validation for the first completed challenge implementation passed on GitHub Actions, including lint, build, tests, scientific-format validation, determinism, and corpus-integrity checks.

After deployment, verify in a compatible browser that these four tools are discoverable:

```text
get_lexical_relations
search_parallel_corpus
search_raramuri_lexicon
search_spanish_terminology
```

Suggested agent prompt:

> Using Rarámuri Digital, investigate vocabulary in a coherent semantic field. Find relevant Rarámuri entries, explain their Spanish meanings, identify documented lexical relationships, and verify several forms against bilingual corpus examples. Preserve provenance and flag any evidence that requires review.

## Demo video script — target 2:15–2:40

### 0:00–0:20 — Problem and project

> Rarámuri Digital is a provenance-aware Rarámuri–Spanish research infrastructure. It already publishes 2,581 lexicographic entries and several evidence layers. For the WebMCP Challenge, we made those capabilities directly discoverable by browser agents without changing the corpus or replacing the human interface.

Show the public homepage and briefly identify the project.

### 0:20–0:40 — WebMCP discovery

Open the compatible agent/browser view and show the four discovered tools:

- `search_raramuri_lexicon`
- `search_spanish_terminology`
- `get_lexical_relations`
- `search_parallel_corpus`

> These are browser-native WebMCP tools registered by the page itself. All are read-only and reuse Rarámuri Digital's existing APIs.

### 0:40–1:45 — Multi-step research flow

Run the suggested research prompt with a semantic field confirmed to return useful evidence.

Show at least three coordinated calls, ideally all four. On screen, point out:

- Rarámuri headword and Spanish meaning;
- source document/page provenance;
- a documented lexical relation;
- a bilingual corpus example;
- a pending/review status where applicable.

> The important part is that the agent is not scraping labels from the interface. It is invoking explicit capabilities and receiving structured evidence with provenance and validation states intact.

### 1:45–2:10 — Human/agent value

> This creates a research workflow rather than another search box. A human asks the question; the agent coordinates the lexicon, terminology, relations, and corpus; and the resource keeps documentary evidence and uncertainty attached to every step.

### 2:10–2:30 — Auditability

Show GitHub PR #33 and `WEBMCP_CHALLENGE.md`.

> The implementation is public and auditable. The WebMCP change is isolated from the scientific corpus, the software is MIT-licensed, and the existing validation pipeline passes.

End on the project URL.

## Final evidence fields

Fill these only after they exist:

- Deployed WebMCP verification date: `[PENDING]`
- Merged challenge commit/PR: `[PENDING]`
- Public YouTube demo: `[PENDING]`
- Devpost submission URL: `[PENDING]`
- Devpost submission confirmation/date: `[PENDING]`
