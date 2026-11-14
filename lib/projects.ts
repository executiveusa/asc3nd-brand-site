import { creditGroupsForDialog } from "./credits";
import { communityCutsMedia } from "./community-cuts-media.generated";

export type ProjectMediaType = "image" | "video";

export type ProjectMediaItem = {
  id: string;
  type: ProjectMediaType;
  src?: string;
  poster?: string;
  alt: string;
  /** Spanish alt text; Spanish pages fall back to `alt` when it is missing. */
  altEs?: string;
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
  story?: string[];
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
  title: "Fresh Fade, Fresh Grade",
  eyebrow: "Community project",
  location: "Everett, Washington",
  dateLabel: "August 2026",
  summary:
    "Our inaugural Fresh Fade, Fresh Grade initiative brought our community together to help local youth prepare for the new school year with confidence and excitement.",
  story: [
    "Through community collaboration, giving, and meaningful connections, we celebrated the importance of showing up for our youth and reminding them that they are supported, valued, and capable of achieving great things.",
    "More than a back-to-school event, this initiative represented the beginning of Asc3nd Collective's commitment to uplifting the next generation, one meaningful experience at a time.",
  ],
  status: "proof-building",
  featuredFilm: {
    title: "Fresh Fade, Fresh Grade — full film",
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
    groups: creditGroupsForDialog("en"),
  },
};

export const asc3ndProjects = [communityCutsProject] as const;

export function getApprovedProjectMedia(project: Asc3ndProject) {
  return project.media.filter(
    (item) => item.approved && item.consentConfirmed && Boolean(item.src),
  );
}
