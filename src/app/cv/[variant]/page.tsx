import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CvStyledDynamic } from "@/components/shared/CvStyledDynamic";
import { CvAtsPreview } from "@/components/shared/CvAtsPreview";
import { getCvForRoute } from "@/lib/content";
import { canServeVariant } from "@/lib/auth";

/**
 * Shareable CV page.
 *
 * `force-dynamic` and the deliberate absence of `generateStaticParams` are
 * security-relevant, not performance choices: prerendering this route would bake
 * every unpublished variant slug into the build manifest and ship private CVs to
 * the CDN as static HTML. Do not add either without re-reading the leak-vector
 * notes in the plan.
 *
 * There is also intentionally **no** `opengraph-image.tsx` in this directory. It
 * would be an independently routable segment that does not inherit the gating
 * below, so it would render an unpublished CV's name and headline into a
 * publicly fetchable PNG.
 */
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ variant: string }> };

async function load(slug: string) {
  const cv = await getCvForRoute(slug);
  if (!cv) return null;
  return (await canServeVariant(cv.published)) ? cv : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { variant } = await params;
  const cv = await load(variant);

  // Generic metadata for anything we cannot confirm is publicly viewable —
  // this runs before the body's notFound() and must not leak either.
  if (!cv) return { title: "Not found", robots: { index: false, follow: false } };

  return {
    title: `${cv.profile.name} - CV`,
    description: cv.profile.summary[0],
    // Only the published variant is indexable. Everything else is reachable
    // solely by someone holding the exact URL.
    robots: cv.published ? undefined : { index: false, follow: false },
  };
}

export default async function CvVariantPage({ params }: Params) {
  const { variant } = await params;
  const cv = await load(variant);

  // 404, never 403 — a 403 confirms the slug exists.
  if (!cv) notFound();

  if (cv.format === "ats") return <CvAtsPreview cv={cv} />;

  // `cv-print-scope` is what makes Ctrl+P on this page produce the CV rather
  // than a blank sheet — the print rules in globals.css hide everything outside
  // it. See the comment there.
  return (
    <div className="cv-print-scope">
      <CvStyledDynamic cv={cv} />
    </div>
  );
}
