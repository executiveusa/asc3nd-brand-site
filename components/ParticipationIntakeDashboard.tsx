"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
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

function csvCell(value: unknown) {
  const text = value == null ? "" : typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCsv(rows: IntakeRow[]) {
  const headers = ["Submission ID","Created","Route","Form Type","Name","Email","Phone","Organization","Language","Status","Primary Goal","Availability","Experience / Skills","Message","Contact Consent","Updates Opt-In","Supabase Person ID","Sheet Sync Status"];
  const body = rows.map((row) => {
    const a = row.answers || {};
    return [row.id,row.created_at,row.route_key,row.form_type,row.name,row.email,row.phone,row.organization_name,row.preferred_language,row.status,a.primary_goal,a.availability,a.experience,a.message ?? a.support_needed ?? a.partnership_type,row.contact_consent,row.updates_opt_in,row.person_id,row.sheet_sync_status].map(csvCell).join(",");
  });
  const blob = new Blob([[headers.map(csvCell).join(","), ...body].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `asc3nd-website-intake-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function ParticipationIntakeDashboard() {
  const supabase = useMemo(() => createAsc3ndBrowserClient(), []);
  const [signedIn, setSignedIn] = useState(false);
  const [route, setRoute] = useState<(typeof routeOptions)[number]>("all");
  const [rows, setRows] = useState<IntakeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function load(nextRoute = route) {
    if (!signedIn) return;
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.rpc("asc3nd_staff_participation_intakes", {
      p_route_key: nextRoute === "all" ? null : nextRoute,
      p_limit: 1000,
      p_offset: 0,
    });
    setRows((data as IntakeRow[] | null) || []);
    setMessage(error ? error.message : "");
    setLoading(false);
  }

  useEffect(() => { if (signedIn) void load(route); }, [signedIn, route]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!signedIn) return null;

  return (
    <section className={styles.contentSection}>
      <div className={styles.contentHeader}>
        <div><p className={styles.sectionEyebrow}>Website intake</p><h2>Take Part submissions</h2></div>
        <div className={styles.actions}>
          <button className={styles.outlineButton} type="button" onClick={() => load()} disabled={loading}><RefreshCw size={16} /> Refresh</button>
          <button className={styles.primaryButton} type="button" onClick={() => downloadCsv(rows)} disabled={!rows.length}><Download size={16} /> Export CSV</button>
        </div>
      </div>
      <div className={styles.routes} role="tablist" aria-label="Website intake routes">
        {routeOptions.map((item) => <button className={item === route ? styles.activeRoute : styles.outlineButton} key={item} type="button" onClick={() => setRoute(item)}>{item === "all" ? "All intake" : item}</button>)}
      </div>
      {message ? <p className={styles.notice}>{message}</p> : null}
      <div className={styles.queueHeader}><div><span>Canonical Supabase intake</span><h2>{loading ? "Loading…" : `${rows.length} submissions`}</h2></div><strong>Sheet mirror: {rows.filter((r) => r.sheet_sync_status === "synced").length} synced</strong></div>
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
