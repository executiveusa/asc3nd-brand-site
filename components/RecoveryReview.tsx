"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, RefreshCw, Upload } from "lucide-react";
import { createAsc3ndBrowserClient } from "@/lib/supabase-client";
import styles from "@/app/staff/staff.module.css";

type RecoveryRow = {
  id: string;
  source_type: string;
  source_record_key: string;
  confirmation_code: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  preferred_language: string | null;
  relationship_interest: string | null;
  children_count: number | null;
  age_range: string | null;
  arrival_window: string | null;
  data_quality: string;
  review_required: boolean;
  review_status: "pending" | "verified" | "rejected" | "promoted";
  reviewed_at: string | null;
  promoted_person_id: string | null;
};

export function RecoveryReview() {
  const supabase = useMemo(() => createAsc3ndBrowserClient(), []);
  const [signedIn, setSignedIn] = useState(false);
  const [rows, setRows] = useState<RecoveryRow[]>([]);
  const [selected, setSelected] = useState<RecoveryRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("en");
  const [relationship, setRelationship] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  function edit(row: RecoveryRow) {
    setSelected(row);
    setName(row.name || "");
    setEmail(row.email || "");
    setPhone(row.phone || "");
    setLanguage(row.preferred_language === "es" ? "es" : "en");
    setRelationship(row.relationship_interest || "");
    setMessage("");
  }

  async function loadRows() {
    setLoading(true);
    const { data, error } = await supabase.rpc("asc3nd_staff_recovery_queue");
    const next = (data as RecoveryRow[] | null) || [];
    setRows(next);
    if (selected) {
      const refreshed = next.find((item) => item.id === selected.id) || null;
      if (refreshed) edit(refreshed);
      else setSelected(null);
    }
    setMessage(error ? error.message : "");
    setLoading(false);
  }

  useEffect(() => {
    if (signedIn) void loadRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn]);

  async function verifySelected() {
    if (!selected) return;
    setLoading(true);
    setMessage("");
    const { error } = await supabase.rpc("asc3nd_verify_import_contact", {
      p_id: selected.id,
      p_name: name,
      p_email: email || null,
      p_phone: phone || null,
      p_preferred_language: language,
      p_relationship_interest: relationship || null,
    });
    setMessage(error ? error.message : "Human verification recorded. This record may now be promoted into canonical ICM Identity.");
    await loadRows();
    setLoading(false);
  }

  async function promoteSelected() {
    if (!selected) return;
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.rpc("asc3nd_promote_import_contact", { p_id: selected.id });
    if (error) setMessage(error.message);
    else if (data?.status === "needs_identity_resolution") {
      setMessage("Promotion paused: exact email and phone point to different canonical people. An Identity resolution case was created for human review.");
    } else {
      setMessage("Promoted into ICM. Ongoing marketing permission was not granted; consent remains unknown until proof exists.");
    }
    await loadRows();
    setLoading(false);
  }

  if (!signedIn) {
    return (
      <section className={styles.contentSection}>
        <div className={styles.sectionEyebrow}>Historical recovery</div>
        <p className={styles.notice}>Sign in above to review recovered Community Cuts records.</p>
      </section>
    );
  }

  const pending = rows.filter((row) => row.review_status === "pending").length;
  const verified = rows.filter((row) => row.review_status === "verified").length;
  const promoted = rows.filter((row) => row.review_status === "promoted").length;

  return (
    <section className={styles.contentSection} aria-labelledby="recovery-title">
      <div className={styles.contentHeader}>
        <div>
          <span className={styles.sectionEyebrow}>ICM Identity · historical recovery</span>
          <h2 id="recovery-title">Recovery Review</h2>
          <div className={styles.cardStats}>
            <span>{pending} pending</span>
            <span>{verified} verified</span>
            <span>{promoted} promoted</span>
            <span>{rows.length} total</span>
          </div>
        </div>
        <button type="button" className={styles.outlineButton} onClick={loadRows} disabled={loading}>
          <RefreshCw size={16} aria-hidden="true" /> Refresh
        </button>
      </div>

      <div className={styles.commandGrid}>
        <div className={styles.contentList}>
          <span className={styles.sectionEyebrow}>Recovered records</span>
          {rows.map((row) => (
            <article key={row.id} className={`${styles.contentCard} ${selected?.id === row.id ? styles.contentCardActive : ""}`}>
              <button type="button" className={styles.cardSelect} onClick={() => edit(row)}>
                <strong>{row.name || "Unnamed recovered contact"}</strong>
                <span>{row.source_type.replaceAll("_", " ")} · {row.confirmation_code || row.source_record_key}</span>
                <small>{row.email || "No email"} · {row.phone || "No phone"}</small>
              </button>
              <div className={styles.cardStats}>
                <span>{row.review_status}</span>
                <span>{row.data_quality}</span>
              </div>
            </article>
          ))}
        </div>

        {selected ? (
          <div className={styles.contentComposer}>
            <span className={styles.sectionEyebrow}>Human verification</span>
            <label htmlFor="recovery-name">Name</label>
            <input id="recovery-name" value={name} onChange={(event) => setName(event.target.value)} disabled={selected.review_status === "promoted"} />
            <label htmlFor="recovery-email">Email</label>
            <input id="recovery-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={selected.review_status === "promoted"} />
            <label htmlFor="recovery-phone">Phone</label>
            <input id="recovery-phone" value={phone} onChange={(event) => setPhone(event.target.value)} disabled={selected.review_status === "promoted"} />
            <div className={styles.formPair}>
              <div>
                <label htmlFor="recovery-language">Language</label>
                <select id="recovery-language" value={language} onChange={(event) => setLanguage(event.target.value)} disabled={selected.review_status === "promoted"}>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              <div>
                <label htmlFor="recovery-relationship">Relationship / interests</label>
                <input id="recovery-relationship" value={relationship} onChange={(event) => setRelationship(event.target.value)} disabled={selected.review_status === "promoted"} />
              </div>
            </div>
            <div className={styles.cardStats}>
              {selected.children_count != null ? <span>{selected.children_count} children</span> : null}
              {selected.age_range ? <span>{selected.age_range}</span> : null}
              {selected.arrival_window ? <span>arrival {selected.arrival_window}</span> : null}
              <span>{selected.data_quality}</span>
            </div>
            {selected.review_status === "pending" ? (
              <button type="button" className={styles.primaryButton} onClick={verifySelected} disabled={loading}>
                <Check size={15} aria-hidden="true" /> Record human verification
              </button>
            ) : null}
            {selected.review_status === "verified" ? (
              <button type="button" className={styles.primaryButton} onClick={promoteSelected} disabled={loading}>
                <Upload size={15} aria-hidden="true" /> Promote to canonical ICM
              </button>
            ) : null}
            {selected.review_status === "promoted" ? (
              <small>Canonical person: {selected.promoted_person_id}. The source record remains preserved for provenance.</small>
            ) : null}
            <small>Promotion never grants ongoing marketing consent. Exact email/phone conflicts pause into Identity resolution instead of merging automatically.</small>
          </div>
        ) : (
          <div className={styles.contentComposer}>
            <span className={styles.sectionEyebrow}>Human verification</span>
            <p className={styles.notice}>Select a recovered record to verify it before promotion.</p>
          </div>
        )}
      </div>

      {message ? <p className={styles.notice}>{message}</p> : null}
    </section>
  );
}
