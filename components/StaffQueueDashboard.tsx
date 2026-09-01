"use client";

import { useEffect, useMemo, useState } from "react";
import { LogOut, RefreshCw, Send } from "lucide-react";
import { createAsc3ndBrowserClient } from "@/lib/supabase-client";
import styles from "@/app/staff/staff.module.css";

const routes = [
  ["family", "Families"],
  ["updates", "Updates"],
  ["volunteer", "Volunteers"],
  ["mentor", "Mentors"],
  ["supplies", "Supplies"],
  ["sponsor", "Sponsors"],
  ["partner", "Partners"],
] as const;

type QueueRow = {
  person_id: string;
  display_name: string;
  preferred_name: string | null;
  primary_email: string | null;
  primary_phone: string | null;
  preferred_language: string;
  route_key: string;
  route_status: string;
  route_assigned_to: string | null;
  task_id: string | null;
  task_type: string | null;
  task_status: string | null;
  task_priority: string | null;
  task_due_at: string | null;
  consent_email_updates: string | null;
  last_touchpoint_at: string | null;
};

export function StaffQueueDashboard() {
  const supabase = useMemo(() => createAsc3ndBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [route, setRoute] = useState<(typeof routes)[number][0]>("family");
  const [rows, setRows] = useState<QueueRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function requestMagicLink(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const redirectTo = `${window.location.origin}/staff`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    setMessage(error ? error.message : "Check your email for the ASC3ND staff sign-in link.");
  }

  async function loadQueue(nextRoute = route) {
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.rpc("asc3nd_staff_queue", {
      p_route_key: nextRoute,
      p_limit: 100,
      p_offset: 0,
    });
    setRows((data as QueueRow[] | null) || []);
    setMessage(error ? error.message : "");
    setLoading(false);
  }

  useEffect(() => {
    if (signedIn) void loadQueue(route);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn, route]);

  async function signOut() {
    await supabase.auth.signOut();
    setRows([]);
  }

  if (!signedIn) {
    return (
      <form className={styles.signIn} onSubmit={requestMagicLink}>
        <label htmlFor="staff-email">Staff email</label>
        <div className={styles.signInRow}>
          <input
            id="staff-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@asc3nd.org"
          />
          <button type="submit"><Send size={16} aria-hidden="true" /> Send sign-in link</button>
        </div>
        <p>{message || "Access is controlled by ASC3ND organization roles in Supabase."}</p>
      </form>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.toolbar}>
        <div className={styles.routes} role="tablist" aria-label="ICM relationship queues">
          {routes.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={route === key}
              className={route === key ? styles.activeRoute : undefined}
              onClick={() => setRoute(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={() => loadQueue()} disabled={loading}>
            <RefreshCw size={16} aria-hidden="true" /> Refresh
          </button>
          <button type="button" onClick={signOut}>
            <LogOut size={16} aria-hidden="true" /> Sign out
          </button>
        </div>
      </div>

      {message ? <p className={styles.notice}>{message}</p> : null}

      <div className={styles.queueHeader}>
        <div>
          <span>ICM route</span>
          <h2>{routes.find(([key]) => key === route)?.[1]}</h2>
        </div>
        <strong>{loading ? "Loading…" : `${rows.length} visible`}</strong>
      </div>

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Person</th>
              <th>Contact</th>
              <th>Consent</th>
              <th>Next task</th>
              <th>Priority</th>
              <th>Last touch</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.person_id}-${row.route_key}`}>
                <td>
                  <strong>{row.preferred_name || row.display_name}</strong>
                  <small>{row.preferred_language?.toUpperCase() || "EN"}</small>
                </td>
                <td>
                  <span>{row.primary_email || "No email"}</span>
                  <small>{row.primary_phone || "No phone"}</small>
                </td>
                <td><span className={styles.pill}>{row.consent_email_updates || "unknown"}</span></td>
                <td>
                  <span>{row.task_type || "No open task"}</span>
                  <small>{row.task_status || "—"}</small>
                </td>
                <td>{row.task_priority || "normal"}</td>
                <td>{row.last_touchpoint_at ? new Date(row.last_touchpoint_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No records are visible for this route. That can mean the queue is empty or your assigned role does not grant access.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
