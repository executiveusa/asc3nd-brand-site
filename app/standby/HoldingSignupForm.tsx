"use client";
import { FormEvent, useState } from "react";
import styles from "./holding.module.css";

type Status = { type: "idle" | "loading" | "success" | "error"; message: string };
export default function HoldingSignupForm() {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const consent = data.get("consent") === "on";
    if (!name || !email || !consent) {
      setStatus({ type: "error", message: "Please add your name and email, then confirm you want ASC3ND updates." });
      return;
    }
    setStatus({ type: "loading", message: "Joining…" });
    try {
      // Reuse the new brand site's already-verified, rate-limited and consented signup endpoint.
      const response = await fetch("/api/community/join", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name, email,
          preferred_language: "en",
          website: String(data.get("companyWebsite") || ""),
          consent_accepted: consent,
          source_page: "asc3nd.org/standby",
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) throw new Error("submission_failed");
      form.reset();
      setStatus({ type: "success", message: "You’re on the list. We’ll keep you posted." });
    } catch {
      setStatus({ type: "error", message: "We couldn’t save your information. Please try again." });
    }
  }
  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <input className={styles.honeypot} type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className={styles.fields}>
        <label><span>Name</span><input name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} /></label>
        <label><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
      </div>
      <label className={styles.consent}>
        <input name="consent" type="checkbox" required />
        <span>Keep me updated about ASC3ND programs, events, and opportunities.</span>
      </label>
      <button type="submit" disabled={status.type === "loading"}>
        {status.type === "loading" ? "Joining…" : "Keep Me Updated"}
      </button>
      {status.message ? <p className={`${styles.status} ${status.type === "success" ? styles.success : status.type === "error" ? styles.error : ""}`} role={status.type === "error" ? "alert" : "status"}>{status.message}</p> : null}
    </form>
  );
}
