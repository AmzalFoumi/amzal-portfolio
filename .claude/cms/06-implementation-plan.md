# Plan: Central content admin + multi-version CV system

> **This is the approved implementation plan, persisted from the planning session.**
> It is a record of intent, not a live document — the sections below are annotated
> with what actually shipped. Where the build diverged from the plan, the divergence
> is noted inline rather than the plan being rewritten to match.

## Status as of 2026-08-17

**Stage 1 is complete and verified.** `npx tsc --noEmit` clean · `npm run lint` 0 errors
(9 pre-existing `no-img-element` warnings) · `npm test` 80 passing · `npx playwright test`
8 passing · `npm run build` green with `/cv/[variant]` and its download route both
listed as Dynamic (`ƒ`), which is the manual confirmation that no private slug reaches
the build manifest.

| Section | Status | Note |
| --- | --- | --- |
| 1.1 Stable identity | Done | `key` on projects, roles, education, certifications, references, project links. `workExperience.ts` is an empty array so it needed none. |
| 1.2 Flatten experience | Done | `flattenExperience()` in the files adapter; role-level location/workMode/engagementType win over group-level. |
| 1.3 Flags kept, URLs become a checklist | Done | Migration wrote explicit arrays reproducing prior output exactly. |
| 1.4 Fix the `featured` gate | Done | **Consequence pending your call:** `asl-finance-hub` now appears on the styled CV. |
| 1.5 Variant types + three-tier resolution | Done | Written test-first; 29 tests in `resolve.test.ts`. |
| 1.6 The port and first two adapters | Done | Seed variants are named `general-styled` / `general-ats`, not `default-*` as the plan said. |
| 1.7 Refactor the renderers | Done | Both are now `({ cv }: { cv: ResolvedCv })` with zero data imports and zero filtering. |
| 1.8 Reconcile the drift | **Not done — awaiting adjudication** | Each divergence is a fact about Amzal's life, not a decision the implementation can make. See below. |
| 1.8 Freeze the static CV | Done | `CvStyledStatic.tsx` retained behind `CV_FALLBACK_STATIC=1` with a dated frozen-artifact header. Amzal will edit its content separately. |
| 1.8b Page-break rules | Done | Plus two bugs the plan did not anticipate — see "What the plan missed". |
| 1.9 Routes and gating | Done | All four leak vectors closed; three of them have a Playwright tripwire. |
| Stage 2 (Payload) | Not started | Blocked on the infrastructure items under "What Amzal does". |

### What the plan missed

Three defects surfaced during implementation that the plan did not predict:

1. **Printing the standalone `/cv/styled` page produced a blank sheet.** The print CSS
   hid everything outside `.cv-print-root`, which existed only inside `HeroSection`'s
   hidden portal. Caught by Playwright tripwire 1 failing — the exact class of bug that
   test exists for. Fixed by introducing `.cv-print-scope` as the printable-subtree
   marker, applied at *both* render sites.
2. **`@page { margin: 0 }` meant page 2 printed flush to the paper edge.** Container
   padding applies once; page margin repeats. Vertical margin moved to `@page`.
3. `asl-finance-hub.repoUrl` carried a trailing space. The CVs hid it with `.trim()`;
   the project pages did not.

### The one blocking decision

§1.8's drift list is unadjudicated. The data files currently win everywhere; the frozen
static CV disagrees on location, graduation date, role title, role dates, honours and
skill groupings. Two facts have nowhere to live at all: Itinerary.ai's "A+ (Top 0.3%)"
(no field on `Project`) and `profile.honors`, which is written but read nowhere and
duplicates `education[0].achievements` in different words.

---

## Context

The portfolio's content lives in typed TypeScript files under `src/data/` and is rendered
directly by components. Changing anything means editing code, committing, and waiting for a
Vercel rebuild. Tailoring a CV for a specific role isn't possible — there are two booleans
(`showInAtsCv` / `showInStyledCv`) producing exactly two fixed outputs.

Amzal wants:

