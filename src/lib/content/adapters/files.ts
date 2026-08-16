import type { ExperienceGroup, ExperienceItem } from "@/types";
import type { CvFormat, CvVariant, SiteContent } from "@/types/cv";
import { certifications } from "@/data/certifications";
import { cvVariants } from "@/data/cvVariants";
import { education } from "@/data/education";
import { leadership } from "@/data/leadership";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { references } from "@/data/references";
import { voluntary } from "@/data/voluntary";
import { workExperience } from "@/data/workExperience";
import { pickPublished, type ContentSource } from "../types";

/**
 * Flatten `ExperienceGroup × roles[]` into one entry per role.
 *
 * The grouped shape is an authoring convenience — one organisation, many roles.
 * CVs and the variant override model both want a flat list, and flattening here
 * means the group needs no key of its own.
 */
export function flattenExperience(groups: ExperienceGroup[]): ExperienceItem[] {
  return groups.flatMap((group) =>
    group.roles.map((role) => ({
      ...role,
      organisation: group.organisation,
      // Role-level values win; the group supplies the default.
      location: role.location ?? group.location,
      workMode: role.workMode ?? group.workMode,
      engagementType: role.engagementType ?? group.engagementType,
    })),
  );
}

const groups = (): ExperienceGroup[] => [...workExperience, ...voluntary];

/**
 * Reads the typed TypeScript files in `src/data/`.
 *
 * This is the Stage 1 default and remains the seed source after the CMS lands.
 * It stops being the runtime fallback once Payload goes live — see the snapshot
 * adapter, which cannot go stale.
 */
export const filesAdapter: ContentSource = {
  async getSiteContent(): Promise<SiteContent> {
    return {
      profile,
      projects,
      experience: flattenExperience(groups()),
      education,
      certifications,
      references,
      leadership,
    };
  },

  async getExperienceGroups(): Promise<ExperienceGroup[]> {
    return groups();
  },

  async getCvVariants(): Promise<CvVariant[]> {
    return cvVariants;
  },

  async getCvVariant(slug: string): Promise<CvVariant | null> {
    return cvVariants.find((v) => v.slug === slug) ?? null;
  },

  async getPublishedVariant(format: CvFormat): Promise<CvVariant | null> {
    return pickPublished(cvVariants, format);
  },
};
