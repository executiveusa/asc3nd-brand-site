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
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const isLightboxOpen = activeIndex !== null;

  const move = (direction: 1 | -1) => {
    setActiveIndex((current) => {
      if (current === null || approved.length < 2) return current;
      return (current + direction + approved.length) % approved.length;
    });
  };

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveIndex(null);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((current) =>
          current === null || approved.length < 2
            ? current
            : (current + 1) % approved.length,
        );
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) =>
          current === null || approved.length < 2
            ? current
            : (current - 1 + approved.length) % approved.length,
        );
        return;
      }

      if (event.key === "Tab" && lightboxRef.current) {
        const focusable = Array.from(
          lightboxRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), video[controls]',
          ),
        );

        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
    };
  }, [isLightboxOpen, approved.length]);

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
              onClick={(event) => {
                lastTriggerRef.current = event.currentTarget;
                setActiveIndex(index);
              }}
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
          ref={lightboxRef}
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
          <button ref={closeButtonRef} className="project-proof-close" type="button" onClick={() => setActiveIndex(null)} aria-label="Close gallery">
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
