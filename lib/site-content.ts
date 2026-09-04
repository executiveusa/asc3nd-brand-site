export const siteStory = {
  hero: {
    headline: "ASC3ND.ORG",
    lines: ["EMPOWER YOUTH.", "ELEVATE FUTURES.", "BUILD COMMUNITY."],
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

export const communityRoll = [
  {
    index: "01",
    title: "Approved event image",
    copy: "CONTENT PLACEHOLDER — Add an approved Community Cuts image and a verified caption.",
    mediaSlot: "arrival",
  },
  {
    index: "02",
    title: "Verified outcome",
    copy: "CONTENT PLACEHOLDER — Add only a verified event outcome or service fact.",
    mediaSlot: "service",
  },
  {
    index: "03",
    title: "Founder reflection",
    copy: "CONTENT PLACEHOLDER — Add a founder-approved post-event reflection or participant testimony.",
    mediaSlot: "connection",
  },
  {
    index: "04",
    title: "What comes next",
    copy: "CONTENT PLACEHOLDER — Add the next confirmed activity in approved founder language.",
    mediaSlot: "next",
  },
] as const;

export const pathways = [
  {
    index: "01",
    title: "Program / activity 01",
    copy: "CONTENT PLACEHOLDER — Add a confirmed program or activity after founder approval.",
    status: "Needs approval",
  },
  {
    index: "02",
    title: "Program / activity 02",
    copy: "CONTENT PLACEHOLDER — Add a confirmed program or activity after founder approval.",
    status: "Needs approval",
  },
  {
    index: "03",
    title: "Program / activity 03",
    copy: "CONTENT PLACEHOLDER — Add only if a third confirmed program or activity is needed.",
    status: "Needs approval",
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
