"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, X, Play } from "lucide-react";
import type { ProjectMediaItem } from "@/lib/projects";
import "./project-proof-gallery.css";

type Props = {
  items: ProjectMediaItem[];
  emptyLabel?: string;
  compact?: boolean;
};

export function ProjectProofGallery({
  items,
  emptyLabel = "PROJECT MEDIA — APPROVED PHOTOS / VIDEO",
  compact = false,
}: Props) {
  const approved = items.filter(
    (item) => item.approved && item.consentConfirmed && item.src,
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % approved.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? null
            : (current - 1 + approved.length) % approved.length,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, approved.length]);

  if (!approved.length) {
    return (
      <div className="project-proof-empty" role="img" aria-label={emptyLabel}>
        <span>{emptyLabel}</span>
      </div>
    );
  }

  const active = activeIndex === null ? null : approved[activeIndex];

  return (
    <>
      <div className={`project-proof-grid${compact ? " project-proof-grid--compact" : ""}`}>
        {approved.map((item, index) => (
          <button
            className="project-proof-card"
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Open ${item.alt}`}
          >
            {item.type === "video" ? (
              <>
                <video src={item.src} poster={item.poster} muted playsInline preload="metadata" />
                <span className="project-proof-play" aria-hidden="true"><Play size={18} fill="currentColor" /></span>
              </>
            ) : (
              <img src={item.src} alt="" loading="lazy" />
            )}
            {(item.caption || item.credit) && (
              <span className="project-proof-caption">
                {item.caption || item.credit}
              </span>
            )}
          </button>
        ))}
      </div>

      {active ? (
        <div className="project-proof-lightbox" role="dialog" aria-modal="true" aria-label={active.alt}>
          <button className="project-proof-close" type="button" onClick={() => setActiveIndex(null)} aria-label="Close gallery">
            <X size={22} />
          </button>
          {approved.length > 1 ? (
            <>
              <button className="project-proof-prev" type="button" onClick={() => setActiveIndex((activeIndex! - 1 + approved.length) % approved.length)} aria-label="Previous image">
                <ArrowLeft size={24} />
              </button>
              <button className="project-proof-next" type="button" onClick={() => setActiveIndex((activeIndex! + 1) % approved.length)} aria-label="Next image">
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
