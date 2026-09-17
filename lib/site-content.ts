export const siteStory = {
  hero: {
    headline: "ASC3ND.ORG",
    lines: ["EMPOWER YOUTH.", "ELEVATE FUTURES.", "BUILD COMMUNITY."],
  },
  founders: [
    {
      name: "Otha Minnifield",
      role: "FOUNDER",
      quote: "It’s powerful when you have someone that can sit down and talk to a young youth and just build off of what they want to have in life, and just let them know what it is that they can be a part of, which is the future.",
      mediaSlot: "founder-otha",
    },
    {
      name: "Elisha Minnifield",
      role: "FOUNDER",
      quote: "I want any youth that comes even close to me to walk feeling like they're a better person because they encountered love and interaction and communication with me.",
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
    title: "Everett, Washington",
    copy: "Community Cuts for Kids took place in Everett in August 2026.",
    mediaSlot: "arrival",
  },
  {
    index: "02",
    title: "Full event film",
    copy: "The complete Community Cuts film is published with the project record.",
    mediaSlot: "service",
  },
  {
    index: "03",
    title: "86 approved photographs",
    copy: "The project record includes 86 approved event photographs.",
    mediaSlot: "connection",
  },
  {
    index: "04",
    title: "Event credits",
    copy: "ASC3ND is documenting the people and organizations that helped make the event possible.",
    mediaSlot: "next",
  },
] as const;

export const pathways = [
  {
    index: "01",
    title: "Trusted guidance",
    copy: "Connect young people with adults who can listen, encourage, and help them see practical next steps.",
    status: "In development",
  },
  {
    index: "02",
    title: "Life skills",
    copy: "Create useful experiences where young people can practice communication, confidence, and everyday skills.",
    status: "In development",
  },
  {
    index: "03",
    title: "Community opportunity",
    copy: "Connect young people and families with people, programs, and opportunities in their community.",
    status: "In development",
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
