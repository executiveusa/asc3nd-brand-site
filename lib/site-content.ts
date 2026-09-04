export const siteStory = {
  hero: {
    eyebrow: "ASC3ND Collective · Everett, Washington",
    headline: ["Empower youth.", "Elevate futures.", "Build community."],
    action: "Meet ASC3ND ↓",
    actionHref: "#story",
    mediaSlot: "hero",
  },
  story: {
    eyebrow: "The founders",
    headline: "Why ASC3ND exists.",
    body: "FOUNDER STORY PLACEHOLDER — Use the founders’ own words from the recorded interviews and reels. Keep this section short: origin, belief, and what they want young people to gain.",
    founderBelief: "FOUNDER QUOTE PLACEHOLDER",
    mediaSlot: "founder",
  },
  firstChapter: {
    eyebrow: "A first chapter",
    headline: "Community Cuts for Kids",
    meta: "Everett · August 2026",
    mediaSlot: "community-cuts",
  },
  next: {
    eyebrow: "What comes next",
    headline: "Define the next chapter together.",
  },
  takePart: {
    eyebrow: "Take part",
    headline: "Stay close to the work.",
  },
  footer: {
    eyebrow: "ASC3ND, with a three.",
    lines: ["Empower youth.", "Elevate futures.", "Build community."],
  },
} as const;

export const nextChapter = [
  {
    index: "01",
    title: "Youth programs",
    copy: "TO DEFINE WITH ASC3ND",
  },
  {
    index: "02",
    title: "Mentorship",
    copy: "TO DEFINE WITH ASC3ND",
  },
  {
    index: "03",
    title: "Community partnerships",
    copy: "TO DEFINE WITH ASC3ND",
  },
] as const;

export const participationRoutes = [
  {
    index: "01",
    label: "Families",
    action: "Stay connected →",
    href: "/take-part/family",
  },
  {
    index: "02",
    label: "Mentors + volunteers",
    action: "Get involved →",
    href: "/take-part/mentor-volunteer",
  },
  {
    index: "03",
    label: "Community partners",
    action: "Talk with ASC3ND →",
    href: "/take-part/partner",
  },
] as const;
