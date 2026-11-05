import type { SignupCopy } from "@/components/CommunitySignup";

export type SupportCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  rows: {
    donate: { label: string; detail: string; action: string };
    volunteer: { label: string; detail: string; action: string; href: string };
    partner: { label: string; detail: string; action: string; href: string };
    supplies: { label: string; detail: string; action: string };
  };
  trust: { eyebrow: string; title: string; body: string; link: string; href: string };
};

export type ShopCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  gridLabel: string;
  demo: { chip: string; note: string; state: string };
  signup: SignupCopy;
};

export const supportEn: SupportCopy = {
  eyebrow: "Support",
  title: "Help ASC3ND grow.",
  intro: "Give, show up, partner with us, or share what you have. Choose the route that fits you.",
  rows: {
    donate: {
      label: "Donate",
      detail: "Give online through Zeffy. You will leave this site to finish your gift.",
      action: "Donate",
    },
    volunteer: {
      label: "Volunteer",
      detail: "Tell us how you would like to help. A person replies directly.",
      action: "Volunteer",
      href: "/take-part/mentor-volunteer",
    },
    partner: {
      label: "Partner",
      detail: "Organizations, businesses and neighbors who want to work with ASC3ND.",
      action: "Become a partner",
      href: "/take-part/partner",
    },
    supplies: {
      label: "Give supplies",
      detail: "Have supplies to give? Email us before you gather anything, so we can tell you whether it fits a current need.",
      action: "main@asc3nd.org",
    },
  },
  trust: {
    eyebrow: "Before you give",
    title: "Know who you are giving to.",
    body: "Before making a contribution, please confirm the legal recipient and any tax-deductibility information directly with the organization.",
    link: "Read trust and transparency",
    href: "/transparency",
  },
};

export const shopEn: ShopCopy = {
  eyebrow: "Shop",
  title: "Wear the mission.",
  intro: "A preview of what an ASC3ND shop could look like.",
  gridLabel: "ASC3ND merchandise concepts",
  demo: {
    chip: "Concept preview",
    note: "These are design concepts. Items, designs and prices are not final, and nothing is for sale yet.",
    state: "Preview only",
  },
  signup: {
    title: "Be first to know.",
    body: "One email when the shop opens, and occasional news when a program or event is confirmed. Unsubscribe any time.",
    name: "Name",
    email: "Email",
    consent: "I agree to receive ASC3ND updates by email. I can unsubscribe at any time.",
    submit: "Join updates",
    submitting: "Joining…",
    success: "You are signed up for ASC3ND updates.",
    failed: "We could not save your signup. Please try again.",
    unreachable: "We could not reach ASC3ND right now. Check your connection and try again.",
  },
};
