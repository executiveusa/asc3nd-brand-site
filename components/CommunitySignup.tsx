"use client";

import { FormEvent, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { signupEs } from "@/lib/site-content.es";

type FormState = "idle" | "submitting" | "success" | "error";

const signupEn = {
  title: "Hear what ASC3ND does next.",
  intro: "Occasional email when a program, event or volunteer need is confirmed. Unsubscribe any time.",
  name: "Name",
  email: "Email",
  consent: "I agree to receive ASC3ND updates by email. I can unsubscribe at any time.",
  honeypot: "Website",
  submit: "Join updates",
  submitting: "Joining…",
  failed: "We could not save your signup. Please try again.",
  saved: "You are signed up for ASC3ND updates.",
  offline: "We could not reach ASC3ND right now. Check your connection and try again.",
};

export function CommunitySignup({ locale = "en" }: { locale?: Locale }) {
  const t = locale === "es" ? signupEs : signupEn;
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/community/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          website: formData.get("website"),
          preferred_language: locale,
          consent_accepted: formData.get("consent") === "on",
          source_page: locale === "es" ? "asc3nd.org/es" : "asc3nd.org/home",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        setState("error");
        setMessage(locale === "es" ? t.failed : data?.message || t.failed);
        return;
      }

      setState("success");
      setMessage(locale === "es" ? t.saved : data.message || t.saved);
      form.reset();
    } catch {
      setState("error");
      setMessage(t.offline);
    }
  }

  return (
    <section className="community-signup shell" aria-labelledby="community-signup-title">
      <div className="community-signup-copy">
        <h2 id="community-signup-title">{t.title}</h2>
        <p>{t.intro}</p>
      </div>

      <form className="community-signup-form" onSubmit={submit}>
        <label>
          <span>{t.name}</span>
          <input name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} />
        </label>
        <label>
          <span>{t.email}</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="signup-consent">
          <input name="consent" type="checkbox" required />
          <span>{t.consent}</span>
        </label>
        <label className="signup-honeypot" aria-hidden="true">
          <span>{t.honeypot}</span>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? t.submitting : t.submit}
        </button>
        <p className={`signup-status signup-status-${state}`} role="status" aria-live="polite">
          {message}
        </p>
      </form>
    </section>
  );
}
