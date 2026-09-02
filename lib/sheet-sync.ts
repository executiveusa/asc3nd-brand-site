import { createSign } from "node:crypto";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://cyxdevcjycmffhmwxojh.supabase.co";
const SHEET_ID = process.env.ASC3ND_GOOGLE_SHEET_ID ?? "1AINRICsxDODe9lwKKScjjUYZTRoL36B4QPsc05OU09M";
const RANGE = "'Website Intake'!A:R";

type ServiceAccount = { client_email: string; private_key: string };

type IntakeRow = {
  id: string;
  person_id: string | null;
  route_key: string;
  form_type: string;
  name: string;
  email: string;
  phone: string | null;
  organization_name: string | null;
  preferred_language: string;
  answers: Record<string, unknown>;
  contact_consent: boolean;
  updates_opt_in: boolean;
  status: string;
  sheet_sync_status: string;
  created_at: string;
};

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64").replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function getServiceAccount(): ServiceAccount {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not configured.");
  const parsed = JSON.parse(raw) as Partial<ServiceAccount>;
  if (!parsed.client_email || !parsed.private_key) throw new Error("Google service account JSON is incomplete.");
  return { client_email: parsed.client_email, private_key: parsed.private_key.replaceAll("\\n", "\n") };
}

async function getGoogleAccessToken() {
  const service = getServiceAccount();
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({
    iss: service.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = base64url(signer.sign(service.private_key));
  const assertion = `${unsigned}.${signature}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => null) as { access_token?: string; error_description?: string } | null;
  if (!response.ok || !data?.access_token) throw new Error(data?.error_description || "Google authentication failed.");
  return data.access_token;
}

function serviceKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  return key;
}

async function rpc<T>(name: string, args: Record<string, unknown>) {
  const key = serviceKey();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || `${name} failed.`);
  return data as T;
}

function sheetRow(row: IntakeRow) {
  const a = row.answers || {};
  return [
    row.id,
    row.created_at,
    row.route_key,
    row.form_type,
    row.name,
    row.email,
    row.phone ?? "",
    row.organization_name ?? "",
    row.preferred_language,
    row.status,
    String(a.primary_goal ?? ""),
    String(a.availability ?? ""),
    String(a.experience ?? ""),
    String(a.message ?? a.support_needed ?? a.partnership_type ?? ""),
    row.contact_consent ? "YES" : "NO",
    row.updates_opt_in ? "YES" : "NO",
    row.person_id ?? "",
    "synced",
  ];
}

async function getExistingSubmissionIds(token: string) {
  const range = encodeURIComponent("'Website Intake'!A2:A");
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (response.status === 404) throw new Error("Website Intake sheet tab was not found.");
  const data = await response.json().catch(() => null) as { values?: string[][]; error?: { message?: string } } | null;
  if (!response.ok) throw new Error(data?.error?.message || "Could not read Google Sheet mirror.");
  return new Set((data?.values || []).flat().filter(Boolean));
}

async function appendRows(token: string, rows: IntakeRow[]) {
  if (!rows.length) return;
  const range = encodeURIComponent(RANGE);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ majorDimension: "ROWS", values: rows.map(sheetRow) }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => null) as { error?: { message?: string } } | null;
  if (!response.ok) throw new Error(data?.error?.message || "Google Sheet append failed.");
}

export async function syncParticipationSheet(limit = 100) {
  const claimed = await rpc<IntakeRow[]>("asc3nd_worker_claim_sheet_sync", { p_limit: limit });
  if (!claimed.length) return { claimed: 0, appended: 0, alreadyPresent: 0, synced: 0 };
  const ids = claimed.map((row) => row.id);

  try {
    const token = await getGoogleAccessToken();
    const existing = await getExistingSubmissionIds(token);
    const alreadyPresent = claimed.filter((row) => existing.has(row.id));
    const toAppend = claimed.filter((row) => !existing.has(row.id));
    await appendRows(token, toAppend);
    const synced = await rpc<number>("asc3nd_worker_mark_sheet_synced", { p_ids: ids });
    return { claimed: claimed.length, appended: toAppend.length, alreadyPresent: alreadyPresent.length, synced };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sheet sync failed.";
    await rpc<number>("asc3nd_worker_mark_sheet_failed", { p_ids: ids, p_error: message }).catch(() => null);
    throw error;
  }
}
