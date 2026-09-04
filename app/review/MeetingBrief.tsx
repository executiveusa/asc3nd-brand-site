"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./review.module.css";

type Notes = Record<string, string>;

const MEETING_SECONDS = 45 * 60;

const agenda = [
  { time: "0–5", title: "Set the frame", copy: "Why we are reducing the site and what we need to decide today." },
  { time: "5–20", title: "Founders first", copy: "Listen. Capture their exact language. Do not pitch features." },
  { time: "20–30", title: "Walk the new page", copy: "ASC3ND → founders → proof → next → participation." },
  { time: "30–38", title: "Choose the brand direction", copy: "Primary mark, legacy badge, color territory, image world." },
  { time: "38–45", title: "Lock the next 90 days", copy: "Audience, next activity, primary action, approver, missing assets." },
];

const decisions = [
  ["identity", "What is ASC3ND?", "If someone asks tomorrow, what do you say in one or two sentences?"],
  ["audience", "Who matters first?", "Who should we work hardest to reach over the next 90 days?"],
  ["next", "What happens next?", "What are the one or two real things ASC3ND plans to do next?"],
  ["outcome", "What should change for a young person?", "Six months after being around ASC3ND, what should be different?"],
  ["action", "What should a visitor do?", "What is the single most important action after visiting asc3nd.org?"],
  ["approval", "Who decides?", "Who gives final approval on brand, copy, and publishing?"],
] as const;

const walkthrough = [
  ["hero", "01 — ASC3ND", "Identity first. Short. No event headline.", "What must people understand in five seconds?"],
  ["founders", "02 — Why ASC3ND exists", "Founders’ words. One short story or film.", "What made you start this?"],
  ["beliefs", "03 — What we believe", "Only language the founders confirm.", "Which ideas are real priorities: education, mentorship, leadership, life skills, community?"],
  ["proof", "04 — First chapter", "Community Cuts becomes proof, not the whole identity.", "What can we prove from the event?"],
  ["future", "05 — What comes next", "Only real next programs or activities.", "Which one or two things are real enough to invite people into now?"],
  ["participation", "06 — Take part", "Families. Mentors + volunteers. Community partners.", "Which audience should get the strongest call to action?"],
  ["footer", "07 — Stay connected", "Social, contact, media kit. Nothing extra.", "Which public accounts and contact details are official?"],
] as const;

const brandOptions = [
  {
    id: "preserve",
    label: "Preserve",
    title: "Keep the current full mark primary",
    copy: "Lowest disruption. Highest visual complexity.",
    example: "Circular multicolor logo stays in the website header and social avatar.",
  },
  {
    id: "evolve",
    label: "Evolve",
    title: "A3 leads. Community badge stays.",
    copy: "Preserves equity while creating a cleaner digital system.",
    example: "A3 / crown / arrow becomes primary. Circular mark becomes event + community badge.",
  },
  {
    id: "replace",
    label: "Replace",
    title: "Start a completely new identity",
    copy: "Largest reset. Only justified if the founders reject both current directions.",
    example: "New symbol, wordmark, palette, typography, and brand architecture.",
  },
];

