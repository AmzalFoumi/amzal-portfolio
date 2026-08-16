import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { CvAtsDynamic } from "@/components/shared/CvAtsDynamic";
import { getCvForRoute } from "@/lib/content";
import { canServeVariant } from "@/lib/auth";

/** renderToBuffer is Node-only. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Server-rendered PDF download.
 *
 * The gating below is deliberately duplicated from `page.tsx` rather than shared
 * with it by assumption: route handlers inherit nothing from the page in the same
 * segment, so an unguarded handler would happily serve a private CV that the page
 * 404s. Any new route under `cv/[variant]` needs this check too.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ variant: string }> },
) {
  const { variant } = await params;
  const cv = await getCvForRoute(variant);

  // 404, never 403 — see the note in page.tsx.
  if (!cv || !(await canServeVariant(cv.published))) {
    return new Response("Not found", { status: 404 });
  }

  if (cv.format !== "ats") {
    // Styled CVs are a print-CSS layout, not a @react-pdf document — there is no
    // server-side renderer for them. Print the page instead. Safe to answer
    // honestly here: we already know the caller may see this variant.
    return new Response(
      "This CV is the styled format — open the page and print it to PDF.",
      { status: 415, headers: { "Content-Type": "text/plain" } },
    );
  }

  // renderToBuffer is typed to take an element whose *own* props are DocumentProps,
  // so it rejects any wrapper component even though CvAtsDynamic returns a
  // <Document>. Correct at runtime; the cast is the standard workaround.
  const element = createElement(CvAtsDynamic, { cv }) as unknown as Parameters<
    typeof renderToBuffer
  >[0];
  const buffer = await renderToBuffer(element);
  const name = cv.profile.name.replace(/\s+/g, "-");

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${name}-CV.pdf"`,
      // Never let a shared cache hold an author-only CV.
      "Cache-Control": cv.published
        ? "public, max-age=0, must-revalidate"
        : "private, no-store",
    },
  });
}
