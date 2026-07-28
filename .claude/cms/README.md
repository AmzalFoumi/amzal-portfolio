# Content architecture & CMS evaluation

_Written 2026-07-28. Status: proposal, nothing implemented._

This directory evaluates whether `amzal-portfolio` should adopt a CMS (Payload was the one named),
and designs the content architecture needed to support **multiple tailored CVs**, **an archive of
past versions**, and **central control over where each piece of content appears**.

## The short answer

**You do not need a CMS to get most of what you asked for — but one of your four drivers genuinely
requires it, and there is a problem underneath all of it that has to be fixed first either way.**

| Driver                                    | Does a CMS solve it?                                      | Verdict                                                                                                                                                                                                                                                          |
| ----------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CV tailoring per role**                 | No — this is a _modelling_ problem, not a storage problem | Solvable today in pure TypeScript. Ship it first.                                                                                                                                                                                                                |
| **Central control of "what shows where"** | No — same modelling problem                               | Generalise the existing `showInAtsCv` / `showInStyledCv` flags into a channel matrix.                                                                                                                                                                            |
| **Archive of past CVs**                   | Partly                                                    | Git already versions your _source_. What you actually want is an **artifact archive** — "which exact PDF went to which company, on which date". That's snapshot-to-storage. Payload's built-in drafts/versions is the one CMS feature that maps cleanly onto it. |
| **Editing without a deploy**              | **Yes**                                                   | This is the only driver that truly requires a runtime datastore.                                                                                                                                                                                                 |
| **Learning value / CV-worthy tech**       | Yes, by definition                                        | Legitimate. Worth weighing openly rather than pretending it isn't a factor.                                                                                                                                                                                      |

So: three of your four drivers are satisfied by a refactor that costs **zero infrastructure, zero
ongoing money, and zero new failure modes**. The CMS earns its keep on the fourth — plus the
learning — and it becomes dramatically cheaper to adopt _after_ the refactor rather than before.

## Step zero, before anything else {DEFER FOR NOW}

`src/components/shared/CvStyledStatic.tsx` (383 lines) is the CV your site actually renders, and
roughly **250 lines of it are hardcoded content that has already drifted out of sync with
`src/data/`** — wrong city, wrong graduation date, a missing `featured` project, honors and skill
groupings that exist in no data file.

Meanwhile `src/components/shared/CvStyledDynamic.tsx` (361 lines) is a finished, data-driven
replacement for it that **nothing imports**.

Building a CMS on top of a component that ignores your data layer is building on sand. Fix this
first. It is a prerequisite for every other phase, and it is valuable on its own.

See [01-current-state.md](01-current-state.md) for the full drift catalogue.

## Recommended path

| Phase | What                                                                                                       | Infra        | Unlocks                                                                                         |
| ----- | ---------------------------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------- |
| **0** | Retire `CvStyledStatic`, wire `CvStyledDynamic`, add the missing `Profile` type, reconcile drifted content | None         | One source of truth. Makes everything else possible.                                            |
| **1** | Channel matrix + `CvVariant` model + `/cv/[variant]` pages and PDF routes                                  | None         | Tailored CVs, shareable links, downloads, public/private tiers. **All the user-visible value.** |
| **2** | CMS behind a single `src/lib/content.ts` accessor — _only if editing friction is still real_               | DB + admin   | Editing without a deploy. Drafts/versions.                                                      |
| **3** | Application archive: snapshot JSON + PDF to Blob, keyed by company and date                                | Blob storage | "What exactly did I send to Company X in March?"                                                |

The crucial structural idea: **Phase 1 introduces one accessor module that every component reads
content through.** After that, "where does content live" is one module's implementation detail, and
Phase 2 becomes a swap rather than a rewrite. Do not skip it.

## Documents

| Doc                                                  | Read it for                                                                                                               |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [01-current-state.md](01-current-state.md)           | What exists today, the three parallel CV implementations, and the exact drift catalogue                                   |
| [02-variant-model.md](02-variant-model.md)           | **The core design.** Channel matrix, `CvVariant`, visibility tiers, serving links + PDFs. Storage-agnostic                |
| [03-options-comparison.md](03-options-comparison.md) | Every alternative to Payload: git-as-CMS, Sanity, Supabase, Notion, MDX — with a comparison matrix                        |
| [04-payload-deep-dive.md](04-payload-deep-dive.md)   | Payload specifically: real install shape, **embedded vs separate backend app vs monorepo**, drafts/versions, honest costs |
| [05-rollout.md](05-rollout.md)                       | Phased execution, the accessor boundary, seed script, archive design, risks, and available tooling                        |

## If you only do one thing

Do Phase 0 and Phase 1. They deliver tailored CVs with shareable links, keep the site free and
fully static, and leave the CMS decision open with no penalty for deferring it.
