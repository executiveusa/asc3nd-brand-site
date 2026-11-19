import { createRequire } from "node:module";
import { test, expect } from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

const baseURL = process.env.QA_BASE_URL || "http://127.0.0.1:3000";

const viewports = [
  { name: "320x568", width: 320, height: 568 },
  { name: "360x800", width: 360, height: 800 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1440x900", width: 1440, height: 900 },
];

async function assertNoHorizontalOverflow(page) {
  const dims = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    innerWidth: window.innerWidth,
  }));
  expect(dims.scrollWidth, JSON.stringify(dims)).toBeLessThanOrEqual(dims.innerWidth + 1);
}

async function settleLazyMedia(page) {
  await page.evaluate(async () => {
    const step = Math.max(240, Math.floor(window.innerHeight * 0.65));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() =>
    Array.from(document.images)
      .filter((img) => img.getBoundingClientRect().width > 0 && img.getBoundingClientRect().height > 0)
      .every((img) => img.complete && img.naturalWidth > 0),
    undefined,
    { timeout: 8000 },
  ).catch(() => {});
  await page.waitForTimeout(350);
}

async function assertMinimumTargets(page, selector) {
  const issues = await page.locator(selector).evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return { text: (el.innerText || el.getAttribute("aria-label") || "").trim(), width: r.width, height: r.height };
    }).filter((x) => x.width > 0 && x.height > 0 && (x.width < 44 || x.height < 44))
  );
  expect(issues, JSON.stringify(issues)).toEqual([]);
}

