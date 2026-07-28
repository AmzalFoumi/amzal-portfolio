# 05 — Rollout

How to execute this incrementally, with each phase independently valuable and safe to stop after.

## The one structural idea

Every phase below depends on a single decision: **components must stop importing `src/data/*`
directly and read through one accessor module instead.**

```ts
// src/lib/content.ts — the seam
import type { Channel, CvVariant, Project, ExperienceGroup } from "@/types";

export async function getProjects(channel: Channel): Promise<Project[]>;
export async function getExperience(channel: Channel): Promise<ExperienceGroup[]>;
export async function getProfile(): Promise<Profile>;
export async function getVariant(slug: string): Promise<CvVariant | null>;
export async function getPublicVariants(): Promise<CvVariant[]>;
```

Phase 1 implements these against the existing TypeScript files (trivially — import, filter with
`forChannel`, return). Phase 2 reimplements the same signatures against a CMS. **Nothing else in
the codebase changes.**

Make the functions `async` from the start even though Phase 1 needs no await. Retrofitting async
through a component tree later is exactly the kind of churn this seam exists to prevent.

That single decision is what turns "adopt a CMS" from a rewrite into a swap, and it is why the
recommendation is to build Phase 1 first regardless of whether Phase 2 ever happens.

---

## Phase 0 — Fix the foundation

**Prerequisite for everything. Do this even if you abandon the rest of the plan.**

1. Add the missing `Profile` interface to [src/types/index.ts](../../src/types/index.ts) and type
   `profile.ts` against it. Currently it's an untyped literal that CV components reach into blind.
2. Add a `leadership` data model — `CvStyledDynamic` hardcodes this section because no model
   exists. `profile.honors` is adjacent but differently worded; reconcile them.
