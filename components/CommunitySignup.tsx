"use client";

import { FormEvent, useState } from "react";
import { signupEs } from "@/lib/participation.es";

type FormState = "idle" | "submitting" | "success" | "error";

export function CommunitySignup({ locale = "en" }: { locale?: "en" | "es" }) {
  const es = locale === "es";
  const t = signupEs;
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
          preferred_language: es ? "es" : "en",
          consent_accepted: formData.get("consent") === "on",
          source_page: es ? "asc3nd.org/es" : "asc3nd.org/home",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        setState("error");
        setMessage(es ? t.error : data?.message || "We could not save your signup. Please try again.");
        return;
      }

      setState("success");
      setMessage(es ? t.success : data.message || "You are signed up for ASC3ND updates.");
      form.reset();
    } catch {
      setState("error");
      setMessage(es ? t.network : "We could not reach ASC3ND right now. Check your connection and try again.");
    }
  }

  return (
    <section className="community-signup shell" aria-labelledby="community-signup-title">
      <div className="community-signup-copy">
        <h2 id="community-signup-title">{es ? t.title : "Hear what ASC3ND does next."}</h2>
        <p>{es ? t.intro : "Occasional email when a program, event or volunteer need is confirmed. Unsubscribe any time."}</p>
      </div>

      <form className="community-signup-form" onSubmit={submit}>
        <label>
          <span>{es ? t.name : "Name"}</span>
          <input name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} />
        </label>
        <label>
          <span>{es ? t.email : "Email"}</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="signup-consent">
          <input name="consent" type="checkbox" required />
          <span>{es ? t.consent : "I agree to receive ASC3ND updates by email. I can unsubscribe at any time."}</span>
        </label>
        <label className="signup-honeypot" aria-hidden="true">
          <span>{es ? t.honeypot : "Website"}</span>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? (es ? t.submitting : "Joining…") : (es ? t.submit : "Join updates")}
        </button>
        <p className={`signup-status signup-status-${state}`} role="status" aria-live="polite">
          {message}
        </p>
      </form>
    </section>
  );
}
