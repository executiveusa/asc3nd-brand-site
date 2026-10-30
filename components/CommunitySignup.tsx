"use client";

import { FormEvent, useState } from "react";
import { BrandWordmark } from "@/components/BrandWordmark";

type FormState = "idle" | "submitting" | "success" | "error";

export function CommunitySignup({ locale = "en" }: { locale?: "en" | "es" }) {
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
        setMessage(locale === "es" ? "No pudimos guardar tu registro. Inténtalo de nuevo." : (data?.message || "We could not save your signup. Please try again."));
        return;
      }

      setState("success");
      setMessage(locale === "es" ? "Ya estás registrado para recibir novedades de ASC3ND." : (data.message || "You are signed up for ASC3ND updates."));
      form.reset();
    } catch {
      setState("error");
      setMessage(locale === "es" ? "No pudimos comunicarnos con ASC3ND en este momento. Revisa tu conexión e inténtalo de nuevo." : "We could not reach ASC3ND right now. Check your connection and try again.");
    }
  }

  return (
    <section className="community-signup shell" aria-labelledby="community-signup-title">
      <div className="community-signup-copy">
        <p className="eyebrow">{locale === "es" ? "MANTENTE EN CONTACTO" : "STAY CONNECTED"}</p>
        <h2 id="community-signup-title"><BrandWordmark text="ASC3ND" digitNudgeEm={0.005} /> {locale === "es" ? "novedades." : "updates."}</h2>
      </div>

      <form className="community-signup-form" onSubmit={submit}>
        <label>
          <span>{locale === "es" ? "Nombre" : "Name"}</span>
          <input name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="signup-consent">
          <input name="consent" type="checkbox" required />
          <span>{locale === "es" ? "Acepto recibir novedades de ASC3ND por correo electrónico. Puedo cancelar la suscripción en cualquier momento." : "I agree to receive ASC3ND updates by email. I can unsubscribe at any time."}</span>
        </label>
        <label className="signup-honeypot" aria-hidden="true">
          <span>Website</span>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? (locale === "es" ? "Enviando…" : "Joining…") : (locale === "es" ? "Recibir novedades" : "Join updates")}
        </button>
        <p className={`signup-status signup-status-${state}`} role="status" aria-live="polite">
          {message}
        </p>
      </form>
    </section>
  );
}
