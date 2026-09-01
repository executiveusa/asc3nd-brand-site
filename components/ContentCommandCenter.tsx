"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, RefreshCw, Send, Users } from "lucide-react";
import { createAsc3ndBrowserClient } from "@/lib/supabase-client";
import styles from "@/app/staff/staff.module.css";

type ContentDrop = {
  id: string;
  title: string;
  slug: string;
  route_key: string;
  required_consent_purpose: string;
  channel: string;
  status: string;
  approved_at: string | null;
  created_at: string;
  proposed_count: number;
  approved_count: number;
  sent_count: number;
  replied_count: number;
  suppressed_count: number;
};

type Delivery = {
  id: string;
  person_id: string;
  display_name: string;
  primary_email: string | null;
  status: string;
  eligibility_reason: string | null;
  consent_snapshot: Record<string, unknown> | null;
  personalization: Record<string, unknown> | null;
  approved_at: string | null;
  sent_at: string | null;
  replied_at: string | null;
  outbox_status: string | null;
  outbox_provider: string | null;
};

const routes = ["family", "updates", "volunteer", "mentor", "supplies", "sponsor", "partner"];

export function ContentCommandCenter() {
  const supabase = useMemo(() => createAsc3ndBrowserClient(), []);
  const [signedIn, setSignedIn] = useState(false);
  const [drops, setDrops] = useState<ContentDrop[]>([]);
  const [selected, setSelected] = useState<ContentDrop | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [route, setRoute] = useState("updates");
  const [purpose, setPurpose] = useState("ongoing_asc3nd_updates");
  const [body, setBody] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function loadDrops() {
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.rpc("asc3nd_staff_content_drops");
    const next = (data as ContentDrop[] | null) || [];
    setDrops(next);
    if (selected) setSelected(next.find((item) => item.id === selected.id) || null);
    setMessage(error ? error.message : "");
    setLoading(false);
  }

  async function loadDeliveries(contentDropId: string) {
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.rpc("asc3nd_staff_content_deliveries", {
      p_content_drop_id: contentDropId,
    });
    setDeliveries((data as Delivery[] | null) || []);
    setMessage(error ? error.message : "");
    setLoading(false);
  }

  useEffect(() => {
    if (signedIn) void loadDrops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn]);

  async function createDraft(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.rpc("asc3nd_create_content_drop", {
      p_title: title,
      p_route_key: route,
      p_required_consent_purpose: purpose,
      p_body: body || null,
      p_channel: "email",
    });
    if (error) setMessage(error.message);
    else {
      setTitle("");
      setBody("");
      setMessage("Draft created. It cannot prepare an audience until a human approves it.");
      await loadDrops();
    }
    setLoading(false);
  }

  async function approveDrop(drop: ContentDrop) {
    setLoading(true);
    const { error } = await supabase.rpc("asc3nd_approve_content_drop", { p_content_drop_id: drop.id });
    setMessage(error ? error.message : "Content approved. Audience preparation is now allowed.");
    await loadDrops();
    setLoading(false);
  }

  async function prepareAudience(drop: ContentDrop) {
    setLoading(true);
    const { data, error } = await supabase.rpc("asc3nd_prepare_content_audience", { p_content_drop_id: drop.id });
    setMessage(error ? error.message : `Audience prepared: ${JSON.stringify(data)}`);
    await loadDrops();
    await loadDeliveries(drop.id);
    setLoading(false);
  }

  async function approveDelivery(delivery: Delivery) {
    setLoading(true);
    const { error } = await supabase.rpc("asc3nd_approve_content_delivery", { p_delivery_id: delivery.id });
    setMessage(error ? error.message : "Recipient approved. Consent will be checked again when this delivery is queued.");
    if (selected) await loadDeliveries(selected.id);
    await loadDrops();
    setLoading(false);
  }

  async function queueDelivery(delivery: Delivery) {
    setLoading(true);
    const { error } = await supabase.rpc("asc3nd_queue_approved_delivery", {
      p_delivery_id: delivery.id,
      p_provider: "unconfigured",
    });
    setMessage(error ? error.message : "Queued after a fresh consent check. No network send will occur until an email provider is configured.");
    if (selected) await loadDeliveries(selected.id);
    await loadDrops();
    setLoading(false);
  }

  if (!signedIn) {
    return (
      <section className={styles.contentSection}>
        <div className={styles.sectionEyebrow}>Content command center</div>
        <p className={styles.notice}>Sign in above to review consent-aware content and recipient approvals.</p>
      </section>
    );
  }

  return (
    <section className={styles.contentSection} aria-labelledby="content-command-title">
      <div className={styles.contentHeader}>
        <div>
          <span className={styles.sectionEyebrow}>ICM Memory · communications</span>
          <h2 id="content-command-title">Content Command Center</h2>
        </div>
        <button type="button" className={styles.outlineButton} onClick={loadDrops} disabled={loading}>
          <RefreshCw size={16} aria-hidden="true" /> Refresh
        </button>
      </div>

      <div className={styles.commandGrid}>
        <form className={styles.contentComposer} onSubmit={createDraft}>
          <span className={styles.sectionEyebrow}>New draft</span>
          <label htmlFor="content-title">Title</label>
          <input id="content-title" required value={title} onChange={(event) => setTitle(event.target.value)} />
          <div className={styles.formPair}>
            <div>
              <label htmlFor="content-route">Audience route</label>
              <select id="content-route" value={route} onChange={(event) => setRoute(event.target.value)}>
                {routes.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="content-purpose">Required consent purpose</label>
              <input id="content-purpose" required value={purpose} onChange={(event) => setPurpose(event.target.value)} />
            </div>
          </div>
          <label htmlFor="content-body">Draft body</label>
          <textarea id="content-body" rows={7} value={body} onChange={(event) => setBody(event.target.value)} />
          <button type="submit" className={styles.primaryButton} disabled={loading}>Create draft</button>
          <small>Creating a draft never prepares recipients and never sends.</small>
        </form>

        <div className={styles.contentList}>
          <span className={styles.sectionEyebrow}>Review queue</span>
          {drops.map((drop) => (
            <article key={drop.id} className={`${styles.contentCard} ${selected?.id === drop.id ? styles.contentCardActive : ""}`}>
              <button type="button" className={styles.cardSelect} onClick={() => { setSelected(drop); void loadDeliveries(drop.id); }}>
                <strong>{drop.title}</strong>
                <span>{drop.route_key} · {drop.channel}</span>
                <small>Consent: {drop.required_consent_purpose}</small>
              </button>
              <div className={styles.cardStats}>
                <span>{drop.status}</span>
                <span>{drop.proposed_count} proposed</span>
                <span>{drop.approved_count} approved</span>
                <span>{drop.sent_count} sent</span>
              </div>
              <div className={styles.cardActions}>
                {drop.status === "draft" ? (
                  <button type="button" onClick={() => approveDrop(drop)} disabled={loading}><Check size={15} aria-hidden="true" /> Approve content</button>
                ) : null}
                {drop.status === "approved" ? (
                  <button type="button" onClick={() => prepareAudience(drop)} disabled={loading}><Users size={15} aria-hidden="true" /> Prepare audience</button>
                ) : null}
              </div>
            </article>
          ))}
          {!loading && drops.length === 0 ? <p className={styles.empty}>No content drops yet.</p> : null}
        </div>
      </div>

      {selected ? (
        <div className={styles.recipientPanel}>
          <div className={styles.contentHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Recipient review</span>
              <h3>{selected.title}</h3>
            </div>
            <strong>{deliveries.length} visible</strong>
          </div>
          <div className={styles.recipientList}>
            {deliveries.map((delivery) => {
              const consent = delivery.consent_snapshot || {};
              return (
                <div key={delivery.id} className={styles.recipientRow}>
                  <div>
                    <strong>{delivery.display_name}</strong>
                    <small>{delivery.primary_email || "No email"}</small>
                  </div>
                  <div>
                    <span className={styles.pill}>{delivery.status}</span>
                    <small>{String(consent.purpose || "consent purpose unavailable")}</small>
                  </div>
                  <div>
                    <small>{delivery.eligibility_reason || "—"}</small>
                    {delivery.outbox_status ? <small>Outbox: {delivery.outbox_status} · {delivery.outbox_provider || "unconfigured"}</small> : null}
                  </div>
                  <div>
                    {delivery.status === "proposed" ? (
                      <button type="button" className={styles.outlineButton} onClick={() => approveDelivery(delivery)} disabled={loading}>
                        <Check size={14} aria-hidden="true" /> Approve recipient
                      </button>
                    ) : null}
                    {delivery.status === "approved" ? (
                      <button type="button" className={styles.outlineButton} onClick={() => queueDelivery(delivery)} disabled={loading}>
                        <Send size={14} aria-hidden="true" /> Queue after consent recheck
                      </button>
                    ) : null}
                    {delivery.status !== "proposed" && delivery.status !== "approved" ? <span>{delivery.status}</span> : null}
                  </div>
                </div>
              );
            })}
            {!loading && deliveries.length === 0 ? <p className={styles.empty}>No recipients prepared for this content yet.</p> : null}
          </div>
        </div>
      ) : null}

      {message ? <p className={styles.notice}>{message}</p> : null}
    </section>
  );
}