1. A **form-based admin UI** to manage all the site's content centrally.
2. **Multiple CV versions** of both formats (styled and ATS), each defaulting to site content
   but allowing **per-field overrides** ("leave as site default, or edit") and per-version choice
   of which items appear.
3. **One published version of each format** visible to the public; all other versions remain
   author-only but still viewable and downloadable by him.
4. A **live preview** of the CV inside the admin while editing.
5. A **safe fallback** — if Payload breaks, the site and the published CVs keep working.

Decisions taken: Payload CMS, MongoDB (Atlas free tier, two databases on one cluster), embedded
in this same Next.js app, full per-field overrides, Live Preview enabled.

**The per-format flags stay.** They exist so the same project can behave differently on the ATS
CV and the styled CV — different visibility, different links. All seven projects currently set
identical values, which means the axis is unexercised, not unnecessary. Variants layer *on top
of* the format flags rather than replacing them.

### Do we need a CMS, or should we build it?

**Payload, for asks 1 and 4 specifically.** Ask 1 is Payload's core product — it generates the
entire CRUD form UI from a schema, which would otherwise be weeks of hand-built forms,
validation, and persistence across seven entity types. Ask 4 (Live Preview) is built in: it
renders the real `/cv/<slug>` page beside the edit form.

Asks 2, 3 and 5 — the variant model, override resolution, gating, and the fallback architecture
— are **application logic Payload does not provide**. That code gets written either way. Writing
it first against the existing TypeScript files is the same total work in a cheaper order: fast
iteration with no database in the loop, and a verification point before any infrastructure exists.

### What goes in the CMS vs stays in code

| Goes into Payload | Stays in code |
|---|---|
| `profile` (Global) | Rendering components, `globals.css`, design tokens |
| `projects`, `experience`, `education`, `certifications`, `references` | `resolveCv()` and all resolution logic |
| `leadership` (Global — currently hardcoded in both styled CV components) | `DEFAULT_SECTION_ORDER`, `PROJECT_CARD_TAG_LIMIT` |
| `cv-variants` (versions, selections, overrides) | Types (Payload generates `payload-types.ts`) |
| | Section copy in `src/components/sections/*` |
| | **Images** — `public/` paths stay plain text fields. No media library, no uploads. |

Deliberately excluded: uploads/media library, rich text, multi-user auth. Complexity with no
payoff for a single author whose images are already static assets.

---

## The resilience architecture

This is a first-class requirement, not a bolt-on, so it's designed up front and built in Stage 1
— **before** Payload exists. Three named patterns, each covering a different failure mode.

### Ports and Adapters

`src/lib/content.ts` is the **port** — an interface every component reads through. Behind it sit
interchangeable **adapters**, none of which any component knows about:

```
src/lib/content/
├── index.ts          the port: chooses an adapter, exports the public API
├── types.ts          the ContentSource interface every adapter satisfies
├── adapters/
│   ├── files.ts      reads src/data/*.ts          (Stage 1, and the seed)
│   ├── snapshot.ts   reads src/content/snapshot.json (the fallback)
│   └── payload.ts    reads Payload via Local API   (Stage 2)
└── contract.test.ts  one suite, run against every adapter
```

The **contract test** is what makes this real rather than aspirational: a single suite asserting
port behaviour, executed against all three adapters. If `payload.ts` ever diverges from
`files.ts`, it fails in CI, not in production.

### The snapshot — and why not `src/data/*.ts`

You asked to fall back to the data files. That works on day one and then rots: the moment you
edit in Payload, `src/data/*.ts` is stale, and a fallback that silently serves months-old content
is worse than an error.

So: a **generated snapshot** in the same shape, `src/content/snapshot.json`, committed to the
repo and regenerated by a `prebuild` script that reads live Payload. It is at most one deploy
old, always.

```
prebuild:  read Payload -> write src/content/snapshot.json
           (Payload unreachable? keep the committed file, build proceeds)
build:     next build, snapshot bundled into the artifact
runtime:   PayloadAdapter fails -> SnapshotAdapter serves
```

