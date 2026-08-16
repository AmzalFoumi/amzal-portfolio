/**
 * Identifies one of a project's available URLs, for the per-format URL checklists.
 * `link:<key>` refers to an entry in the project's `links[]`.
 */
export type CvUrlKey = "live" | "repo" | `link:${string}`;

export interface ProjectLink {
  /** Stable identifier. Referenced by CV URL checklists as `link:<key>`. Never rename. */
  key: string;
  label: string;
  url: string;
}

export interface Project {
  /**
   * Stable identifier used by CV variants to target this item for inclusion or
   * field overrides. Never rename — renaming orphans every override pointing at it.
   */
  key: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  /** Optional per-project tag limit for homepage cards. Falls back to global default. */
  tagLimit?: number;
  year: string;
  liveUrl?: string;
  repoUrl?: string;
  /**
   * Which URLs appear next to this project on the ATS CV, in display order.
   * Omit for all available URLs; `[]` for none.
   */
  atsCvUrls?: CvUrlKey[];
  /**
   * Which URLs appear next to this project on the styled CV, in display order.
   * Omit for all available URLs; `[]` for none.
   */
  styledCvUrls?: CvUrlKey[];
  /** Extra external links (articles, videos, slides) beyond live/repo. */
  links?: ProjectLink[];
  imageUrl?: string;
  /**
   * Site-only: promotes this project on the homepage grid.
   * Deliberately NOT a CV gate — use `showInStyledCv` / `showInAtsCv` for that.
   */
  featured?: boolean;
  /** Set false to hide this project from the ATS CV. Defaults to shown. */
  showInAtsCv?: boolean;
  /** Set false to hide this project from the styled CV. Defaults to shown. */
  showInStyledCv?: boolean;
}

export interface EducationEntry {
  /** Stable identifier for CV variant targeting. Never rename. */
  key: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  description?: string;
  achievements?: string[];
  grade?: string;
  activities?: string;
  skills?: string[];
}

export interface ExperienceRole {
  /** Stable identifier for CV variant targeting. Never rename. */
  key: string;
  role: string;
  startYear: string;
  endYear: string;
  location?: string;
  workMode?: string;
  engagementType?: string;
  description: string;
  tags?: string[];
  /** Set false to hide this role from the ATS CV. Defaults to shown. */
  showInAtsCv?: boolean;
  /** Set false to hide this role from the styled CV. Defaults to shown. */
  showInStyledCv?: boolean;
}

export interface ExperienceGroup {
  organisation: string;
  location?: string;
  workMode?: string;
  engagementType?: string;
  roles: ExperienceRole[];
}

export type VoluntaryGroup = ExperienceGroup;
export type WorkExperienceGroup = ExperienceGroup;

/**
 * One job entry, flattened from `ExperienceGroup` × `roles[]`.
 * The grouped shape is an authoring convenience for the site; CVs and the
 * variant override model both want a flat list. Derived in the content adapter —
 * never authored directly.
 */
export interface ExperienceItem extends ExperienceRole {
  organisation: string;
}

export interface Reference {
  /** Stable identifier for CV variant targeting. Never rename. */
  key: string;
  name: string;
  role?: string;
  organization?: string;
  linkedinUrl?: string;
  description?: string;
}

export interface Certification {
  /** Stable identifier for CV variant targeting. Never rename. */
  key: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  /** Logo shown only on the portfolio site (public/ path). */
  logoUrl: string;
  /** Set false to hide this certification from the ATS CV. Defaults to shown. */
  showInAtsCv?: boolean;
  /** Set false to hide this certification from the styled CV. Defaults to shown. */
  showInStyledCv?: boolean;
  /** Set true to wrap the logo in a card frame (background/border) on the portfolio site. Defaults to no frame — use when the badge image has no frame of its own. */
  showLogoFrame?: boolean;
}

export interface TechStackGroup {
  label: string;
  items: string[];
}

export interface Profile {
  name: string;
  /** Headline used on CV exports. */
  title: string;
  /** Site-only headline (Hero/Footer). Kept separate so CV exports are unaffected. */
  siteHeadline: string;
  location: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  /** Canonical base URL for SEO. No trailing slash. */
  siteUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  techStacks: TechStackGroup[];
  summary: string[];
  honors: string[];
}
