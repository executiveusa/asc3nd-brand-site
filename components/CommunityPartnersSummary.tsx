import { creditPeople } from "@/lib/credits";

/**
 * Only explicitly approved public credits are shown. Empty is intentional:
 * no organization or individual is implied to have endorsed the event.
 */
export function CommunityPartnersSummary({ locale = "en" }: { locale?: "en" | "es" }) {
  const confirmed = [...creditPeople.partners, ...creditPeople.sponsors, ...creditPeople.community];
  const es = locale === "es";
  return (
    <section className="shell community-partners-summary" aria-labelledby="community-partners-summary-title">
      <p className="eyebrow">{es ? "Fresh Fade, Fresh Grade" : "Fresh Fade, Fresh Grade"}</p>
      <h2 id="community-partners-summary-title">{es ? "Aliados comunitarios" : "Community Partners"}</h2>
      {confirmed.length ? (
        <ul>{confirmed.map((person) => (
          <li key={person.name}>{person.name}{person.note ? ` — ${person.note}` : null}</li>
        ))}</ul>
      ) : (
        <p>{es
          ? "Los reconocimientos a los aliados y sus contribuciones se añadirán cuando los fundadores los confirmen."
          : "Pending"}</p>
      )}
    </section>
  );
}