`src/data/*.ts` keeps a different job: it is the **seed** (Stage 2 imports it once) and the
Stage 1 adapter. It stops being the fallback the day Payload goes live.

The snapshot is also the backup answer — content leaves git for a database, and this puts a
readable copy back in git on every deploy.

### Circuit breaker

Wrapping the Payload adapter, per the
[standard pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker):
after N consecutive failures the circuit opens, calls stop, and `SnapshotAdapter` serves until a
cooldown elapses. Without it, every request pays a full connection timeout before failing.
~40 lines, no dependency.

### Kill switch

```
CONTENT_SOURCE = payload | snapshot | files      # default: payload
```

Circuit breakers catch Payload being *down*. They do not catch Payload being *up and wrong* —
a bad migration, a botched bulk edit, corrupted data. For that you want a switch: set
`CONTENT_SOURCE=snapshot` in Vercel, redeploy, and you're on last-known-good in two minutes with
no code change. Read once at module load in `content/index.ts`.

### Break-glass: the static CV

```
CV_FALLBACK_STATIC = 0 | 1        # default: 0
```

[CvStyledStatic.tsx](src/components/shared/CvStyledStatic.tsx) is **retained, not deleted** — the
one component that depends on nothing at all. No adapter, no snapshot, no `resolveCv`, no data
files, no database. If every other layer is broken, setting this flag renders a known-good styled
CV from hardcoded JSX.

It sits below the snapshot because it is a single fixed CV, not the site's content: it covers
"my CV must be viewable right now" and nothing else. Reconciled once in §1.8, then frozen — see
the honesty note there about why it must not be treated as a second source of truth.

### Failure modes and what covers each

| Failure | Covered by | Cost |
|---|---|---|
| Payload/Mongo down at **build** time | Build fails; Vercel keeps the last good deployment live | Free, already true |
| Payload/Mongo down at **request** time | Circuit breaker → snapshot adapter | ~40 lines |
| Payload **up but serving wrong data** | `CONTENT_SOURCE` kill switch | One env var |
| Mongo **data loss** | Snapshot committed on every deploy + scheduled JSON export | Prebuild script |
| Payload adapter **drifts** from the contract | Contract test suite in CI | One test file |
| Payload **package broken** by an upgrade | `CONTENT_SOURCE=files` + `git revert` | Free |
| **Everything above fails** and you need a CV now | `CV_FALLBACK_STATIC=1` → `CvStyledStatic` | Keep the file, don't delete it |

**What this does not cover**, stated plainly: the `/admin` panel itself has no fallback — if
Payload is broken you cannot edit, only serve. That is the correct trade. Reads degrade
gracefully; writes fail loudly.

---

## Testing approach

The repo has **no test infrastructure today** — [package.json](package.json) has `dev`, `build`,
`start`, `lint` and nothing else; zero test files in [src/](src/). That's been fine because the
site is presentational and breakage is visible. It stops being fine at §1.5, which introduces the
first logic in this repo that can **fail silently**: a wrong tier inheritance renders a
valid-looking CV that's quietly missing something.

Not TDD as a methodology, and not formal spec-driven development — the plan file and the
TypeScript interfaces in §1.5 already serve as the spec. Targeted test-first work on the two
modules that are pure, load-bearing, and unverifiable by eye, plus three e2e tripwires.

### Vitest — unit (`+ vite-tsconfig-paths` for the `@/*` alias)

| Module | Approach | Why |
|---|---|---|
| `src/lib/cv/resolve.ts` | **Test-first** | Three-tier inheritance has precise answers a rendered page cannot reveal. The tests are the readable spec of the tier rules. |
| `src/lib/content/contract.test.ts` | **Test-first by definition** | The contract test *is* the port's definition; all three adapters are written against it. |

Both survive the Payload cutover unchanged, which is what makes them the evidence the cutover was
faithful rather than merely uneventful.

### Playwright — three tripwires, not a suite (`tests/e2e/cv.spec.ts`, ~60 lines)