for (const vp of viewports) {
  test(`home mobile polish ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    const errors = [];
    page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(baseURL + "/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main#main-content")).toBeVisible();
    await assertNoHorizontalOverflow(page);

    await assertMinimumTargets(page,
      ".site-nav a, .home-hero-actions a, .home-join-row, .community-signup-form button, .social-links a"
    );

    await expect(page.locator(".home-hero h1")).toBeVisible();
    await expect(page.locator("#story")).toBeVisible();
    await expect(page.locator(".home-essay")).toBeVisible();
    await expect(page.locator("#take-part")).toBeVisible();

    await settleLazyMedia(page);
    await page.screenshot({ path: `test-results/home-${vp.name}.png`, fullPage: true });

    expect(errors, JSON.stringify(errors)).toEqual([]);
  });
}

test("Community Cuts 390px gallery and lightbox", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto(baseURL + "/projects/community-cuts", { waitUntil: "domcontentloaded" });
  await assertNoHorizontalOverflow(page);

  const cards = page.locator(".project-proof-card");
  await expect(cards).toHaveCount(12);
  await settleLazyMedia(page);
  await page.screenshot({ path: "test-results/community-cuts-390.png", fullPage: true });

  const expand = page.getByRole("button", { name: /View all 86 photos/i });
  await expect(expand).toBeVisible();
  await expect(expand).toHaveAttribute("aria-expanded", "false");
  await expand.click();

  await expect(page.locator(".project-proof-card")).toHaveCount(86);
  await page.locator(".project-proof-card").first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: "Close gallery" })).toBeFocused();

  await assertMinimumTargets(page,
    ".project-proof-close, .project-proof-prev, .project-proof-next"
  );
  await assertNoHorizontalOverflow(page);

  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.locator(".project-proof-card").first()).toBeFocused();

  expect(errors, JSON.stringify(errors)).toEqual([]);
});

test("Take Part forms are mobile-safe at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  const routes = [
    "/take-part/family",
    "/take-part/mentor-volunteer",
    "/take-part/partner",
  ];

  for (const route of routes) {
    await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
    await assertNoHorizontalOverflow(page);

    const controls = page.locator("input, select, textarea, button");
    const count = await controls.count();
    expect(count).toBeGreaterThan(0);

    const textInputs = page.locator("input:not([type=checkbox]):not([type=radio]), select, textarea");
    const sizes = await textInputs.evaluateAll((els) =>
      els.map((el) => parseFloat(getComputedStyle(el).fontSize || "0"))
    );
    expect(sizes.every((n) => n >= 16), JSON.stringify(sizes)).toBeTruthy();

    const submit = page.locator("button[type=submit]").first();
    if (await submit.count()) {
      const box = await submit.boundingBox();
      expect(box?.height || 0).toBeGreaterThanOrEqual(44);
    }

    await page.screenshot({ path: `test-results${route.replaceAll("/", "-")}-390.png`, fullPage: true });
  }
});

test("Reduced motion keeps content visible", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(baseURL + "/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#story")).toBeVisible();
  const revealStates = await page.locator(".motion-reveal").evaluateAll((els) =>
    els.map((el) => {
      const cs = getComputedStyle(el);
      return { opacity: cs.opacity, transform: cs.transform };
    })
  );
  expect(revealStates.every((x) => Number(x.opacity) > 0.95), JSON.stringify(revealStates)).toBeTruthy();
  await context.close();
});


const interiorRoutes = [
  "/story",
  "/impact",
  "/take-part",
  "/privacy",
  "/youth-safety",
  "/transparency",
];

for (const route of interiorRoutes) {
  for (const vp of [
    { name: "320x568", width: 320, height: 568 },
    { name: "390x844", width: 390, height: 844 },
    { name: "430x932", width: 430, height: 932 },
  ]) {
    test(`interior mobile polish ${route} ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const errors = [];
      page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
      page.on("pageerror", (err) => errors.push(err.message));

      const response = await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
      expect(response?.status() || 0).toBeLessThan(400);
      await expect(page.locator("main#main-content")).toBeVisible();
      await assertNoHorizontalOverflow(page);

      const title = page.locator("h1").first();
      await expect(title).toBeVisible();

      await assertMinimumTargets(page, ".nav a, .site-nav a, a.button, button");

      const metrics = await page.evaluate(() => ({
        width: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        h1: (() => {
          const el = document.querySelector("h1");
          if (!el) return null;
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return {
            width: r.width,
            left: r.left,
            right: r.right,
            fontSize: cs.fontSize,
            lineHeight: cs.lineHeight,
            overflowWrap: cs.overflowWrap,
          };
        })(),
      }));
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.width + 1);
      if (metrics.h1) {
        expect(metrics.h1.left).toBeGreaterThanOrEqual(-1);
        expect(metrics.h1.right).toBeLessThanOrEqual(metrics.width + 1);
      }

      await settleLazyMedia(page);
      await page.screenshot({
        path: `test-results/interior-${route.replaceAll("/", "-")}-${vp.name}.png`,
        fullPage: true,
      });

      expect(errors, JSON.stringify(errors)).toEqual([]);
    });
  }
}


const keyboardRoutes = [
  "/",
  "/story",
  "/impact",
  "/take-part",
  "/projects/community-cuts",
  "/privacy",
  "/youth-safety",
  "/transparency",
];

