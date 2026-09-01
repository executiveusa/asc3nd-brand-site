import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CANONICAL_SUPABASE_URL = "https://cyxdevcjycmffhmwxojh.supabase.co";
const CANONICAL_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_PoqI-3PsCqewtJWJ0Z73Ag_5hIE0oKI";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const url = process.env.SUPABASE_URL ?? CANONICAL_SUPABASE_URL;
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? CANONICAL_SUPABASE_PUBLISHABLE_KEY;

  const contentType = request.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  let token = "";

  try {
    if (isJson) {
      const body = await request.json();
      token = typeof body?.token === "string" ? body.token.trim() : "";
    } else {
      const form = await request.formData();
      token = typeof form.get("token") === "string" ? String(form.get("token")).trim() : "";
    }
  } catch {
    token = "";
  }

  if (!UUID_PATTERN.test(token)) {
    if (!isJson) return NextResponse.redirect(new URL("/unsubscribe?status=invalid", request.url), 303);
    return NextResponse.json({ ok: false, status: "invalid" }, { status: 400 });
  }

  const response = await fetch(`${url}/rest/v1/rpc/asc3nd_unsubscribe`, {
    method: "POST",
    headers: {
      apikey: publishableKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_token: token }),
    cache: "no-store",
  });

  if (!response.ok) {
    if (!isJson) return NextResponse.redirect(new URL("/unsubscribe?status=error", request.url), 303);
    return NextResponse.json({ ok: false, status: "error" }, { status: 400 });
  }

  const data = await response.json().catch(() => ({ ok: true, status: "processed" }));
  if (!isJson) return NextResponse.redirect(new URL("/unsubscribe?status=done", request.url), 303);
  return NextResponse.json(data);
}
