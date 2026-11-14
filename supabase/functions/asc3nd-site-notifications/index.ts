import { createClient } from "npm:@supabase/supabase-js@2";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

function secretKey() {
  const modern = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (modern) {
    try {
      const parsed = JSON.parse(modern);
      if (parsed?.default) return parsed.default;
    } catch {
      // Fall through to legacy service-role key.
    }
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || null;
}

function subject(kind: string, payload: Record<string, unknown>) {
  if (kind === "community_signup") {
    return `ASC3ND website signup — ${payload.name || "New subscriber"}`;
  }
  const label = payload.form_type || payload.route_key || "take-part";
  return `ASC3ND website ${label} submission — ${payload.name || "New contact"}`;
}

function bodyText(kind: string, payload: Record<string, unknown>) {
  const answers = payload.answers && typeof payload.answers === "object" && !Array.isArray(payload.answers)
    ? payload.answers as Record<string, unknown>
    : null;

  return [
    `Type: ${kind}`,
    `Name: ${payload.name || ""}`,
    `Email: ${payload.email || ""}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.organization_name ? `Organization: ${payload.organization_name}` : null,
    payload.route_key ? `Route: ${payload.route_key}` : null,
    payload.form_type ? `Form: ${payload.form_type}` : null,
    payload.preferred_language ? `Language: ${payload.preferred_language}` : null,
    payload.source_page || payload.source ? `Source: ${payload.source_page || payload.source}` : null,
    answers && Object.keys(answers).length
      ? `Answers:\n${Object.entries(answers).map(([key, value]) => `- ${key}: ${value}`).join("\n")}`
      : null,
    payload.occurred_at || payload.created_at ? `Received: ${payload.occurred_at || payload.created_at}` : null,
  ].filter(Boolean).join("\n");
}

Deno.serve(async (request) => {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const fromEmail = Deno.env.get("ASC3ND_FROM_EMAIL") || "social@asc3nd.org";

  if (request.method === "GET") {
    return json({
      ok: true,
      configured: Boolean(resendKey),
      provider: "resend",
      recipient: "main@asc3nd.org",
      from_email: fromEmail,
      missing: resendKey ? [] : ["RESEND_API_KEY"],
    });
  }

  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  if (!resendKey) return json({ ok: false, configured: false, missing: ["RESEND_API_KEY"] }, 503);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const key = secretKey();
  if (!supabaseUrl || !key) return json({ ok: false, error: "supabase_runtime_not_configured" }, 500);

  const admin = createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: rows, error: claimError } = await admin
    .schema("asc3nd_private")
    .rpc("claim_site_notifications", { p_limit: 10 });

  if (claimError) return json({ ok: false, error: "claim_failed", detail: claimError.message }, 500);

  const results: Array<Record<string, unknown>> = [];

  for (const row of rows || []) {
    const payload = (row.payload || {}) as Record<string, unknown>;
    const text = bodyText(row.kind, payload);
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `asc3nd-site-${row.id}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: ["main@asc3nd.org"],
          reply_to: payload.email || undefined,
          subject: subject(row.kind, payload),
          text,
          html: `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;padding:24px"><h2>ASC3ND website submission</h2><pre style="white-space:pre-wrap;font:14px/1.55 Arial,sans-serif">${escapeHtml(text)}</pre></div>`,
        }),
      });

      const providerBody = await response.json().catch(() => ({}));
      if (!response.ok) {
        await admin.schema("asc3nd_private").rpc("mark_site_notification_failed", {
          p_id: row.id,
          p_error: `resend ${response.status}: ${JSON.stringify(providerBody).slice(0, 700)}`,
        });
        results.push({ id: row.id, ok: false, status: response.status });
        continue;
      }

      await admin.schema("asc3nd_private").rpc("mark_site_notification_sent", { p_id: row.id });
      results.push({ id: row.id, ok: true, provider_message_id: providerBody?.id || null });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await admin.schema("asc3nd_private").rpc("mark_site_notification_failed", {
        p_id: row.id,
        p_error: message,
      });
      results.push({ id: row.id, ok: false, error: message });
    }
  }

  return json({
    ok: true,
    configured: true,
    recipient: "main@asc3nd.org",
    processed: results.length,
    sent: results.filter((item) => item.ok === true).length,
    failed: results.filter((item) => item.ok !== true).length,
    results,
  });
});
