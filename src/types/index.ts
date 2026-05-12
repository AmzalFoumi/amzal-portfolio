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
  imageUrl?: string;
  featured?: boolean;
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
