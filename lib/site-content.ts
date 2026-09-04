export const siteStory = {
  hero: {
    eyebrow: "EMPOWER YOUTH. ELEVATE FUTURES. BUILD COMMUNITY.",
    headline: ["ASC3ND.ORG"],
    body: "",
    action: "",
    actionHref: "#impact",
    mediaSlot: "hero",
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
  impact: {
    eyebrow: "Where it started",
    headline: "It started with Community Cuts for Kids.",
  },
  pathways: {
    eyebrow: "What comes next",
    headline: "Three areas we are building now.",
    mediaSlot: "pathways",
  },
  takePart: {
    eyebrow: "Take part",
    headline: "Want to be part of what comes next?",
    mediaSlot: "take-part",
  },
  footer: {
    eyebrow: "ASC3ND, with a three.",
    lines: ["Empower youth.", "Elevate futures.", "Build community."],
  },
} as const;

export const communityRoll = [
  {
    index: "01",
    title: "Arrival",
    copy: "Young people, families, volunteers, and local supporters showed up in the same place.",
    mediaSlot: "arrival",
  },
  {
    index: "02",
    title: "Service",
    copy: "Community Cuts for Kids centered the day on something useful: haircuts for kids.",
    mediaSlot: "service",
  },
  {
    index: "03",
    title: "Connection",
    copy: "The event gave families, volunteers, and supporters a reason to spend time together.",
    mediaSlot: "connection",
  },
  {
    index: "04",
    title: "What comes next",
    copy: "ASC3ND is building from that day instead of treating it like a one-time event.",
    mediaSlot: "next",
  },
] as const;

export const pathways = [
  {
    index: "01",
    title: "Trusted guidance",
    copy: "We want young people to have adults who listen, stay present, and help them sort out what comes next.",
    status: "In development",
  },
  {
    index: "02",
    title: "Leadership + life skills",
    copy: "We are developing experiences where young people can practice confidence, responsibility, and everyday problem-solving.",
    status: "In development",
  },
  {
    index: "03",
    title: "Community-built opportunity",
    copy: "We want families, schools, mentors, and local partners to open more doors together.",
    status: "In development",
  },
] as const;

export const participationRoutes = [
  {
    index: "01",
    label: "Families",
    action: "Tell us what your family needs →",
    href: "/take-part/family",
  },
  {
    index: "02",
    label: "Mentors + volunteers",
    action: "Tell us how you want to help →",
    href: "/take-part/mentor-volunteer",
  },
  {
    index: "03",
    label: "Community partners",
    action: "Choose partnership, sponsorship, or supplies →",
    href: "/take-part/partner",
  },
] as const;
