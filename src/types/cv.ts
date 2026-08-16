import type {
  Certification,
  CvUrlKey,
  EducationEntry,
  ExperienceItem,
  Profile,
  Project,
  Reference,
  TechStackGroup,
} from "@/types";

export type CvFormat = "styled" | "ats";

export type CvSectionKey =
  | "summary"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "certifications"
  | "leadership"
  | "references";

/**
 * A patch over a canonical item.
 *
 * - key absent  → inherit the site default for that field
 * - key present → use this value; `null` explicitly clears it
 *
 * Deliberately not `Partial<T>`: `Partial` cannot distinguish "not overridden"
 * from "set to nothing", because `{ grade: undefined }` and `{}` are identical
 * after a JSON round-trip. Never store `undefined` — Mongo does not round-trip it.
 */
export type Override<T> = { [K in keyof T]?: T[K] | null };

/**
 * One item's per-variant treatment. Every field is optional; absent means inherit
 * from the format layer (`showInAtsCv` / `atsCvUrls` and their styled twins).
 *
 * Only items that need to differ appear in a variant — an empty variant renders
 * exactly what the format flags say.
 */
export interface VariantItem<T> {
  /** Matches the canonical item's `key`. */
  key: string;
  /** Tri-state: true forces in, false forces out, absent inherits the format flag. */
  include?: boolean;
  /** Absent inherits the format's URL checklist. Projects only. */
  urls?: CvUrlKey[];
  /** Field-level content edits. Absent keys keep the site default. */
  override?: Override<T>;
}

export interface CvVariantItems {
  projects?: VariantItem<Project>[];
  experience?: VariantItem<ExperienceItem>[];
  education?: VariantItem<EducationEntry>[];
  certifications?: VariantItem<Certification>[];
  references?: VariantItem<Reference>[];
}

/**
 * A CV version. Not a copy of the CV — a recipe describing how to project the
 * one content pool onto one output.
 */
export interface CvVariant {
  /** URL segment. Make it unguessable for anything not published. */
  slug: string;
  /** Author-facing name, e.g. "Cloud / DevOps roles". */
  label: string;
  format: CvFormat;
  /**
   * Exactly one variant per format should be published. Published variants are
   * publicly viewable; everything else is author-only.
   */
  published: boolean;

  /** Overrides `profile.title`. */
  headline?: string | null;
  /** Overrides `profile.summary`. */
  summary?: string[] | null;
  /** Overrides `profile.techStacks`. */
  techStacks?: TechStackGroup[] | null;

  /** Section order and presence. Absent uses DEFAULT_SECTION_ORDER. */
  sectionOrder?: CvSectionKey[];
  /** Per-section heading overrides. */
  sectionTitles?: Partial<Record<CvSectionKey, string>>;

  items?: CvVariantItems;

  /** Free-text note to self. Never rendered. */
  notes?: string;
  updatedAt?: string;
}

/** Everything the site knows, before any variant is applied. */
export interface SiteContent {
  profile: Profile;
  projects: Project[];
  /** Flattened from ExperienceGroup × roles by the content adapter. */
  experience: ExperienceItem[];
  education: EducationEntry[];
  certifications: Certification[];
  references: Reference[];
  leadership: LeadershipContent;
}

/**
 * The "Leadership & Comm." block, previously hardcoded identically in both
 * styled CV components because no data model existed for it.
 */
export interface LeadershipContent {
  /** Narrative paragraphs. */
  body: string[];
  /** e.g. "Cross-Cultural Collaboration, Stakeholder Management". */
  coreCompetencies: string[];
}

/** A project's URLs after the checklist has been resolved, in display order. */
export interface ResolvedProjectUrl {
  key: CvUrlKey;
  label: string;
  url: string;
}

export interface ResolvedProject extends Project {
  /** Replaces the per-format URL checklists once resolved. */
  resolvedUrls: ResolvedProjectUrl[];
}

/** Fully resolved, render-ready CV content. Renderers take only this. */
export interface ResolvedCv {
  slug: string;
  label: string;
  format: CvFormat;
  published: boolean;
  profile: Profile;
  sectionOrder: CvSectionKey[];
  sectionTitles: Record<CvSectionKey, string>;
  projects: ResolvedProject[];
  experience: ExperienceItem[];
  education: EducationEntry[];
  certifications: Certification[];
  references: Reference[];
  leadership: LeadershipContent;
}
