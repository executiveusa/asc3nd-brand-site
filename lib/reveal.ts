/**
 * Reveal-once for images. Progressive enhancement: nothing is hidden until this runs in the
 * browser, and only for elements that are still below the fold, so content never flashes or
 * shifts and above-the-fold images are never delayed. Under prefers-reduced-motion it does nothing.
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.dataset.reveal = "done";
          observer?.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
  }
  return observer;
}

export function revealOnce(el: HTMLElement): () => void {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  if (el.dataset.reveal === "done") return () => {};
  const rect = el.getBoundingClientRect();
  // Already on screen (or above it): leave visible, no animation.
  if (rect.top < window.innerHeight) {
    el.dataset.reveal = "done";
    return () => {};
  }
  el.dataset.reveal = "pending";
  const obs = getObserver();
  obs.observe(el);
  return () => obs.unobserve(el);
}

/** Ref callback for client components (React 19 cleanup form). */
export function revealRef(el: HTMLElement | null) {
  if (!el) return;
  return revealOnce(el);
}
