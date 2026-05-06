export interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
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

export interface VoluntaryEntry {
  organisation: string;
  role: string;
  startYear: string;
  endYear: string;
  location?: string;
  description: string;
  tags?: string[];
}
