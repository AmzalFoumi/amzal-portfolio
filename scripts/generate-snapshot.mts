/**
 * Regenerates `src/content/snapshot.json` — the runtime fallback content.
 *
 * Runs as `prebuild`, reading from whichever adapter is live (files in Stage 1,
 * Payload after the CMS lands). If the source is unreachable it leaves the
 * committed snapshot untouched and exits 0, so a CMS outage fails the *content
 * refresh*, not the build — Vercel keeps serving with slightly older fallback
 * data rather than not deploying at all.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { filesAdapter } from "../src/lib/content/adapters/files";
import type { ContentSnapshot } from "../src/lib/content/snapshotShape";

const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/content/snapshot.json",
);

async function main() {
  // Stage 2 swaps this for the Payload adapter.
  const source = filesAdapter;

  const snapshot: ContentSnapshot = {
    generatedAt: new Date().toISOString(),
    source: "files",
    siteContent: await source.getSiteContent(),
    experienceGroups: await source.getExperienceGroups(),
    cvVariants: await source.getCvVariants(),
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log(`[snapshot] wrote ${OUT} from "${snapshot.source}"`);
}

main().catch((error) => {
  console.warn(
    "[snapshot] refresh failed — keeping the committed snapshot.\n",
    error,
  );
  process.exit(0);
});
