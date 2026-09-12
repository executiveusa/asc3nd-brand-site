"use client";

import { useEffect, useRef, useState } from "react";

type BrandWordmarkProps = {
  text?: string;
  /** Small optical correction, in em, applied after ink-bound alignment. Negative values raise the 3. */
  digitNudgeEm?: number;
};

/** Match the numeral's ink bounds to the surrounding letters in the inherited font. */
export function BrandWordmark({ text = "ASC3ND", digitNudgeEm = 0 }: BrandWordmarkProps) {
  const root = useRef<HTMLSpanElement>(null);
  const [metrics, setMetrics] = useState<{ size: number; top: number } | null>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    let active = true;
    const measure = () => {
      if (!active) return;
      const style = getComputedStyle(element);
      const fontSize = parseFloat(style.fontSize);
      if (!fontSize) return;
      context.font = style.font;
      const index = text.indexOf("3");
      const letters = context.measureText(text.slice(0, index) + text.slice(index + 1));
      const digit = context.measureText("3");
      const letterHeight = letters.actualBoundingBoxAscent + letters.actualBoundingBoxDescent;
      const digitHeight = digit.actualBoundingBoxAscent + digit.actualBoundingBoxDescent;
      if (!letterHeight || !digitHeight) return;
      const size = letterHeight / digitHeight;
      const top = letters.actualBoundingBoxDescent - size * digit.actualBoundingBoxDescent;
      setMetrics((previous) => previous?.size === size && previous.top === top ? previous : { size, top });
    };
    measure();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(element);
    document.fonts?.ready.then(measure);
    document.fonts?.addEventListener("loadingdone", measure);
    return () => {
      active = false;
      observer?.disconnect();
      document.fonts?.removeEventListener("loadingdone", measure);
    };
  }, [text]);

  const index = text.indexOf("3");
  if (index < 0) return <span>{text}</span>;
  const top = metrics
    ? digitNudgeEm === 0
      ? `${metrics.top}px`
      : `calc(${metrics.top}px + ${digitNudgeEm}em)`
    : digitNudgeEm === 0
      ? undefined
      : `${digitNudgeEm}em`;

  return (
    <span ref={root} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, index)}</span>
      <span
        aria-hidden="true"
        style={{
          position: "relative",
          fontSize: metrics ? `${metrics.size}em` : undefined,
          top,
        }}
      >
        {text[index]}
      </span>
      <span aria-hidden="true">{text.slice(index + 1)}</span>
    </span>
  );
}
