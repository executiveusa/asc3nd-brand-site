"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/app/take-part/participation.module.css";

type Kind = "family" | "mentor-volunteer" | "partner";
type Props = { kind: Kind };

type Draft = {
  version: 1;
  kind: Kind;
  route: string;
  idempotencyKey: string;
  savedAt: string;
  fields: Record<string, string | boolean>;
};

const config = {
  family: {
    eyebrow: "Families",
    title: "Tell us what would help your family connect with ASC3ND.",
    intro: "This goes directly to the family follow-up queue so the right person can respond.",
    defaultRoute: "family",
  },
  "mentor-volunteer": {
    eyebrow: "Mentors + volunteers",
    title: "Tell us how you want to show up.",
    intro: "Choose mentoring or volunteering and your submission will route to the matching ASC3ND team queue.",
    defaultRoute: "volunteer",
  },
  partner: {
    eyebrow: "Community partners",
    title: "Tell us what kind of partnership you want to explore.",
    intro: "Partnership, sponsorship, and in-kind support are routed separately so the right team member can follow up.",
    defaultRoute: "partner",
  },
} as const;

function idempotencyKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function storageKey(kind: Kind) {
  return `asc3nd:take-part:draft:${kind}:v1`;
}

function collectFields(form: HTMLFormElement) {
  const fields: Record<string, string | boolean> = {};
  const controls = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input[name], textarea[name], select[name]");
  controls.forEach((control) => {
    if (!control.name || control.name === "website") return;
    if (control instanceof HTMLInputElement && control.type === "checkbox") fields[control.name] = control.checked;
    else fields[control.name] = control.value;
  });
  return fields;
}

function restoreFields(form: HTMLFormElement, fields: Draft["fields"]) {
  Object.entries(fields).forEach(([name, value]) => {
    const control = form.elements.namedItem(name);
    if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement)) return;
    if (control instanceof HTMLInputElement && control.type === "checkbox") control.checked = value === true;
    else control.value = typeof value === "string" ? value : "";
  });
}

