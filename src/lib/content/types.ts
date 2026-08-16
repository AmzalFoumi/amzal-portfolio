import type { ExperienceGroup } from "@/types";
import type { CvFormat, CvVariant, SiteContent } from "@/types/cv";

/**
 * The port. Every adapter satisfies this, and every component reads through it —
 * nothing outside `src/lib/content/` may import `src/data/*` or a CMS client.
 *
 * All methods are async even where an adapter is synchronous today. Retrofitting
 * async through a component tree later is exactly the churn this port exists to
 * prevent.
 */
export interface ContentSource {
  /** Canonical content, with experience already flattened. */
  getSiteContent(): Promise<SiteContent>;

  /**
   * Experience in its grouped, authored shape — one organisation, many roles.
   * The site renders this; CVs use the flattened `SiteContent.experience`.
   * Same underlying source, two views.
   */
  getExperienceGroups(): Promise<ExperienceGroup[]>;

  getCvVariants(): Promise<CvVariant[]>;
  getCvVariant(slug: string): Promise<CvVariant | null>;

  /**
   * The one variant of this format that is publicly viewable, or null if none
   * is published. Where several are marked published, the most recently updated
   * wins so production degrades rather than throwing.
   */
  getPublishedVariant(format: CvFormat): Promise<CvVariant | null>;
}

/** Which adapter backs the port. See `CONTENT_SOURCE` in the resilience design. */
export type ContentSourceName = "files" | "snapshot" | "payload";

/**
 * Pick the published variant deterministically when the data is inconsistent.
 * Shared by every adapter so they cannot disagree about it.
 */
export function pickPublished(
  variants: CvVariant[],
  format: CvFormat,
): CvVariant | null {
  const candidates = variants.filter(
    (v) => v.format === format && v.published,
  );
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[content] ${candidates.length} published "${format}" variants (${candidates
        .map((v) => v.slug)
        .join(", ")}) — exactly one is expected. Using the most recent.`,
    );
  }
  return [...candidates].sort((a, b) =>
    (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""),
  )[0];
}
