"use client";

import { useEffect, useRef, type RefObject } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import "./project-proof-gallery.css";

export type LightboxItem = {
  type?: "image" | "video";
  src?: string;
  srcSet?: string;
  poster?: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  credit?: string;
};

export const galleryEn = {
  open: (alt: string, n: number, total: number) => `Open photo ${n} of ${total}: ${alt}`,
  viewAll: (n: number) => `View all ${n} photos`,
  close: "Close gallery",
  prev: "Previous image",
  next: "Next image",
};

const SWIPE_THRESHOLD = 42;
const LIGHTBOX_SIZES = "(max-width: 1466px) 90vw, 1320px";

type Props = {
  items: LightboxItem[];
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
  label: string;
  labels: { close: string; prev: string; next: string };
  /** Element that opened the lightbox; focus returns to it on close. */
  triggerRef: RefObject<HTMLElement | null>;
};

/**
 * Shared photo lightbox: Escape, arrow keys, Tab focus trap, swipe, focus restored to the trigger.
 * Mount it only while open; unmounting closes it.
 */
export function Lightbox({ items, index, onIndexChange, onClose, label, labels, triggerRef }: Props) {
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const live = useRef({ index, count: items.length, onIndexChange, onClose });
  live.current = { index, count: items.length, onIndexChange, onClose };

  const move = (direction: 1 | -1) => {
    const { index: current, count } = live.current;
    if (count < 2) return;
    live.current.onIndexChange((current + direction + count) % count);
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        live.current.onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
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
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = items[index];
  if (!active) return null;

  return (
    <div
      ref={lightboxRef}
      className="project-proof-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={label}
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
      <button ref={closeButtonRef} className="project-proof-close" type="button" onClick={onClose} aria-label={labels.close}>
        <X size={22} />
      </button>
      {items.length > 1 ? (
        <>
          <button className="project-proof-prev" type="button" onClick={() => move(-1)} aria-label={labels.prev}>
            <ArrowLeft size={24} />
          </button>
          <button className="project-proof-next" type="button" onClick={() => move(1)} aria-label={labels.next}>
            <ArrowRight size={24} />
          </button>
        </>
      ) : null}
      <figure>
        {active.type === "video" ? (
          <video src={active.src} poster={active.poster} controls autoPlay playsInline />
        ) : (
          <img
            src={active.src}
            srcSet={active.srcSet}
            sizes={LIGHTBOX_SIZES}
            alt={active.alt}
            width={active.width}
            height={active.height}
            decoding="async"
          />
        )}
        {(active.caption || active.credit) && (
          <figcaption>
            {active.caption ? <span>{active.caption}</span> : null}
            {active.credit ? <span>{active.credit}</span> : null}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
