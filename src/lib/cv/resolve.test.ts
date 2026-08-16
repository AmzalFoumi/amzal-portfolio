import { describe, expect, it } from "vitest";
import type { SiteContent, CvVariant } from "@/types/cv";
import type { Project } from "@/types";
import { DEFAULT_SECTION_ORDER, resolveCv } from "./resolve";

/* ------------------------------------------------------------------ fixtures */

function project(key: string, over: Partial<Project> = {}): Project {
  return {
    key,
    slug: key,
    title: key,
    shortDescription: `${key} short`,
    fullDescription: `${key} full`,
    tags: ["TypeScript"],
    year: "2026",
    ...over,
  };
}

function content(over: Partial<SiteContent> = {}): SiteContent {
  return {
    profile: {
      name: "Amzal Foumi",
      title: "Default headline",
      siteHeadline: "Site headline",
      location: "Colombo",
      email: "a@b.c",
      phone: "+94",
      portfolioUrl: "https://p",
      siteUrl: "https://p",
      githubUrl: "https://gh",
      linkedinUrl: "https://li",
      techStacks: [{ label: "Languages", items: ["Java"] }],
      summary: ["Default summary"],
      honors: ["Dean's List"],
    },
    projects: [],
    experience: [],
    education: [],
    certifications: [],
    references: [],
    leadership: { body: [], coreCompetencies: [] },
    ...over,
  };
}

function variant(over: Partial<CvVariant> = {}): CvVariant {
  return {
    slug: "v",
    label: "V",
    format: "ats",
    published: false,
    ...over,
  };
}

const keys = <T extends { key: string }>(items: T[]) => items.map((i) => i.key);

/* -------------------------------------------------- tier 2: the format layer */

describe("format layer (a variant that lists nothing)", () => {
  it("reproduces the ATS flags exactly", () => {
    const cv = resolveCv(
      content({
        projects: [
          project("a"),
          project("b", { showInAtsCv: false }),
          project("c", { showInStyledCv: false }),
        ],
      }),
      variant({ format: "ats" }),
    );
    expect(keys(cv.projects)).toEqual(["a", "c"]);
  });

  it("reproduces the styled flags exactly", () => {
    const cv = resolveCv(
      content({
        projects: [
          project("a"),
          project("b", { showInAtsCv: false }),
          project("c", { showInStyledCv: false }),
        ],
      }),
      variant({ format: "styled" }),
    );
    expect(keys(cv.projects)).toEqual(["a", "b"]);
  });

  it("does NOT treat `featured` as a gate (§1.4 regression guard)", () => {
    const cv = resolveCv(
      content({ projects: [project("a", { featured: false })] }),
      variant({ format: "styled" }),
    );
    expect(keys(cv.projects)).toEqual(["a"]);
  });

  it("keeps canonical order", () => {
    const cv = resolveCv(
      content({ projects: [project("c"), project("a"), project("b")] }),
      variant(),
    );
    expect(keys(cv.projects)).toEqual(["c", "a", "b"]);
  });
});

/* ------------------------------------------------- tier 3: the variant layer */

describe("variant layer — inclusion", () => {
  it("include:true forces in an item the format flag hides", () => {
    const cv = resolveCv(
      content({ projects: [project("a", { showInAtsCv: false })] }),
      variant({ items: { projects: [{ key: "a", include: true }] } }),
    );
    expect(keys(cv.projects)).toEqual(["a"]);
  });

  it("include:false forces out an item the format flag shows", () => {
    const cv = resolveCv(
      content({ projects: [project("a"), project("b")] }),
      variant({ items: { projects: [{ key: "a", include: false }] } }),
    );
    expect(keys(cv.projects)).toEqual(["b"]);
  });

  it("a listed item with no `include` inherits the format flag", () => {
    const cv = resolveCv(
      content({ projects: [project("a", { showInAtsCv: false })] }),
      variant({
        items: { projects: [{ key: "a", override: { title: "T" } }] },
      }),
    );
    expect(cv.projects).toHaveLength(0);
  });

  it("drops variant entries whose key matches nothing", () => {
    const cv = resolveCv(
      content({ projects: [project("a")] }),
      variant({ items: { projects: [{ key: "ghost", include: true }] } }),
    );
    expect(keys(cv.projects)).toEqual(["a"]);
  });
});

describe("variant layer — ordering", () => {
  it("puts listed items first in listed order, then unlisted in canonical order", () => {
    const cv = resolveCv(
      content({
        projects: [project("a"), project("b"), project("c"), project("d")],
      }),
      variant({
        items: { projects: [{ key: "c" }, { key: "a" }] },
      }),
    );
    expect(keys(cv.projects)).toEqual(["c", "a", "b", "d"]);
  });

  it("excluded listed items do not occupy a position", () => {
    const cv = resolveCv(
      content({ projects: [project("a"), project("b")] }),
      variant({
        items: { projects: [{ key: "b", include: false }, { key: "a" }] },
      }),
    );
    expect(keys(cv.projects)).toEqual(["a"]);
  });
});

