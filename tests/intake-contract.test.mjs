import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const source = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("direct contact requires explicit category and does not default to partner", () => {
  const form = source("components/ContactForm.tsx");
  assert.match(form, /<select name="purpose" required defaultValue="">/);
  for (const route of ["family", "volunteer", "donor", "sponsor", "partner"]) {
    assert.match(form, new RegExp('\\["' + route + '",'));
  }
  assert.doesNotMatch(form, /route_key:\s*"partner"/);
  assert.match(form, /route_key: route/);
});

test("donor flow is distinct and no payment details are collected", () => {
  const form = source("components/ParticipationForm.tsx");
  assert.match(form, /kind === "donor"/);
  assert.match(form, /defaultRoute: "donor"/);
  assert.match(form, /Please do not enter card numbers/);
  assert.match(source("app/take-part/donor/page.tsx"), /kind="donor"/);
  assert.match(source("app/es/participar/donante/page.tsx"), /kind="donor" locale="es"/);
});

test("migration preserves the existing RPC while adding donor and separate acknowledgments", () => {
  const sql = source("supabase/migrations/20261116180000_asc3nd_categorized_intake_and_ack.sql");
  assert.match(sql, /CREATE OR REPLACE FUNCTION public.asc3nd_submit_participation/i);
  assert.match(sql, /v_form_type='donor' and v_route<>'donor'/);
  assert.match(sql, /'participation_ack'/);
  assert.match(sql, /status='held'/);
  assert.match(sql, /new\.contact_consent/);
});

test("notification delivery requires server-only auth and separates staff and visitor recipients", () => {
  const worker = source("supabase/functions/asc3nd-site-notifications/index.ts");
  const caller = source("lib/site-notifications.ts");
  assert.match(worker, /ASC3ND_NOTIFICATION_TRIGGER_SECRET/);
  assert.match(worker, /error: "unauthorized"/);
  assert.match(worker, /row\.recipient_email/);
  assert.match(worker, /participation_ack/);
  assert.match(caller, /process\.env\.ASC3ND_NOTIFICATION_TRIGGER_SECRET/);
  assert.match(caller, /Authorization: `Bearer \$\{triggerSecret\}`/);
  assert.doesNotMatch(caller, /NEXT_PUBLIC_ASC3ND_NOTIFICATION_TRIGGER_SECRET/);
});

test("public worker health check does not reveal provider configuration", () => {
  const worker = source("supabase/functions/asc3nd-site-notifications/index.ts");
  const getBranch = worker.match(/if \(request\.method === "GET"\) \{([\s\S]*?)\n  \}/)?.[1];
  assert.ok(getBranch, "GET health route must exist");
  assert.match(getBranch, /return json\(\{ ok: true \}\)/);
  assert.doesNotMatch(getBranch, /configured|recipient|from_email|missing|RESEND_API_KEY|triggerSecret/);
});

test("worker authenticates before inspecting delivery configuration", () => {
  const worker = source("supabase/functions/asc3nd-site-notifications/index.ts");
  const methodIndex = worker.indexOf('if (request.method !== "POST")');
  const authIndex = worker.indexOf('if (!triggerSecret || request.headers.get("authorization")');
  const resendConfigIndex = worker.indexOf('if (!resendKey) return json(');
  const claimIndex = worker.indexOf('.rpc("asc3nd_claim_site_notifications"');
  assert.ok(methodIndex >= 0 && authIndex > methodIndex);
  assert.ok(resendConfigIndex > authIndex, "do not disclose Resend configuration before auth");
  assert.ok(claimIndex > authIndex, "do not claim queued notifications before auth");
  assert.doesNotMatch(worker, /missing:\s*\[\.\.\.\(!resendKey/);
});

test("migration terminates every SQL function before the next statement", () => {
  const sql = source("supabase/migrations/20261116180000_asc3nd_categorized_intake_and_ack.sql");
  assert.equal(sql.split("$function$").length - 1, 6);
  assert.equal(sql.split("$function$;").length - 1, 3);
  for (const nextStatement of ["CREATE OR REPLACE", "-- Extend", "commit;"]) {
    assert.ok(!sql.includes("$function$" + String.fromCharCode(10) + nextStatement), "Missing SQL terminator before " + nextStatement);
  }
});

test("service-only public RPC bridge keeps notification queue private", () => {
  const sql = source("supabase/migrations/20261117013500_asc3nd_service_only_notification_rpc_bridge.sql");
  const worker = source("supabase/functions/asc3nd-site-notifications/index.ts");
  for (const fn of [
    "asc3nd_claim_site_notifications",
    "asc3nd_mark_site_notification_sent",
    "asc3nd_mark_site_notification_failed",
  ]) {
    assert.ok(sql.includes("function public." + fn), "Missing migration: " + fn);
    assert.ok(worker.includes('.rpc("' + fn + '"'), "Worker still calls private schema for: " + fn);
  }
  assert.equal(sql.split("revoke all on function public.").length - 1, 3);
  assert.equal(sql.split("grant execute on function public.").length - 1, 3);
  assert.ok(!worker.includes('.schema("asc3nd_private")'));
});

test("scheduled worker uses Vault token and only runs for queued notifications", () => {
  const sql = source("supabase/migrations/20261117015000_asc3nd_vault_backed_notification_schedule.sql");
  assert.ok(sql.includes("asc3nd-notification-outbox-dispatch-v1"));
  assert.ok(sql.includes("vault.decrypted_secrets"));
  assert.ok(sql.includes("asc3nd_notification_dispatch_token"));
  assert.ok(sql.includes("net.http_post"));
  assert.ok(sql.includes("status in ('pending', 'failed')"));
  assert.ok(!sql.includes("b94e1e72"), "No runtime token may be committed");
});
