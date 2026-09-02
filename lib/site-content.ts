export const siteStory = {
  hero: {
    eyebrow: "The ASC3ND Collective · Everett, Washington",
    headline: ["Community came through.", "Now we build forward."],
    body: "Community Cuts for Kids brought young people, families, volunteers, and local supporters into the same space. ASC3ND is building from that day with more ways for young people to find guidance, practice life skills, and connect with opportunity.",
    action: "Start with Community Cuts ↓",
    actionHref: "#impact",
    mediaSlot: "hero",
  },
  impact: {
    eyebrow: "Where it started",
    headline: "It started with Community Cuts for Kids.",
  },
  story: {
    eyebrow: "Why ASC3ND exists",
    headline: "Keep showing up after the event ends.",
    body: "ASC3ND starts with a simple belief: young people need trusted adults, useful experiences, and a community that stays involved. Community Cuts gave us a place to begin. The work now is to keep building.",
    founderBelief: "CLIENT COPY NEEDED — Add a short founder quote here (1–3 sentences) explaining why ASC3ND exists and what you want young people to feel, learn, or gain.",
    mediaSlot: "founder",
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
    action: "Stay connected →",
    href: "mailto:hello@asc3nd.org?subject=Family interest",
  },
  {
    index: "02",
    label: "Mentors + volunteers",
    action: "Tell us how you want to help →",
    href: "mailto:hello@asc3nd.org?subject=Mentor or volunteer interest",
  },
  {
    index: "03",
    label: "Community partners",
    action: "Start a conversation →",
    href: "mailto:hello@asc3nd.org?subject=Community partnership",
  },
] as const;