describe("variant layer — field overrides", () => {
  it("replaces a field", () => {
    const cv = resolveCv(
      content({ projects: [project("a", { title: "Original" })] }),
      variant({
        items: { projects: [{ key: "a", override: { title: "Tailored" } }] },
      }),
    );
    expect(cv.projects[0].title).toBe("Tailored");
  });

  it("leaves unmentioned fields at the site default", () => {
    const cv = resolveCv(
      content({ projects: [project("a", { title: "Original", year: "2020" })] }),
      variant({
        items: { projects: [{ key: "a", override: { title: "Tailored" } }] },
      }),
    );
    expect(cv.projects[0].year).toBe("2020");
  });

  it("null clears an optional field", () => {
    const cv = resolveCv(
      content({ projects: [project("a", { tagLimit: 3 })] }),
      variant({
        items: { projects: [{ key: "a", override: { tagLimit: null } }] },
      }),
    );
    expect(cv.projects[0].tagLimit).toBeUndefined();
  });

  it("does not mutate the canonical content", () => {
    const c = content({ projects: [project("a", { title: "Original" })] });
    resolveCv(
      c,
      variant({
        items: { projects: [{ key: "a", override: { title: "Tailored" } }] },
      }),
    );
    expect(c.projects[0].title).toBe("Original");
  });
});

/* ------------------------------------------------------------ URL checklists */

const linked = () =>
  project("a", {
    liveUrl: "https://live",
    repoUrl: "https://repo",
    links: [{ key: "writeup", label: "Writeup", url: "https://writeup" }],
  });

describe("URL checklists", () => {
  it("omitted at both layers shows every available URL", () => {
    const cv = resolveCv(content({ projects: [linked()] }), variant());
    expect(cv.projects[0].resolvedUrls.map((u) => u.key)).toEqual([
      "live",
      "repo",
      "link:writeup",
    ]);
  });

  it("honours the format checklist and its order", () => {
    const cv = resolveCv(
      content({ projects: [{ ...linked(), atsCvUrls: ["repo", "live"] }] }),
      variant({ format: "ats" }),
    );
    expect(cv.projects[0].resolvedUrls.map((u) => u.url)).toEqual([
      "https://repo",
      "https://live",
    ]);
  });

  it("reads the styled checklist when the format is styled", () => {
    const cv = resolveCv(
      content({
        projects: [
          { ...linked(), atsCvUrls: ["repo"], styledCvUrls: ["live"] },
        ],
      }),
      variant({ format: "styled" }),
    );
    expect(cv.projects[0].resolvedUrls.map((u) => u.key)).toEqual(["live"]);
  });

  it("an empty format checklist shows none", () => {
    const cv = resolveCv(
      content({ projects: [{ ...linked(), atsCvUrls: [] }] }),
      variant({ format: "ats" }),
    );
    expect(cv.projects[0].resolvedUrls).toEqual([]);
  });

  it("the variant checklist overrides the format checklist", () => {
    const cv = resolveCv(
      content({ projects: [{ ...linked(), atsCvUrls: ["live"] }] }),
      variant({ items: { projects: [{ key: "a", urls: ["link:writeup"] }] } }),
    );
    expect(cv.projects[0].resolvedUrls).toEqual([
      { key: "link:writeup", label: "Writeup", url: "https://writeup" },
    ]);
  });

  it("an empty variant checklist shows none, overriding a non-empty format list", () => {
    const cv = resolveCv(
      content({ projects: [{ ...linked(), atsCvUrls: ["live"] }] }),
      variant({ items: { projects: [{ key: "a", urls: [] }] } }),
    );
    expect(cv.projects[0].resolvedUrls).toEqual([]);
  });

  it("skips checklist entries with no corresponding URL", () => {
    const cv = resolveCv(
      content({
        projects: [
          { ...project("a", { liveUrl: "https://live" }), atsCvUrls: ["repo", "live"] },
        ],
      }),
      variant({ format: "ats" }),
    );
    expect(cv.projects[0].resolvedUrls.map((u) => u.key)).toEqual(["live"]);
  });

  it("trims whitespace off stored URLs", () => {
    const cv = resolveCv(
      content({ projects: [project("a", { repoUrl: "https://repo " })] }),
      variant(),
    );
    expect(cv.projects[0].resolvedUrls[0].url).toBe("https://repo");
  });
});

/* -------------------------------------------------------------- header + meta */

describe("header overrides", () => {
  it("overrides headline, summary and techStacks", () => {
    const cv = resolveCv(
      content(),
      variant({
        headline: "Cloud Engineer",
        summary: ["Tailored"],
        techStacks: [{ label: "Cloud", items: ["AWS"] }],
      }),
    );
    expect(cv.profile.title).toBe("Cloud Engineer");
    expect(cv.profile.summary).toEqual(["Tailored"]);
    expect(cv.profile.techStacks).toEqual([{ label: "Cloud", items: ["AWS"] }]);
  });

  it("falls back to the site default when absent or null", () => {
    const cv = resolveCv(content(), variant({ headline: null }));
    expect(cv.profile.title).toBe("Default headline");
    expect(cv.profile.summary).toEqual(["Default summary"]);
  });
});

describe("sections", () => {
  it("defaults the order per format", () => {
    expect(resolveCv(content(), variant({ format: "ats" })).sectionOrder).toEqual(
      DEFAULT_SECTION_ORDER.ats,
    );
    expect(
      resolveCv(content(), variant({ format: "styled" })).sectionOrder,
    ).toEqual(DEFAULT_SECTION_ORDER.styled);
  });

  it("gives the ATS CV no leadership section by default", () => {
    const cv = resolveCv(content(), variant({ format: "ats" }));
    expect(cv.sectionOrder).not.toContain("leadership");
  });

  it("honours an explicit order", () => {
    const cv = resolveCv(
      content(),
      variant({ sectionOrder: ["projects", "summary"] }),
    );
    expect(cv.sectionOrder).toEqual(["projects", "summary"]);
  });

  it("merges section title overrides over the defaults", () => {
    const cv = resolveCv(
      content(),
      variant({ sectionTitles: { projects: "Selected Work" } }),
    );
    expect(cv.sectionTitles.projects).toBe("Selected Work");
    expect(cv.sectionTitles.education).toBe("Education");
  });
});
