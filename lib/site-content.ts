export const siteStory = {
  hero: {
    eyebrow: "EMPOWER YOUTH. ELEVATE FUTURES. BUILD COMMUNITY.",
    headline: ["ASC3ND.ORG"],
    action: "↓",
    actionHref: "#story",
    mediaSlot: "hero",
  },
  story: {
    eyebrow: "WHY WE STARTED",
    headline: "Not having the right mentors around me.",
    body: "Just growing up in life, not having. Not having the right mentors around me to lead me to the success where I feel like I needed to be, I wanted to be.",
    founderBelief: "It’s powerful when you have someone that can sit down and talk to a young youth and just build off of what they want to have in life, and just let them know what it is that they can be a part of, which is the future.",
    mediaSlot: "founder",
  },
  firstChapter: {
    eyebrow: "COMMUNITY CUTS FOR KIDS",
    headline: "A big event to reach the community.",
    meta: "Everett · August 2026",
    mediaSlot: "community-cuts",
  },
  next: {
    eyebrow: "THE NEXT GENERATION",
    headline: "What we live by and stand by and what we believe.",
  },
  takePart: {
    eyebrow: "TAKE PART",
    headline: "We’re here.",
  },
  footer: {
    eyebrow: "ASC3ND.ORG",
    lines: ["Empower youth.", "Elevate futures.", "Build community."],
  },
} as const;

export const nextChapter = [
  {
    index: "01",
    title: "LOVE ON YOU.",
    copy: "we’re here to love on you",
  },
  {
    index: "02",
    title: "MENTOR YOU.",
    copy: "we’re here to help mentor you",
  },
  {
    index: "03",
    title: "GUIDE YOU.",
    copy: "guide you",
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
