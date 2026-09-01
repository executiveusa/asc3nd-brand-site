export type MediaStatus = "pending" | "approved" | "rejected";
export type ConsentStatus = "unknown" | "confirmed" | "not-required";
export type MediaKind = "image" | "video";

export type MediaSlot =
  | "hero"
  | "arrival"
  | "service"
  | "connection"
  | "next"
  | "founder"
  | "pathways"
  | "take-part"
  | "impact-closing"
  | "story-context";

export type DocumentaryMedia = {
  id: string;
  slot: MediaSlot;
  kind: MediaKind;
  src?: string;
  mobileSrc?: string;
  poster?: string;
  alt: string;
  caption?: string;
  credit?: string;
  status: MediaStatus;
  consent: ConsentStatus;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
};

/**
 * Every major story section has a media slot. A slot can hold either an image
 * or a video without changing page structure. Nothing renders publicly until
 * it is approved and its consent state is known.
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
  {
    id: "story-context",
    slot: "story-context",
    kind: "video",
    alt: "ASC3ND founder or community story video pending approval",
    status: "pending",
    consent: "unknown",
  },
  {
    id: "pathways-brand-media",
    slot: "pathways",
    kind: "video",
    alt: "ASC3ND pathways brand media pending approval",
    status: "pending",
    consent: "unknown",
  },
  {
    id: "take-part-brand-media",
    slot: "take-part",
    kind: "image",
    alt: "ASC3ND participation media pending approval",
    status: "pending",
    consent: "unknown",
  },
  {
    id: "impact-closing-media",
    slot: "impact-closing",
    kind: "video",
    alt: "Community Cuts closing brand film pending approval",
    status: "pending",
    consent: "unknown",
  },
];

export function getApprovedMedia(slot: MediaSlot) {
  return documentaryMedia.find(
    (item) =>
      item.slot === slot &&
      item.status === "approved" &&
      item.consent !== "unknown" &&
      Boolean(item.src),
  );
}
