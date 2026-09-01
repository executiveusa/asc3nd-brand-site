type DocumentaryFrameProps = {
  label: string;
  variant?: "light" | "dark";
  className?: string;
};

export function DocumentaryFrame({
  label,
  variant = "light",
  className = "",
}: DocumentaryFrameProps) {
  const classes = [
    "media-placeholder",
    variant === "dark" ? "dark-media" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="img" aria-label={label}>
      <span>{label}</span>
    </div>
  );
}
