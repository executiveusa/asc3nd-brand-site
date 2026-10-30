"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/app/take-part/participation.module.css";

type Kind = "family" | "mentor-volunteer" | "partner";
type Locale = "en" | "es";
type Props = { kind: Kind; locale?: Locale };

type Draft = {
  version: 1;
  kind: Kind;
  route: string;
  idempotencyKey: string;
  savedAt: string;
  fields: Record<string, string | boolean>;
};

const copy = {
  en: {
    config: {
      family: { eyebrow: "Families", title: "Tell us what would help your family connect with ASC3ND.", intro: "This goes directly to the family follow-up queue so the right person can respond.", defaultRoute: "family" },
      "mentor-volunteer": { eyebrow: "Mentors + volunteers", title: "Tell us how you want to show up.", intro: "Choose mentoring or volunteering and your submission will route to the matching ASC3ND team queue.", defaultRoute: "volunteer" },
      partner: { eyebrow: "Community partners", title: "Tell us what kind of partnership you want to explore.", intro: "Partnership, sponsorship, and in-kind support are routed separately so the right team member can follow up.", defaultRoute: "partner" },
    },
    name: "Name", phone: "Phone", preferredLanguage: "Preferred language",
    choose: "Choose one", saved: "Saved on this device.",
    restored: "Draft restored from", draftFail: "Draft could not be saved on this device. Keep this page open until you submit.",
    submitFail: "We could not save your information. Please try again.", submitSaved: "Your answers are still saved on this device.",
    received: "Thank you. ASC3ND received your information.", offline: "We could not reach ASC3ND right now. Your answers are still saved on this device. Try again when your connection is back.",
    sending: "Sending…", send: "Send to ASC3ND",
    contactConsent: "I agree that ASC3ND may contact me about this request.",
    updates: "I also want occasional ASC3ND community updates by email.",
  },
  es: {
    config: {
      family: { eyebrow: "Familias", title: "Cuéntanos qué ayudaría a tu familia a conectarse con ASC3ND.", intro: "Esto llega directamente a la cola de seguimiento para familias para que la persona adecuada pueda responder.", defaultRoute: "family" },
      "mentor-volunteer": { eyebrow: "Mentores + voluntariado", title: "Cuéntanos cómo quieres participar.", intro: "Elige mentoría o voluntariado y tu solicitud se enviará a la cola correspondiente del equipo de ASC3ND.", defaultRoute: "volunteer" },
      partner: { eyebrow: "Aliados comunitarios", title: "Cuéntanos qué tipo de colaboración quieres explorar.", intro: "Las alianzas, patrocinios y apoyos en especie se canalizan por separado para que la persona adecuada pueda dar seguimiento.", defaultRoute: "partner" },
    },
    name: "Nombre", phone: "Teléfono", preferredLanguage: "Idioma preferido",
    choose: "Elige una opción", saved: "Guardado en este dispositivo.",
    restored: "Borrador restaurado de", draftFail: "No se pudo guardar el borrador en este dispositivo. Mantén esta página abierta hasta enviarlo.",
    submitFail: "No pudimos guardar tu información. Inténtalo de nuevo.", submitSaved: "Tus respuestas siguen guardadas en este dispositivo.",
    received: "Gracias. ASC3ND recibió tu información.", offline: "No pudimos comunicarnos con ASC3ND en este momento. Tus respuestas siguen guardadas en este dispositivo. Inténtalo de nuevo cuando vuelva tu conexión.",
    sending: "Enviando…", send: "Enviar a ASC3ND",
    contactConsent: "Acepto que ASC3ND se comunique conmigo sobre esta solicitud.",
    updates: "También quiero recibir ocasionalmente novedades de la comunidad ASC3ND por correo electrónico.",
  },
} as const;

function idempotencyKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function storageKey(kind: Kind, locale: Locale) {
  return `asc3nd:take-part:draft:${locale}:${kind}:v1`;
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

export function ParticipationForm({ kind, locale = "en" }: Props) {
  const strings = copy[locale];
  const formCopy = strings.config[kind];
  const formRef = useRef<HTMLFormElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [submissionKey, setSubmissionKey] = useState(() => idempotencyKey());
  const [route, setRoute] = useState(formCopy.defaultRoute as string);
  const [status, setStatus] = useState("");
  const [draftStatus, setDraftStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const key = useMemo(() => storageKey(kind, locale), [kind, locale]);

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
      setDraftStatus(`${strings.restored} ${new Date(draft.savedAt).toLocaleString(locale === "es" ? "es-MX" : "en-US")}.`);
    } catch {
      window.localStorage.removeItem(key);
    }
  }, [key, kind, locale, strings.restored]);

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  function saveDraft() {
    const form = formRef.current;
    if (!form) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const draft: Draft = { version: 1, kind, route, idempotencyKey: submissionKey, savedAt: new Date().toISOString(), fields: collectFields(form) };
      try {
        window.localStorage.setItem(key, JSON.stringify(draft));
        setDraftStatus(strings.saved);
      } catch {
        setDraftStatus(strings.draftFail);
      }
    }, 250);
  }

  function clearDraft() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    try { window.localStorage.removeItem(key); } catch {}
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
          preferred_language: locale,
          answers,
          contact_consent: form.get("contact_consent") === "on",
          updates_opt_in: form.get("updates_opt_in") === "on",
          website: form.get("website"),
          idempotency_key: submissionKey,
          source_page: locale === "es" ? `asc3nd.org/es/participar/${kind}` : `asc3nd.org/take-part/${kind}`,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setStatus(`${data?.message || strings.submitFail} ${strings.submitSaved}`);
        saveDraft();
        return;
      }

      setStatus(data?.message || strings.received);
      clearDraft();
      formElement.reset();
      setRoute(formCopy.defaultRoute);
      setSubmissionKey(idempotencyKey());
    } catch {
      setStatus(strings.offline);
      saveDraft();
    } finally {
      setSubmitting(false);
    }
  }

  function onRouteChange(nextRoute: string) {
    setRoute(nextRoute);
    queueMicrotask(saveDraft);
  }

  const isEs = locale === "es";

  return (
    <section className={styles.wrap} lang={locale}>
      <div className={styles.intro}>
        <p className="eyebrow">{formCopy.eyebrow}</p>
        <h1>{formCopy.title}</h1>
        <p>{formCopy.intro}</p>
      </div>

      <form ref={formRef} className={styles.form} onSubmit={submit} onInput={saveDraft} onChange={saveDraft}>
        <div className={styles.grid}>
          <label><span>{strings.name}</span><input name="name" required minLength={2} maxLength={100} autoComplete="name" /></label>
          <label><span>Email</span><input name="email" required type="email" autoComplete="email" /></label>
          <label><span>{strings.phone}</span><input name="phone" type="tel" autoComplete="tel" /></label>
          <label><span>{strings.preferredLanguage}</span><select name="preferred_language" value={locale} readOnly aria-readonly="true"><option value={locale}>{isEs ? "Español" : "English"}</option></select></label>
        </div>

        {kind === "family" ? <>
          <label><span>{isEs ? "Edad del niño, niña o jóvenes" : "Age range of child or children"}</span><select name="child_age_range" defaultValue=""><option value="">{strings.choose}</option><option value="preschool">{isEs ? "Preescolar" : "Preschool"}</option><option value="elementary">{isEs ? "Primaria" : "Elementary school"}</option><option value="middle">{isEs ? "Secundaria media" : "Middle school"}</option><option value="high">{isEs ? "Preparatoria" : "High school"}</option><option value="mixed">{isEs ? "Edades mixtas" : "Mixed ages"}</option></select></label>
          <label><span>{isEs ? "¿Qué sería más útil en este momento?" : "What would be most useful right now?"}</span><textarea name="support_needed" rows={4} placeholder={isEs ? "Mentoría, actividades, habilidades para la vida, apoyo escolar, oportunidades u otra cosa..." : "Mentorship, activities, life skills, school support, opportunities, something else..."} /></label>
          <label><span>{isEs ? "¿Qué te gustaría que ASC3ND supiera sobre tus metas?" : "What would you like ASC3ND to know about your goals?"}</span><textarea name="primary_goal" rows={4} /></label>
        </> : null}

        {kind === "mentor-volunteer" ? <>
          <label><span>{isEs ? "Quiero" : "I want to"}</span><select value={route} onChange={(event) => onRouteChange(event.target.value)}><option value="volunteer">{isEs ? "Hacer voluntariado" : "Volunteer"}</option><option value="mentor">{isEs ? "Ser mentor/a" : "Mentor"}</option></select></label>
          <label><span>{isEs ? "Experiencia, habilidades o intereses relevantes" : "Relevant experience, skills, or interests"}</span><textarea name="experience" rows={4} /></label>
          <label><span>{isEs ? "Disponibilidad general" : "General availability"}</span><input name="availability" placeholder={isEs ? "Fines de semana, tardes, mensual, días de eventos..." : "Weekends, evenings, monthly, event days..."} /></label>
          <label><span>{isEs ? "¿Por qué quieres participar?" : "Why do you want to be involved?"}</span><textarea name="primary_goal" rows={4} /></label>
        </> : null}

        {kind === "partner" ? <>
          <label><span>{isEs ? "Organización o empresa" : "Organization or company"}</span><input name="organization_name" autoComplete="organization" /></label>
          <label><span>{isEs ? "Tipo de participación" : "Type of involvement"}</span><select value={route} onChange={(event) => onRouteChange(event.target.value)}><option value="partner">{isEs ? "Alianza comunitaria" : "Community partnership"}</option><option value="sponsor">{isEs ? "Patrocinio" : "Sponsorship"}</option><option value="supplies">{isEs ? "Bienes o suministros en especie" : "In-kind goods / supplies"}</option></select></label>
          <label><span>{isEs ? "¿Qué te gustaría explorar en conjunto?" : "What would you like to explore together?"}</span><textarea name="partnership_type" rows={4} /></label>
          <label><span>{isEs ? "¿Hay algo más que debamos saber?" : "Anything else we should know?"}</span><textarea name="message" rows={4} /></label>
        </> : null}

        <label className={styles.check}><input name="contact_consent" type="checkbox" required /><span>{strings.contactConsent}</span></label>
        <label className={styles.check}><input name="updates_opt_in" type="checkbox" /><span>{strings.updates}</span></label>
        <label className={styles.honeypot} aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>

        <button type="submit" disabled={submitting}>{submitting ? strings.sending : strings.send}</button>
        <p className={styles.status} role="status" aria-live="polite">{status || draftStatus}</p>
      </form>
    </section>
  );
}
