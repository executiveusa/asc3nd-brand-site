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
  /** Responsive WebP renditions of `src`, narrowest first. `src` stays the full-size fallback. */
  variants?: { width: number; src: string }[];
  width?: number;
  height?: number;
};

export type ProjectFilm = {
  title: string;
  embedSrc: string;
  aspectRatio: "9:16" | "16:9";
  caption?: string;
  provider: "google-drive-preview" | "cloudflare-stream" | "direct-video";
  /** First frame shown before play. */
  poster?: string;
  /** Optional 1080p file for wide screens. When unset every screen gets embedSrc (the 720p file). */
  hdSrc?: string;
};

export type ProjectCreditGroup = {
  label: string;
  entries: string[];
};

export type ProjectCredits = {
  intro: string;
  groups: ProjectCreditGroup[];
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
  credits?: ProjectCredits;
};

/**
 * The 1080p film is 218 MB, over GitHub's 100 MB file limit, so it is hosted outside the repo.
 * Leave undefined until it is uploaded; wide screens then fall back to the 720p file.
 */
const COMMUNITY_CUTS_FILM_HD_URL: string | undefined = undefined;

export const communityCutsProject: Asc3ndProject = {
  slug: "community-cuts",
  title: "Community Cuts for Kids",
  eyebrow: "Community project",
  location: "Everett, Washington",
  dateLabel: "August 2026",
  summary:
    "Community Cuts for Kids took place in Everett, Washington, in August 2026. This project page brings together the event film, approved photographs, and event credits in one public record.",
  status: "proof-building",
  featuredFilm: {
    title: "Community Cuts for Kids — full film",
    embedSrc: "/media/community-cuts/community-cuts-720.mp4",
    poster: "/media/community-cuts/community-cuts-poster-720.webp",
    hdSrc: COMMUNITY_CUTS_FILM_HD_URL,
    aspectRatio: "9:16",
    caption: "Everett, Washington, August 2026",
    provider: "direct-video",
  },
  media: communityCutsMedia,
  outcomes: [],
  quotes: [],
  credits: {
    intro:
      "To the barbers, volunteers, families, partners, photographers, organizers, and everyone who gave their time, talent, and support — thank you for showing up for the community.",
    groups: [
      { label: "Event partners", entries: ["Names to be confirmed"] },
      { label: "Sponsors", entries: ["Names to be confirmed"] },
      { label: "Barbers", entries: ["Names to be confirmed"] },
      { label: "Volunteers", entries: ["Names to be confirmed"] },
      { label: "Photography + video", entries: ["Names to be confirmed"] },
      { label: "Community partners", entries: ["Names to be confirmed"] },
      { label: "Organizers", entries: ["Names to be confirmed"] },
      { label: "Special thanks", entries: ["Names to be confirmed"] },
    ],
  },
};

export const asc3ndProjects = [communityCutsProject] as const;

export function getApprovedProjectMedia(project: Asc3ndProject) {
  return project.media.filter(
    (item) => item.approved && item.consentConfirmed && Boolean(item.src),
  );
}
