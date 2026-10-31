"use client";

import { useEffect, useRef } from "react";
import { revealRef } from "@/lib/reveal";

type Props = { src: string; poster: string; className?: string };

/**
 * Decorative silent loop. Never plays under prefers-reduced-motion (poster only), and pauses
 * whenever it is off screen. Plays from script rather than the autoplay attribute so a
 * reduced-motion visitor never gets a first frame of motion.
 */
export function LoopVideo({ src, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    const sync = () => {
      if (query.matches || !visible) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    query.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      query.removeEventListener("change", sync);
      video.pause();
    };
  }, []);

  return (
    <video
      ref={(el) => {
        ref.current = el;
        return revealRef(el);
      }}
      className={className}
      data-reveal=""
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
    />
  );
}
