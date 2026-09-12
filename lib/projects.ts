export type ProjectMediaType = "image" | "video";

export type ProjectMediaItem = {
  id: string;
  type: ProjectMediaType;
  src?: string;
  poster?: string;
  alt: string;
  caption?: string;
  credit?: string;
  approved: boolean;
  consentConfirmed: boolean;
  featured?: boolean;
};

export type Asc3ndProject = {
  slug: string;
  title: string;
  eyebrow: string;
  location: string;
  dateLabel: string;
  summary: string;
  status: "proof-building" | "published";
  media: ProjectMediaItem[];
  outcomes: string[];
  quotes: { quote: string; attribution: string }[];
};

export const communityCutsProject: Asc3ndProject = {
  slug: "community-cuts",
  title: "Community Cuts for Kids",
  eyebrow: "PROJECT 001",
  location: "Everett, Washington",
  dateLabel: "August 2026",
  summary:
    "Community Cuts for Kids is the first public project in ASC3ND's story. This record is designed to hold the approved photographs, video, outcomes, partners, and testimony that prove what happened.",
  status: "proof-building",
  media: [],
  outcomes: [],
  quotes: [],
};

export const asc3ndProjects = [communityCutsProject] as const;

export function getApprovedProjectMedia(project: Asc3ndProject) {
  return project.media.filter(
    (item) => item.approved && item.consentConfirmed && Boolean(item.src),
  );
}
