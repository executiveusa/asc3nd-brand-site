import { createClient } from "npm:@supabase/supabase-js@2";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

function defaultSecretKey(): string | null {
  const modern = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (modern) {
    try {
      const parsed = JSON.parse(modern);
      if (parsed?.default) return parsed.default;
    } catch {
      // fall through to legacy service-role key
    }
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || null;
}

function defaultPublishableKey(): string | null {
  const modern = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
  if (modern) {
    try {
      const parsed = JSON.parse(modern);
      if (parsed?.default) return parsed.default;
    } catch {
      // fall through to legacy anon key
    }
  }
  return Deno.env.get("SUPABASE_ANON_KEY") || null;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderEmail(body: string, unsubscribeUrl: string) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((part) => `<p style="margin:0 0 16px;line-height:1.6">${escapeHtml(part).replaceAll("\n", "<br>")}</p>`)
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#f5f2e8;color:#120f0b;font-family:Arial,sans-serif"><div style="max-width:640px;margin:0 auto;padding:36px 24px"><div style="font-weight:800;letter-spacing:.08em;margin-bottom:28px">ASC3ND</div>${paragraphs}<hr style="border:0;border-top:1px solid #d9d4c8;margin:32px 0 20px"><p style="font-size:12px;line-height:1.5;color:#625e56">You are receiving this because you explicitly opted in to this category of ASC3ND email. <a href="${unsubscribeUrl}" style="color:#120f0b">Unsubscribe from these updates</a>.</p></div></body></html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKey = defaultPublishableKey();
  const secretKey = defaultSecretKey();
  const authorization = req.headers.get("authorization");

  if (!supabaseUrl || !publishableKey || !secretKey || !authorization) {
    return json({ ok: false, error: "runtime_not_configured" }, 500);
  }

  const userClient = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: authorized, error: authError } = await userClient.rpc("asc3nd_email_worker_authorized");
  if (authError || authorized !== true) return json({ ok: false, error: "forbidden" }, 403);

  const resendKey = Deno.env.get("RESEND_API_KEY");
  const fromEmail = Deno.env.get("ASC3ND_FROM_EMAIL");
  const publicSite = (Deno.env.get("ASC3ND_PUBLIC_SITE_URL") || "https://asc3nd.org").replace(/\/$/, "");

  // Hard fail before claiming anything when provider credentials are absent.
  if (!resendKey || !fromEmail) {
    return json({
      ok: false,
      configured: false,
      provider: "resend",
      missing: [!resendKey ? "RESEND_API_KEY" : null, !fromEmail ? "ASC3ND_FROM_EMAIL" : null].filter(Boolean),
    }, 503);
  }

  let requested = 10;
  try {
    const payload = await req.json();
    if (Number.isInteger(payload?.limit)) requested = Math.min(25, Math.max(1, payload.limit));
  } catch {
    // empty body is valid
  }

  const admin = createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: rows, error: claimError } = await admin.rpc("asc3nd_worker_claim_outbox", {
    p_limit: requested,
    p_provider: "resend",
  });

  if (claimError) return json({ ok: false, error: "claim_failed", detail: claimError.message }, 500);

  const results: Array<Record<string, unknown>> = [];
  for (const row of rows || []) {
    const unsubscribeUrl = `${publicSite}/unsubscribe?token=${encodeURIComponent(row.unsubscribe_token)}`;
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `asc3nd-outbox-${row.outbox_id}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [row.to_email],
          subject: row.subject,
          text: `${row.body}\n\nUnsubscribe from these updates: ${unsubscribeUrl}`,
          html: renderEmail(row.body, unsubscribeUrl),
          headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
        }),
      });

      const providerBody = await response.json().catch(() => ({}));
      if (!response.ok) {
        const providerError = JSON.stringify(providerBody).slice(0, 900);
        await admin.rpc("asc3nd_worker_mark_outbox_failed", {
          p_outbox_id: row.outbox_id,
          p_error: `resend ${response.status}: ${providerError}`,
        });
        results.push({ outbox_id: row.outbox_id, ok: false, status: response.status });
        continue;
      }

      const providerMessageId = providerBody?.id || null;
      const { error: markError } = await admin.rpc("asc3nd_worker_mark_outbox_sent", {
        p_outbox_id: row.outbox_id,
        p_provider_message_id: providerMessageId,
      });
      if (markError) throw new Error(`provider sent but ledger update failed: ${markError.message}`);

      results.push({ outbox_id: row.outbox_id, ok: true, provider_message_id: providerMessageId });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await admin.rpc("asc3nd_worker_mark_outbox_failed", {
        p_outbox_id: row.outbox_id,
        p_error: message,
      }).catch(() => undefined);
      results.push({ outbox_id: row.outbox_id, ok: false, error: message });
    }
  }

  return json({
    ok: true,
    configured: true,
    provider: "resend",
    claimed: (rows || []).length,
    sent: results.filter((item) => item.ok === true).length,
    failed: results.filter((item) => item.ok !== true).length,
    results,
  });
});
