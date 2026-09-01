export const communityRoll = [
  {
    index: "01",
    title: "Arrival",
    copy: "Young people, families, volunteers, and local supporters showed up in the same place.",
  },
  {
    index: "02",
    title: "Service",
    copy: "Community Cuts for Kids centered the day on something useful: haircuts for kids.",
  },
  {
    index: "03",
    title: "Connection",
    copy: "The event gave families, volunteers, and supporters a reason to spend time together.",
  },
  {
    index: "04",
    title: "What comes next",
    copy: "ASC3ND is building from that day instead of treating it like a one-time event.",
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
