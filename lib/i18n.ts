export type Locale = "en" | "es";

/** Every English public page and its Spanish twin. The header switch, hreflang and the sitemap all read this list. */
export const routePairs = [
  { en: "/", es: "/es" },
  { en: "/story", es: "/es/historia" },
  { en: "/events", es: "/es/eventos" },
  { en: "/projects/community-cuts", es: "/es/proyectos/community-cuts" },
  { en: "/take-part", es: "/es/participar" },
  { en: "/take-part/family", es: "/es/participar/familia" },
  { en: "/take-part/mentor-volunteer", es: "/es/participar/mentores-voluntariado" },
  { en: "/take-part/partner", es: "/es/participar/aliados" },
  { en: "/support", es: "/es/apoyo" },
  { en: "/shop", es: "/es/tienda" },
  { en: "/privacy", es: "/es/privacidad" },
  { en: "/youth-safety", es: "/es/seguridad-juvenil" },
  { en: "/transparency", es: "/es/transparencia" },
] as const;

export function localeOf(pathname: string): Locale {
  return pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
}

function clean(pathname: string) {
  const p = pathname.split("?")[0].split("#")[0];
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}

/** The same page in the other language. Falls back to that language's home page. */
export function counterpart(pathname: string): { locale: Locale; href: string } {
  const here = clean(pathname);
  const locale = localeOf(here);
  const other: Locale = locale === "en" ? "es" : "en";
  const pair = routePairs.find((p) => p[locale] === here);
  return { locale: other, href: pair ? pair[other] : other === "es" ? "/es" : "/" };
}

export const ui = {
  en: {
    homeLabel: "ASC3ND home",
    primary: "Primary navigation",
    menu: "Menu",
    close: "Close",
    donate: "Donate",
    donateLabel: "Donate (opens in a new tab)",
    language: "Language",
    nav: [
      { href: "/story", label: "Story", key: "story" },
      { href: "/events", label: "Events", key: "events" },
      { href: "/take-part", label: "Take part", key: "take-part" },
      { href: "/shop", label: "Shop", key: "shop" },
    ],
    footerNav: "Footer navigation",
    promise: ["Empower youth.", "Elevate futures.", "Build community."],
    columns: {
      asc3nd: "ASC3ND",
      trust: "Trust",
      follow: "Follow",
    },
    links: {
      story: "Story",
      events: "Events",
      takePart: "Take part",
      support: "Support",
      shop: "Shop",
      transparency: "Transparency",
      privacy: "Privacy",
      youthSafety: "Youth safety",
    },
    legal: "Washington nonprofit corporation, UBI 606 247 629",
    record: "Public record",
  },
  es: {
    homeLabel: "Inicio de ASC3ND",
    primary: "Navegación principal",
    menu: "Menú",
    close: "Cerrar",
    donate: "Donar",
    donateLabel: "Donar (se abre en una pestaña nueva)",
    language: "Idioma",
    nav: [
      { href: "/es/historia", label: "Historia", key: "story" },
      { href: "/es/eventos", label: "Eventos", key: "events" },
      { href: "/es/participar", label: "Participa", key: "take-part" },
      { href: "/es/tienda", label: "Tienda", key: "shop" },
    ],
    footerNav: "Navegación del pie de página",
    promise: ["Empoderar a la juventud.", "Elevar futuros.", "Construir comunidad."],
    columns: {
      asc3nd: "ASC3ND",
      trust: "Confianza",
      follow: "Síguenos",
    },
    links: {
      story: "Historia",
      events: "Eventos",
      takePart: "Participa",
      support: "Apoyo",
      shop: "Tienda",
      transparency: "Transparencia",
      privacy: "Privacidad",
      youthSafety: "Seguridad juvenil",
    },
    legal: "Corporación sin fines de lucro de Washington, UBI 606 247 629",
    record: "Registro público",
  },
} as const;
