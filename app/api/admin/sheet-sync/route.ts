import { NextResponse } from "next/server";
import { syncParticipationSheet } from "@/lib/sheet-sync";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://cyxdevcjycmffhmwxojh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_PoqI-3PsCqewtJWJ0Z73Ag_5hIE0oKI";

async function authorized(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return false;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/asc3nd_sheet_sync_authorized`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    body: "{}",
    cache: "no-store",
  });
  if (!response.ok) return false;
  return (await response.json().catch(() => false)) === true;
}

export async function POST(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ ok: false, message: "You do not have permission to sync the ASC3ND Sheet mirror." }, { status: 403 });
  }
  try {
    const result = await syncParticipationSheet(250);
    const message = result.claimed
      ? `Sheet sync complete: ${result.synced} confirmed, ${result.appended} appended, ${result.alreadyPresent} already present.`
      : "Sheet is already current. No pending website intake was found.";
    return NextResponse.json({ ok: true, ...result, message });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      message: error instanceof Error ? error.message : "Sheet sync failed.",
    }, { status: 503 });
  }
}