1. **Styled CV breaks safely across pages** under `emulateMedia({ media: "print" })`. Multiple
   pages are fine; *bad* breaks are not. Measure every atomic block's bounding box in
   `page.evaluate` and assert none straddles a page boundary: no job entry, project entry,
   education entry or certification split in half, and no section heading left stranded as the
   last element on a page. The highest-value test here — it's a manual check you'd otherwise
   repeat forever, and the whole point of variants is generating CVs you have *not* printed.
2. **`GET /cv/<private-slug>` returns 404** when logged out. Real HTTP against a real build tests
   route registration and gating together; importing the handler into Vitest tests neither.
3. **`sitemap.xml` contains only `/cv/styled` and `/cv/ats`.**

### Deliberately not tested

| | Why |
|---|---|
| Visual regression / screenshot baselines | §1.8 intentionally changes CV output — baselines would churn through exactly the phase you'd want them stable. Revisit after Stage 1 lands. |
| CV components via React Testing Library | Asserts JSX shape on a component whose output is meant to change. Pure churn. |
| Payload collection configs | Declarative schema; testing it tests Payload. |
| §1.8 drift reconciliation | Editorial decisions about facts, not logic. |
| `generateStaticParams` slug leakage | Neither tool sees the build manifest — inspect `.next` output by hand per §1.9. |

---

## Stage 1 — Variant model and the port, against the existing data files

No database, no new dependencies. Ships tailored CVs with shareable links on its own, and stands
up the entire resilience structure before there's anything to be resilient to.

### 1.1 Stable identity

Overrides and selections need a key that survives edits. Content strings can't serve — renaming
a role title is exactly the edit this feature enables — and array indices break on reorder.

Add a required `key: string` to `Project`, `ExperienceRole`, `EducationEntry`, `Certification`,
`Reference` and `ProjectLink` in [src/types/index.ts](src/types/index.ts), authored by hand in
the data files (~21 lines). Projects reuse their existing `slug` value.

> Named `key`, **not** `id` — Payload reserves `id` for its document identifier in Stage 2.

Also add the missing `Profile` and `TechStackGroup` interfaces and annotate
[src/data/profile.ts](src/data/profile.ts), currently the only untyped data file.

### 1.2 Flatten experience

`ExperienceGroup { organisation, roles[] }` is an authoring convenience; both CV renderers and
the override model want a flat list of job entries. Add `ExperienceItem` (organisation folded
into each role), derived in the adapter. `ExperienceSection` keeps consuming the grouped shape —
same source, two views, no duplicated data.

### 1.3 Per-format settings: flags kept, URLs become a checklist

**Visibility flags are unchanged.** `showInAtsCv` and `showInStyledCv` stay exactly as they are
on `Project`, `ExperienceRole` and `Certification`. Zero churn.

**URL preference becomes a checklist.** Today `atsCvUrlPreference: "live" | "repo" | "none"`
picks exactly one. Replace with an array so you can show all available links, some, or none —
array order is display order:

```ts
/** Identifies one of a project's available URLs. */
export type CvUrlKey = "live" | "repo" | `link:${string}`;

export interface Project {
  liveUrl?: string;
  repoUrl?: string;
  links?: ProjectLink[];        // ProjectLink gains `key`

  showInAtsCv?: boolean;        // unchanged
  showInStyledCv?: boolean;     // unchanged

  /** Which URLs appear on the ATS CV, in order. Omit = all available. [] = none. */
  atsCvUrls?: CvUrlKey[];
  /** Which URLs appear on the styled CV, in order. Omit = all available. [] = none. */
  styledCvUrls?: CvUrlKey[];
}
```

`links[]` becomes addressable — `distributed-health`'s "System Design Writeup" can now appear on
the ATS CV, which it never could before.

Migration writes explicit arrays reproducing today's output exactly, so nothing changes
implicitly. Nothing relies on the omit-means-all default until you choose to.

### 1.4 Fix the `featured` gate

