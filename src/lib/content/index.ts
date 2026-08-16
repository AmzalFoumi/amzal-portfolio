import type { ExperienceGroup } from "@/types";
import type { CvFormat, CvVariant, ResolvedCv, SiteContent } from "@/types/cv";
import { resolveCv } from "@/lib/cv/resolve";
import { filesAdapter } from "./adapters/files";
import { snapshotAdapter } from "./adapters/snapshot";
import type { ContentSource, ContentSourceName } from "./types";

const ADAPTERS: Record<ContentSourceName, ContentSource | null> = {
  files: filesAdapter,
  snapshot: snapshotAdapter,
  // Added in Stage 2, wrapped in the circuit breaker.
  payload: null,
};

function selectAdapter(): ContentSource {
  const requested = process.env.CONTENT_SOURCE as ContentSourceName | undefined;
  const adapter = requested ? ADAPTERS[requested] : undefined;

  if (requested && !adapter) {
    console.warn(
      `[content] CONTENT_SOURCE="${requested}" is unavailable — falling back to "files".`,
    );
  }
  return adapter ?? filesAdapter;
}

/**
 * The single content boundary.
 *
 * Nothing outside this directory may import `src/data/*` or a CMS client. That
 * is what makes the storage decision reversible: swapping adapters is a change
 * here and nowhere else.
 */
const source = selectAdapter();

export const getSiteContent = (): Promise<SiteContent> =>
  source.getSiteContent();

export const getExperienceGroups = (): Promise<ExperienceGroup[]> =>
  source.getExperienceGroups();

export const getCvVariants = (): Promise<CvVariant[]> => source.getCvVariants();

export const getCvVariant = (slug: string): Promise<CvVariant | null> =>
  source.getCvVariant(slug);

export const getPublishedVariant = (
  format: CvFormat,
): Promise<CvVariant | null> => source.getPublishedVariant(format);

/** Resolve a variant by slug into render-ready CV content. */
export async function getResolvedCv(slug: string): Promise<ResolvedCv | null> {
  const variant = await source.getCvVariant(slug);
  if (!variant) return null;
  return resolveCv(await source.getSiteContent(), variant);
}

/** Resolve whichever variant of this format is currently published. */
export async function getPublishedCv(
  format: CvFormat,
): Promise<ResolvedCv | null> {
  const variant = await source.getPublishedVariant(format);
  if (!variant) return null;
  return resolveCv(await source.getSiteContent(), variant);
}

/**
 * Stable public URLs. `/cv/styled` and `/cv/ats` always point at whichever
 * variant is currently published, so a shared link keeps working after you
 * publish a different version — and no real variant slug ever appears in the
 * sitemap or in anything you hand out.
 */
export const CV_ALIASES = { styled: "styled", ats: "ats" } as const;

function aliasFormat(slug: string): CvFormat | null {
  return slug === "styled" || slug === "ats" ? slug : null;
}

/**
 * Resolve a `/cv/[variant]` segment, which may be a public alias or a real
 * variant slug. Returns null when nothing matches — callers must 404 without
 * distinguishing "no such variant" from "not allowed to see it".
 */
export async function getCvForRoute(slug: string): Promise<ResolvedCv | null> {
  const format = aliasFormat(slug);
  return format ? getPublishedCv(format) : getResolvedCv(slug);
}

export type { ContentSource, ContentSourceName } from "./types";
