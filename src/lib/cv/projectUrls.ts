import type { CvUrlKey, Project } from "@/types";
import type { CvFormat, ResolvedProjectUrl } from "@/types/cv";

const BUILTIN_LABELS: Record<"live" | "repo", string> = {
  live: "Live",
  repo: "GitHub",
};

/**
 * Every URL this project actually has, in canonical order: live, repo, then
 * extra links in authored order. This is the menu a checklist selects from.
 */
export function availableUrls(project: Project): ResolvedProjectUrl[] {
  const out: ResolvedProjectUrl[] = [];
  const live = project.liveUrl?.trim();
  const repo = project.repoUrl?.trim();

  if (live) out.push({ key: "live", label: BUILTIN_LABELS.live, url: live });
  if (repo) out.push({ key: "repo", label: BUILTIN_LABELS.repo, url: repo });

  for (const link of project.links ?? []) {
    const url = link.url?.trim();
    if (url) out.push({ key: `link:${link.key}`, label: link.label, url });
  }

  return out;
}

/** The format-level checklist for this project, before any variant override. */
export function formatUrlChecklist(
  project: Project,
  format: CvFormat,
): CvUrlKey[] | undefined {
  return format === "ats" ? project.atsCvUrls : project.styledCvUrls;
}

/**
 * Resolve a checklist against a project's available URLs.
 *
 * `checklist` undefined means "all available, canonical order"; `[]` means none.
 * Entries naming a URL the project doesn't have are skipped rather than erroring
 * — a checklist can legitimately outlive the field it points at.
 */
export function resolveProjectUrls(
  project: Project,
  checklist: CvUrlKey[] | undefined,
): ResolvedProjectUrl[] {
  const available = availableUrls(project);
  if (checklist === undefined) return available;

  const byKey = new Map(available.map((u) => [u.key, u]));
  return checklist
    .map((key) => byKey.get(key))
    .filter((u): u is ResolvedProjectUrl => u !== undefined);
}
