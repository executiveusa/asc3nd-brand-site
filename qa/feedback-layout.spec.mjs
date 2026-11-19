import { test, expect } from "@playwright/test";
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3000";
const sizes = [
  { name: "320", width: 320, height: 700 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
];

for (const vp of sizes) {
  test(`feedback layout ${vp.name}px: founders preserved, headings matched, footer controls separated`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto(base + "/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".home-founder")).toHaveCount(2);
    await expect(page.locator(".home-founder img[src='/media/founders/otha.webp']")).toBeVisible();
    await expect(page.locator(".home-founder img[src='/media/founders/elisha.webp']")).toBeVisible();
    await expect(page.locator(".home-founder blockquote")).toHaveCount(2);
    const mail = page.locator(".site-footer-mail");
    const cta = page.locator(".site-footer-support-cta");
    await expect(mail).toHaveAttribute("href", /^mailto:main@asc3ndcollective\.com\?subject=/);
    const emailBox = await mail.boundingBox();
    const ctaBox = await cta.boundingBox();
    expect(emailBox).not.toBeNull();
    expect(ctaBox).not.toBeNull();
    expect(ctaBox.y - (emailBox.y + emailBox.height), "Email and giving CTA overlap").toBeGreaterThanOrEqual(12);
    const shell = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: window.innerWidth }));
    expect(shell.scroll, JSON.stringify(shell)).toBeLessThanOrEqual(shell.viewport + 1);
    await page.screenshot({ path: `test-results/footer-feedback-${vp.name}.png`, fullPage: true });

    await page.goto(base + "/events", { waitUntil: "domcontentloaded" });
    const titles = [page.locator("#current-initiatives-title"),page.locator("#past-impact-title")];
    for (const heading of titles) await expect(heading).toBeVisible();
    const metrics = await Promise.all(titles.map(heading => heading.evaluate(el => {
      const css = getComputedStyle(el);
      return { size: css.fontSize, lineHeight: css.lineHeight, spacing: css.letterSpacing, weight: css.fontWeight };
    })));
    expect(metrics[0], JSON.stringify(metrics)).toEqual(metrics[1]);
    const dims = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: window.innerWidth }));
    expect(dims.scroll).toBeLessThanOrEqual(dims.viewport + 1);
    await page.screenshot({ path: `test-results/events-feedback-${vp.name}.png`, fullPage: true });
  });
}

test("Story founder section uses Otha only; homepage retains both", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/story");
  await expect(page.locator(".story-founder-feature")).toBeVisible();
  await expect(page.locator(".story-founder-feature img[src='/media/founders/otha.webp']")).toBeVisible();
  await expect(page.locator(".story-founder-feature img[src='/media/founders/elisha.webp']")).toHaveCount(0);
  await expect(page.locator(".story-founder-feature blockquote")).toHaveCount(1);
});

test("Contact form reports accepted submission without claiming email delivery", async ({ page }) => {
  await page.route("**/api/participation/submit", async route => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, status: "accepted" }) });
  });
  await page.goto(base + "/take-part");
  const form = page.locator("#direct-contact form");
  await form.locator("input[name=name]").fill("Website QA Test");
  await form.locator("input[name=email]").fill("qa@example.test");
  await form.locator("select[name=purpose]").selectOption("partner");
  await form.locator("textarea[name=message]").fill("A synthetic question for the website.");
  await form.locator("input[name=contact_consent]").check();
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.locator('[role="status"]')).toContainText("Your message was received.");
});

for (const width of [390, 1440]) {
  test(`Spanish Events headings match at ${width}px`, async ({ page }) => {
    await page.setViewportSize({width,height:844});
    await page.goto(base + "/es/eventos", {waitUntil:"domcontentloaded"});
    const headings = [page.locator("#current-initiatives-title"),page.locator("#past-impact-title")];
    for (const h of headings) await expect(h).toBeVisible();
    const styles = await Promise.all(headings.map(h=>h.evaluate(el=>{
      const c = getComputedStyle(el);
      return [c.fontSize,c.lineHeight,c.letterSpacing,c.fontWeight];
    })));
    expect(styles[0]).toEqual(styles[1]);
  });
}
