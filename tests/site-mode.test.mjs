import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("site mode is always an explicit, supported deployment setting", () => {
  const cfg = JSON.parse(source("config/site-mode.json"));
  assert.ok(["full", "standby"].includes(cfg.mode));
  assert.doesNotMatch(source("scripts/set-site-mode.mjs"), /process\\.env\\.NEXT_PUBLIC_/);
});
test("standby mode is a server-side rewrite, never user-controlled", () => {
  const proxy = source("proxy.ts");
  assert.match(proxy, /siteMode\.mode !== "standby"/);
  assert.match(proxy, /NextResponse\.rewrite\(url\)/);
  assert.match(proxy, /pathname\.startsWith\("\/api\/"\)/);
  assert.doesNotMatch(proxy, /searchParams\.get\(["']mode/);
  assert.doesNotMatch(proxy, /cookies\(\).*mode/);
});
test("standby retains existing consented signup API", () => {
  const standby = source("app/standby/page.tsx");
  const signup = source("app/standby/HoldingSignupForm.tsx");
  assert.match(standby, /HoldingSignupForm/);
  assert.match(signup, /\/api\/community\/join/);
  assert.match(signup, /consent_accepted/);
  assert.match(signup, /source_page: "asc3nd.org\/standby"/);
});