`CvStyledDynamic` filters projects on `project.featured && project.showInStyledCv !== false`.
That second gate is undocumented and wrong: `asl-finance-hub` has `featured: false` and no
`showInStyledCv: false`, so it's silently hidden from the styled CV despite its flag saying show.

Remove `featured` from CV filtering entirely. `showInStyledCv` alone decides. `featured` stays on
`Project` as a **site-only** field driving the homepage grid; update its JSDoc to say so.

**Consequence:** `asl-finance-hub` starts appearing on the styled CV. If it shouldn't, set
`showInStyledCv: false` — one control, one meaning.

### 1.5 Variant types and three-tier resolution

New `src/types/cv.ts`:

```ts
/** Patch over a canonical item. Key absent -> inherit. null -> explicitly cleared. */
export type Override<T> = { [K in keyof T]?: T[K] | null };

export type CvFormat = "styled" | "ats";

/** One item's per-variant treatment. Every field optional; absent means inherit. */
export interface VariantItem<T> {
  key: string;
  /** Tri-state: true = force in, false = force out, absent = inherit the format flag. */
  include?: boolean;
  /** Absent = inherit the format's URL checklist. */
  urls?: CvUrlKey[];
  /** Field-level edits. Absent keys use the site default. */
  override?: Override<T>;
}

export interface CvVariant {
  slug: string;
  label: string;
  format: CvFormat;
  published: boolean;
  headline?: string | null;
  summary?: string[] | null;
  techStacks?: TechStackGroup[] | null;
  sectionOrder?: CvSectionKey[];
  sectionTitles?: Partial<Record<CvSectionKey, string>>;
  /** Only items needing per-variant treatment appear. Order here overrides canonical order. */
  items?: {
    projects?: VariantItem<Project>[];
    experience?: VariantItem<ExperienceItem>[];
    education?: VariantItem<EducationEntry>[];
    certifications?: VariantItem<Certification>[];
    references?: VariantItem<Reference>[];
  };
}
```

`Override<T>` rather than `Partial<T>` because `Partial` can't express "clear this field" —
`{ grade: undefined }` and `{}` are indistinguishable after a JSON round-trip, and Mongo doesn't
round-trip `undefined` reliably.

**Resolution is three tiers:**

1. **Canonical item** — the data file / CMS record.
2. **Format layer** — `showInAtsCv` / `atsCvUrls` when rendering ATS; the styled pair when
   rendering styled. This is the CV-wide default a brand-new variant inherits.
3. **Variant layer** — only for items the variant explicitly mentions. Anything unmentioned
   behaves exactly as tier 2 says.

So a new ATS variant starts out identical to the default ATS CV without listing a single item.
You touch only what should differ.

New `src/lib/cv/resolve.ts` — **pure**: no adapter imports, no React, no `next/*`.

```ts
export function resolveCv(content: SiteContent, variant: CvVariant): ResolvedCv
```

Ordering: items the variant lists appear first in the variant's order; unlisted items follow in
canonical order. Variant entries whose `key` matches nothing are dropped with a dev-mode warning.

New `src/lib/cv/projectUrls.ts` resolves `CvUrlKey[]` into renderable `{ label, url }[]` — the
live/repo branch is currently duplicated verbatim in both CV components.

### 1.6 The port and the first two adapters

`src/lib/content/types.ts`:

```ts
export interface ContentSource {
  getSiteContent(): Promise<SiteContent>;
  getCvVariants(): Promise<CvVariant[]>;
  getCvVariant(slug: string): Promise<CvVariant | null>;
  getPublishedVariant(format: CvFormat): Promise<CvFormat extends never ? never : CvVariant | null>;
}
```

Async throughout despite the TS files being synchronous — otherwise every call site changes again
at the Payload cutover.

Build `files.ts` (reads `src/data/*.ts`, flattens experience) and `snapshot.ts` (reads
`src/content/snapshot.json`) **now**, plus `contract.test.ts` run against both. Add the
`prebuild` snapshot script, sourcing from the files adapter in Stage 1 — so the snapshot format,
the script, and the contract are all proven before Payload arrives. Stage 2 then adds one
adapter to a structure that already works.

