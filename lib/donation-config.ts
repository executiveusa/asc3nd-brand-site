/**
 * Client-approved campaign URL received from ASC3ND on 2026-11-18.
 * NEXT_PUBLIC_ASC3ND_ZEFFY_URL may override it with another valid campaign.
 *
 * Zeffy's homepage is NOT a donation checkout. Never silently send visitors
 * to the generic platform or invent a campaign URL.
 */
function verifiedCampaignShape(input: string): string | null {
  if (!input.trim()) return null;
  try {
    const url = new URL(input.trim());
    if (url.protocol !== "https:" || !["zeffy.com", "www.zeffy.com"].includes(url.hostname)) return null;
    const segments = url.pathname.split("/").filter(Boolean);
    // /, /en-US, /login, etc. are NOT campaign pages.
    if (segments.length < 2 || segments.some((segment) => /^(login|sign-in|dashboard|account|admin)$/i.test(segment))) return null;
    if (!segments.some((segment) => /^(fundraising|donation-form|ticketing|peer-to-peer|campaigns?)$/i.test(segment))) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export const ASC3ND_DONATION_URL = verifiedCampaignShape(
  process.env.NEXT_PUBLIC_ASC3ND_ZEFFY_URL?.trim() || "https://www.zeffy.com/en-US/donation-form/the-asc3nd-collective",
);
/** One destination for all donation CTAs. Replace via the verified campaign env var. */
export const ASC3ND_ZEFFY_DESTINATION = ASC3ND_DONATION_URL ?? "https://www.zeffy.com/";
export const asc3ndDonationAvailable = ASC3ND_DONATION_URL !== null;
