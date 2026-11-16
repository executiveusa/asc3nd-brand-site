"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { EditorialProof } from "@/lib/editorial-proof";
import type { Locale } from "@/lib/i18n";
import "./editorial-proof-carousel.css";

type Props = {
  items: EditorialProof[];
  locale?: Locale;
};

const labels = {
  en: {
    eyebrow: "Real moments, real community",
    heading: "Our community, in action.",
    intro: "A few moments from the initiatives behind our mission.",
    previous: "Previous photo",
    next: "Next photo",
    photo: "Photo",
    of: "of",
    full: "Explore the full event",
  },
  es: {
    eyebrow: "Momentos reales, comunidad real",
    heading: "Nuestra comunidad en acción.",
    intro: "Algunos momentos de las iniciativas que dan vida a nuestra misión.",
    previous: "Foto anterior",
    next: "Foto siguiente",
    photo: "Foto",
    of: "de",
    full: "Conoce el evento completo",
  },
} as const;

/**
 * Intentionally simple: no autoplay, no lightbox, no animation library.
 * Native overflow scrolling works with touch, keyboard focus and trackpads.
 * Buttons advance by one card, while an IntersectionObserver-free scroll
 * calculation keeps the counter synchronized with direct mobile swipes.
 */
export function EditorialProofCarousel({ items, locale = "en" }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const t = labels[locale];
  if (!items.length) return null;
  const visible = items.slice(0, 4);
  const advance = (next: number) => {
    const safe = Math.max(0, Math.min(next, visible.length - 1));
    const rail = railRef.current;
    const target = rail?.children[safe] as HTMLElement | undefined;
    if (rail && target) {
      rail.scrollTo({ left: target.offsetLeft - rail.offsetLeft, behavior: "smooth" });
    }
    setIndex(safe);
  };
  const onScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    const slides = Array.from(rail.children) as HTMLElement[];
    const nearest = slides.reduce(
      (best, slide, i) =>
        Math.abs(slide.offsetLeft - rail.offsetLeft - rail.scrollLeft) <
        Math.abs(slides[best].offsetLeft - rail.offsetLeft - rail.scrollLeft)
          ? i : best,
      0,
    );
    setIndex(nearest);
  };
  const firstEventHref = locale === "es" ? visible[0].hrefEs : visible[0].hrefEn;

  return (
    <section className="editorial-proof shell" aria-labelledby="editorial-proof-heading">
      <div className="editorial-proof-top">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="editorial-proof-heading">{t.heading}</h2>
          <p className="editorial-proof-intro">{t.intro}</p>
        </div>
        <div className="editorial-proof-tools">
          <span className="editorial-proof-count" aria-live="off" aria-label={`${t.photo} ${index + 1} ${t.of} ${visible.length}`}>
            {String(index + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
          </span>
          {visible.length > 1 ? (
            <div className="editorial-proof-arrows">
              <button type="button" aria-label={t.previous} disabled={index === 0} onClick={() => advance(index - 1)}><ArrowLeft size={18} aria-hidden="true" /></button>
              <button type="button" aria-label={t.next} disabled={index >= visible.length - 1} onClick={() => advance(index + 1)}><ArrowRight size={18} aria-hidden="true" /></button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="editorial-proof-rail" ref={railRef} onScroll={onScroll} role="region" aria-roledescription="carousel" aria-label={t.heading} tabIndex={0}>
        {visible.map(({ image, eventTitle, hrefEn, hrefEs, captionEn, captionEs }, i) => (
          <figure className="editorial-proof-slide" key={image.id} role="group" aria-roledescription="slide" aria-label={`${i + 1} ${t.of} ${visible.length}`}>
            <Link href={locale === "es" ? hrefEs : hrefEn} aria-label={`${eventTitle}: ${locale === "es" ? image.altEs || image.alt : image.alt}`}>
              <img
                src={image.variants?.[0]?.src || image.src}
                srcSet={image.variants?.map((v) => `${v.src} ${v.width}w`).join(", ")}
                sizes="(max-width: 820px) 80vw, 45vw"
                width={image.width}
                height={image.height}
                alt={locale === "es" ? image.altEs || image.alt : image.alt}
                loading="lazy"
                decoding="async"
              />
            </Link>
            <figcaption>{locale === "es" ? captionEs : captionEn}</figcaption>
          </figure>
        ))}
      </div>
      <Link className="editorial-proof-full" href={firstEventHref}>
        {t.full} <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
