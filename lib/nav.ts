import { ui, type Locale } from "@/lib/i18n";
import { shopLiveUrl, shopMode } from "@/lib/shop-config";

export type NavLink = { href: string; label: string; key: string; external?: boolean };

/** Primary navigation for a language, with the Shop link following the shop switch. */
export function navFor(locale: Locale): NavLink[] {
  return ui[locale].nav.flatMap((link): NavLink[] => {
    if (link.key !== "shop") return [link];
    if (shopMode === "off") return [];
    if (shopMode === "live") return [{ ...link, href: shopLiveUrl, external: true }];
    return [link];
  });
}

/** Where the footer's Shop link goes, or null when the shop is off. */
export function shopLink(locale: Locale): { href: string; external: boolean } | null {
  if (shopMode === "off") return null;
  if (shopMode === "live") return { href: shopLiveUrl, external: true };
  return { href: locale === "es" ? "/es/tienda" : "/shop", external: false };
}
