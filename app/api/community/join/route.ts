import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    return NextResponse.json(
      { ok: false, message: "Community signup is temporarily unavailable." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: legitimate clients leave this empty.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true, status: "accepted" });
  }

  const payload = {
    name: typeof body.name === "string" ? body.name : "",
    email: typeof body.email === "string" ? body.email : "",
    preferred_language: body.preferred_language === "es" ? "es" : "en",
    consent_accepted: body.consent_accepted === true,
    source_page: typeof body.source_page === "string" ? body.source_page : "asc3nd.org/home",
  };

  const response = await fetch(`${url}/rest/v1/rpc/asc3nd_join_community`, {
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
        : "We could not save your signup. Please try again.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }

  return NextResponse.json(data);
}