for (const route of keyboardRoutes) {
  test(`keyboard journey ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const response = await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
    expect(response?.status() || 0).toBeLessThan(400);

    const seen = [];
    for (let i = 0; i < 24; i += 1) {
      await page.keyboard.press("Tab");
      const focus = await page.evaluate(() => {
        const el = document.activeElement;
        if (!(el instanceof HTMLElement)) return null;
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          text: (el.innerText || el.getAttribute("aria-label") || el.getAttribute("name") || "").trim().slice(0, 120),
          href: el instanceof HTMLAnchorElement ? el.getAttribute("href") : null,
          visible: r.width > 0 && r.height > 0,
          width: r.width,
          height: r.height,
        };
      });
      if (focus?.visible) seen.push(`${focus.tag}|${focus.text}|${focus.href || ""}`);
    }

    expect(new Set(seen).size, JSON.stringify(seen)).toBeGreaterThanOrEqual(3);
  });
}

test("participation form controls have accessible names", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/take-part/family", "/take-part/mentor-volunteer", "/take-part/partner"]) {
    await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
    const unnamed = await page.locator("input, select, textarea").evaluateAll((els) =>
      els.filter((el) => {
        const id = el.id;
        const labelled = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
        const wrapped = el.closest("label");
        const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
        return !labelled && !wrapped && !aria;
      }).map((el) => ({
        tag: el.tagName,
        type: el.getAttribute("type"),
        name: el.getAttribute("name"),
        id: el.id,
      }))
    );
    expect(unnamed, `${route}: ${JSON.stringify(unnamed)}`).toEqual([]);
  }
});


test("skip link moves focus to main content", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL + "/", { waitUntil: "domcontentloaded" });
  const skip = page.getByRole("link", { name: "Skip to content" });
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

for (const route of ["/", "/story", "/impact", "/take-part", "/privacy", "/youth-safety", "/transparency", "/projects/community-cuts"]) {
  test(`semantic landmarks ${route}`, async ({ page }) => {
    await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("main#main-content")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('nav[aria-label]')).toHaveCount(await page.locator('nav[aria-label]').count());
    const unnamedNavs = await page.locator("nav").evaluateAll((els) =>
      els.filter((el) => !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby"))
        .map((el) => el.outerHTML.slice(0, 180))
    );
    expect(unnamedNavs, `${route}: ${JSON.stringify(unnamedNavs)}`).toEqual([]);
  });
}

test("Community Cuts lightbox traps focus and restores trigger", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL + "/projects/community-cuts", { waitUntil: "domcontentloaded" });
  const firstCard = page.locator(".project-proof-card").first();
  await firstCard.focus();
  await expect(firstCard).toBeFocused();
  await firstCard.press("Enter");

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-label", /Fresh Fade, Fresh Grade event photo 1/i);
  const close = page.getByRole("button", { name: "Close gallery" });
  await expect(close).toBeFocused();

  for (let i = 0; i < 8; i += 1) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const dialog = document.querySelector(".project-proof-lightbox");
      return Boolean(dialog && dialog.contains(document.activeElement));
    });
    expect(inside).toBeTruthy();
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(firstCard).toBeFocused();
});

test("event credits dialog is named, keyboard-closeable, and restores trigger", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL + "/projects/community-cuts", { waitUntil: "networkidle" });

  const trigger = page.getByRole("button", { name: /View event credits/i });
  await trigger.focus();
  await expect(trigger).toBeFocused();
  await trigger.press("Enter");

  const dialog = page.locator("dialog.event-credits-dialog[open]");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-labelledby", "event-credits-title");
  await expect(page.locator("#event-credits-title")).toHaveText("The people behind the day.");
  await expect(page.getByRole("button", { name: "Close event credits" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});


const semanticSmokeRoutes = [
  "/",
  "/story",
  "/impact",
  "/take-part",
  "/take-part/family",
  "/take-part/mentor-volunteer",
  "/take-part/partner",
  "/projects/community-cuts",
  "/privacy",
  "/youth-safety",
  "/transparency",
];

for (const route of semanticSmokeRoutes) {
  test(`semantic accessibility smoke ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });

    const imagesMissingAlt = await page.locator("img").evaluateAll((els) =>
      els.filter((el) => !el.hasAttribute("alt")).map((el) => el.outerHTML.slice(0, 240))
    );
    expect(imagesMissingAlt, `${route}: images missing alt ${JSON.stringify(imagesMissingAlt)}`).toEqual([]);

    const unnamedInteractive = await page.locator("a, button, input, select, textarea").evaluateAll((els) =>
      els
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return false;
          const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
          const text = (el.textContent || "").trim();
          const title = el.getAttribute("title") || "";
          const placeholder = el.getAttribute("placeholder") || "";
          const value = "value" in el ? String(el.value || "") : "";
          const id = el.getAttribute("id");
          const labelled = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
          const wrapped = el.closest("label");
          return !(aria || text || title || placeholder || value || labelled || wrapped);
        })
        .map((el) => ({ tag: el.tagName, outerHTML: el.outerHTML.slice(0, 300) }))
    );
    expect(unnamedInteractive, `${route}: unnamed interactive ${JSON.stringify(unnamedInteractive)}`).toEqual([]);

    const headingLevels = await page.locator("h1,h2,h3,h4,h5,h6").evaluateAll((els) =>
      els.map((el) => Number(el.tagName.slice(1)))
    );
    expect(headingLevels[0], `${route}: no H1 found`).toBe(1);
    for (let i = 1; i < headingLevels.length; i += 1) {
      expect(
        headingLevels[i] - headingLevels[i - 1],
        `Heading jump on ${route}: ${headingLevels.join(" -> ")}`
      ).toBeLessThanOrEqual(1);
    }

    const skip = page.getByRole("link", { name: /skip to content/i });
    await page.keyboard.press("Tab");
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main-content")).toBeFocused();
  });
}


