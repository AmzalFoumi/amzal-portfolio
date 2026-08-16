import type { ExperienceGroup } from "@/types";
import type { CvVariant, SiteContent } from "@/types/cv";
import type { ContentSourceName } from "./types";

/**
 * The on-disk fallback content, written by `scripts/generate-snapshot.mts` on
 * every build and committed to the repo.
 *
 * It exists because `src/data/*.ts` stops being a truthful fallback the moment
 * content moves into the CMS — a fallback that silently serves months-old data
 * is worse than an error. This file is regenerated from whatever the live source
 * is, so it is at most one deploy old.
 */
export interface ContentSnapshot {
  /** ISO timestamp. Surfaced in logs when the fallback is serving. */
  generatedAt: string;
  /** Which adapter produced it. */
  source: ContentSourceName;
  siteContent: SiteContent;
  experienceGroups: ExperienceGroup[];
  cvVariants: CvVariant[];
}
