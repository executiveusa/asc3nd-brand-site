"use client";

import { useEffect } from "react";
import { revealOnce } from "@/lib/reveal";

/** Wires reveal-once to server-rendered images marked with data-reveal. Renders nothing. */
export function RevealInit() {
  useEffect(() => {
    const cleanups = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).map(revealOnce);
    return () => cleanups.forEach((fn) => fn());
  }, []);
  return null;
}
