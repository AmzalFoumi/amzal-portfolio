# 01 — Current state

Where the codebase actually is today, and the one problem that blocks everything else.

## Architecture in one paragraph

A single-page Next.js 16 portfolio, fully statically generated, deployed on Vercel. Content lives
as typed TypeScript exports in `src/data/`; components import them directly. There is **no backend
of any kind**: no `src/app/api/`, no `route.ts`, no `"use server"`, no database, no ORM, no auth,
no middleware, and **zero `process.env` usage anywhere in `src/`**. The only runtime work is
build-time OG image generation via `next/og` and client-side PDF generation in the browser.

That is a genuinely good position to be in. It costs nothing to run, cannot break at 3am, and has
no cold starts. Any change proposed here should be weighed against losing that.

## The data layer

All under [src/data/](../../src/data/) — ~456 lines total across 7 files.

| File | Lines | Export | Entries |
|---|---|---|---|
| [projects.ts](../../src/data/projects.ts) | 239 | `projects: Project[]` | 6 active (+6 commented templates) |
| [voluntary.ts](../../src/data/voluntary.ts) | 81 | `voluntary: VoluntaryGroup[]` | 2 orgs / 6 roles |
| [profile.ts](../../src/data/profile.ts) | 58 | `profile` — **untyped object literal** | 1 |
| [education.ts](../../src/data/education.ts) | 35 | `education: EducationEntry[]` | 2 |
| [certifications.ts](../../src/data/certifications.ts) | 22 | `certifications: Certification[]` | 2 |
| [references.ts](../../src/data/references.ts) | 16 | `references: Reference[]` | 2 |
| [workExperience.ts](../../src/data/workExperience.ts) | 6 | `workExperience: WorkExperienceGroup[]` | **0 — empty scaffold** |

Shapes are defined in [src/types/index.ts](../../src/types/index.ts) (93 lines): `ProjectLink`,
`Project`, `EducationEntry`, `ExperienceRole`, `ExperienceGroup` (+ `VoluntaryGroup` /
`WorkExperienceGroup` aliases), `Reference`, `Certification`.

**Gap:** there is no `Profile` interface. `profile.ts` is a bare object literal, so `techStacks`,
`summary`, `honors` and `siteUrl` are structurally inferred only — no contract, no compile-time
protection when a CV component reaches into them.

### The existing visibility mechanism

This is the seed of the whole design. Three types already carry paired booleans:

```ts
// on Project, ExperienceRole, and Certification:
showInAtsCv?: boolean;    // Set false to hide from the generated ATS PDF
showInStyledCv?: boolean; // Set false to hide from the styled CV
```

Plus `Project` carries per-channel URL preferences:

```ts
atsCvUrlPreference?: "live" | "repo" | "none";
styledCvUrlPreference?: "live" | "repo" | "none";
```

The instinct is right — content is one pool, presentation is per-channel. The limitation is that
it's hardcoded to exactly two channels, both booleans, with no notion of the live site as a channel
and no way to add a third target without editing the type and every consumer.
[02-variant-model.md](02-variant-model.md) generalises this.

## The three CV implementations

| File | Lines | Data-driven? | Wired up? |
|---|---|---|---|
| [CvAtsDynamic.tsx](../../src/components/shared/CvAtsDynamic.tsx) | 280 | **100%** — imports all 6 data modules, honours `showInAtsCv` and `atsCvUrlPreference` | Yes (dynamic import) |
| [CvStyledStatic.tsx](../../src/components/shared/CvStyledStatic.tsx) | 383 | **~0%** — no data imports at all | **Yes — this is what the site renders** |
| [CvStyledDynamic.tsx](../../src/components/shared/CvStyledDynamic.tsx) | 361 | ~95% — imports all 6 modules, filters on `showInStyledCv` | **No — dead code** |

The single call site is [HeroSection.tsx](../../src/components/sections/HeroSection.tsx) (397 lines,
`"use client"`):

- `CvStyledStatic` is statically imported; `CvAtsDynamic` and `@react-pdf/renderer` are dynamically
  imported to keep them out of the initial bundle. That's a good call and should be preserved.
