import type { WorkExperienceGroup } from "@/types";

// Shares the ExperienceRole shape with voluntary.ts, so each role here also
// accepts the CV visibility flags: `showInAtsCv` (honored by the ATS PDF) and
// `showInStyledCv` (annotation-only until the styled CV becomes data-driven).
export const workExperience: WorkExperienceGroup[] = [];