`src/data/cvVariants.ts` seeds two variants — `default-styled` and `default-ats`, both
`published: true`, both with **empty `items`**. They inherit the format flags entirely, which
reproduces today's output with zero duplication.

### 1.7 Refactor the renderers

Both become pure presentational components taking one prop:

```ts
export function CvAtsDynamic({ cv }: { cv: ResolvedCv })
export function CvStyledDynamic({ cv }: { cv: ResolvedCv })
```

Delete every `@/data/*` import and every filter — filtering happened in `resolveCv`. Drive the
body from `cv.sectionOrder`. For the styled CV's two-column `.grid-layout`, keep a fixed
`Record<CvSectionKey, "left" | "right">` column assignment and order *within* each column;
free-form styled layout is out of scope.

[HeroSection.tsx](src/components/sections/HeroSection.tsx) is `"use client"` and can no longer
import data — it receives the two published `ResolvedCv` objects as props from
[page.tsx](src/app/page.tsx). `ResolvedCv` is plain JSON and crosses the RSC boundary fine.

### 1.8 Reconcile the drift, keep the static CV as break-glass

[CvStyledStatic.tsx](src/components/shared/CvStyledStatic.tsx) (405 lines, zero data imports) is
what the site renders today, and its content has diverged from `src/data/`. **It is not deleted**
— it's switched off and retained as the last-resort fallback (see the resilience section). Its
value is precisely that it depends on nothing: no adapter, no snapshot, no `resolveCv`, no data
files. If everything else is broken, it still renders a correct CV.

Adjudicate each divergence below and fix it in **both** places — the data files are not
automatically right:

- Headline and summary paragraph exist only in the static CV
- Location "Dehiwala" vs `profile.location` "Colombo, Western Province"
- Graduation "Dec 2027" vs `education` "Nov 2027"
- Role title "SE Team Lead - National Dev Team" vs data "Software Engineering Team Lead"
- Role dates "Feb 2025 – Jan 2026" vs data "Mar 2025 – Feb 2026"
- "Top 1% Merit Scholarship" and "Consistent Dean's List" exist in no data file
- Itinerary.ai's "A+ (Top 0.3%)" claim has no field on `Project`
- 2 hand-made skill buckets vs `profile.techStacks`' 7 groups; `AI & Agents` and
  `Platforms & Services` absent from the static CV entirely
- `profile.honors` is written but **never read anywhere** — three out-of-sync copies of the same
  three honors live in `profile`, `education[0].achievements`, and the static CV

Add a `leadership` model — currently hardcoded identically in *both* styled components because
none exists.

Expect the rendered CV to change visibly. That's drift correction, not regression.

**Retiring it honestly.** Keeping a hand-maintained parallel CV re-creates the drift problem this
plan exists to solve — the day you edit anything in Payload, it goes stale again. So it is
retained as a **frozen artifact, not a maintained implementation**: reconciled once here, then
left alone. Add a dated header comment saying exactly that, so a future reader knows it is
emergency-only and its content is as-of that date. That trade is fine for break-glass; it is not
fine if anyone mistakes it for a second source of truth.

### 1.8b Page-break rules

Multi-page CVs are acceptable; unsafe breaks are not. [globals.css](src/app/globals.css)
currently has only `.cv-print-root section { break-inside: avoid }`, which protects whole sections
but nothing inside them — a single job entry can still be sliced in half.

Add, scoped to `.cv-print-root` inside `@media print`:

- `break-inside: avoid` on each atomic entry (job, project, education, certification), not just
  the section wrapper
- `break-after: avoid` on section headings, so a heading can't be orphaned at a page bottom
- `orphans` / `widows` on descriptive paragraph text
- Reconsider `section { break-inside: avoid }` itself — on a long experience section it now
  forces an unnecessary page break rather than allowing a clean split between entries

Playwright tripwire 1 is the assertion for all of this.

### 1.9 Routes and gating