function formatTime(total: number) {
  const minutes = Math.floor(total / 60).toString().padStart(2, "0");
  const seconds = (total % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function MeetingBrief() {
  const [remaining, setRemaining] = useState(MEETING_SECONDS);
  const [running, setRunning] = useState(false);
  const [notes, setNotes] = useState<Notes>({});
  const [brandChoice, setBrandChoice] = useState("evolve");

  useEffect(() => {
    const saved = window.localStorage.getItem("asc3nd-meeting-notes-v1");
    const savedChoice = window.localStorage.getItem("asc3nd-brand-choice-v1");
    if (saved) setNotes(JSON.parse(saved));
    if (savedChoice) setBrandChoice(savedChoice);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("asc3nd-meeting-notes-v1", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    window.localStorage.setItem("asc3nd-brand-choice-v1", brandChoice);
  }, [brandChoice]);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(id);
  }, [running, remaining]);

  useEffect(() => {
    if (remaining === 0) setRunning(false);
  }, [remaining]);

  const answered = useMemo(
    () => decisions.filter(([id]) => notes[id]?.trim()).length,
    [notes],
  );

  const updateNote = (id: string, value: string) => setNotes((current) => ({ ...current, [id]: value }));

  const downloadNotes = () => {
    const lines = [
      "ASC3ND — Meeting Decisions",
      `Brand direction: ${brandChoice}`,
      "",
      ...decisions.flatMap(([id, title, question]) => [title, question, notes[id] || "—", ""]),
      "PAGE WALKTHROUGH",
      ...walkthrough.flatMap(([id, title, , question]) => [title, question, notes[`page-${id}`] || "—", ""]),
      "FINAL NOTES",
      notes.final || "—",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ASC3ND-meeting-decisions.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <a href="/" className={styles.wordmark}>ASC3ND</a>
        <div className={styles.timer} aria-live="polite">
          <span>{formatTime(remaining)}</span>
          <button onClick={() => setRunning((value) => !value)}>{running ? "Pause" : "Start"}</button>
          <button onClick={() => { setRunning(false); setRemaining(MEETING_SECONDS); }}>Reset</button>
        </div>
      </header>

      <section className={styles.hero}>
        <p className={styles.kicker}>Founder review · September 2026</p>
        <h1>Decide what ASC3ND becomes next.</h1>
        <p className={styles.lead}>Today is not a website approval meeting. It is a brand and direction meeting.</p>
        <div className={styles.status}>{answered}/6 core decisions captured</div>
      </section>

      <section className={styles.section}>
        <p className={styles.kicker}>45-minute walkthrough</p>
        <div className={styles.agenda}>
          {agenda.map((item) => (
            <article key={item.time}>
              <span>{item.time} min</span>
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.darkSection}>
        <div className={styles.sectionInner}>
          <p className={styles.kicker}>The frame</p>
          <h2>We intentionally took things away.</h2>
          <p>Community Cuts proved ASC3ND can bring people together. One event should not define the whole organization. The new site starts with ASC3ND, the founders, and what they are actually building next.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.kicker}>Six decisions</p>
            <h2>Leave the meeting with these answered.</h2>
          </div>
          <button className={styles.primaryButton} onClick={downloadNotes}>Download notes</button>
        </div>
        <div className={styles.questions}>
          {decisions.map(([id, title, question], index) => (
            <article key={id} className={styles.question}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{title}</h3>
                <p>{question}</p>
                <textarea
                  value={notes[id] || ""}
                  onChange={(event) => updateNote(id, event.target.value)}
                  placeholder="Capture their exact words…"
                  aria-label={`${title} notes`}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.brandSection}>
        <div className={styles.sectionInner}>
          <p className={styles.kicker}>Brand decision</p>
          <h2>Three paths. One recommendation.</h2>
          <div className={styles.brandGrid}>
            {brandOptions.map((option) => (
              <label key={option.id} className={`${styles.brandCard} ${brandChoice === option.id ? styles.brandCardSelected : ""}`}>
                <input
                  type="radio"
                  name="brand-direction"
                  value={option.id}
                  checked={brandChoice === option.id}
                  onChange={() => setBrandChoice(option.id)}
                />
                <span>{option.label}</span>
                <h3>{option.title}</h3>
                <p>{option.copy}</p>
                <small>{option.example}</small>
              </label>
            ))}
          </div>
          <div className={styles.recommendation}>
            <strong>Recommendation — Evolve.</strong>
            <p>Make the A3 / crown / arrow the primary digital mark. Keep the circular multicolor mark as the community and event badge. Lock final vectors only after founder approval.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.kicker}>New page walkthrough</p>
        <h2>Less language. More truth.</h2>
        <div className={styles.walkthrough}>
          {walkthrough.map(([id, title, copy, question]) => (
            <article key={id}>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
              <div>
                <strong>{question}</strong>
                <textarea
                  value={notes[`page-${id}`] || ""}
                  onChange={(event) => updateNote(`page-${id}`, event.target.value)}
                  placeholder="Founder input…"
                  aria-label={`${title} input`}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.darkSection}>
        <div className={styles.sectionInner}>
          <p className={styles.kicker}>90 days</p>
          <h2>Define → Express → Operate.</h2>
          <div className={styles.threeUp}>
            <article><span>01</span><h3>Define</h3><p>Identity. Positioning. Brand kit. Website direction.</p></article>
            <article><span>02</span><h3>Express</h3><p>Founder stories. Social rhythm. Real community media.</p></article>
            <article><span>03</span><h3>Operate</h3><p>Events. Publishing. Analytics. Reusable media kit.</p></article>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.kicker}>Close</p>
        <h2>Before we leave.</h2>
        <textarea
          className={styles.finalNotes}
          value={notes.final || ""}
          onChange={(event) => updateNote("final", event.target.value)}
          placeholder="Lock: official name · primary audience · next activity · primary action · identity direction · final approver · missing assets"
          aria-label="Final meeting notes"
        />
        <div className={styles.actions}>
          <button className={styles.primaryButton} onClick={downloadNotes}>Download decisions</button>
          <a className={styles.secondaryButton} href="/">Open site direction</a>
        </div>
        <p className={styles.saved}>Notes save automatically on this device.</p>
      </section>
    </main>
  );
}
