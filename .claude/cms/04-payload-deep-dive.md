# 04 — Payload deep dive

What adopting Payload actually involves, what it costs, and — since you asked directly — whether it
should live in this app or a separate backend app.

All API details below were verified against current Payload docs (via context7, `/payloadcms/payload`)
rather than recalled.

## Why Payload is the strongest CMS candidate here

Three reasons specific to your situation:

1. **Drafts and versions are built in.** This is the only option that ships your archive
   requirement rather than making you build it.
2. **It's code-first TypeScript.** Collection configs look like your existing
   `src/types/index.ts` interfaces. Payload generates types from the schema, so you keep compile-time
   safety instead of trading it away for a runtime CMS.
3. **It's self-hosted and runs inside Next.js.** No vendor holds your content. Lock-in stays low —
   the data is in a Postgres database you control.

### The versions feature, concretely

```ts
import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  versions: {
    drafts: {
      autosave: true,        // saves while you type
      schedulePublish: true, // publish/unpublish at a future date
    },
    maxPerDoc: 100,          // 0 = unlimited
  },
  access: {
    // Public reads see published documents only — drafts stay private.
    read: ({ req }) => req.user ? true : { _status: { equals: 'published' } },
  },
  fields: [/* ... */],
}
```

Retrieval and restore, via the Local API:

```ts
await payload.findVersions({ collection: 'projects', where: { parent: { equals: id } } })
await payload.restoreVersion({ collection: 'projects', id: versionId })
```

Enabling `drafts` injects a `_status` field. The `access.read` pattern above is what keeps unpublished
edits invisible to the public — worth wiring correctly from day one, since it's the mechanism your
`unlisted`/`private` CV variants would lean on too.

## What the install actually looks like

```bash
npm i payload @payloadcms/next @payloadcms/db-postgres
npm i @payloadcms/storage-vercel-blob   # only if you add media uploads
```

`next.config.ts` must be wrapped:

```ts
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  experimental: { optimizePackageImports: ["@phosphor-icons/react"] }, // existing
}

export default withPayload(nextConfig)
```

`payload.config.ts` at the project root:

```ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } }),
  collections: [Projects, Experience, Education, Certifications, References, CvVariants],
  globals: [Profile],   // singletons — profile is a Global, not a Collection
})
```

Payload scaffolds a route group into your app directory:

```
src/app/
├── (payload)/
│   ├── admin/[[...segments]]/{page.tsx,not-found.tsx}
│   ├── admin/importMap.js
│   ├── api/[...slug]/route.ts
│   ├── custom.css
│   └── layout.tsx
└── (your existing routes, untouched)
```

New environment variables — note this project currently has **zero** `process.env` usage and no
`.env` file at all, so this is a new category of thing to manage:

| Var | Purpose |
|---|---|
| `PAYLOAD_SECRET` | Signing key for auth tokens. Must differ per environment. |
| `DATABASE_URI` | Postgres connection string. |
| `BLOB_READ_WRITE_TOKEN` | Only if using Vercel Blob storage. |

## Mapping your data to collections

The mapping is close to one-to-one with `src/types/index.ts`, which is a good sign:

| Today | Payload |
|---|---|
| `projects: Project[]` | Collection `projects`, versions + drafts |
| `voluntary` / `workExperience` | Collection `experience` with an `array` field for `roles[]`, plus a `kind` select to distinguish them |
| `education`, `certifications`, `references` | Collections |
| `profile` (single object) | **Global** — Payload's singleton type |
| `cvVariants` | Collection `cv-variants` |
| `visibleIn?: Channel[]` | `select` field, `hasMany: true` |
| `showInAtsCv` / `showInStyledCv` | Absorbed into `visibleIn` — do the channel refactor first |

`profile` being a Global is a nice fit, and while you're at it, define the `Profile` interface that
[01-current-state.md](01-current-state.md) flags as missing — do it in Phase 0, before Payload,
so the collection schema has something to mirror.

## Deployment topology — the question you asked

### (a) Embedded in this Next app

Admin at `amzal-portfolio.vercel.app/admin`. One repo, one deploy, one Vercel project.

**For:** Simplest possible setup. RSCs use Payload's **Local API** (`getPayload()`) — direct
function calls into the database with no HTTP hop, no network latency, no CORS, no API tokens. This
is Payload's signature advantage and you only get it when embedded. One env set. One thing to
monitor.

