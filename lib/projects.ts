import { communityCutsMedia } from "./community-cuts-media.generated";

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
  width?: number;
  height?: number;
};

export type ProjectFilm = {
  title: string;
  embedSrc: string;
  aspectRatio: "9:16" | "16:9";
  caption?: string;
  provider: "google-drive-preview" | "cloudflare-stream" | "direct-video";
};

export type Asc3ndProject = {
  slug: string;
  title: string;
  eyebrow: string;
  location: string;
  dateLabel: string;
  summary: string;
  status: "proof-building" | "published";
  featuredFilm?: ProjectFilm;
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
  featuredFilm: {
    title: "Community Cuts for Kids — full film",
    embedSrc: "https://pub-90c88be06d2b4940b0047cf04c9fed6d.r2.dev/community-cuts-opus-master-9x16.mp4",
    aspectRatio: "9:16",
    caption: "Everett, Washington · August 2026",
    provider: "direct-video",
  },
  media: communityCutsMedia,
  outcomes: [],
  quotes: [],
};

export const asc3ndProjects = [communityCutsProject] as const;

export function getApprovedProjectMedia(project: Asc3ndProject) {
  return project.media.filter(
    (item) => item.approved && item.consentConfirmed && Boolean(item.src),
  );
}
