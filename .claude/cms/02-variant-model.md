# 02 — The variant model

**This is the core design.** It is deliberately storage-agnostic: everything here works with the
current TypeScript data files, and works unchanged if a CMS is adopted later. That is the point.

## The problem being solved

You want one content pool and many outputs: a generalist styled CV, a generalist ATS CV, a
cloud-engineer CV, a full-stack CV, a CV for a specific application — plus the live site itself.
Each output should show a different subset of your projects, roles and skills, with different
emphasis.

Today you have two booleans (`showInAtsCv`, `showInStyledCv`) and no concept of the site as a
target. The generalisation is small and mechanical.

## Channels: a strict superset of what you have

The live site becomes just another channel alongside each CV variant. Per-item control goes from
**2 fixed axes to N**.

```ts
// src/types/index.ts

/** Every surface a piece of content can appear on. */
export type Channel =
  | "site"           // the public portfolio
  | "cv-styled"      // the public generalist styled CV
  | "cv-ats"         // the public generalist ATS CV
  | `cv:${string}`;  // any tailored variant, e.g. "cv:cloud-engineer"

/** Mixed into Project, ExperienceRole, Certification, EducationEntry. */
export interface ChannelScoped {
  /** Omit to mean "visible on every channel". */
  visibleIn?: Channel[];
  /** Omit to mean "never hidden". Applied after visibleIn. */
  hiddenIn?: Channel[];
}
```

### Nothing you can do today is lost

The migration is mechanical, and the new model is strictly more expressive:

| Today | Becomes |
|---|---|
| _(no flags)_ | omit `visibleIn` → visible everywhere. **Most entries need no change at all.** |
| `showInAtsCv: false` | `hiddenIn: ["cv-ats"]` |
| `showInStyledCv: false` | `hiddenIn: ["cv-styled"]` |
| both `false` | `hiddenIn: ["cv-ats", "cv-styled"]` |
| _(impossible)_ | `visibleIn: ["site", "cv:cloud-engineer"]` — on the site and one tailored CV only |
| _(impossible)_ | `hiddenIn: ["site"]` — in CVs but not public on the portfolio |

Keeping `visibleIn` optional is what makes this cheap: the 4 AIESEC roles currently flagged
`showInAtsCv: false` get one line changed each, and everything else is untouched.

Resolution is one shared helper, so filtering logic never gets duplicated across CV components
again:

```ts
// src/lib/channels.ts
export function isVisibleOn<T extends ChannelScoped>(item: T, channel: Channel): boolean {
  if (item.hiddenIn?.includes(channel)) return false;
  return item.visibleIn ? item.visibleIn.includes(channel) : true;
}

export const forChannel = <T extends ChannelScoped>(items: T[], channel: Channel) =>
  items.filter((i) => isVisibleOn(i, channel));
```

### Generalising the URL preference too

`Project` currently has `atsCvUrlPreference` and `styledCvUrlPreference` — the same
two-channels-hardcoded problem. Same fix:

```ts
urlPreference?: Partial<Record<Channel, "live" | "repo" | "none">> & {
  default?: "live" | "repo" | "none";
};
```

## The `CvVariant` record

A variant is *not* a copy of your CV. It is a small recipe describing how to project the one
content pool onto one output.

```ts
// src/types/index.ts
export type VariantVisibility = "public" | "unlisted" | "private";
export type CvFormat = "styled" | "ats";

export interface CvVariant {
  /** URL segment. For unlisted variants, make this unguessable. */
  slug: string;
  /** Author-facing name, e.g. "Cloud / DevOps roles". */
  label: string;
  format: CvFormat;
  visibility: VariantVisibility;

  /** The channel key items are filtered against. Derived: `cv:${slug}`. */
  channel: Channel;

  /** Override profile.summary for this audience. Falls back to the default. */
  summary?: string[];
  /** Override the headline under the name. */
  headline?: string;

  /** Section order + which sections appear at all. */
  sections?: SectionKey[];
  /** Tags to surface first in tag lists — the cheapest form of tailoring. */
  emphasisTags?: string[];
  /** Cap output length per section, so a tailored CV stays one page. */
  limits?: Partial<Record<SectionKey, number>>;

  /** Free-text note to self. Never rendered. */
  notes?: string;
}

export type SectionKey =
  | "summary" | "experience" | "projects" | "education"
  | "skills" | "certifications" | "leadership" | "references";
```

Lives in `src/data/cvVariants.ts` alongside the other data files. A first cut:

