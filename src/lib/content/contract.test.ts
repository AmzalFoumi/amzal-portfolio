import { describe, expect, it } from "vitest";
import type { CvFormat, CvVariant, SiteContent } from "@/types/cv";
import { filesAdapter } from "./adapters/files";
import { snapshotAdapter } from "./adapters/snapshot";
import type { ContentSource } from "./types";

/**
 * The port's definition, executed against every adapter.
 *
 * This is what makes "swapping the content source is safe" a checked claim
 * rather than an aspiration. When the Payload adapter lands in Stage 2 it is
 * added to the table below and must pass this suite unchanged — if it needs the
 * suite relaxed, the port was drawn wrong.
 */
const ADAPTERS: [name: string, adapter: ContentSource][] = [
  ["files", filesAdapter],
  ["snapshot", snapshotAdapter],
];

const SECTIONS = [
  "projects",
  "experience",
  "education",
  "certifications",
  "references",
] as const satisfies readonly (keyof SiteContent)[];

const FORMATS: CvFormat[] = ["styled", "ats"];

describe.each(ADAPTERS)("ContentSource contract: %s", (_name, adapter) => {
  describe("getSiteContent", () => {
    it("returns every section", async () => {
      const c = await adapter.getSiteContent();
      for (const section of SECTIONS) expect(Array.isArray(c[section])).toBe(true);
      expect(c.profile).toBeTruthy();
      expect(c.leadership).toBeTruthy();
    });

    it("returns a complete profile", async () => {
      const { profile } = await adapter.getSiteContent();
      for (const field of [
        "name",
        "title",
        "siteHeadline",
        "location",
        "email",
        "siteUrl",
      ] as const) {
        expect(profile[field], `profile.${field}`).toBeTruthy();
      }
      expect(profile.techStacks.length).toBeGreaterThan(0);
      expect(profile.summary.length).toBeGreaterThan(0);
    });

    it.each(SECTIONS)("gives every %s item a non-empty key", async (section) => {
      const c = await adapter.getSiteContent();
      for (const item of c[section]) {
        expect(typeof item.key).toBe("string");
        expect(item.key.trim()).not.toBe("");
      }
    });

    it.each(SECTIONS)("gives every %s item a unique key", async (section) => {
      const c = await adapter.getSiteContent();
      const keys = c[section].map((i) => i.key);
      expect(new Set(keys).size, `duplicate keys in ${section}`).toBe(
        keys.length,
      );
    });

    it("flattens experience, carrying the organisation onto each role", async () => {
      const c = await adapter.getSiteContent();
      for (const item of c.experience) {
        expect(item.organisation, `role "${item.key}"`).toBeTruthy();
        expect(item.role).toBeTruthy();
      }
    });

    it("flattened experience matches the grouped view one-for-one", async () => {
      const c = await adapter.getSiteContent();
      const groups = await adapter.getExperienceGroups();
      const roleCount = groups.reduce((n, g) => n + g.roles.length, 0);
      expect(c.experience).toHaveLength(roleCount);
      expect(new Set(c.experience.map((r) => r.key))).toEqual(
        new Set(groups.flatMap((g) => g.roles.map((r) => r.key))),
      );
    });
  });

  describe("variants", () => {
    it("returns at least one", async () => {
      expect((await adapter.getCvVariants()).length).toBeGreaterThan(0);
    });

    it("gives every variant a unique slug", async () => {
      const slugs = (await adapter.getCvVariants()).map((v) => v.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("round-trips each variant by slug", async () => {
      for (const variant of await adapter.getCvVariants()) {
        expect(await adapter.getCvVariant(variant.slug)).toEqual(variant);
      }
    });

    it("returns null for an unknown slug rather than throwing", async () => {
      expect(await adapter.getCvVariant("no-such-variant")).toBeNull();
    });

    it.each(FORMATS)("publishes exactly one %s variant", async (format) => {
      const published = (await adapter.getCvVariants()).filter(
        (v) => v.format === format && v.published,
      );
      expect(published).toHaveLength(1);
    });

    it.each(FORMATS)("getPublishedVariant returns that %s variant", async (format) => {
      const variant = await adapter.getPublishedVariant(format);
      expect(variant).not.toBeNull();
      expect(variant?.format).toBe(format);
      expect(variant?.published).toBe(true);
    });
  });

  describe("referential integrity", () => {
    it("every variant item key names a real canonical item", async () => {
      const content = await adapter.getSiteContent();
      const known: Record<string, Set<string>> = Object.fromEntries(
        SECTIONS.map((s) => [s, new Set(content[s].map((i) => i.key))]),
      );

      for (const variant of await adapter.getCvVariants()) {
        for (const section of SECTIONS) {
          const entries = variant.items?.[section] ?? [];
          for (const entry of entries) {
            expect(
              known[section].has(entry.key),
              `variant "${variant.slug}" → ${section} → unknown key "${entry.key}"`,
            ).toBe(true);
          }
        }
      }
    });

    it("every project URL checklist names a URL the project has", async () => {
      const { projects } = await adapter.getSiteContent();
      for (const project of projects) {
        const available = new Set<string>();
        if (project.liveUrl) available.add("live");
        if (project.repoUrl) available.add("repo");
        for (const link of project.links ?? []) available.add(`link:${link.key}`);

        for (const list of [project.atsCvUrls, project.styledCvUrls]) {
          for (const key of list ?? []) {
            expect(
              available.has(key),
              `project "${project.key}" lists "${key}" but has no such URL`,
            ).toBe(true);
          }
        }
      }
    });

    it("every project link has a unique, non-empty key", async () => {
      const { projects } = await adapter.getSiteContent();
      for (const project of projects) {
        const keys = (project.links ?? []).map((l) => l.key);
        for (const key of keys) expect(key?.trim()).toBeTruthy();
        expect(new Set(keys).size, `duplicate link keys in "${project.key}"`).toBe(
          keys.length,
        );
      }
    });
  });
});

describe("pickPublished tie-breaking", () => {
  it("prefers the most recently updated when several are published", async () => {
    const { pickPublished } = await import("./types");
    const variants = [
      { slug: "old", label: "", format: "ats", published: true, updatedAt: "2026-01-01" },
      { slug: "new", label: "", format: "ats", published: true, updatedAt: "2026-08-01" },
    ] satisfies CvVariant[];
    expect(pickPublished(variants, "ats")?.slug).toBe("new");
  });

  it("returns null when none is published", async () => {
    const { pickPublished } = await import("./types");
    expect(pickPublished([], "styled")).toBeNull();
  });
});
