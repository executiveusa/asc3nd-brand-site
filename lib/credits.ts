import type { Locale } from "@/lib/i18n";

/**
 * The people ASC3ND thanks by name. This is the ONE place to add them: the Credits page
 * (/credits, /es/creditos) and the "View event credits" pop-up on the project page both read it.
 *
 * Add a person to the group they belong in:  { name: "Full Name", note: "what they did" }
 * `note` is optional and is shown after the name. Only list someone who has said yes to being named.
 * A group with no names shows as "still being gathered" instead of an empty list.
 */
export type CreditPerson = { name: string; note?: string };

export const creditGroupOrder = [
  "partners",
  "sponsors",
  "barbers",
  "volunteers",
  "media",
  "community",
  "organizers",
  "thanks",
] as const;

export type CreditGroupKey = (typeof creditGroupOrder)[number];

export const creditPeople: Record<CreditGroupKey, CreditPerson[]> = {
  partners: [],
  sponsors: [],
  barbers: [],
  volunteers: [],
  media: [],
  community: [],
  organizers: [],
  thanks: [],
};

export const creditLabels: Record<Locale, Record<CreditGroupKey, string>> = {
  en: {
    partners: "Event partners",
    sponsors: "Sponsors",
    barbers: "Barbers",
    volunteers: "Volunteers",
    media: "Photography + video",
    community: "Community partners",
    organizers: "Organizers",
    thanks: "Special thanks",
  },
  es: {
    partners: "Aliados del evento",
    sponsors: "Patrocinadores",
    barbers: "Barberos",
    volunteers: "Voluntarios",
    media: "Fotografía y video",
    community: "Aliados comunitarios",
    organizers: "Organizadores",
    thanks: "Agradecimientos especiales",
  },
};

const placeholder: Record<Locale, string> = { en: "Names to be confirmed", es: "Nombres por confirmar" };

const asText = (p: CreditPerson) => (p.note ? `${p.name}, ${p.note}` : p.name);

/** The shape the "View event credits" pop-up expects. Unfilled groups keep the old placeholder line. */
export function creditGroupsForDialog(locale: Locale) {
  return creditGroupOrder.map((key) => ({
    label: creditLabels[locale][key],
    entries: creditPeople[key].length ? creditPeople[key].map(asText) : [placeholder[locale]],
  }));
}

export function creditGroupsForPage(locale: Locale) {
  return creditGroupOrder.map((key) => ({ key, label: creditLabels[locale][key], people: creditPeople[key] }));
}
