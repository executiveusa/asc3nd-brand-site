"use client";

import { FormEvent, useState } from "react";
import { signupEs } from "@/lib/participation.es";

type FormState = "idle" | "submitting" | "success" | "error";

export type SignupCopy = {
  title: string;
  body: string;
  name: string;
  email: string;
  consent: string;
  submit: string;
  submitting: string;
  success: string;
  failed: string;
  unreachable: string;
};

const englishCopy: SignupCopy = {
  title: "Hear what ASC3ND does next.",
  body: "Occasional email when a program, event or volunteer need is confirmed. Unsubscribe any time.",
  name: "Name",
  email: "Email",
  consent: "I agree to receive ASC3ND updates by email. I can unsubscribe at any time.",
  submit: "Join updates",
  submitting: "Joining…",
  success: "You are signed up for ASC3ND updates.",
  failed: "We could not save your signup. Please try again.",
  unreachable: "We could not reach ASC3ND right now. Check your connection and try again.",
};

const spanishCopy: SignupCopy = {
  title: signupEs.title,
  body: signupEs.intro,
  name: signupEs.name,
  email: signupEs.email,
  consent: signupEs.consent,
  submit: signupEs.submit,
  submitting: signupEs.submitting,
  success: signupEs.success,
  failed: signupEs.error,
  unreachable: signupEs.network,
};

/** `locale="es"` is the shortcut for the Spanish pages; `copy`, `language` and `sourcePage` override it. */
type CommunitySignupProps = { copy?: SignupCopy; language?: "en" | "es"; sourcePage?: string; locale?: "en" | "es" };

export function CommunitySignup({ locale, copy: copyProp, language: languageProp, sourcePage: sourceProp }: CommunitySignupProps = {}) {
  const language = languageProp ?? locale ?? "en";
  const copy = copyProp ?? (language === "es" ? spanishCopy : englishCopy);
  const sourcePage = sourceProp ?? (language === "es" ? "asc3nd.org/es" : "asc3nd.org/home");
  const honeypot = language === "es" ? signupEs.honeypot : "Website";
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
          preferred_language: language,
          consent_accepted: formData.get("consent") === "on",
          source_page: sourcePage,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        setState("error");
        setMessage(data?.message || copy.failed);
        return;
      }

      setState("success");
      setMessage(data.message || copy.success);
      form.reset();
    } catch {
      setState("error");
      setMessage(copy.unreachable);
    }
  }

  return (
    <section className="community-signup shell" aria-labelledby="community-signup-title">
      <div className="community-signup-copy">
        <h2 id="community-signup-title">{copy.title}</h2>
        <p>{copy.body}</p>
      </div>

      <form className="community-signup-form" onSubmit={submit}>
        <label>
          <span>{copy.name}</span>
          <input name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} />
        </label>
        <label>
          <span>{copy.email}</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="signup-consent">
          <input name="consent" type="checkbox" required />
          <span>{copy.consent}</span>
        </label>
        <label className="signup-honeypot" aria-hidden="true">
          <span>{honeypot}</span>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? copy.submitting : copy.submit}
        </button>
        <p className={`signup-status signup-status-${state}`} role="status" aria-live="polite">
          {message}
        </p>
      </form>
    </section>
  );
}
