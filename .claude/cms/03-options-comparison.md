# 03 — Options other than Payload

Payload gets its own doc ([04-payload-deep-dive.md](04-payload-deep-dive.md)). This one covers
everything else, so the comparison is honest rather than a foregone conclusion.

Assume throughout that the [variant model](02-variant-model.md) has been implemented — it is
storage-agnostic, so it is a constant across all options, not a differentiator.

## Option A — Git as the CMS (status quo, improved)

Keep `src/data/*.ts`. Add the channel matrix and `CvVariant`. Nothing else changes.

**For:** Zero cost, zero infrastructure, zero new failure modes. Full type safety — a typo in a
field name fails `npm run build` rather than rendering blank. Git already gives you history,
diffs, blame, branches and PR review of content. The site stays fully static, so it is fast and
free forever. Content is portable plain text you own outright.

**Against:** Editing requires a laptop, a working checkout, and a deploy cycle (~1–2 min on Vercel).
No mobile editing. No non-technical editing — irrelevant here, since you are the only author. No
media library; images stay as `public/` paths.

**Honest assessment:** For 6 projects, 2 education entries and 2 certifications, this is
proportionate. The entire content layer is 456 lines. The "editing friction" is real but small —
be sure it is genuinely bothering you and not just theoretically annoying before adding a database
to solve it.

## Option B — Hosted headless CMS (Sanity, Contentful, Hygraph, Prismic)

Content lives in a vendor's cloud; you query it over the network at build or request time.

**Sanity** is the strongest of these for this use case: generous free tier, an excellent authoring
UI (Sanity Studio, which you can embed at `/studio` in this same Next app), real-time collaboration,
GROQ for querying, and built-in document history on paid plans.

**For:** No database to run, patch or back up. Best-in-class editing UX including mobile. Fast to
stand up — a day, not a week. Free tier realistically covers a personal portfolio forever.

**Against:** Your content lives on someone else's platform, subject to their pricing changes and
schema conventions. Vendor lock-in is real — migrating out means writing an exporter. Less learning
value than running your own backend, because the interesting part (schema, auth, storage, API) is
the vendor's problem. Content history on Sanity's free tier is limited, which weakens the archive
story.

**Honest assessment:** If the *only* goal were "edit without deploying", this is the correct answer
and Payload would be over-engineering. It loses specifically on your stated learning goal.

## Option C — Supabase + a thin custom admin

Postgres + auth + storage as a managed service, with your own minimal editing UI (or just the
Supabase table editor, which is serviceable for a single author).

**For:** You already have the Supabase skill and MCP server configured in this environment. Real
Postgres, real SQL, real row-level security — strong, transferable learning. Generous free tier.
Auth and file storage included, so the archive in Phase 3 has a natural home. You control the
schema completely.

**Against:** No admin UI comes for free. Either you use the raw table editor (fine for you, ugly)
or you build one (real work, and building a CRUD admin is not especially interesting work). No
built-in drafts, versions or publish workflow — you'd implement them yourself. Free tier projects
pause after a period of inactivity, which is a genuine annoyance for a low-traffic portfolio.

**Honest assessment:** Best cost-to-learning ratio of any option, *if* you're willing to live
without a polished admin. Weaker than Payload on exactly the feature that serves your archive
requirement.

## Option D — Notion or Google Sheets as a CMS

Fetch content from the Notion API or a published Sheet at build time.

**For:** Genuinely excellent mobile editing — this is the only option where you can meaningfully
update your CV from your phone on a bus. Free. Zero schema work.

**Against:** No type safety whatsoever; everything arrives as loosely-typed blobs and you validate
at the boundary or suffer. Notion's API is rate-limited and not fast. Your nested shapes
(`ExperienceGroup.roles[]`, `techStacks` groups, `Channel[]` arrays) map awkwardly onto rows and
Notion blocks. Effectively no learning value for a software engineering CV. An outage or a schema
change on their side breaks your build.

**Honest assessment:** A pragmatic hack, not an architecture. Would undersell you if a recruiter
looked at the repo, which cuts directly against driver #4.

## Option E — MDX / content collections in-repo

Move prose into MDX files with frontmatter, validated by a build step (Velite, or plain Zod).

**For:** Better authoring ergonomics than TypeScript literals for long prose — `fullDescription`
fields are the obvious candidate, since one is ~1,700 characters currently living inside a
`\n\n`-delimited string literal. Keeps everything in git with full type validation. Rich text
becomes pleasant to write.

**Against:** Solves prose authoring only; it does nothing for the deploy cycle, which is your actual
friction. Adds a build dependency. Structured data (dates, tags, channel arrays) is still better as
TypeScript than as frontmatter.

**Honest assessment:** A worthwhile ergonomic improvement to Option A, not a competitor to a CMS.
Consider it for `fullDescription` specifically if writing project write-ups feels cramped.

## Comparison matrix

| | A: Git | B: Sanity | C: Supabase | D: Notion | E: MDX | Payload |
|---|---|---|---|---|---|---|
| Monthly cost | £0 | £0 (free tier) | £0 (free tier) | £0 | £0 | £0–low (DB) |
| Infra to run | None | None | Managed | None | None | DB + admin |
| Edit without deploy | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ |
| Mobile editing | ✗ | ✓ | Partial | ✓✓ | ✗ | ✓ |
| Type safety | ✓✓ | ✓ (codegen) | ✓ (codegen) | ✗ | ✓ | ✓✓ (generated) |
| Built-in drafts/versions | git only | Paid tiers | Build it | ✗ | git only | **✓✓ built in** |
| Site stays fully static | ✓✓ | ✓ (ISR) | ✓ (ISR) | ✓ | ✓✓ | ✓ (ISR) |
| Learning / CV value | Low | Medium | **High** | None | Low | **High** |
| Lock-in risk | None | High | Low | Medium | None | Low (self-hosted) |
| Setup effort | Hours | ~1 day | ~2 days | Hours | Hours | ~3–5 days |
| Ongoing maintenance | None | None | Low | None | None | **Real** (deps, migrations, DB) |

## Where this lands

- **If you want minimum cost and complexity:** Option A. Genuinely defensible at this content size.
- **If "edit without deploying" is the whole point:** Option B (Sanity). Fastest path, least
  maintenance, and honestly the right engineering answer in isolation.
- **If learning is weighted heavily and you want a real backend:** Payload or Supabase.
- **Payload's specific edge over all of these:** built-in drafts, versions, `restoreVersion()` and
  scheduled publishing — the only option that ships your archive requirement out of the box, plus
  it's self-hosted so lock-in stays low. That's the case to examine in
  [04-payload-deep-dive.md](04-payload-deep-dive.md).

Whichever is chosen, it sits behind the same accessor module described in
[05-rollout.md](05-rollout.md), so the decision is reversible.