```
src/app/cv/[variant]/page.tsx           styled or ATS preview
src/app/cv/[variant]/download/route.ts  server-rendered PDF (ATS)
```

`export const dynamic = "force-dynamic"` — gating must not be baked into a static shell.
Unpublished variants return **404, not 403**, so the response never confirms a private slug
exists. `isAuthor()` lives in `src/lib/auth.ts` as a signed-cookie check in Stage 1 and becomes
`payload.auth({ headers })` in Stage 2 — one function, one cutover.

Stable public aliases `/cv/styled` and `/cv/ats` resolve via `getPublishedVariant(format)`, so
the public URL doesn't change when you publish a different version. Those two are what
`HeroSection` links to and the only CV URLs in the sitemap.

**Four leak vectors, each needing an explicit fix:**

1. **No `generateStaticParams` on `/cv/[variant]`.** The biggest risk — it would bake every
   private slug into the build manifest and prerender private CVs to the CDN.
2. **[sitemap.ts](src/app/sitemap.ts)** currently maps projects unconditionally. Emit only the
   two aliases.
3. **No `opengraph-image.tsx` under `cv/[variant]`.** It's a separate route segment that does
   **not** inherit page gating — it would render a private CV's name and headline into a publicly
   fetchable PNG.
4. **The download route repeats the check independently.** Route handlers inherit nothing from
   the page. Same for `generateMetadata`.

### Stage 1 verification

**Automated:**

- `resolveCv` unit tests: variant with no items matches the format-flag output; `include` forces
  in and out; `urls: []` shows none; omitted `urls` inherits; `null` clears; unknown key dropped.
- Contract test green against both `files` and `snapshot` adapters.
- The three Playwright tripwires pass.

**Manual — the things no tool covers:**

- `npm run build`; inspect the output and confirm **no** `/cv/<slug>` routes are prerendered.
- `CONTENT_SOURCE=snapshot npm run dev` renders the site identically to `CONTENT_SOURCE=files`.
- Compare the new styled CV against `CvStyledStatic` side by side — every difference should trace
  to a deliberate §1.4 or §1.8 decision. After reconciliation the two should agree.
- `CV_FALLBACK_STATIC=1` renders the static CV and it still prints correctly.
- Download the ATS PDF from `HeroSection` and from `/cv/ats/download`; both should match.
- Fetch a published variant (200) and an unpublished one logged in (200) — the logged-out 404 is
  covered by tripwire 2.

---

## Stage 2 — Payload CMS

Only after Stage 1 is merged and verified.

### 2.1 Install

```bash
npm i payload @payloadcms/next @payloadcms/db-mongodb @payloadcms/richtext-lexical
npm i @payloadcms/live-preview-react
```

Wrap [next.config.ts](next.config.ts) in `withPayload()`, add `payload.config.ts` at the root
with `mongooseAdapter({ url: process.env.DATABASE_URL })`. Payload scaffolds `src/app/(payload)/`
(admin, api, graphql, graphql-playground) alongside existing routes untouched.

Env: `PAYLOAD_SECRET`, `DATABASE_URL`, `NEXT_PUBLIC_SERVER_URL`, `CONTENT_SOURCE`. `.env*` is
already gitignored. Node 22.16 clears Payload's requirement.

MongoDB needs no migrations — schema changes are config changes. That's why it was chosen here.

### 2.2 Collections

Mirroring the Stage 1 types one-to-one: `projects`, `experience`, `education`, `certifications`,
`references`, `cv-variants` as Collections; `profile` and `leadership` as Globals.

Per-format settings on `projects` are four plain fields, URL checklists as `hasMany` selects:

```ts
{ name: "showInAtsCv",    type: "checkbox", defaultValue: true },
{ name: "showInStyledCv", type: "checkbox", defaultValue: true },
{ name: "atsCvUrls",      type: "select", hasMany: true, options: [...] },
{ name: "styledCvUrls",   type: "select", hasMany: true, options: [...] },
```

`cv-variants` models per-item treatment as an **array field per section** (Payload has no
arbitrary-key field type), which is exactly the "leave as site default or edit" UI — a row per
item, blank fields inherit, row order drives CV order:

