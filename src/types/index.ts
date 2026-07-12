export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
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
  /** Set true to show the GitHub repo link on the generated CVs. Defaults to hidden. */
  showRepoUrlInCv?: boolean;
  /** Extra external links (articles, videos, slides) beyond live/repo. */
  links?: ProjectLink[];
  imageUrl?: string;
  featured?: boolean;
  /** Set false to hide this project from the generated ATS PDF. Defaults to shown. */
  showInAtsCv?: boolean;
  /** Set false to hide this project from the styled CV. Defaults to shown. */
  showInStyledCv?: boolean;
}

export interface EducationEntry {
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
  role: string;
  startYear: string;
  endYear: string;
  location?: string;
  workMode?: string;
  engagementType?: string;
  description: string;
  tags?: string[];
  /** Set false to hide this role from the generated ATS PDF. Defaults to shown. */
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

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  /** Logo shown only on the portfolio site (public/ path). */
  logoUrl: string;
  /** Set false to hide this certification from the generated ATS PDF. Defaults to shown. */
  showInAtsCv?: boolean;
  /** Set false to hide this role from the styled CV. Defaults to shown. */
  showInStyledCv?: boolean;
  /** Set true to wrap the logo in a card frame (background/border) on the portfolio site. Defaults to no frame — use when the badge image has no frame of its own. */
  showLogoFrame?: boolean;
}