3. **Reconcile the drift.** Walk the catalogue in
   [01-current-state.md](01-current-state.md#the-drift-catalogue) item by item and decide which
   version is correct — the hardcoded CV or the data file. Update `src/data/*` to match. This is
   the real work of Phase 0; the import swap below is trivial by comparison.
4. Swap `HeroSection`'s import from `CvStyledStatic` → `CvStyledDynamic`.
5. Delete `CvStyledStatic.tsx`.
6. Update `CLAUDE.md`, which currently documents the two-implementations-to-keep-in-sync burden and
   the unwired `CvStyledDynamic`. Both facts stop being true.

**Verify:** `npm run build`, then open the CV modal and compare both views against the deleted
component side by side (keep it in git history and diff the rendered output). Expect visible
changes — that is the drift being corrected, not a regression. Check the print output too, since
`@media print` rules in `globals.css` target `.cv-root`.

**Also worth considering:** the styled CV's QR codes call `api.qrserver.com` at render time. Your CV
currently depends on a third-party service being up. Generating them at build time or inlining as
data URIs would remove that.

**Value delivered:** one source of truth. The `showInStyledCv` flags become live for the first time.

---

## Phase 1 — Variants, with zero infrastructure

Implements [02-variant-model.md](02-variant-model.md) in full.

1. Add `Channel`, `ChannelScoped`, `CvVariant`, `SectionKey`, `VariantVisibility` to
   `src/types/index.ts`.
2. Add `src/lib/channels.ts` with `isVisibleOn` / `forChannel`.
3. Migrate the existing booleans to `hiddenIn` per the table in
   [02-variant-model.md](02-variant-model.md#nothing-you-can-do-today-is-lost). Mechanical — only
   the handful of entries carrying flags today need touching.
4. Add `src/data/cvVariants.ts`.
5. Add `src/lib/content.ts` — the seam, backed by the data files.
6. Refactor `CvAtsDynamic`, `CvStyledDynamic` and the site sections to take a `channel` (and
   optionally a `variant`) and read through the accessor.
7. Add `src/app/cv/[variant]/page.tsx` and `src/app/cv/[variant]/pdf/route.ts`.
8. **Close the leak vectors** —
   [02-variant-model.md](02-variant-model.md#leak-vectors-to-close-explicitly): filter
   `generateStaticParams` to public variants, filter `sitemap.ts`, set `robots: { index: false }`
   on non-public variants, and return a real `404` for private ones.

**Verify:** `npm run build`; confirm the build output lists only public CV routes. Fetch a public
variant, an unlisted one, and a private one and check status codes and `robots` meta. Download the
PDF from `/cv/<slug>/pdf` and open it. Confirm `HeroSection`'s existing buttons still work.

**Value delivered:** everything you asked for except editing-without-deploy. Still £0/month, still
no backend.

**Stop here and reassess.** Live with it for a few weeks of actual job applications. If editing
friction is genuinely painful by then, Phase 2 is justified. If it isn't, you've saved yourself a
database.

---

## Phase 2 — CMS behind the seam

Only if Phase 1's friction is real. See [04-payload-deep-dive.md](04-payload-deep-dive.md) for the
Payload specifics and [03-options-comparison.md](03-options-comparison.md) if reconsidering.

1. Provision Postgres (Neon via Vercel Marketplace). Set `PAYLOAD_SECRET`, `DATABASE_URI`.
2. Install Payload, wrap `next.config.ts` in `withPayload`, write `payload.config.ts`.
3. Define collections mirroring `src/types/index.ts`; `profile` becomes a Global.
4. **Seed from the existing files.** Write a one-shot script that imports `src/data/*.ts` and writes
   documents via the Local API. Your current data files become the seed source of truth — no manual
   re-entry, no transcription errors.
5. Reimplement `src/lib/content.ts` against Payload's Local API. **This is the only file that
   changes.** If a component needs editing at this step, the seam was drawn wrong.
6. Add caching: `'use cache'` + `cacheTag` in the accessor, `updateTag` from a Payload `afterChange`
   hook.
7. Keep `src/data/*.ts` in the repo, git-ignored from the build, as seed data and as a fallback.

**Verify:** seed into a fresh database, then diff the rendered site against the pre-migration build
— it should be byte-identical if the seed is faithful. Publish a change in `/admin` and confirm it
appears without a deploy. Confirm an unpublished draft is invisible to a logged-out request.

---

## Phase 3 — Application archive

The thing you actually meant by "versioning". Independent of Phase 2 — it works on top of Phase 1
alone.

The insight: git versions your *source*, and Payload versions your *documents*, but neither answers
"what exact PDF did I send to Company X on 12 March". That needs an immutable artifact.

```ts
interface Application {
  company: string;
  role: string;
  appliedAt: string;      // ISO date
  variantSlug: string;
  /** Frozen copy of the resolved content at send time. */
  snapshot: ResolvedCv;
  /** Blob URL of the exact PDF sent. */
  pdfUrl: string;
  outcome?: "pending" | "rejected" | "interview" | "offer";
}
```

On "send", resolve the variant, render the PDF, upload both the PDF and the JSON snapshot to Vercel
Blob (**private**, not public), and record the row. The snapshot matters as much as the PDF —
it's what lets you diff what you claimed then against what you claim now, and regenerate the
document if the format changes.

Never regenerate an archived PDF from current data. The point is that it's frozen.

---

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| **No test suite.** Every phase changes rendered output with nothing to catch regressions. | Build and eyeball at each step. Consider adding a snapshot test of resolved CV content per variant — a pure function over data, cheap to test, and it protects every later phase. |
| **Phase 0 changes the visible CV.** | Expected, not a bug — it's drift correction. Review the diff deliberately rather than assuming the data files are right. |
| **Unlisted variants leak.** | The three vectors in [02-variant-model.md](02-variant-model.md#leak-vectors-to-close-explicitly). Verify against the actual build manifest, not by reading code. |
| **Content trapped in a database.** | Scheduled export of all collections to JSON, committed to the repo or pushed to Blob. Set this up the same day the CMS goes in, not later. |
| **Payload major upgrades / migrations.** | Real ongoing cost. Pin versions, read release notes, test migrations against a branch database. |
| **Scope creep into a monorepo.** | Resist. Split only when a concrete problem demands it — see [04-payload-deep-dive.md](04-payload-deep-dive.md#recommendation-start-embedded-a-preserve-the-option-to-split). |

## Tooling available in this environment

Verified during this evaluation:

- **context7 MCP** — live Payload and Next.js docs. Already used to source every API detail in
  [04-payload-deep-dive.md](04-payload-deep-dive.md). Use it rather than recalled API shapes.
- **`vercel:marketplace` skill** — provisioning Neon Postgres and other integrations.
- **`vercel:vercel-storage` skill** — Blob and Neon specifics for Phase 3.
- **`vercel:next-cache-components` skill** — `use cache` / `cacheTag` / `updateTag`, needed in
  Phase 2 step 6.
- **`vercel:nextjs` skill** — route handlers, async params, streaming responses for Phase 1 step 7.
- **`supabase` skill + MCP** — if Option C is chosen instead.
- **Payload's own Claude skill** — ships in the Payload repo at `tools/claude-plugin/skills/payload/`.

Two blockers to clear before any Phase 2 work:

- **The Vercel CLI is not installed.** `npm i -g vercel` is needed before `vercel integration`,
  `vercel env pull`, or `vercel deploy`.
- **The Vercel and Supabase MCP servers are unauthenticated.** They need authorising interactively
  via `claude mcp` or `/mcp`. Not required for Phase 0 or 1.