- Modal toggles `cvView: "styled" | "ats"`.
- **Download ATS** → `pdf(<CvAtsDynamic />).toBlob()` client-side → `Amzal-Foumi-CV.pdf`.
- **Download Styled** → renders a hidden `.cv-print-root` and calls `window.print()`, styled by
  `@media print` rules under `.cv-root` in [globals.css](../../src/app/globals.css).

There is **no `/cv` route**, no server-side PDF generation, and no way to link anyone to a CV.

## The drift catalogue

This is the blocker. Every item below exists **only** inside `CvStyledStatic.tsx` and disagrees
with the data layer:

| What | In `CvStyledStatic.tsx` | In `src/data/` |
|---|---|---|
| Headline | "Software Engineering Intern Candidate" | `profile.title` — entirely different string |
| Summary | Bespoke 5-line paragraph | `profile.summary[0]` — different text |
| Location | "Dehiwala, Sri Lanka" | `profile.location` = "Colombo, Western Province, Sri Lanka" |
| AIESEC role dates | "Feb 2025 – Jan 2026" | `voluntary.ts` says "Mar 2025 – Feb 2026" |
| Role bullets | Mentions a Supabase/Recharts finance dashboard | Not present in the data at all |
| Projects | Distributed Health, Itinerary.ai, KidsFeed — hand-rewritten descriptions | **Aesth-ai is `featured: true` and missing entirely** |
| Graduation | "Oct 2023 – Dec 2027" | `education.ts` says Nov 2027 |
| Achievements | "Top 1% Merit Scholarship" | Not in `education.ts` |
| Skills | 16 hand-grouped tags (adds GitOps, ArgoCD, MVC; drops the AI/ML group) | `profile.techStacks` — 5 groups, 21 items |
| Leadership | "Best Performing iGT IR & M Leader", Legacy 2025 | Exists in **no data file**; `profile.honors` words it differently |
| References | Absent | Present in both other CV implementations |
| Credential URLs | Each AWS URL literal appears **4×** (href + QR `src`, twice) | `certifications.ts` |

Roughly 250 of 383 lines are duplicated content, and most duplicates have already drifted.

**Consequence:** every `showInStyledCv` flag in the data files is currently **inert**. The doc
comments in `projects.ts`, `voluntary.ts`, `types/index.ts` and `CLAUDE.md` already say so.

**Important caveat for whoever does Phase 0:** swapping `CvStyledStatic` → `CvStyledDynamic` is
mechanically a one-line import change in `HeroSection`, but it **will visibly change the CV**,
because the two sources disagree. The real work is deciding, item by item, which version is
correct and reconciling the data files to match. Budget for that, not for the import swap.

One genuine gap: `CvStyledDynamic` still hardcodes its "Leadership & Comm." narrative section
because no data model exists for it. Phase 0 should add one.

## Routes and rendering

```
src/app/layout.tsx                          88   fonts, Navbar/Footer, Vercel Analytics, Person JSON-LD
src/app/page.tsx                            17   Hero → About → Projects → Education → Experience
src/app/projects/[slug]/page.tsx           275   generateStaticParams over `projects`
src/app/projects/[slug]/opengraph-image.tsx  78   has its OWN generateStaticParams
src/app/sitemap.ts                          17   base URL + one entry per project
src/app/robots.ts / icon.tsx / opengraph-image.tsx
```

Two details that matter later:

1. `sitemap.ts` maps over `projects` unconditionally. When CV variants arrive, this file **must
   filter on visibility** or unlisted variants leak into search engines.
2. `projects/[slug]/opengraph-image.tsx` duplicates `generateStaticParams` because each file
   convention route is an independent build target. **Any `/cv/[variant]` OG route will have the
   same property** — it is independently routable and must apply the same visibility filter.

## Dependencies

`next@16.2.4`, `react@19.2.4`, `@react-pdf/renderer@^4.5.1`, `framer-motion`, `radix-ui`,
`lucide-react`, `@phosphor-icons/react`, `@vercel/analytics`, Tailwind v4.

Scripts: `dev`, `build`, `start`, `lint`. **No test suite** — verification is `npm run build` plus
visual inspection, which is worth remembering when planning a migration that changes rendered
output.

`next.config.ts` sets only `experimental.optimizePackageImports`. No `images.remotePatterns`, and
`next/image` is never imported — cert logos and CV QR codes are raw `<img>`. The QR codes hit
`api.qrserver.com` at render time, which is a live third-party dependency inside your CV.
