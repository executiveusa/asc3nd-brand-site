import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { creditGroupsForPage } from "@/lib/credits";
import type { Locale } from "@/lib/i18n";
import "./credits.css";

const copy = {
  en: {
    eyebrow: "With gratitude",
    title: "Thank you, by name.",
    intro:
      "Community Cuts for Kids happened because people gave their time, their skill and their care. This page names them, and it will keep growing as ASC3ND holds more events.",
    pendingTitle: "Still being gathered.",
    pendingBody: "We are confirming names for these groups. Each person appears here once they have said yes to being listed:",
    missingTitle: "Someone missing?",
    missingBody:
      "If you helped and your name isn't here, or you would like the way it appears changed or removed, tell us and we will fix it.",
    message: "Send us a message",
    messageHref: "/take-part#direct-contact",
    eventLink: "See the Community Cuts record",
    eventHref: "/projects/community-cuts",
    list: (label: string) => `${label}, names`,
  },
  es: {
    eyebrow: "Con gratitud",
    title: "Gracias, con nombre y apellido.",
    intro:
      "Community Cuts for Kids fue posible porque personas dieron su tiempo, su talento y su cariño. Esta página las nombra y seguirá creciendo a medida que ASC3ND haga más eventos.",
    pendingTitle: "Aún estamos reuniendo nombres.",
    pendingBody: "Estamos confirmando los nombres de estos grupos. Cada persona aparece aquí cuando ha dicho que sí a que la mencionemos:",
    missingTitle: "¿Falta alguien?",
    missingBody:
      "Si ayudaste y tu nombre no está aquí, o quieres cambiar o quitar cómo aparece, avísanos y lo corregimos.",
    message: "Envíanos un mensaje",
    messageHref: "/es/participar#contacto-directo",
    eventLink: "Ver el registro de Community Cuts",
    eventHref: "/es/proyectos/community-cuts",
    list: (label: string) => `${label}, nombres`,
  },
} as const;

export function CreditsPage({ locale = "en" }: { locale?: Locale }) {
  const t = copy[locale];
  const groups = creditGroupsForPage(locale);
  const named = groups.filter((g) => g.people.length > 0);
  const pending = groups.filter((g) => g.people.length === 0);

  return (
    <main id="main-content" tabIndex={-1} lang={locale}>
      <SiteHeader />

      <section className="credits-hero shell">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </section>

      {named.map((group) => (
        <section className="credits-group shell" key={group.key} aria-labelledby={`credits-${group.key}`}>
          <h2 id={`credits-${group.key}`}>{group.label}</h2>
          <ul className="credits-names" aria-label={t.list(group.label)}>
            {group.people.map((person) => (
              <li key={person.name}>
                {person.name}
                {person.note ? <small>{person.note}</small> : null}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {pending.length > 0 ? (
        <section className="credits-pending shell" aria-labelledby="credits-pending-title">
          <h2 id="credits-pending-title">{t.pendingTitle}</h2>
          <div>
            <p>{t.pendingBody}</p>
            <p>{pending.map((g) => g.label).join(" · ")}</p>
          </div>
        </section>
      ) : null}

      <section className="credits-missing shell" aria-labelledby="credits-missing-title">
        <h2 id="credits-missing-title">{t.missingTitle}</h2>
        <div>
          <p>{t.missingBody}</p>
          <div className="credits-links">
            <Link href={t.messageHref}>{t.message} <span className="arrow" aria-hidden="true">→</span></Link>
            <a href="mailto:main@asc3nd.org">main@asc3nd.org</a>
            <Link href={t.eventHref}>{t.eventLink} <span className="arrow" aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
