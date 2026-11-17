import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("full brand site stays the default until client approval", () => {
  const cfg = JSON.parse(source("config/site-mode.json"));
  assert.equal(cfg.mode, "full");
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
  const signup = source("components/CommunitySignup.tsx");
  assert.match(standby, /CommunitySignup/);
  assert.match(standby, /sourcePage="asc3nd.org\/standby"/);
  assert.match(signup, /\/api\/community\/join/);
  assert.match(signup, /consent_accepted/);
});
