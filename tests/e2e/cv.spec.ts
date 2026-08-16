import { expect, test } from "@playwright/test";

/** CSS px per mm at the 96dpi Playwright renders print at. */
const PX_PER_MM = 96 / 25.4;

/** A4 height minus the 10.5mm top and bottom @page margins in globals.css. */
const PRINTABLE_PAGE_PX = (297 - 10.5 * 2) * PX_PER_MM;

/** The unpublished variant seeded in src/data/cvVariants.ts. */
const PRIVATE_SLUG = "cloud-devops-7f3a91";

test.describe("styled CV printing", () => {
  /**
   * The precondition for safe page breaks.
   *
   * `break-inside: avoid` can only move a block to the next page if the block
   * fits on a page at all — an entry taller than the printable area is split
   * regardless of any CSS. So rather than trying to predict where the print
   * engine will paginate (which the DOM cannot tell us), assert the invariant
   * that makes the CSS able to do its job.
   *
   * What this does NOT prove: that the engine actually produced good breaks.
   * It proves the layout never puts it in a position where it cannot.
   */
  test("no atomic entry is taller than a printable page", async ({ page }) => {
    await page.goto("/cv/styled");
    await page.emulateMedia({ media: "print" });
    // `attached`, not the default `visible`: elements hidden via `visibility`
    // still occupy layout, and it is layout we are measuring.
    await page.waitForSelector(".cv-entry", { state: "attached" });

    const tooTall = await page.$$eval(
      ".cv-entry",
      (nodes, limit) =>
        nodes
          .map((node) => ({
            height: node.getBoundingClientRect().height,
            text: (node.textContent ?? "").trim().slice(0, 60),
          }))
          .filter((entry) => entry.height > limit),
      PRINTABLE_PAGE_PX,
    );

    expect(
      tooTall,
      `entries taller than one page (${Math.round(PRINTABLE_PAGE_PX)}px) cannot be kept whole`,
    ).toEqual([]);
  });

  test("every section heading is followed by content on the same page", async ({
    page,
  }) => {
    await page.goto("/cv/styled");
    await page.emulateMedia({ media: "print" });

    // `break-after: avoid` is what enforces this; the check here is that every
    // heading actually has a following sibling to be kept with.
    const orphaned = await page.$$eval(".section-title", (nodes) =>
      nodes
        .filter((node) => !node.parentElement?.querySelector(".cv-entry"))
        .map((node) => node.textContent?.trim() ?? ""),
    );

    expect(orphaned, "sections rendered with a heading but no entries").toEqual(
      [],
    );
  });

  test("renders to a PDF of a sane length", async ({ page }) => {
    await page.goto("/cv/styled");
    const pdf = await page.pdf({ format: "A4", printBackground: true });

    // Counting page objects in the raw PDF avoids pulling in a parser. A CV that
    // suddenly spans many pages means the layout broke, not that it grew.
    const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? [])
      .length;
    expect(pages).toBeGreaterThanOrEqual(1);
    expect(pages).toBeLessThanOrEqual(3);
  });
});

test.describe("variant gating", () => {
  test("an unpublished variant 404s for an anonymous visitor", async ({
    request,
  }) => {
    const response = await request.get(`/cv/${PRIVATE_SLUG}`, {
      maxRedirects: 0,
    });

    // 404 and not 403: a 403 confirms the slug exists, turning the route into an
    // enumeration oracle for private CVs.
    expect(response.status()).toBe(404);
  });

  test("its download route 404s independently of the page", async ({
    request,
  }) => {
    // Route handlers inherit no gating from the page in the same segment, so
    // this is a genuinely separate hole that has to be checked separately.
    const response = await request.get(`/cv/${PRIVATE_SLUG}/download`, {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(404);
  });

  test("no opengraph-image route exists for CV variants", async ({
    request,
  }) => {
    // An OG image segment would not inherit the page's gating and would render a
    // private CV's name and headline into a publicly fetchable PNG.
    const response = await request.get(
      `/cv/${PRIVATE_SLUG}/opengraph-image`,
      { maxRedirects: 0 },
    );
    expect(response.status()).toBe(404);
  });

  test("the published aliases are reachable", async ({ request }) => {
    for (const alias of ["styled", "ats"]) {
      expect((await request.get(`/cv/${alias}`)).status(), alias).toBe(200);
    }
  });
});

test("sitemap lists only the two CV aliases", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();

  const cvUrls = [...xml.matchAll(/<loc>([^<]*\/cv\/[^<]*)<\/loc>/g)].map((m) =>
    m[1].replace(/^https?:\/\/[^/]+/, ""),
  );

  expect(cvUrls.sort()).toEqual(["/cv/ats", "/cv/styled"]);
  expect(xml).not.toContain(PRIVATE_SLUG);
});
