import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { profile } = await getSiteContent();
  const base = profile.siteUrl.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/cv/styled", "/cv/ats"],
      // Belt-and-braces only: crawlers that respect robots.txt won't wander into
      // variant slugs. The actual guarantee is the 404 in cv/[variant]/page.tsx
      // plus noindex metadata — robots.txt is a request, not a control, and
      // listing a path here does not hide it.
      disallow: "/cv/",
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
