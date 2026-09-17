"use client";

import { useRef } from "react";
import "./event-credits.css";

export type EventCreditGroup = {
  label: string;
  entries: string[];
};

type EventCreditsProps = {
  eventLabel: string;
  groups: EventCreditGroup[];
};

export function EventCredits({ eventLabel, groups }: EventCreditsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openCredits = () => dialogRef.current?.showModal();
  const closeCredits = () => dialogRef.current?.close();

  return (
    <>
      <button className="event-credits-trigger" type="button" onClick={openCredits}>
        View event credits <span aria-hidden="true">↗</span>
      </button>

      <dialog
        ref={dialogRef}
        className="event-credits-dialog"
        aria-labelledby="event-credits-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeCredits();
        }}
      >
        <div className="event-credits-panel">
          <div className="event-credits-header">
            <div>
              <p className="eyebrow">EVENT CREDITS</p>
              <h2 id="event-credits-title">The people behind the day.</h2>
              <p>{eventLabel}</p>
            </div>
            <button className="event-credits-close" type="button" onClick={closeCredits} aria-label="Close event credits">
              Close
            </button>
          </div>

          <div className="event-credits-groups">
            {groups.map((group) => (
              <section className="event-credit-group" key={group.label}>
                <h3>{group.label}</h3>
                <ul>
                  {group.entries.map((entry) => (
                    <li key={`${group.label}-${entry}`}>{entry}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
