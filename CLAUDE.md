# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js, http://localhost:3000)
npm run build    # Production build; also validates generateStaticParams / typing
npm run start    # Serve the production build
npm run lint     # ESLint (eslint-config-next: core-web-vitals + typescript)
```

There is no test suite. Verify changes with `npm run build` (catches type + static-generation errors) and by viewing the dev server.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Framer Motion. Deployed on Vercel (`@vercel/analytics` is wired into the root layout).

## Architecture

This is a single-page personal portfolio. The whole site is **data-driven**: content lives in `src/data/*.ts` as typed exports, and components render it. To change what the site says, edit data files — not components.

- **Content layer** (`src/data/`): `profile.ts`, `projects.ts`, `education.ts`, `workExperience.ts`, `voluntary.ts`. All shapes are defined in `src/types/index.ts` (`Project`, `EducationEntry`, `ExperienceGroup` and its `WorkExperienceGroup`/`VoluntaryGroup` aliases). `ExperienceGroup` nests `roles[]` so one organisation can list multiple roles.
- **Home page** (`src/app/page.tsx`): fixed vertical stack of section components (`HeroSection`, `AboutSection`, `ProjectsSection`, `EducationSection`, `ExperienceSection`) from `src/components/sections/`. Reorder/add sections here.
- **Project detail pages** (`src/app/projects/[slug]/page.tsx`): statically generated per project via `generateStaticParams()` over the `projects` array. Slug order in `projects.ts` also drives prev/next navigation. `fullDescription` is split on `\n\n` into paragraphs — author multi-paragraph copy with double newlines.
- **Component tiers** (`src/components/`): `sections/` (page sections) → `shared/` (reusable pieces like `ProjectCard`, `TagBadge`, `SectionHeading`, `CvStyledStatic`) → `ui/` (unmodified shadcn primitives). `layout/` holds `Navbar` and `Footer` (rendered by the root layout, not the page).

## Theming / styling conventions

All design tokens are CSS custom properties in `src/app/globals.css` and are the single source of truth for color, radius, and spacing.

- The site is **dark-theme only** by design (a `@layer base` reset forces it). Tokens live under `:root` as `--bg-*`, `--text-*`, `--accent-*`, `--radius-*`.
- Components style with **inline `style={{ color: "var(--text-primary)" }}`** referencing these variables, rather than Tailwind color classes. Match this pattern when editing components — the existing code leans on `var(--…)` heavily.
- Tailwind v4 is configured in CSS (`@theme inline` in `globals.css`), not a `tailwind.config.js`. Tokens are also forwarded to shadcn-style names (`--color-*`) there.
- The CV modal (`CvStyledStatic`) is an intentional exception: `.cv-root` in `globals.css` overrides the tokens to a **light** theme and adds print styles (`@media print`) for A4 export. `CvAtsDynamic` (`@react-pdf/renderer`) is a separate, parallel implementation of the same CV content for generating a downloadable PDF — keep both in sync when editing CV content. A data-driven styled variant, `CvStyledDynamic`, exists in parallel for future evaluation but is not yet wired into any page.
- Reusable helpers in `globals.css`: `.section` / `.section-container` (layout), `.tag`, `.card-glow` (hover glow), `.dot-grid` (hero background).

## Fonts

Loaded via `next/font/google` in the root layout: **Syne** → `--font-display` (headings, `.font-display`), **DM Mono** → `--font-body` (body/mono, `.font-mono`). The body default is monospace by design.

## Placeholder content

Some content still contains template placeholders (e.g. `[YOUR NAME]` in project-page metadata, `[PLACEHOLDER]` comments in `projects.ts`). When editing, prefer replacing placeholders with real profile data from `src/data/profile.ts` rather than leaving them.

## Conventions

- Path alias `@/*` → `src/*`.
- Icons come from two libraries: `lucide-react` and `@phosphor-icons/react` (import Phosphor server icons from `/dist/ssr`; the package is in `optimizePackageImports`).
- Use `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) to compose class names.
