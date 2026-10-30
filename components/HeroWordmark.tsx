type Props = {
  className?: string;
};

export function HeroWordmark({ className = "" }: Props) {
  return (
    <img
      className={`hero-wordmark-svg ${className}`.trim()}
      src="/brand/asc3nd-wordmark.svg"
      alt="ASC3ND"
      width={1200}
      height={250}
      decoding="async"
    />
  );
}
