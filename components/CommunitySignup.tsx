"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function CommunitySignup() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setState("submitting");
    setMessage("");

    const response = await fetch("/api/community/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        website: formData.get("website"),
        preferred_language: "en",
        consent_accepted: formData.get("consent") === "on",
        source_page: "asc3nd.org/home",
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.ok) {
      setState("error");
      setMessage(data?.message || "We could not save your signup. Please try again.");
      return;
    }

    setState("success");
    setMessage(data.message || "Thank you. You are on the ASC3ND community updates list.");
    form.reset();
  }

  return (
    <section className="community-signup shell" aria-labelledby="community-signup-title">
      <div className="community-signup-copy">
        <p className="eyebrow">Stay connected</p>
        <h2 id="community-signup-title">The event ends. The relationship should not.</h2>
        <p>
          Get occasional ASC3ND updates about community work, ways to participate, and what we are building next.
        </p>
      </div>

      <form className="community-signup-form" onSubmit={submit}>
        <label>
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="signup-consent">
          <input name="consent" type="checkbox" required />
          <span>I agree to receive ASC3ND community updates by email. I can unsubscribe at any time.</span>
        </label>
        <label className="signup-honeypot" aria-hidden="true">
          <span>Website</span>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Joining…" : "Join the community"}
        </button>
        <p className={`signup-status signup-status-${state}`} role="status" aria-live="polite">
          {message}
        </p>
      </form>
    </section>
  );
}
