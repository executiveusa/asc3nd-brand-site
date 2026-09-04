export const siteStory = {
  hero: {
    eyebrow: "EMPOWER YOUTH. ELEVATE FUTURES. BUILD COMMUNITY.",
    headline: "ASC3ND.ORG",
  },
  founders: [
    {
      name: "Otha",
      role: "FOUNDER",
      quote: "It’s powerful when you have someone that can sit down and talk to a young youth and just build off of what they want to have in life, and just let them know what it is that they can be a part of, which is the future.",
      mediaSlot: "founder-otha",
    },
    {
      name: "Elisha",
      role: "FOUNDER",
      quote: "I want any youth that comes even close to me, like, to walk feeling like they're a better person because they encountered love and interaction and communication with me.",
      mediaSlot: "founder-elisha",
    },
  ],
  footer: {
    lines: ["Empower youth.", "Elevate futures.", "Build community."],
  },
} as const;

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
