import type { MetadataRoute } from "next";
import { getPublishedVariant, getSiteContent } from "@/lib/content";

/**
 * Only the two stable CV aliases are listed, and only when something is actually
 * published behind them.
 *
 * Never map over `getCvVariants()` here — that would publish every unpublished
 * variant slug to search engines and to anyone who reads sitemap.xml, which is
 * exactly the leak the alias indirection exists to prevent.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ profile, projects }, styled, ats] = await Promise.all([
    getSiteContent(),
    getPublishedVariant("styled"),
    getPublishedVariant("ats"),
  ]);

  const base = profile.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const cvAliases = [
    styled ? "styled" : null,
    ats ? "ats" : null,
  ].filter((alias): alias is string => alias !== null);

  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...cvAliases.map((alias) => ({
      url: `${base}/cv/${alias}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
