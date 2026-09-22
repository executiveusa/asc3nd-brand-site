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