```ts
{ name: "projectItems", type: "array", fields: [
    { name: "project", type: "relationship", relationTo: "projects", required: true },
    { name: "include", type: "radio", options: ["inherit", "show", "hide"], defaultValue: "inherit" },
    { name: "urls", type: "select", hasMany: true },   // blank = inherit format list
    { name: "title", type: "text" },                    // blank = site default
    { name: "shortDescription", type: "textarea" },
  ]}
```

The adapter converts these into the `VariantItem<T>[]` shape `resolveCv` already expects, so the
resolution code is untouched.

Access control: public `read` on canonical content; `cv-variants` reads gate on
`published === true` unless `req.user` exists. Single-user `users` collection, registration off.

### 2.3 Live Preview

```ts
admin: { livePreview: { url: ({ data }) => `${base}/cv/${data.slug}`, collections: ["cv-variants"] } }
```

Add the `RefreshRouteOnSave` client component so the server-rendered `/cv/[variant]` page
re-renders on save. The preview iframe carries the admin session, so the existing `isAuthor()`
gate lets unpublished variants render there and nowhere else.

### 2.4 Cutover

1. Seed from `src/data/*.ts` via a one-shot Local API script — existing files are the seed
   source, nothing retyped by hand.
2. Add `adapters/payload.ts`; wrap it in the circuit breaker; make it the default
   `CONTENT_SOURCE`. **No component changes.** If one is needed, the port was drawn wrong.
3. Run the existing contract test against the Payload adapter. It must pass unchanged.
4. Repoint the `prebuild` snapshot script from the files adapter to the Payload adapter.
5. Add `'use cache'` + `cacheTag` in the port and `updateTag` from an `afterChange` hook, so
   publishing invalidates exactly the affected pages and the site stays CDN-fast.
6. Add a scheduled JSON export of all collections alongside the per-deploy snapshot.
7. Update [CLAUDE.md](CLAUDE.md), which documents the now-obsolete two-CV-implementations burden.

### Stage 2 verification

- Seed a fresh dev database, then diff the rendered site and both CVs against the Stage 1 build —
  identical if the seed is faithful.
- Contract test green against all three adapters.
- Publish a change in `/admin`; confirm it appears without a deploy.
- **Fallback drill, done deliberately once:** stop the database (or point `DATABASE_URL` at a
  dead host), load the site, confirm it serves from the snapshot rather than erroring, and
  confirm the circuit opens instead of timing out per request. Then set `CONTENT_SOURCE=snapshot`
  and confirm Payload is bypassed entirely.
- Confirm an unpublished draft and an unpublished variant are both invisible logged out.
- Confirm Live Preview updates on save for a `cv-variants` document.
- Re-run every Stage 1 leak-vector check — collection access control does not replace them.

---

## What Amzal does (not automatable)

1. Provision **MongoDB Atlas** free cluster; create `portfolio-dev` and `portfolio-prod`.
2. `npm i -g vercel` — the CLI is not installed and `vercel env pull` needs it.
3. Generate `PAYLOAD_SECRET` (different per environment); set env vars locally and on Vercel.
4. Create the first admin user in the browser after `/admin` boots.
5. **Adjudicate the §1.8 drift list** — which version of each divergent fact is correct.
6. Decide whether `asl-finance-hub` should now appear on the styled CV (§1.4).

## Open risk

There is **no test suite today**, and every stage changes rendered output. Two cheap tests carry
the whole plan: `resolveCv` unit tests (pure function over plain data) and the adapter contract
suite. Together they protect every later change including the entire Payload cutover and the
fallback path.

## References

- [Repository / Ports and Adapters](https://www.cosmicpython.com/book/chapter_02_repository) —
  the port-and-adapter structure used for `content/`
- [Circuit Breaker pattern, Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)
  — trip-and-fallback semantics
- [Payload live preview docs](https://payloadcms.com/docs/live-preview/overview) — verified via
  context7 against the current release