export function ParticipationForm({ kind }: Props) {
  const copy = config[kind];
  const formRef = useRef<HTMLFormElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [submissionKey, setSubmissionKey] = useState(() => idempotencyKey());
  const [route, setRoute] = useState(copy.defaultRoute as string);
  const [status, setStatus] = useState("");
  const [draftStatus, setDraftStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const key = useMemo(() => storageKey(kind), [kind]);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return;
      const draft = JSON.parse(raw) as Draft;
      if (draft?.version !== 1 || draft.kind !== kind || !draft.fields) return;
      restoreFields(form, draft.fields);
      if (draft.route) setRoute(draft.route);
      if (draft.idempotencyKey) setSubmissionKey(draft.idempotencyKey);
      setDraftStatus(`Draft restored from ${new Date(draft.savedAt).toLocaleString()}.`);
    } catch {
      window.localStorage.removeItem(key);
    }
  }, [key, kind]);

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  function saveDraft() {
    const form = formRef.current;
    if (!form) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const draft: Draft = {
        version: 1,
        kind,
        route,
        idempotencyKey: submissionKey,
        savedAt: new Date().toISOString(),
        fields: collectFields(form),
      };
      try {
        window.localStorage.setItem(key, JSON.stringify(draft));
        setDraftStatus("Saved on this device.");
      } catch {
        setDraftStatus("Draft could not be saved on this device. Keep this page open until you submit.");
      }
    }, 250);
  }

  function clearDraft() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    try { window.localStorage.removeItem(key); } catch { /* local storage unavailable */ }
    setDraftStatus("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitting(true);
    setStatus("");
    saveDraft();

    const form = new FormData(formElement);
    const answers: Record<string, string> = {};
    ["primary_goal", "availability", "experience", "message", "child_age_range", "support_needed", "partnership_type"].forEach((field) => {
      const value = form.get(field);
      if (typeof value === "string" && value.trim()) answers[field] = value.trim();
    });

    try {
      const response = await fetch("/api/participation/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          organization_name: form.get("organization_name"),
          route_key: route,
          form_type: kind,
          preferred_language: form.get("preferred_language"),
          answers,
          contact_consent: form.get("contact_consent") === "on",
          updates_opt_in: form.get("updates_opt_in") === "on",
          website: form.get("website"),
          idempotency_key: submissionKey,
          source_page: `asc3nd.org/take-part/${kind}`,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setStatus(`${data?.message || "We could not save your information. Please try again."} Your answers are still saved on this device.`);
        saveDraft();
        return;
      }

      setStatus(data?.message || "Thank you. ASC3ND received your information.");
      clearDraft();
      formElement.reset();
      setRoute(copy.defaultRoute);
      setSubmissionKey(idempotencyKey());
    } catch {
      setStatus("We could not reach ASC3ND right now. Your answers are still saved on this device. Try again when your connection is back.");
      saveDraft();
    } finally {
      setSubmitting(false);
    }
  }

  function onRouteChange(nextRoute: string) {
    setRoute(nextRoute);
    queueMicrotask(saveDraft);
  }

  return (
    <section className={styles.wrap}>
      <div className={styles.intro}>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
      </div>

      <form ref={formRef} className={styles.form} onSubmit={submit} onInput={saveDraft} onChange={saveDraft}>
        <div className={styles.grid}>
          <label><span>Name</span><input name="name" required minLength={2} maxLength={100} autoComplete="name" /></label>
          <label><span>Email</span><input name="email" required type="email" autoComplete="email" /></label>
          <label><span>Phone</span><input name="phone" type="tel" autoComplete="tel" /></label>
          <label>
            <span>Preferred language</span>
            <select name="preferred_language" defaultValue="en"><option value="en">English</option><option value="es">Español</option></select>
          </label>
        </div>

        {kind === "family" ? (
          <>
            <label><span>Age range of child or children</span><select name="child_age_range" defaultValue=""><option value="">Choose one</option><option>Preschool</option><option>Elementary school</option><option>Middle school</option><option>High school</option><option>Mixed ages</option></select></label>
            <label><span>What would be most useful right now?</span><textarea name="support_needed" rows={4} placeholder="Mentorship, activities, life skills, school support, opportunities, something else..." /></label>
            <label><span>What would you like ASC3ND to know about your goals?</span><textarea name="primary_goal" rows={4} /></label>
          </>
        ) : null}

        {kind === "mentor-volunteer" ? (
          <>
            <label><span>I want to</span><select value={route} onChange={(event) => onRouteChange(event.target.value)}><option value="volunteer">Volunteer</option><option value="mentor">Mentor</option></select></label>
            <label><span>Relevant experience, skills, or interests</span><textarea name="experience" rows={4} /></label>
            <label><span>General availability</span><input name="availability" placeholder="Weekends, evenings, monthly, event days..." /></label>
            <label><span>Why do you want to be involved?</span><textarea name="primary_goal" rows={4} /></label>
          </>
        ) : null}

        {kind === "partner" ? (
          <>
            <label><span>Organization or company</span><input name="organization_name" autoComplete="organization" /></label>
            <label><span>Type of involvement</span><select value={route} onChange={(event) => onRouteChange(event.target.value)}><option value="partner">Community partnership</option><option value="sponsor">Sponsorship</option><option value="supplies">In-kind goods / supplies</option></select></label>
            <label><span>What would you like to explore together?</span><textarea name="partnership_type" rows={4} /></label>
            <label><span>Anything else we should know?</span><textarea name="message" rows={4} /></label>
          </>
        ) : null}

        <label className={styles.check}><input name="contact_consent" type="checkbox" required /><span>I agree that ASC3ND may contact me about this request.</span></label>
        <label className={styles.check}><input name="updates_opt_in" type="checkbox" /><span>I also want occasional ASC3ND community updates by email.</span></label>
        <label className={styles.honeypot} aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>

        <button type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send to ASC3ND"}</button>
        <p className={styles.status} role="status" aria-live="polite">{status || draftStatus}</p>
      </form>
    </section>
  );
}