```ts
export const cvVariants: CvVariant[] = [
  { slug: "styled",  label: "General (styled)", format: "styled", visibility: "public",
    channel: "cv-styled" },
  { slug: "ats",     label: "General (ATS)",    format: "ats",    visibility: "public",
    channel: "cv-ats" },
  { slug: "cloud-engineer", label: "Cloud / DevOps", format: "ats", visibility: "unlisted",
    channel: "cv:cloud-engineer",
    headline: "Cloud & Platform Engineering Intern",
    emphasisTags: ["AWS", "Docker", "Kubernetes", "Terraform"],
    limits: { projects: 3 } },
];
```

Note the two public variants map to the existing `cv-styled` / `cv-ats` channels rather than
`cv:styled` — so **the migration table above stays valid and today's flags keep working.**

## Serving variants

### Routes to add

```
src/app/cv/[variant]/page.tsx        Styled HTML CV — this is the shareable link
src/app/cv/[variant]/pdf/route.ts    Route handler streaming a real PDF
```

The PDF route is what makes a link genuinely useful — a recruiter gets a file, not a web page they
have to print:

```ts
// src/app/cv/[variant]/pdf/route.ts
import { renderToStream } from "@react-pdf/renderer";

export const runtime = "nodejs"; // renderToStream is Node-only

export async function GET(_: Request, { params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;              // Next 16 async params
  const cv = getVariant(variant);
  if (!cv || !canServe(cv)) return new Response("Not found", { status: 404 });

  const stream = await renderToStream(<CvAtsDynamic variant={cv} />);
  return new Response(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Amzal-Foumi-${cv.slug}.pdf"`,
    },
  });
}
```

This runs comfortably on Vercel's default Node runtime (Fluid Compute); `@react-pdf/renderer` is
well within the 5 GB package limit and a CV renders in well under the 300s timeout.

### What stays as-is

The existing `HeroSection` modal and its two client-side download buttons keep working. They just
render the **public** variants. No regression for existing visitors.

## The public/private guarantee

You asked whether non-displayed variants are ever visible to the public. They are not, provided
three tiers are implemented and the leak vectors below are closed.

| Tier | Linked from site | In `sitemap.ts` | Indexable | Reachable by |
|---|---|---|---|---|
| `public` | Yes — `HeroSection` | Yes | Yes | anyone |
| `unlisted` | **No** | **No** | **No** (`robots: { index: false }`) | only someone given the exact URL |
| `private` | No | No | No | you only — token or auth gated |

Exactly **one** `styled` and **one** `ats` variant should be `public`. Everything else defaults to
`unlisted`. The site never renders a list of variants, so there is no "browse my CVs" surface
unless one is deliberately built — and it shouldn't be.

For `unlisted`, make the slug unguessable (`cloud-engineer-7f3a91`) rather than relying on
obscurity of the path alone. For `private`, gate on a signed token query param or a session — do
not rely on the slug.

### Leak vectors to close explicitly

These are the ways "unlisted" quietly becomes "public". All three are live risks in this codebase:

1. **`generateStaticParams` leaking slugs.** If `/cv/[variant]` prerenders every variant, non-public
   slugs land in the build manifest and are discoverable by anyone reading the client bundle.
   Either return **public variants only** from `generateStaticParams` and let the rest render
   on-demand, or drop static generation for this route entirely.
2. **`sitemap.ts`.** It currently maps `projects` unconditionally
   ([sitemap.ts:10](../../src/app/sitemap.ts#L10)). Any variant loop added here must filter to
   `visibility === "public"`.
3. **OG image routes.** `projects/[slug]/opengraph-image.tsx` already demonstrates that these are
   independently routable build targets with their own `generateStaticParams`. If a
   `cv/[variant]/opengraph-image.tsx` is added, it needs the same filter — otherwise the image
   endpoint confirms a variant exists even when the page 404s.

Also set `export const metadata = { robots: { index: false, follow: false } }` (or the dynamic
equivalent) on non-public variant pages, and return a genuine `404` — not a `403` — for private
ones, so their existence isn't confirmed.

## Why this is worth doing even if you never adopt a CMS

- It delivers **every user-visible thing you asked for**: tailored CVs, shareable links, downloads,
  and one public generalist CV of each format.
- It costs **nothing** — no database, no service, no monthly bill, no new failure mode.
- It kills the `CvStyledStatic` duplication permanently, because a variant is a recipe rather than
  a copy. There is no second place for content to drift to.
- It is the thing that makes a CMS cheap later. Once components read content through channels and
  variants rather than importing data files directly, swapping the source is a one-module change.
  See [05-rollout.md](05-rollout.md).
