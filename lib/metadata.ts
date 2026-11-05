import type { Metadata } from "next";
import { counterpart, localeOf, routePairs, type Locale } from "@/lib/i18n";

export const SITE_URL = "https://asc3nd.org";
export const OG_IMAGE = "/og/asc3nd.jpg";
const OG_ALT = "ASC3ND over a photo of families at the Community Cuts for Kids tent in Everett, Washington";

type PageMeta = { title: string; description: string; path: string };

/** Per-page title, description, canonical, hreflang alternates, Open Graph and Twitter card. */
export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  const locale: Locale = localeOf(path);
  const pair = routePairs.find((p) => p[locale] === path);
  const other = counterpart(path);
  const languages: Record<string, string> = {};
  if (pair) {
    languages["en-US"] = pair.en;
    languages["es-US"] = pair.es;
    languages["x-default"] = pair.en;
  }
  const full = title === "ASC3ND" ? title : `${title} | ASC3ND`;
  return {
    title: full,
    description,
    alternates: { canonical: path, languages: pair ? languages : undefined },
    openGraph: {
      type: "website",
      siteName: "ASC3ND",
      title: full,
      description,
      url: path,
      locale: locale === "en" ? "en_US" : "es_US",
      alternateLocale: [other.locale === "en" ? "en_US" : "es_US"],
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: OG_ALT }],
    },
    twitter: { card: "summary_large_image", title: full, description, images: [OG_IMAGE] },
  };
}
