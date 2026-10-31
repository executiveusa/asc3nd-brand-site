type BrandWordmarkProps = {
  text?: string;
  /** Retained for compatibility with older callers; lining figures now align the 3 without runtime correction. */
  digitNudgeEm?: number;
};

/** Inline brand name in running text. Lining figures (set globally) keep the 3 on the capital baseline. */
export function BrandWordmark({ text = "ASC3ND" }: BrandWordmarkProps) {
  return <span className="brand-wordmark">{text}</span>;
}