const axeRoutes = [
  "/",
  "/story",
  "/impact",
  "/take-part",
  "/take-part/family",
  "/take-part/mentor-volunteer",
  "/take-part/partner",
  "/projects/community-cuts",
  "/privacy",
  "/youth-safety",
  "/transparency",
];

for (const route of axeRoutes) {
  test(`WCAG A/AA axe smoke ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(baseURL + route, { waitUntil: "networkidle" });
    await page.addScriptTag({ path: axePath });

    const results = await page.evaluate(async () => {
      return await window.axe.run(document, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
        },
        resultTypes: ["violations"],
      });
    });

    const violations = results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        failureSummary: node.failureSummary,
      })),
    }));

    expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
  });
}


const craftRoutes = [
  { route: "/story", slug: "story" },
  { route: "/impact", slug: "impact" },
  { route: "/take-part", slug: "take-part" },
  { route: "/projects/community-cuts", slug: "community-cuts" },
];

for (const { route, slug } of craftRoutes) {
  test(`visual craft evidence ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(baseURL + route, { waitUntil: "networkidle" });
    await settleLazyMedia(page);
    await page.screenshot({
      path: `test-results/craft-${slug}-1440x900.png`,
      fullPage: true,
    });
  });
}


/**
 * Regression: screenshot pixels outside the client's painted logo must match
 * the footer/hero background, rather than the opaque black image canvas.
 * Decode Playwright's screenshots in the browser to avoid extra PNG libraries.
 */
