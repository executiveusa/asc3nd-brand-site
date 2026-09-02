"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, RefreshCw, RotateCw } from "lucide-react";
import { createAsc3ndBrowserClient } from "@/lib/supabase-client";
import styles from "@/app/staff/staff.module.css";

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

const routeOptions = ["all", "family", "volunteer", "mentor", "partner", "sponsor", "supplies"] as const;
const EXPORT_PAGE_SIZE = 1000;
const EXPORT_HARD_LIMIT = 25000;

function csvCell(value: unknown) {
  const text = value == null ? "" : typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCsv(rows: IntakeRow[], route: string) {
  const headers = ["Submission ID","Created","Route","Form Type","Name","Email","Phone","Organization","Language","Status","Primary Goal","Availability","Experience / Skills","Message","Contact Consent","Updates Opt-In","Supabase Person ID","Sheet Sync Status"];
  const body = rows.map((row) => {
    const a = row.answers || {};
    return [row.id,row.created_at,row.route_key,row.form_type,row.name,row.email,row.phone,row.organization_name,row.preferred_language,row.status,a.primary_goal,a.availability,a.experience,a.message ?? a.support_needed ?? a.partnership_type,row.contact_consent,row.updates_opt_in,row.person_id,row.sheet_sync_status].map(csvCell).join(",");
  });
  const csv = `\uFEFF${[headers.map(csvCell).join(","), ...body].join("\r\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().replaceAll(":", "-").replace(".", "-");
  link.href = url;
  link.download = `asc3nd-website-intake-${route}-${stamp}.csv`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    link.remove();
    URL.revokeObjectURL(url);
  }, 0);
}

export function ParticipationIntakeDashboard() {
  const supabase = useMemo(() => createAsc3ndBrowserClient(), []);
  const [signedIn, setSignedIn] = useState(false);
  const [route, setRoute] = useState<(typeof routeOptions)[number]>("all");
  const [rows, setRows] = useState<IntakeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function fetchPage(nextRoute: typeof route, offset: number) {
    return supabase.rpc("asc3nd_staff_participation_intakes", {
      p_route_key: nextRoute === "all" ? null : nextRoute,
      p_limit: EXPORT_PAGE_SIZE,
      p_offset: offset,
    });
  }

  async function load(nextRoute = route) {
    if (!signedIn) return;
    setLoading(true);
    setMessage("");
    const { data, error } = await fetchPage(nextRoute, 0);
    setRows((data as IntakeRow[] | null) || []);
    setMessage(error ? error.message : "");
    setLoading(false);
  }

  async function exportAll() {
    if (!signedIn || exporting) return;
    setExporting(true);
    setMessage("Preparing a fresh export from Supabase…");
    try {
      const all: IntakeRow[] = [];
      for (let offset = 0; offset < EXPORT_HARD_LIMIT; offset += EXPORT_PAGE_SIZE) {
        const { data, error } = await fetchPage(route, offset);
        if (error) throw error;
        const page = (data as IntakeRow[] | null) || [];
        all.push(...page);
        if (page.length < EXPORT_PAGE_SIZE) break;
      }
      if (!all.length) {
        setMessage("There are no visible submissions to export for this filter.");
        return;
      }
      if (all.length >= EXPORT_HARD_LIMIT) {
        throw new Error(`Export safety limit reached at ${EXPORT_HARD_LIMIT.toLocaleString()} rows. Narrow the route filter before exporting.`);
      }
      downloadCsv(all, route);
      setMessage(`Exported ${all.length.toLocaleString()} current Supabase submission${all.length === 1 ? "" : "s"}.`);
    } catch (error) {
      setMessage(error instanceof Error ? `Export failed: ${error.message}` : "Export failed. Refresh and try again.");
    } finally {
      setExporting(false);
    }
  }

  async function syncSheet() {
    if (!signedIn || syncing) return;
    setSyncing(true);
    setMessage("Syncing pending website intake to the Google Sheet mirror…");
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Your staff session expired. Sign in again.");
      const response = await fetch("/api/admin/sheet-sync", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Sheet sync failed.");
      setMessage(data?.message || "Google Sheet sync completed.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sheet sync failed.");
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => { if (signedIn) void load(route); }, [signedIn, route]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!signedIn) return null;

  const synced = rows.filter((r) => r.sheet_sync_status === "synced").length;
  const pending = rows.filter((r) => r.sheet_sync_status === "pending" || r.sheet_sync_status === "failed").length;

  return (
    <section className={styles.contentSection}>
      <div className={styles.contentHeader}>
        <div><p className={styles.sectionEyebrow}>Website intake</p><h2>Take Part submissions</h2></div>
        <div className={styles.actions}>
          <button className={styles.outlineButton} type="button" onClick={() => load()} disabled={loading}><RefreshCw size={16} /> Refresh</button>
          <button className={styles.outlineButton} type="button" onClick={syncSheet} disabled={syncing}><RotateCw size={16} /> {syncing ? "Syncing…" : "Sync Sheet"}</button>
          <button className={styles.primaryButton} type="button" onClick={exportAll} disabled={exporting}><Download size={16} /> {exporting ? "Preparing…" : "Export CSV"}</button>
        </div>
      </div>
      <div className={styles.routes} role="tablist" aria-label="Website intake routes">
        {routeOptions.map((item) => <button className={item === route ? styles.activeRoute : styles.outlineButton} key={item} type="button" onClick={() => setRoute(item)}>{item === "all" ? "All intake" : item}</button>)}
      </div>
      {message ? <p className={styles.notice}>{message}</p> : null}
      <div className={styles.queueHeader}><div><span>Canonical Supabase intake</span><h2>{loading ? "Loading…" : `${rows.length} latest submissions`}</h2></div><strong>Sheet: {synced} synced · {pending} pending</strong></div>
      <div className={styles.tableWrap}>
        <table>
          <thead><tr><th>Submitted</th><th>Person</th><th>Route</th><th>Organization</th><th>What they told us</th><th>Consent</th><th>Sheet</th></tr></thead>
          <tbody>
            {rows.map((row) => <tr key={row.id}>
              <td><span>{new Date(row.created_at).toLocaleDateString()}</span><small>{row.form_type}</small></td>
              <td><strong>{row.name}</strong><span>{row.email}</span><small>{row.phone || "No phone"}</small></td>
              <td><span className={styles.pill}>{row.route_key}</span><small>{row.status}</small></td>
              <td>{row.organization_name || "—"}</td>
              <td><span>{String(row.answers?.primary_goal || row.answers?.support_needed || row.answers?.partnership_type || row.answers?.message || "—")}</span><small>{String(row.answers?.availability || row.answers?.experience || "")}</small></td>
              <td><span>Follow-up: {row.contact_consent ? "yes" : "no"}</span><small>Updates: {row.updates_opt_in ? "yes" : "no"}</small></td>
              <td><span className={styles.pill}>{row.sheet_sync_status}</span></td>
            </tr>)}
            {!loading && rows.length === 0 ? <tr><td colSpan={7} className={styles.empty}>No website intake submissions are visible for this route.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
