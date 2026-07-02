# SEO Improvements Plan — amzal-portfolio

> Status: **READY TO IMPLEMENT.** Gitignored local artifact.
> Grounded in Next.js 16.2 docs (fetched) + current codebase state.

## Context

The site is a data-driven Next.js portfolio. Content lives in `src/data/*.ts` and is
**statically generated** at build time (`generateStaticParams`), so it is already SEO-equivalent
to hardcoded HTML — crawlers see full markup, no client-side fetching. The gaps are **not** about
rendering; they are missing metadata plumbing: no `metadataBase`/canonical, no social-share image,
no `sitemap.xml`/`robots.txt`, no favicon, no structured data. This plan closes those five gaps so
the site is properly indexable and shares cleanly to recruiters on LinkedIn/WhatsApp/X.

## Decisions locked in (from user)

| Topic | Decision |
| --- | --- |
| Canonical base URL | **Single source `profile.siteUrl`.** Ship pointing at the live vercel URL now; flip one line after the custom domain is bought. |
| `siteUrl` value at implementation | **`https://amzal-portfolio.vercel.app`** (no trailing slash). This is the correct canonical *today*. |
| Custom domain (future) | **`amzalfoumi.com`** intended (`.com` for recruiter trust). Not yet purchased — non-blocking. |
| Domain strategy | **Portfolio stays at the ROOT** (`amzalfoumi.com`); any future side projects go on **subdomains** (`blog.`, `demo.`, …), never subpaths. Subdomains are SEO-isolated, so rough side projects won't dilute the portfolio's ranking. |
| OG social image | **Generate in code** via `next/og` `ImageResponse` (on-brand, data-driven). |
| Favicon | **Generate an "AF" monogram** via `ImageResponse`. |
| Scope | All four gaps (metadataBase+canonical, OG images, sitemap+robots, JSON-LD) + bonus favicon. |

**Why vercel.app now, not amzalfoumi.com:** the domain isn't purchased yet. Pointing canonical /
sitemap / OG URLs at a non-resolving host before it's live can confuse crawlers. The vercel URL is
where the site actually lives, so it is the *correct* canonical today. Because everything reads
`profile.siteUrl`, migration later is a **one-line change** + a 301 redirect (Vercel does the 301
automatically when you set the custom domain as primary).

---

## Current state (verified in repo)

- `src/app/layout.tsx:23-33` — has `title` / `description` / `openGraph`; **missing** `metadataBase`,
  `alternates`, `openGraph.images`, `twitter`, `icons`, JSON-LD.
- `src/app/projects/[slug]/page.tsx:24-36` — solid `generateMetadata`; **missing** `alternates.canonical`
  and `openGraph.type: "article"`.
- Routes: `/` and `/projects/[slug]` (5 active projects in `src/data/projects.ts`).
- **No** `src/app/sitemap.ts`, **no** `src/app/robots.ts`.
- `public/` contains only default starter SVGs — **no favicon, no OG image**.
- `src/data/profile.ts` — has `name`, `title`, `portfolioUrl` (`https://amzal-portfolio.vercel.app/`),
  `githubUrl`, `linkedinUrl`, `honors`, `techStacks`, `summary`. **No `siteUrl` yet.**

---

## Gap 1 — metadataBase + canonical URLs + single siteUrl source

**Why:** Without `metadataBase`, relative metadata URLs (OG images) error/resolve wrong. Without
`canonical`, duplicate reachable domains split ranking signals.

**Files:**
1. `src/data/profile.ts` — add `siteUrl: "https://amzal-portfolio.vercel.app"` (no trailing slash;
   keep `portfolioUrl` as-is for display/QR links — it stays the trailing-slash form).
