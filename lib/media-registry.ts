export type MediaStatus = "pending" | "approved" | "rejected";
export type ConsentStatus = "unknown" | "confirmed" | "not-required";
export type MediaKind = "image" | "video";

export type DocumentaryMedia = {
  id: string;
  slot: "hero" | "arrival" | "service" | "connection" | "next" | "founder";
  kind: MediaKind;
  src?: string;
  poster?: string;
  alt: string;
  caption?: string;
  credit?: string;
  status: MediaStatus;
  consent: ConsentStatus;
  mobileSrc?: string;
};

/**
 * No media may render publicly until `status` is approved and consent is
 * confirmed (or explicitly not required). This registry is the single source
 * of truth for documentary evidence used on the public site.
 */
export const documentaryMedia: DocumentaryMedia[] = [
  {
    id: "community-cuts-hero",
    slot: "hero",
    kind: "image",
    alt: "Community Cuts for Kids documentary media pending approval",
    status: "pending",
    consent: "unknown",
  },
  {
    id: "community-cuts-arrival",
    slot: "arrival",
    kind: "image",
    alt: "Community Cuts arrival documentary media pending approval",
    status: "pending",
    consent: "unknown",
  },
  {
    id: "community-cuts-service",
    slot: "service",
    kind: "image",
    alt: "Community Cuts service documentary media pending approval",
    status: "pending",
    consent: "unknown",
  },
  {
    id: "community-cuts-connection",
    slot: "connection",
    kind: "image",
    alt: "Community Cuts connection documentary media pending approval",
    status: "pending",
    consent: "unknown",
  },
  {
    id: "community-cuts-next",
    slot: "next",
    kind: "image",
    alt: "Community Cuts next chapter documentary media pending approval",
    status: "pending",
    consent: "unknown",
  },
  {
    id: "founder-portrait",
    slot: "founder",
    kind: "image",
    alt: "ASC3ND founder portrait pending approval",
    status: "pending",
    consent: "unknown",
  },
];

export function getApprovedMedia(slot: DocumentaryMedia["slot"]) {
  return documentaryMedia.find(
    (item) =>
      item.slot === slot &&
      item.status === "approved" &&
      item.consent !== "unknown" &&
      Boolean(item.src),
  );
}
