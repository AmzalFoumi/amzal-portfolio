import type { CvVariant } from "@/types/cv";

/**
 * CV versions.
 *
 * A variant is a recipe, not a copy — it describes how to project the one content
 * pool onto one output. The two defaults below list **no items at all**, so they
 * inherit the format-level flags (`showInAtsCv` / `showInStyledCv` and the URL
 * checklists) entirely. That is what reproduces today's output with zero
 * duplication, and it is also what a brand-new variant starts from: copy one of
 * these, change the slug, and touch only what should differ.
 *
 * Exactly one variant per format may be `published: true` — published means
 * publicly viewable at /cv/<slug>. Everything else is author-only. Give unpublished
 * variants unguessable slugs.
 */
export const cvVariants: CvVariant[] = [
  {
    slug: "general-styled",
    label: "General (Styled)",
    format: "styled",
    published: true,
  },
  {
    slug: "general-ats",
    label: "General (ATS)",
    format: "ats",
    published: true,
  },

  /**
   * Worked example of a tailored variant — unpublished, so it is author-only.
   *
   * It deliberately contains **no invented prose**: only structural choices
   * (which items, in what order, with which links). Add `headline` / `summary`
   * yourself when you tailor it for a real application; those are claims about
   * you, not something to inherit from a template.
   *
   * Everything not mentioned here inherits the format flags — that is the whole
   * point. Copy this, change the slug, adjust, and leave the rest alone.
   */
  {
    slug: "cloud-devops-7f3a91",
    label: "Cloud / DevOps (example)",
    format: "ats",
    published: false,
    notes:
      "Template. Duplicate per application, give it an unguessable slug, and set headline/summary before sending.",
    items: {
      projects: [
        // Lead with the infrastructure-heavy work, and show the writeup link
        // that the general CV leaves off.
        {
          key: "distributed-health",
          urls: ["repo", "link:system-design-writeup"],
        },
        { key: "asl-finance-hub" },
        { key: "agentic-erp" },
        // Force out work that reads as product rather than platform.
        { key: "itinerary-ai", include: false },
        { key: "aesth-ai", include: false },
      ],
    },
  },
];
