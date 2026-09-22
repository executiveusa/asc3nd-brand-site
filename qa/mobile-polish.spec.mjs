import { test, expect } from "@playwright/test";

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
      ".nav a, .hero-action, .choices a, .community-signup-form button, .social-links a"
    );

    await expect(page.locator(".hero h1")).toBeVisible();
    await expect(page.locator("#story")).toBeVisible();
    await expect(page.locator("#community")).toBeVisible();
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
  await expect(cards).toHaveCount(10);
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

      await assertMinimumTargets(page, ".nav a, a.button, button");

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


const accessibilityRoutes = [
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

for (const route of accessibilityRoutes) {
  test(`accessibility smoke ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });

    const main = page.locator("main#main-content");
    await expect(main).toBeVisible();

    const images = page.locator("img");
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute("alt");
    }

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
          return !(aria || text || title || placeholder || value);
        })
        .map((el) => ({ tag: el.tagName, outerHTML: el.outerHTML.slice(0, 300) }))
    );
    expect(unnamedInteractive, JSON.stringify(unnamedInteractive)).toEqual([]);

    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);

    const headingLevels = await page.locator("h1,h2,h3,h4,h5,h6").evaluateAll((els) =>
      els.map((el) => Number(el.tagName.slice(1)))
    );
    expect(headingLevels[0]).toBe(1);
    for (let i = 1; i < headingLevels.length; i++) {
      expect(
        headingLevels[i] - headingLevels[i - 1],
        `Heading jump on ${route}: ${headingLevels.join(" -> ")}`
      ).toBeLessThanOrEqual(1);
    }

    const skip = page.getByRole("link", { name: /skip to content/i });
    if (await skip.count()) {
      await page.keyboard.press("Tab");
      await expect(skip).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(main).toBeFocused();
    }

    const controls = page.locator("input, select, textarea");
    const controlCount = await controls.count();
    for (let i = 0; i < controlCount; i++) {
      const control = controls.nth(i);
      const type = await control.getAttribute("type");
      if (type === "hidden") continue;
      const hasName = await control.evaluate((el) => {
        const id = el.getAttribute("id");
        const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
        const wrapped = !!el.closest("label");
        const explicit = id ? !!document.querySelector(`label[for="${CSS.escape(id)}"]`) : false;
        return Boolean(aria || wrapped || explicit);
      });
      expect(hasName, `Unlabelled control on ${route} at index ${i}`).toBeTruthy();
    }

    await assertNoHorizontalOverflow(page);
  });
}

test("Community Cuts dialog traps and restores keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL + "/projects/community-cuts", { waitUntil: "domcontentloaded" });

  const firstCard = page.locator(".project-proof-card").first();
  await firstCard.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  const close = page.getByRole("button", { name: "Close gallery" });
  await expect(close).toBeFocused();

  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const dialogEl = document.querySelector('[role="dialog"]');
      return Boolean(dialogEl && document.activeElement && dialogEl.contains(document.activeElement));
    });
    expect(inside).toBeTruthy();
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(firstCard).toBeFocused();
});
