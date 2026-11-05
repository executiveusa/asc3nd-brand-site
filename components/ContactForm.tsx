"use client";

import { FormEvent, useId, useRef, useState } from "react";
import "./contact-form.css";

type Locale = "en" | "es";
type Status = "idle" | "pending" | "success" | "error";

const copy = {
  en: {
    eyebrow: "Direct contact",
    title: "Start with a conversation.",
    intro: "Send us a message and the right person at ASC3ND can respond. Prefer email?",
    name: "Name",
    email: "Email",
    message: "What would you like to talk about?",
    consent: "I agree that ASC3ND may contact me about this message.",
    submit: "Send message",
    pending: "Sending…",
    success: "Thank you. Your message was received.",
    error: "We could not send your message. Please try again, or email main@asc3nd.org.",
    limit: "Too many messages were sent from this connection. Please try again in a few minutes.",
    sourcePage: "asc3nd.org/take-part#direct-contact",
    honeypot: "Website",
  },
  es: {
    eyebrow: "Contacto directo",
    title: "Empieza con una conversación.",
    intro: "Envíanos un mensaje y la persona indicada en ASC3ND podrá responderte. ¿Prefieres escribir por correo?",
    name: "Nombre",
    email: "Correo electrónico",
    message: "¿De qué te gustaría hablar?",
    consent: "Acepto que ASC3ND me contacte sobre este mensaje.",
    submit: "Enviar mensaje",
    pending: "Enviando…",
    success: "Gracias. Recibimos tu mensaje.",
    error: "No pudimos enviar tu mensaje. Inténtalo de nuevo o escribe a main@asc3nd.org.",
    limit: "Se enviaron demasiados mensajes desde esta conexión. Inténtalo de nuevo en unos minutos.",
    sourcePage: "asc3nd.org/es/participar#contacto-directo",
    honeypot: "Sitio web",
  },
} as const;

function newKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Direct contact form for the Take part pages. It sends through the same intake endpoint and
 * payload shape as the participation forms, into the Partner queue, with source_page telling
 * staff it came from this box. The visitor's text stays in the form if sending fails.
 */
export function ContactForm({ locale = "en" }: { locale?: Locale }) {
  const t = copy[locale];
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  // One key per message, kept across retries so a double tap or a retry cannot create a duplicate.
  const key = useRef<string>(newKey());

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending") return;
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("pending");
    setMessage("");
    try {
      const response = await fetch("/api/participation/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: "",
          organization_name: "",
          route_key: "partner",
          form_type: "partner",
          preferred_language: locale,
          answers: {
            partnership_type: locale === "es" ? "Conversación general (contacto directo)" : "General conversation (direct contact)",
            message: String(data.get("message") ?? "").trim(),
          },
          contact_consent: data.get("contact_consent") === "on",
          updates_opt_in: false,
          website: data.get("website"),
          idempotency_key: key.current,
          source_page: t.sourcePage,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || body?.ok === false) {
        setStatus("error");
        setMessage(response.status === 429 ? t.limit : t.error);
        return;
      }
      form.reset();
      key.current = newKey();
      setStatus("success");
      setMessage(t.success);
    } catch {
      setStatus("error");
      setMessage(t.error);
    }
  }

  return (
    <section className="community-signup contact-section shell" id={locale === "es" ? "contacto-directo" : "direct-contact"} aria-labelledby={`${id}-title`} data-status={status}>
      <div className="community-signup-copy">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 id={`${id}-title`}>{t.title}</h2>
        <p>
          {t.intro} <a className="text-link" href="mailto:main@asc3nd.org">main@asc3nd.org</a>
        </p>
      </div>

      <form className="community-signup-form" onSubmit={submit} data-status={status}>
        <label>
          <span>{t.name}</span>
          <input name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} />
        </label>
        <label>
          <span>{t.email}</span>
          <input name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
        <label>
          <span>{t.message}</span>
          <textarea name="message" rows={5} required minLength={5} maxLength={4000} />
        </label>
        <label className="signup-consent">
          <input name="contact_consent" type="checkbox" required />
          <span>{t.consent}</span>
        </label>
        <label className="signup-honeypot" aria-hidden="true">
          <span>{t.honeypot}</span>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
        <button type="submit" disabled={status === "pending"}>
          {status === "pending" ? t.pending : t.submit}
        </button>
        <p className="signup-status signup-status-success" role="status" aria-live="polite">{status === "success" ? message : ""}</p>
        <p className="signup-status signup-status-error" role="alert">{status === "error" ? message : ""}</p>
      </form>
    </section>
  );
}
