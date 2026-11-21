import { getApprovedMedia, type MediaSlot } from "@/lib/media-registry";

type DocumentaryFrameProps = {
  label: string;
  slot?: MediaSlot;
  variant?: "light" | "dark";
  className?: string;
  locale?: "en" | "es";
};

export function DocumentaryFrame({
  label,
  slot,
  variant = "light",
  className = "",
  locale = "en",
}: DocumentaryFrameProps) {
  const classes = [
    "media-placeholder",
    variant === "dark" ? "dark-media" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const media = slot ? getApprovedMedia(slot) : undefined;
  const mediaAlt = locale === "es" && media?.altEs ? media.altEs : media?.alt;

  if (media?.src) {
    return (
      <figure className={[classes, "media-live"].join(" ")}>
        {media.kind === "video" ? (
          <video
            controls={!media.autoplay}
            playsInline
            poster={media.poster}
            autoPlay={media.autoplay}
            loop={media.loop}
            muted={media.autoplay || media.muted}
            aria-label={mediaAlt}
          >
            {media.mobileSrc ? (
              <source media="(max-width: 820px)" src={media.mobileSrc} />
            ) : null}
            <source src={media.src} />
          </video>
        ) : (
          <picture>
            {media.mobileSrc ? (
              <source media="(max-width: 820px)" srcSet={media.mobileSrc} />
            ) : null}
            <img src={media.src} alt={mediaAlt} loading="lazy" />
          </picture>
        )}
        {media.caption || media.credit ? (
          <figcaption>
            {media.caption ? <span>{media.caption}</span> : null}
            {media.credit ? <span>{media.credit}</span> : null}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <div className={classes} role="img" aria-label={label}>
      <span>{label}</span>
    </div>
  );
}