for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
]) {
  test(`client logo has no opaque rectangle on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(baseURL + "/", { waitUntil: "networkidle" });
    for (const selector of [".home-hero-client-logo .client-brand-lockup", ".site-footer-client-logo"]) {
      const logo = page.locator(selector);
      await expect(logo).toBeVisible();
      const png = await logo.screenshot();
      const sampled = await page.evaluate(async (base64) => {
        const img = new Image();
        img.src = "data:image/png;base64," + base64;
        await img.decode();
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        return [[0.04, 0.06], [0.96, 0.06], [0.04, 0.94], [0.96, 0.94]].map(([x,y]) => {
          const px = ctx.getImageData(Math.floor(x * (canvas.width - 1)), Math.floor(y * (canvas.height - 1)), 1, 1).data;
          return Array.from(px).slice(0, 3);
        });
      }, png.toString("base64"));
      // --ink is rgb(18, 15, 11). The old black rectangle is rgb(0,0,0).
      for (const sample of sampled) {
        expect(sample[0], `${selector}: ${JSON.stringify(sampled)}`).toBeGreaterThanOrEqual(14);
        expect(Math.abs(sample[0] - 18)).toBeLessThanOrEqual(4);
        expect(Math.abs(sample[1] - 15)).toBeLessThanOrEqual(4);
        expect(Math.abs(sample[2] - 11)).toBeLessThanOrEqual(4);
      }
    }
  });
}


/* Founder-feedback copy release: paths and non-fabricated facts remain in sync. */
for (const locale of ["en", "es"]) {
  test(`founder feedback copy and Project Joy slots — ${locale}`, async ({ page }) => {
    const spanish = locale === "es";
    const storyPath = spanish ? "/es/historia" : "/story";
    const eventsPath = spanish ? "/es/eventos" : "/events";
    const joyPath = spanish ? "/es/proyectos/project-joy" : "/projects/project-joy";
    const takePartPath = spanish ? "/es/participar" : "/take-part";
    await page.goto(baseURL + storyPath);
    // Owner explicitly approved removing both Elisha's Story portrait and testimony.
    await expect(page.locator(".story-founder-commentary")).toHaveCount(0);
    await expect(page.locator('[data-slot="founder-elisha"]')).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(spanish ? "Quiero que cualquier joven" : "I want any youth");
    await expect(page.locator(`.event-record--upcoming .event-record-link[href="${joyPath}"]`)).toBeVisible();
    await page.goto(baseURL + eventsPath);
    await expect(page.locator(".event-record--upcoming")).toContainText("Project Joy: Asc3nd the Joy");
    await expect(page.locator(".community-partners-summary")).toBeVisible();
    await expect(page.locator(`a[href="${joyPath}"]`)).toBeVisible();
    await page.goto(baseURL + joyPath);
    await expect(page.locator("h1")).toHaveText("Project Joy: Asc3nd the Joy");
    await expect(page.locator("#joy-story-heading")).toBeVisible();
    await expect(page.locator(".joy-brand-art img")).toBeVisible();
    await expect(page.locator("#joy-support-heading")).toBeVisible();
    await expect(page.locator("#joy-final-heading")).toBeVisible();
    // The founders confirmed the campaign Zeffy destination; keep it distinct from general giving.
    await expect(page.locator(`.joy-final a[href="https://www.zeffy.com/en-US/donation-form/project-joy-asc3nd-the-joy"]`)).toBeVisible();
    await expect(page.locator(`.joy-final a[href*="amazon.com/hz/wishlist/ls/24DFHCXA6J5RC"]`)).toBeVisible();
    await page.goto(baseURL + takePartPath);
    await expect(page.locator(".interior-hero-supporting")).toContainText(
      spanish ? "Cada acto de bondad" : "Every act of kindness",
    );
  });
}


/* Fixed-size story gallery: future events must not create an infinite Story page. */
for (const locale of ["en", "es"]) {
  for (const width of [320, 390, 1440]) {
    test(`Story editorial proof gallery ${locale} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      const spanish = locale === "es";
      await page.goto(baseURL + (spanish ? "/es/historia" : "/story"));
      const gallery = page.locator(".editorial-proof");
      await expect(gallery).toBeVisible();
      const slides = gallery.locator(".editorial-proof-slide");
      await expect(slides).toHaveCount(4);
      await expect(gallery.getByText("01 / 04")).toBeVisible();
      await assertNoHorizontalOverflow(page);
      const imageUrls = await slides.locator("img").evaluateAll((els) =>
        els.map((img) => img.getAttribute("src") || "")
      );
      expect(new Set(imageUrls).size).toBe(4);
      const homepageFeatured = ["060", "043", "059", "040", "046", "010", "042", "081", "017", "016"];
      expect(imageUrls.every((src) => !homepageFeatured.some((id) => src.includes(`community-cuts-${id}`)))).toBeTruthy();
      const next = gallery.getByRole("button", { name: spanish ? "Foto siguiente" : "Next photo" });
      await expect(next).toBeVisible();
      await next.click();
      await expect(gallery.getByText("02 / 04")).toBeVisible();
      const first = slides.first().locator("a");
      await expect(first).toHaveAttribute("href", spanish ? "/es/proyectos/community-cuts" : "/projects/community-cuts");
      await page.screenshot({ path: `test-results/story-proof-${locale}-${width}.png`, fullPage: true });
    });
  }
}


