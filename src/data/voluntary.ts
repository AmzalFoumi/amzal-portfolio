import type { VoluntaryGroup } from "@/types";

// CV visibility flags (per role): `showInAtsCv: false` hides a role from the
// generated ATS PDF (CvPdfDocument.tsx). `showInStyledCv: false` is honored only
// once the styled CV becomes data-driven — CvContent.tsx is currently hardcoded
// and ignores it. Omitting a flag means the role is shown.
export const voluntary: VoluntaryGroup[] = [
  {
    organisation: "AIESEC in Sri Lanka",
    location: "Colombo, Western Province, Sri Lanka",
    engagementType: "Volunteer",
    workMode: "Part-time",
    roles: [
      {
        role: "Software Engineering Team Lead",
        startYear: "Feb 2026",
        endYear: "Present",
        description:
          "Leading a technical team to build bigger and better platforms for AIESEC in Sri Lanka.",
        tags: ["Leadership", "Software Delivery", "AIESEC"],
      },
      {
        role: "Software Engineer | National Dev Team",
        startYear: "Mar 2025",
        endYear: "Feb 2026",
        description:
          "Built and maintained live applications for AIESEC in Sri Lanka as part of the National Dev Team.",
        tags: ["Development", "Operations", "Web Development"],
      },
    ],
  },
  {
    organisation: "AIESEC in SLIIT",
    location: "Colombo, Western Province, Sri Lanka",
    engagementType: "Volunteer",
    workMode: "Part-time",

    roles: [
      {
        role: "International Relations Manager | Incoming Global Talent",
        startYear: "Jan 2026",
        endYear: "Present",
        description:
          "Managing three teams dedicated to International Relations for the Incoming Global Talent product. Representing as the primary representaive of the iGT product at AIESEC in SLIIT to the global plenary.",
        tags: ["Leadership", "International Relations", "iGT"],
        showInAtsCv: false,
        showInStyledCv: false,
      },
      {
        role: "Senior Team Leader - International Relations | Incoming Global Talent",
        startYear: "Jan 2025",
        endYear: "Jan 2026",
        description:
          "Led international relations work for the Incoming Global Talent product at AIESEC in SLIIT.",
        tags: ["Leadership", "International Relations", "iGT"],
        showInAtsCv: false,
        showInStyledCv: false,
      },
      {
        role: "Team Member - B2B Sales | Incoming Global Talent",
        startYear: "Aug 2024",
        endYear: "Jan 2025",
        description:
          "Supported B2B sales for the Incoming Global Talent product at AIESEC in SLIIT.",
        tags: ["Sales", "Partnerships", "iGT"],
        showInAtsCv: false,
        showInStyledCv: false,
      },
      {
        role: "Organizing Committee Vice President - Partnership Development | Benchmark 3.0",
        startYear: "Sep 2024",
        endYear: "Dec 2024",
        description:
          "Supported partnership development for Benchmark 3.0, a UI/UX Bootcamp and Hackathon organized by AIESEC in SLIIT.",
        tags: ["Partnership Development", "Event Management", "AIESEC"],
        showInAtsCv: false,
        showInStyledCv: false,
      },
    ],
  },
];
