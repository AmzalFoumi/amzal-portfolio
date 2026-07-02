# SEO Improvements Plan — amzal-portfolio

> Status: **PLAN ONLY — not implemented.** Gitignored local artifact.
> Author: Claude · Grounded in Next.js 16.2 docs (fetched) + current codebase state.

## Decisions locked in (from user)

| Topic | Decision |
| --- | --- |
| Canonical base URL | **Custom domain** — ⚠️ URL NOT YET PROVIDED. Blocks Gaps 1/3/4. See "Required input". |
| OG social image | **Generate in code** via `next/og` `ImageResponse` (on-brand, data-driven). |
| Favicon | **Generate an "AF" monogram** via `ImageResponse`. |
| Scope | All four gaps (metadataBase+canonical, OG images, sitemap+robots, JSON-LD) + bonus favicon. |

## ⚠️ Required input before implementing

The user chose a **custom domain** as the canonical base but has not given the URL.
Everything URL-based (`metadataBase`, `sitemap.ts` loc, `robots.ts` sitemap ref, JSON-LD `url`/`sameAs`)
must use this domain. **Do not fall back to the vercel URL without confirming** — canonical/base
URLs are hard to change once indexed.

- Placeholder used throughout this plan: `https://CUSTOM_DOMAIN` (e.g. `https://amzalfoumi.com`).
- Recommended: store it once as `profile.siteUrl` in `src/data/profile.ts` so all files read a single source.
- Keep `profile.portfolioUrl` (currently `https://amzal-portfolio.vercel.app/`) as-is for display links; add a
  new `siteUrl` field for canonical SEO to avoid conflating "where it's shown" with "canonical identity".

---

## Current state (verified in repo)

- `src/app/layout.tsx:23-33` — has `title` / `description` / `openGraph`; **missing** `metadataBase`,
  `alternates`, `openGraph.images`, `twitter`, `icons`.
- `src/app/projects/[slug]/page.tsx:24-36` — solid `generateMetadata`; **missing** `alternates.canonical`
  and `openGraph.type: "article"`.
- Routes: `/` and `/projects/[slug]` (5 active projects in `src/data/projects.ts`).
- **No** `src/app/sitemap.ts`, **no** `src/app/robots.ts`.
- `public/` contains only default starter SVGs — **no favicon, no OG image**.
- `src/data/profile.ts` — has `name`, `title`, `githubUrl`, `linkedinUrl`, `honors`, `techStacks`, `summary`.

---

## Gap 1 — metadataBase + canonical URLs

**Why:** Without `metadataBase`, relative metadata URLs (OG images) error/resolve wrong. Without
`canonical`, duplicate reachable domains split ranking signals.

**Files:**
1. `src/data/profile.ts` — add `siteUrl: "https://CUSTOM_DOMAIN"`.
2. `src/app/layout.tsx` — in the `metadata` object add:
   ```ts
   metadataBase: new URL(profile.siteUrl),
   title: { default: `${profile.name} — SWE Undergrad @ SLIIT`, template: "%s — Amzal Foumi" },
   alternates: { canonical: "/" },
   ```
   (Converting `title` to template form so child pages compose as `"<Project> — Amzal Foumi"`.)
3. `src/app/projects/[slug]/page.tsx` — in `generateMetadata` return, add:
   ```ts
   alternates: { canonical: `/projects/${slug}` },
   openGraph: { ...existing, type: "article" },
   ```

**Verify:** `npm run build`; inspect built HTML for `<link rel="canonical">` on `/` and a project page.

- **Agent does:** all edits + build.
- **User does:** provide the custom domain URL.

---

## Gap 2 — OpenGraph / Twitter images (generated)

**Why:** Empty `openGraph.images` → blank grey card when shared to recruiters on LinkedIn/WhatsApp/X.

**Docs pattern:** `opengraph-image.tsx` route exporting default `ImageResponse` + `alt`/`size`/`contentType`.
Auto-wires `og:image*` meta tags; file-based takes priority over the config object.

