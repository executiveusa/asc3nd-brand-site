/** Campaign-specific Zeffy link, never a generic Zeffy homepage. */
const candidate = process.env.NEXT_PUBLIC_ASC3ND_ZEFFY_URL?.trim() || "";
export const ZEFFY_DONATE_URL = (() => {
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" && ["zeffy.com", "www.zeffy.com"].includes(url.hostname) && url.pathname.includes("/fundraising/") ? candidate : "";
  } catch { return ""; }
})();

export const siteStory = {
  hero: {
    headline: "ASC3ND",
    lines: ["Empower youth.", "Elevate futures.", "Build community."],
  },
  founders: [
    {
      name: "Otha Minnifield",
      role: "Founder",
      quote: "It’s powerful when you have someone that can sit down and talk to a young youth and just build off of what they want to have in life, and just let them know what it is that they can be a part of, which is the future.",
      mediaSlot: "founder-otha",
    },
    {
      name: "Elisha Minnifield",
      role: "Founder",
      quote: "I want any youth that comes even close to me to walk feeling like they’re a better person because they encountered love and interaction and communication with me.",
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
  { index: "01", title: "Trusted Guidance", copy: "We believe every young person deserves someone in their corner. Through mentorship, encouragement, and meaningful relationships, we aim to connect youth with positive role models who inspire confidence, provide guidance, and help them navigate life's opportunities and challenges." },
  { index: "02", title: "Life Skills & Personal Growth", copy: "Empowering the next generation goes beyond the classroom. We envision creating opportunities for young people to build confidence, develop practical life skills, strengthen communication, and gain the tools they need to thrive." },
  { index: "03", title: "Community Connections & Opportunity", copy: "Strong communities create stronger futures. Through outreach initiatives, collaborative partnerships, and community-driven experiences, we strive to connect youth and families with resources, opportunities, and support that make a lasting difference." },
] as const;

export const participationRoutes = [
  {
    index: "01",
    label: "Families & Youth",
    action: "Stay connected",
    detail: "Learn about upcoming events, programs, and community resources for your family.",
    href: "/take-part/family",
  },
  {
    index: "02",
    label: "Volunteers & Mentors",
    action: "Get involved",
    detail: "Contribute your time, talents, and experiences to support young people.",
    href: "/take-part/mentor-volunteer",
  },
  {
    index: "03",
    label: "Community Partners & Sponsors",
    action: "Talk with ASC3ND",
    detail: "Businesses, organizations, and individuals can collaborate, sponsor events, or provide resources.",
    href: "/take-part/partner",
  },
  { index: "04", label: "Support Our Mission", action: "Support ASC3ND", detail: "Explore ways to contribute, including a conversation about giving.", href: "/support" },
] as const;
