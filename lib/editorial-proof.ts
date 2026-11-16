import { asc3ndProjects, getApprovedProjectMedia, type ProjectMediaItem } from "@/lib/projects";

/**
 * One bounded editorial selection, independent of the number of published events.
 *
 * The full gallery remains on the event detail page. Story should never become
 * an archive. Approved + consent-confirmed images only.
 *
 * Fresh Fade IDs here avoid the homepage hero/focus/essay promotional images.
 * Later event launches can set priority IDs without changing Story's layout.
 */
export const STORY_PHOTO_LIMIT = 4;
const storyPriorityBySlug: Record<string, readonly string[]> = {
  "community-cuts": [
    "community-cuts-photo-002", // families exploring backpacks
    "community-cuts-photo-038", // volunteer giving a child a haircut
    "community-cuts-photo-086", // child packing school supplies
    "community-cuts-photo-049", // detail of supplies
  ],
};

/** Existing prominent homepage image IDs. They may still appear in full archives. */
const homepageFeaturedIds = new Set([
  "community-cuts-photo-060",
  "community-cuts-photo-043",
  "community-cuts-photo-059",
  "community-cuts-photo-040",
  "community-cuts-photo-046",
  "community-cuts-photo-010",
  "community-cuts-photo-042",
  "community-cuts-photo-081",
  "community-cuts-photo-017",
  "community-cuts-photo-016",
]);

const storyCaptions: Record<string, { en: string; es: string }> = {
  "community-cuts-photo-002": { en: "Families exploring school supplies", es: "Familias descubriendo útiles escolares" },
  "community-cuts-photo-038": { en: "A haircut for a young participant", es: "Un corte de pelo para un participante joven" },
  "community-cuts-photo-086": { en: "Preparing a backpack for school", es: "Preparando una mochila para la escuela" },
  "community-cuts-photo-049": { en: "Supplies ready for the community", es: "Útiles preparados para la comunidad" },
};

export type EditorialProof = {
  captionEn: string;
  captionEs: string;
  eventSlug: string;
  eventTitle: string;
  hrefEn: string;
  hrefEs: string;
  image: ProjectMediaItem;
};

/** Round-robin events to prevent the oldest event dominating future Story selections. */
export function getStoryProofs(limit = STORY_PHOTO_LIMIT): EditorialProof[] {
  const capped = Math.min(Math.max(0, Math.floor(limit)), STORY_PHOTO_LIMIT);
  const pools = asc3ndProjects.map((event) => {
    const approved = getApprovedProjectMedia(event).filter(
      (image) => image.type === "image" && !homepageFeaturedIds.has(image.id),
    );
    const priority = storyPriorityBySlug[event.slug] ?? [];
    const rank = (id: string) => {
      const index = priority.indexOf(id);
      return index < 0 ? Number.MAX_SAFE_INTEGER : index;
    };
    return {
      event,
      images: approved.slice().sort((a, b) => rank(a.id) - rank(b.id)),
      index: 0,
    };
  });
  const result: EditorialProof[] = [];
  while (result.length < capped && pools.some((pool) => pool.index < pool.images.length)) {
    for (const pool of pools) {
      if (result.length >= capped) break;
      const image = pool.images[pool.index++];
      if (!image) continue;
      result.push({
        captionEn: storyCaptions[image.id]?.en ?? pool.event.title,
        captionEs: storyCaptions[image.id]?.es ?? pool.event.title,
        eventSlug: pool.event.slug,
        eventTitle: pool.event.title,
        hrefEn: `/projects/${pool.event.slug}`,
        hrefEs: `/es/proyectos/${pool.event.slug}`,
        image,
      });
    }
  }
  return result;
}