**Files:**
1. `src/app/opengraph-image.tsx` — site-wide default card:
   - `export const size = { width: 1200, height: 630 }`, `contentType = "image/png"`, `alt = "Amzal Foumi — SWE Undergrad @ SLIIT"`.
   - JSX: dark `--bg-base` background, name in Syne-style large text, title line in accent color. Load Syne
     via `readFile` of a bundled `.ttf` (or use a system font fallback to avoid asset management — decide at impl).
2. `src/app/projects/[slug]/opengraph-image.tsx` — per-project card stamping `project.title` (docs' `params` example).
3. `src/app/layout.tsx` — add `twitter: { card: "summary_large_image", title, description }`.

**Verify:** `npm run build` renders PNGs; check `/opengraph-image` and `/projects/<slug>/opengraph-image`;
validate a deployed URL in the LinkedIn Post Inspector / X Card Validator post-deploy.

- **Agent does:** write generators, wire fonts, twitter block, build.
- **User does:** nothing required. (Optional: supply a hand-designed PNG to switch to static-file approach.)

**Open impl decision:** bundle the Syne `.ttf` for pixel-perfect brand font vs. use a generic font to skip
asset handling. Recommend: start with generic/system font, upgrade to Syne if desired.

---

## Gap 3 — sitemap.ts

**Why:** Helps crawlers index efficiently; self-maintaining given the data-driven `projects` array.

**Docs pattern:** default export returning `MetadataRoute.Sitemap`.

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

**Verify:** build; open `/sitemap.xml`, confirm homepage + 5 project URLs.

- **Agent does:** all. **User does:** nothing. (Post-deploy: submit sitemap in Google Search Console.)

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

**Verify:** build; open `/robots.txt`, confirm the `Sitemap:` line resolves to the custom domain.

- **Agent does:** all. **User does:** nothing.

---

## Gap 5 — JSON-LD structured data + favicon

**Why:** `Person` schema enables a Google knowledge panel; project schema enriches project result snippets.
Favicon fixes the blank tab/search icon.

**Files:**
1. `src/app/layout.tsx` — inject `<script type="application/ld+json">` (in `<body>`, before children or in a
   small server component) with `Person`:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Person",
     "name": "Amzal Foumi",
     "url": "https://CUSTOM_DOMAIN",
     "jobTitle": "Software Engineering Undergraduate",
     "alumniOf": { "@type": "CollegeOrUniversity", "name": "SLIIT" },
     "sameAs": ["<githubUrl>", "<linkedinUrl>"]
   }
   ```
   Built from `profile` data — no hardcoding.
2. (Optional) `src/app/projects/[slug]/page.tsx` — add `CreativeWork` / `SoftwareSourceCode` JSON-LD per project
   using `project.title`, `shortDescription`, `repoUrl`, `year`.
3. **Favicon:** `src/app/icon.tsx` — generate an "AF" monogram via `ImageResponse`
   (`size = { width: 32, height: 32 }` or a 180×180 apple-icon variant), dark bg + accent letters.
   Next auto-wires `<link rel="icon">`.

**Verify:** build; test the deployed page in Google Rich Results Test; confirm favicon shows in tab.

- **Agent does:** JSON-LD (data-driven) + monogram icon generator + build.
- **User does:** nothing required. (Optional: replace the generated monogram with a real logo later.)

---

## Sequencing

Dependency chain: **Gap 1 → Gap 3 → Gap 4** (siteUrl feeds sitemap feeds robots). Gaps 2 and 5 independent.
Recommend one pass, all files, single `npm run build` to validate types + generated images + static routes.

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
- Ensure the custom domain is set in Vercel with the vercel.app URL 301-redirecting to it.

## Blocking TODO

- [ ] **Get custom domain URL from user** → replace `https://CUSTOM_DOMAIN` everywhere and set `profile.siteUrl`.
