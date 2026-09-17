"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X, Play } from "lucide-react";
import type { ProjectMediaItem } from "@/lib/projects";
import "./project-proof-gallery.css";

type Props = {
  items: ProjectMediaItem[];
  emptyLabel?: string;
  compact?: boolean;
  initialVisible?: number;
};

const SWIPE_THRESHOLD = 42;

export function ProjectProofGallery({
  items,
  emptyLabel = "PROJECT MEDIA — APPROVED PHOTOS / VIDEO",
  compact = false,
  initialVisible,
}: Props) {
  const approved = items.filter(
    (item) => item.approved && item.consentConfirmed && item.src,
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const move = (direction: 1 | -1) => {
    setActiveIndex((current) => {
      if (current === null || approved.length < 2) return current;
      return (current + direction + approved.length) % approved.length;
    });
  };

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex, approved.length]);

  if (!approved.length) {
    return (
      <div className="project-proof-empty" role="img" aria-label={emptyLabel}>
        <span>{emptyLabel}</span>
      </div>
    );
  }

  const active = activeIndex === null ? null : approved[activeIndex];
  const visibleItems = !compact && initialVisible && !expanded
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
              className={`project-proof-card${isFeatured ? " project-proof-card--featured" : ""}`}
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Open ${item.alt}`}
              style={aspectRatio ? { aspectRatio } : undefined}
            >
              {item.type === "video" ? (
                <>
                  <video src={item.src} poster={item.poster} muted playsInline preload="metadata" />
                  <span className="project-proof-play" aria-hidden="true"><Play size={18} fill="currentColor" /></span>
                </>
              ) : (
                <img src={item.src} alt="" loading={index < 3 ? "eager" : "lazy"} decoding="async" />
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
          View all {approved.length} photos <span aria-hidden="true">→</span>
        </button>
      ) : null}

      {active ? (
        <div
          className="project-proof-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onTouchStart={(event) => {
            touchStartX.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
            const delta = endX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(delta) < SWIPE_THRESHOLD) return;
            move(delta < 0 ? 1 : -1);
          }}
        >
          <button className="project-proof-close" type="button" onClick={() => setActiveIndex(null)} aria-label="Close gallery">
            <X size={22} />
          </button>
          {approved.length > 1 ? (
            <>
              <button className="project-proof-prev" type="button" onClick={() => move(-1)} aria-label="Previous image">
                <ArrowLeft size={24} />
              </button>
              <button className="project-proof-next" type="button" onClick={() => move(1)} aria-label="Next image">
                <ArrowRight size={24} />
              </button>
            </>
          ) : null}
          <figure>
            {active.type === "video" ? (
              <video src={active.src} poster={active.poster} controls autoPlay playsInline />
            ) : (
              <img src={active.src} alt={active.alt} />
            )}
            {(active.caption || active.credit) && (
              <figcaption>
                {active.caption ? <span>{active.caption}</span> : null}
                {active.credit ? <span>{active.credit}</span> : null}
              </figcaption>
            )}
          </figure>
        </div>
      ) : null}
    </>
  );
}
