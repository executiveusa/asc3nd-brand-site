import { test, expect } from "@playwright/test";

const base = process.env.QA_BASE_URL || "http://127.0.0.1:3000";

for (const width of [320, 360, 390, 430, 768]) {
  test(`one-row mobile header ${width}px; visible language and theme`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(base + "/story");
    const header = page.locator(".site-header");
    const dims = await header.boundingBox();
    expect(dims?.height || 0).toBeLessThanOrEqual(64);
    await expect(header.locator(".site-logo img")).toBeVisible();
    await expect(header.locator(".locale-switch")).toBeVisible();
    await expect(header.locator(".theme-toggle")).toBeVisible();
    await expect(header.locator(".site-menu-toggle")).toBeVisible();
    await expect(header.locator(".site-desktop-donate")).toBeHidden();
    const overflowing = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    expect(overflowing).toBe(false);
    await header.locator(".site-menu-toggle").click();
    await expect(header.locator(".site-mobile-donate a")).toHaveText("Donate");
    await expect(header.locator(".site-mobile-donate a")).toHaveAttribute("href", "/support");
    await page.keyboard.press("Escape");
    await expect(header.locator(".site-panel")).toBeHidden();
  });
}

test("language switch follows corresponding impact page, not the homepage", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto(base + "/events");
  await page.locator(".site-header-actions .locale-switch a[lang=es]").click();
  await expect(page).toHaveURL(/\/es\/eventos$/);
  await expect(page.locator("h1")).toContainText("Donde el propósito");
  await page.locator(".site-header-actions .locale-switch a[lang=en]").click();
  await expect(page).toHaveURL(/\/events$/);
});

test("theme selection persists between routes and leaves branded hero black", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto(base + "/story");
  await expect(page.locator("html")).toHaveAttribute("data-theme","light");
  await page.getByRole("button", {name:"Switch to dark mode"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme","dark");
  await page.goto(base + "/");
  await expect(page.locator("html")).toHaveAttribute("data-theme","dark");
  expect(await page.locator(".home-hero--client-brand").evaluate(
    el => getComputedStyle(el).backgroundColor)).toBe("rgb(18, 15, 11)");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme","dark");
  await page.getByRole("button", {name:"Switch to light mode"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme","light");
});

test("homepage main image and silent loop open accessible media dialogs", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto(base + "/");
  const photo = page.getByRole("button",{name:"Enlarge event photograph"});
  await photo.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").locator("img")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(photo).toBeFocused();
  const film = page.getByRole("button",{name:"Play the full event film"});
  await film.click();
  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();
  await expect(modal.locator("video[controls][playsinline]")).toHaveCount(1);
  await expect(modal.locator("video")).toHaveAttribute("src",/community-cuts-720\.mp4/);
  await page.getByRole("button",{name:"Close gallery"}).click();
  await expect(film).toBeFocused();
});

test("Spanish full film and donor link are accessible",async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto(base + "/es/proyectos/community-cuts");
  await page.getByRole("button",{name:"Reproducir el video completo del evento"}).click();
  await expect(page.getByRole("dialog").locator("video[controls]")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await page.locator(".site-menu-toggle").click();
  await expect(page.locator(".site-mobile-donate a")).toHaveText("Donar");
  await expect(page.locator(".site-mobile-donate a")).toHaveAttribute("href","/es/apoyo");
});

test("event pages use natural copy and retain native scrolling",async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  for(const path of ["/events","/es/eventos"]){
    await page.goto(base+path);
    await expect(page.locator(".events-hero h1")).toBeVisible();
    const content = await page.locator(".events-next").innerText();
    expect(content).not.toMatch(/PENDING|PENDIENTE/);
    const start = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0,580);
    await expect.poll(async()=>page.evaluate(()=>window.scrollY)).toBeGreaterThan(start);
  }
});
