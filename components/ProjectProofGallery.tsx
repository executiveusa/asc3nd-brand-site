"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";
import type { ProjectMediaItem } from "@/lib/projects";
import type { Locale } from "@/lib/i18n";
import { galleryEs } from "@/lib/site-content.es";
import { Lightbox, galleryEn } from "@/components/Lightbox";
import { revealRef } from "@/lib/reveal";
import "./project-proof-gallery.css";

type Props = {
  items: ProjectMediaItem[];
  emptyLabel?: string;
  compact?: boolean;
  initialVisible?: number;
  maxVisible?: number;
  locale?: Locale;
};


// Layout widths of a grid card (see project-proof-gallery.css): one column up to 820px,
// two columns above it, and a featured card that spans the full shell.
const GRID_SIZES =
  "(max-width: 820px) calc(100vw - 40px), (max-width: 1600px) 45vw, 680px";
const FEATURED_SIZES =
  "(max-width: 820px) calc(100vw - 40px), (max-width: 1600px) 92vw, 1460px";

function srcSetFor(item: ProjectMediaItem) {
  if (!item.variants?.length) return undefined;
  return item.variants.map((variant) => `${variant.src} ${variant.width}w`).join(", ");
}

export function ProjectProofGallery({
  items,
  emptyLabel = "PROJECT MEDIA — APPROVED PHOTOS / VIDEO",
  compact = false,
  initialVisible,
  maxVisible,
  locale = "en",
}: Props) {
  const t = locale === "es" ? galleryEs : galleryEn;
  const approved = items.filter(
    (item) => item.approved && item.consentConfirmed && item.src,
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  if (!approved.length) {
    return (
      <div className="project-proof-empty" role="img" aria-label={emptyLabel}>
        <span>{emptyLabel}</span>
      </div>
    );
  }

  const active = activeIndex === null ? null : approved[activeIndex];
  const activeLabel = activeIndex === null || !active
    ? ""
    : `Community Cuts for Kids event photo ${activeIndex + 1} of ${approved.length}: ${active.alt}`;
  const visibleItems = maxVisible
    ? approved.slice(0, maxVisible)
    : !compact && initialVisible && !expanded
      ? approved.slice(0, initialVisible)
      : approved;
  const canExpand = !compact && initialVisible && approved.length > initialVisible && !expanded;

  return (
    <>
      <div className={`project-proof-grid${compact ? " project-proof-grid--compact" : ""}`}>
        {visibleItems.map((item, index) => {
          const aspectRatio = item.width && item.height ? `${item.width} / ${item.height}` : undefined;
          const isFeatured = item.featured || index === 0;

          return (
            <button
              className={`project-proof-card zoom-frame${isFeatured ? " project-proof-card--featured" : ""}`}
              key={item.id}
              type="button"
              onClick={(event) => {
                lastTriggerRef.current = event.currentTarget;
                setActiveIndex(index);
              }}
              aria-label={t.open(item.alt, index + 1, approved.length)}
              style={aspectRatio ? { aspectRatio } : undefined}
            >
              {item.type === "video" ? (
                <>
                  <video src={item.src} poster={item.poster} muted playsInline preload="metadata" />
                  <span className="project-proof-play" aria-hidden="true"><Play size={18} fill="currentColor" /></span>
                </>
              ) : (
                <img
                  ref={revealRef}
                  data-reveal=""
                  src={item.src}
                  srcSet={srcSetFor(item)}
                  sizes={isFeatured ? FEATURED_SIZES : GRID_SIZES}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading={index < 2 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : undefined}
                  decoding="async"
                />
              )}
              {(item.caption || item.credit) && (
                <span className="project-proof-caption">
                  {item.caption || item.credit}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {canExpand ? (
        <button
          className="project-proof-expand"
          type="button"
          aria-expanded="false"
          onClick={() => setExpanded(true)}
        >
          {t.viewAll(approved.length)} <span aria-hidden="true">→</span>
        </button>
      ) : null}

      {active ? (
        <Lightbox
          items={approved.map((item) => ({
            type: item.type === "video" ? "video" : "image",
            src: item.src,
            srcSet: srcSetFor(item),
            poster: item.poster,
            alt: item.alt,
            width: item.width,
            height: item.height,
            caption: item.caption,
            credit: item.credit,
          }))}
          index={activeIndex as number}
          onIndexChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
          label={activeLabel}
          labels={t}
          triggerRef={lastTriggerRef}
        />
      ) : null}
    </>
  );
}