2. `src/app/layout.tsx` — in the `metadata` object add:
   ```ts
   metadataBase: new URL(profile.siteUrl),
   title: { default: `${profile.name} — SWE Undergrad @ SLIIT`, template: "%s — Amzal Foumi" },
   alternates: { canonical: "/" },
   ```
   (Converting `title` to template form so child pages compose as `"<Project> — Amzal Foumi"`.
   Note: `generateMetadata` in the project page already returns a full `"<title> — <name>"` string;
   keep it, or switch it to just `project.title` and let the template add the suffix — decide at impl,
   don't double-suffix.)
3. `src/app/projects/[slug]/page.tsx` — in `generateMetadata` return, add:
   ```ts
   alternates: { canonical: `/projects/${slug}` },
   openGraph: { ...existing, type: "article" },
   ```

**Verify:** `npm run build`; inspect built HTML for `<link rel="canonical">` on `/` and a project page.

---

## Gap 2 — OpenGraph / Twitter images (generated)

**Why:** Empty `openGraph.images` → blank grey card when shared to recruiters on LinkedIn/WhatsApp/X.

**Docs pattern:** `opengraph-image.tsx` route exporting default `ImageResponse` + `alt`/`size`/`contentType`.
Auto-wires `og:image*` meta tags; file-based takes priority over the config object.

**Files:**
1. `src/app/opengraph-image.tsx` — site-wide default card:
   - `export const size = { width: 1200, height: 630 }`, `contentType = "image/png"`,
     `alt = "Amzal Foumi — SWE Undergrad @ SLIIT"`.
   - JSX: dark background, name in large text, title line in accent color. Start with a generic/system
     font to avoid asset handling; upgrade to bundled Syne `.ttf` later if desired.
2. `src/app/projects/[slug]/opengraph-image.tsx` — per-project card stamping `project.title`
   (docs' `params` example).
3. `src/app/layout.tsx` — add `twitter: { card: "summary_large_image", title, description }`.

**Verify:** `npm run build` renders PNGs; check `/opengraph-image` and `/projects/<slug>/opengraph-image`;
validate a deployed URL in the LinkedIn Post Inspector / X Card Validator post-deploy.

---

## Gap 3 — sitemap.ts

**Why:** Helps crawlers index efficiently; self-maintaining given the data-driven `projects` array.

**File:** `src/app/sitemap.ts`
```ts
import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.siteUrl.replace(/\/$/, "");
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
```
Lists **only** portfolio routes — future subdomains get their own sitemaps.

**Verify:** build; open `/sitemap.xml`, confirm homepage + 5 project URLs.

---

## Gap 4 — robots.ts (depends on Gap 3)

**Why:** Explicit allow rule + sitemap pointer for crawlers.

**File:** `src/app/robots.ts`
```ts
import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

export default function robots(): MetadataRoute.Robots {
  const base = profile.siteUrl.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
```

**Verify:** build; open `/robots.txt`, confirm the `Sitemap:` line resolves to `profile.siteUrl`.

---

## Gap 5 — JSON-LD structured data + favicon

**Why:** `Person` schema enables a Google knowledge panel; project schema enriches project result
snippets. Favicon fixes the blank tab/search icon.

**Files:**
1. `src/app/layout.tsx` — inject `<script type="application/ld+json">` (in `<body>`, before children)
   with `Person`, built from `profile`:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Person",
     "name": "Amzal Foumi",
     "url": "<profile.siteUrl>",
     "jobTitle": "Software Engineering Undergraduate",
     "alumniOf": { "@type": "CollegeOrUniversity", "name": "SLIIT" },
     "sameAs": ["<profile.githubUrl>", "<profile.linkedinUrl>"]
   }
   ```
2. (Optional) `src/app/projects/[slug]/page.tsx` — add `CreativeWork` / `SoftwareSourceCode` JSON-LD
   per project using `project.title`, `shortDescription`, `repoUrl`, `year`.
3. **Favicon:** `src/app/icon.tsx` — generate an "AF" monogram via `ImageResponse`
   (`size = { width: 32, height: 32 }`, dark bg + accent letters). Next auto-wires `<link rel="icon">`.

**Verify:** build; test the deployed page in Google Rich Results Test; confirm favicon shows in tab.

---

## Sequencing

Dependency chain: **Gap 1 → Gap 3 → Gap 4** (`siteUrl` feeds sitemap feeds robots). Gaps 2 and 5 are
independent. Implement in one pass, single `npm run build` to validate types + generated images +
static routes.

New/changed files summary:
- edit: `src/data/profile.ts` (+`siteUrl`)
- edit: `src/app/layout.tsx` (metadataBase, canonical, title template, twitter, JSON-LD)
- edit: `src/app/projects/[slug]/page.tsx` (canonical, og:article, optional per-project JSON-LD)
- new: `src/app/opengraph-image.tsx`
- new: `src/app/projects/[slug]/opengraph-image.tsx`
- new: `src/app/sitemap.ts`
- new: `src/app/robots.ts`
- new: `src/app/icon.tsx`

## Post-deploy (user actions, outside code)

- Add the site to **Google Search Console**, verify ownership, submit `sitemap.xml`.
- Validate share cards (LinkedIn Post Inspector, X Card Validator).
- Run **Google Rich Results Test** on a live URL to confirm the Person schema parses.

## Domain migration checklist (when `amzalfoumi.com` is bought — later, non-blocking)

1. Buy `amzalfoumi.com` (`.com` recommended for recruiter trust).
2. In Vercel: add it as a domain to this project and set it **primary** → Vercel auto-301s the
   vercel.app URL to it (preserves shared links + ranking signals).
3. Change **one line**: `profile.siteUrl = "https://amzalfoumi.com"`.
4. Redeploy.
5. Resubmit `sitemap.xml` in Google Search Console; add the new domain as a property.
6. Keep the **portfolio at the root**; put any future side projects on **subdomains**
   (`x.amzalfoumi.com`), each with its own sitemap/robots.