**Against:** Payload's dependency tree and admin bundle land in the same build as your portfolio.
A site that currently has near-zero runtime surface gains a database in the request path, longer
builds, and a much larger `node_modules`. An admin-side bug or a bad migration can break the
public site's deploy. The `/admin` route is a login page on your personal domain.

### (b) Separate backend app, own Vercel project, shared DB

Portfolio stays lean and mostly static. Payload lives at `cms.yourdomain.com` as its own Next app.

**For:** Clean separation — the public site can't be broken by admin changes. The portfolio's build
stays fast and its bundle stays small. This is the architecture a real team would use, and it
demonstrates service boundaries, which is worth something for driver #4.

**Against:** You lose the Local API. Content now arrives over REST/GraphQL, which means network
latency in your build, CORS configuration, API tokens to manage, and a second set of environment
variables. Cache invalidation must cross a service boundary via webhook rather than a simple
in-process hook. Two deploys to keep in sync. **For a single-author portfolio this is real ops
overhead bought with little practical return.**

### (c) Turborepo monorepo — `apps/web` + `apps/cms` + `packages/content`

Independent deploys, but shared TypeScript types in a workspace package so the content contract is
enforced at compile time across both apps.

**For:** The best of both — separation plus type safety. `packages/content` is the natural home for
the `Channel` / `CvVariant` types and the accessor interface.

**Against:** Highest setup cost by a distance. Turborepo, workspace config, build pipeline, and a
restructure of a repo that currently works fine. Solving a problem you do not yet have.

### Recommendation: start embedded (a), preserve the option to split

Do **not** split up front. Start with (a), and make the split cheap by routing every content read
through a single accessor module (`src/lib/content.ts`, see [05-rollout.md](05-rollout.md)). If
"where content lives" is one module's implementation detail, moving from (a) to (b) or (c) later is
a contained change rather than a rewrite.

**The one condition that flips this:** if you ever need the portfolio to remain a fully static
export with no server runtime, a separate backend stops being optional — you cannot host an admin
panel and a database inside a static export. Decide that before you start, not after.

## The cost nobody mentions: you stop being fully static

This is the most significant consequence and deserves to be stated plainly.

Today every page is prerendered at build time and served from the CDN with no compute. Introducing a
database means pages either hit Postgres at request time or are cached and revalidated. Neither is
bad, but both are strictly more complex than what you have.

The Next 16 approach, using Cache Components:

```ts
// src/lib/content.ts
import { cacheTag, cacheLife } from 'next/cache'

export async function getProjects() {
  'use cache'
  cacheTag('projects')
  cacheLife('max')
  const payload = await getPayload({ config })
  return payload.find({ collection: 'projects', limit: 100 })
}
```

Paired with a Payload `afterChange` hook calling `updateTag('projects')`, so publishing in the admin
invalidates exactly the affected cache entries. Get this right and the site stays CDN-fast; get it
wrong and you have either stale content or a database hit on every page view.

The `vercel:next-cache-components` skill covers this specific work.

## Honest costs

| | Detail |
|---|---|
| **Money** | Neon Postgres free tier is comfortable for this. Vercel Blob free tier likewise. Realistically £0 — but a bill now exists in principle where none did before. |
| **Build time** | Payload's admin bundle meaningfully lengthens builds. Expect minutes where you currently have well under one. |
| **Cold starts** | Serverless + Postgres connections. Fluid Compute mitigates this well, but it's non-zero where today it's exactly zero. |
| **Maintenance** | Dependency updates, breaking changes across Payload majors, and **database migrations** — a genuinely new class of work for this repo. |
| **Backups** | Content moves from git (backed up implicitly, forever, by every clone) into a database that you must now deliberately back up. See the export strategy in [05-rollout.md](05-rollout.md). |
| **Risk** | The site currently cannot break at runtime. After this, it can. |

None of these are reasons not to do it. They are reasons to do it *after* Phase 1 has already
delivered the tailored-CV functionality, so the CMS is a deliberate upgrade rather than a
prerequisite.

## Tooling note

Payload ships its own Claude skill at `tools/claude-plugin/skills/payload/` in its repo, with
reference docs for collections, fields, access control and hooks. Worth installing before starting
implementation. Live docs are also available here through the context7 MCP server
(`/payloadcms/payload`).
