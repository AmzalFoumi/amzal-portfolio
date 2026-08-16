import type { LeadershipContent } from "@/types/cv";

/**
 * The "Leadership & Comm." CV block.
 *
 * Previously hardcoded identically in both styled CV components because no data
 * model existed for it. It is narrative rather than structured, so it stays as
 * prose here rather than being forced into the ExperienceRole shape — the roles
 * it describes already live in `voluntary.ts`, and duplicating them as structured
 * entries would create a second source of truth for the same facts.
 */
export const leadership: LeadershipContent = {
  body: [
    'AIESEC SLIIT IR Manager (Jan 2025 - Present): Managed 3 teams for Incoming Global Talent. Awarded "Best Performing iGT IR & M Leader" at Legacy 2025.',
  ],
  coreCompetencies: [
    "Cross-Cultural Collaboration",
    "Stakeholder Management",
    "Agile Team Leadership",
  ],
};
