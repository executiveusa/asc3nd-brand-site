import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CANONICAL_SUPABASE_URL = "https://cyxdevcjycmffhmwxojh.supabase.co";
const CANONICAL_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_PoqI-3PsCqewtJWJ0Z73Ag_5hIE0oKI";

export async function POST(request: Request) {
  const url = process.env.SUPABASE_URL ?? CANONICAL_SUPABASE_URL;
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? CANONICAL_SUPABASE_PUBLISHABLE_KEY;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true, status: "accepted" });
  }

  const payload = {
    name: typeof body.name === "string" ? body.name : "",
    email: typeof body.email === "string" ? body.email : "",
    phone: typeof body.phone === "string" ? body.phone : "",
    organization_name:
      typeof body.organization_name === "string" ? body.organization_name : "",
    route_key: typeof body.route_key === "string" ? body.route_key : "",
    form_type: typeof body.form_type === "string" ? body.form_type : "",
    preferred_language: body.preferred_language === "es" ? "es" : "en",
    answers:
      body.answers && typeof body.answers === "object" && !Array.isArray(body.answers)
        ? body.answers
        : {},
    contact_consent: body.contact_consent === true,
    updates_opt_in: body.updates_opt_in === true,
    idempotency_key:
      typeof body.idempotency_key === "string" ? body.idempotency_key : "",
    source_page:
      typeof body.source_page === "string" ? body.source_page : "asc3nd.org/take-part",
  };

  const response = await fetch(`${url}/rest/v1/rpc/asc3nd_submit_participation`, {
    method: "POST",
    headers: {
      apikey: publishableKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_payload: payload }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "We could not save your information. Please try again.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }

  return NextResponse.json(data);
}