/* Founder-requested Story portrait hierarchy, single gallery and footer paths. */
for (const locale of ["en", "es"]) {
  test(`Story and footer design QA ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const es = locale === "es";
    await page.goto(baseURL + (es ? "/es/historia" : "/story"));
    const portrait = page.locator(".story-founder-feature .portrait-placeholder");
    const quote = page.locator(".story-founder-feature .story-copy blockquote");
    await expect(portrait).toBeVisible();
    await expect(quote).toBeVisible();
    await expect(page.locator(".editorial-proof")).toHaveCount(1);
    await expect(page.locator(".story-mission")).toBeVisible();
    await assertNoHorizontalOverflow(page);
    const footer = page.locator(".site-footer");
    await expect(footer.locator(".site-footer-support-cta")).toHaveAttribute("href", /^https:\/\/(www\.)?zeffy\.com\//);
    await expect(footer.locator(`a[href="${es ? "/es/participar/mentores-voluntariado" : "/take-part/mentor-volunteer"}"]`)).toBeVisible();
    await expect(footer.locator(`a[href="${es ? "/es/participar/aliados" : "/take-part/partner"}"]`)).toBeVisible();
    await page.screenshot({ path: `test-results/story-footer-design-${locale}-390.png`, fullPage: true });
  });
}


for (const locale of ["en", "es"]) {
  test(`Events media links reach real sections ${locale}`, async ({ page }) => {
    const es = locale === "es";
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(baseURL + (es ? "/es/eventos" : "/events"));
    const proof = page.locator(".event-record-proof").first();
    const href = es ? "/es/proyectos/community-cuts" : "/projects/community-cuts";
    await expect(proof.locator(`a[href="${href}#project-film-title"]`)).toBeVisible();
    await expect(proof.locator(`a[href="${href}#project-proof-title"]`)).toBeVisible();
    await expect(proof.locator(`a[href="${href}#project-partners-title"]`)).toBeVisible();
    await proof.locator(`a[href="${href}#project-partners-title"]`).click();
    await expect(page.locator("#project-partners-title")).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });
}


/* Launch safety: never send a donor to Zeffy's unrelated platform homepage. */
for (const locale of ["en", "es"]) {
  test(`Donation gate and fourth support route ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const es = locale === "es";
    const takePart = es ? "/es/participar" : "/take-part";
    const support = es ? "/es/apoyo" : "/support";
    await page.goto(baseURL + takePart);
    const rows = page.locator(".home-join-row");
    await expect(rows).toHaveCount(4);
    await expect(rows.last()).toHaveAttribute("href", support);
    // On narrow screens the verified-safe Donate / Donar CTA lives in the menu.
    // It never links to Zeffy's general homepage as a misleading donation checkout.
    await page.locator(".site-menu-toggle").click();
    const headerCta = page.locator(".site-mobile-donate .donate-pill");
    await expect(headerCta).toBeVisible();
    await expect(headerCta).toHaveAttribute("aria-label", es ? "Donar (se abre en una pestaña nueva)" : "Donate (opens in a new tab)");
    await expect(headerCta).toHaveAttribute("href", "https://www.zeffy.com/en-US/donation-form/the-asc3nd-collective");
    await expect(page.locator(".site-header-actions .donate-pill")).toBeHidden();
    await page.keyboard.press("Escape");
    await expect(headerCta).toBeHidden();
    await page.goto(baseURL + support);
    const links = await page.locator("a[href]").evaluateAll((els) =>
      els.map((a) => a.getAttribute("href") || "")
    );
    expect(links).toContain("https://www.zeffy.com/");
    await expect(page.locator(".ss-row")).toHaveCount(2);
    await expect(page.locator(".ss-list")).toContainText(es ? "campaña de donaciones" : "donation campaign");
    await expect(page.getByRole("link", { name: es ? /Participa: voluntariado/i : /Get Involved: volunteer/i })).toHaveAttribute("href", takePart);
    await assertNoHorizontalOverflow(page);
  });
}
