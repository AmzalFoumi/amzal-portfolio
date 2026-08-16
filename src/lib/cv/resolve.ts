import type { Project } from "@/types";
import type {
  CvFormat,
  CvSectionKey,
  CvVariant,
  Override,
  ResolvedCv,
  ResolvedProject,
  SiteContent,
  VariantItem,
} from "@/types/cv";
import { formatUrlChecklist, resolveProjectUrls } from "./projectUrls";

/**
 * Section order per format, used when a variant doesn't specify one.
 *
 * These differ deliberately. The ATS CV is a single linear column that leads with
 * skills for keyword scanners and carries no Leadership block. The styled CV is
 * two-column, so this order applies *within* each column — see STYLED_COLUMN in
 * CvStyledDynamic for the column assignment.
 */
export const DEFAULT_SECTION_ORDER: Record<CvFormat, CvSectionKey[]> = {
  ats: [
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
    "certifications",
    "references",
  ],
  styled: [
    "summary",
    "experience",
    "projects",
    "education",
    "skills",
    "certifications",
    "leadership",
    "references",
  ],
};

export const DEFAULT_SECTION_TITLES: Record<CvSectionKey, string> = {
  summary: "Professional Summary",
  skills: "Technical Skills",
  experience: "Technical Experience",
  projects: "Projects",
  education: "Education",
  certifications: "Certifications",
  leadership: "Leadership & Comm.",
  references: "References",
};

/** Items carrying the format-level visibility flags. */
type Flagged = { showInAtsCv?: boolean; showInStyledCv?: boolean };

/**
 * Apply a patch to one item.
 *
 * Key absent → keep the site default. `null` → clear the field. Anything else
 * replaces. `undefined` is treated as absent so a JSON round-trip can't silently
 * blank a field.
 */
function applyOverride<T extends object>(base: T, patch?: Override<T>): T {
  if (!patch) return { ...base };
  const out = { ...base };
  for (const key of Object.keys(patch) as (keyof T)[]) {
    const value = patch[key];
    if (value === undefined) continue;
    if (value === null) delete out[key];
    else out[key] = value as T[keyof T];
  }
  return out;
}

/**
 * Resolve one section through both layers.
 *
 * Tier 2 (format): an item is in unless its format flag says otherwise.
 * Tier 3 (variant): a listed item's `include` overrides that, and listing an
 * item at all pulls it to the front — listed items come first in listed order,
 * then everything unlisted in canonical order.
 */
function resolveSection<T extends { key: string } & Flagged>(
  items: T[],
  variantItems: VariantItem<T>[] | undefined,
  isAts: boolean,
): { item: T; variant?: VariantItem<T> }[] {
  const byKey = new Map(items.map((i) => [i.key, i]));
  const listed = new Map<string, VariantItem<T>>();

  for (const entry of variantItems ?? []) {
    if (!byKey.has(entry.key)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[resolveCv] variant references unknown item key "${entry.key}" — dropped.`,
        );
      }
      continue;
    }
    listed.set(entry.key, entry);
  }

  const included = (item: T): boolean => {
    const entry = listed.get(item.key);
    if (entry?.include !== undefined) return entry.include;
    return (isAts ? item.showInAtsCv : item.showInStyledCv) !== false;
  };

  const ordered: T[] = [];
  for (const key of listed.keys()) {
    const item = byKey.get(key);
    if (item) ordered.push(item);
  }
  for (const item of items) {
    if (!listed.has(item.key)) ordered.push(item);
  }

  return ordered
    .filter(included)
    .map((item) => ({ item, variant: listed.get(item.key) }));
}

/** Resolve a section that carries no per-item URL handling. */
function plain<T extends { key: string } & Flagged>(
  items: T[],
  variantItems: VariantItem<T>[] | undefined,
  isAts: boolean,
): T[] {
  return resolveSection(items, variantItems, isAts).map(({ item, variant }) =>
    applyOverride(item, variant?.override),
  );
}

/**
 * Project the canonical content pool onto one CV output.
 *
 * Pure: no I/O, no clock, no environment beyond a dev-only warning. Given the
 * same two arguments it always returns the same result, and it never mutates
 * either of them.
 *
 * Resolution runs in three tiers — canonical item, then the format-level flags
 * and URL checklists, then the variant's per-item treatment. A variant that
 * lists nothing renders exactly what the format flags alone would produce.
 */
export function resolveCv(content: SiteContent, variant: CvVariant): ResolvedCv {
  const isAts = variant.format === "ats";
  const items = variant.items ?? {};

  const projects: ResolvedProject[] = resolveSection(
    content.projects,
    items.projects,
    isAts,
  ).map(({ item, variant: entry }) => {
    const patched: Project = applyOverride(item, entry?.override);
    const checklist =
      entry?.urls !== undefined
        ? entry.urls
        : formatUrlChecklist(patched, variant.format);
    return { ...patched, resolvedUrls: resolveProjectUrls(patched, checklist) };
  });

  return {
    slug: variant.slug,
    label: variant.label,
    format: variant.format,
    published: variant.published,
    profile: {
      ...content.profile,
      title: variant.headline ?? content.profile.title,
      summary: variant.summary ?? content.profile.summary,
      techStacks: variant.techStacks ?? content.profile.techStacks,
    },
    sectionOrder: variant.sectionOrder ?? DEFAULT_SECTION_ORDER[variant.format],
    sectionTitles: { ...DEFAULT_SECTION_TITLES, ...variant.sectionTitles },
    projects,
    experience: plain(content.experience, items.experience, isAts),
    education: plain(content.education, items.education, isAts),
    certifications: plain(content.certifications, items.certifications, isAts),
    references: plain(content.references, items.references, isAts),
    leadership: content.leadership,
  };
}
