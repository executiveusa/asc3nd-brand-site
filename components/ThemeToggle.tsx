"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type ColorMode = "light" | "dark";
const STORAGE_KEY = "asc3nd-color-mode";

export function ThemeToggle({ locale }: { locale: Locale }) {
  const [mode, setMode] = useState<ColorMode>("light");

  useEffect(() => {
    const root = document.documentElement;
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    const readSaved = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved === "light" || saved === "dark" ? saved : null;
      } catch { return null; }
    };
    const sync = () => {
      const next: ColorMode = readSaved() ?? (system.matches ? "dark" : "light");
      root.dataset.theme = next;
      setMode(next);
    };
    sync();
    system.addEventListener("change", sync);
    return () => system.removeEventListener("change", sync);
  }, []);

  const toggle = () => {
    const next: ColorMode = mode === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setMode(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Storage can be blocked. */ }
  };

  const label = mode === "dark"
    ? (locale === "es" ? "Activar modo claro" : "Switch to light mode")
    : (locale === "es" ? "Activar modo oscuro" : "Switch to dark mode");

  return (
    <button className="theme-toggle" type="button" onClick={toggle}
      aria-label={label} title={label} aria-pressed={mode === "dark"}>
      <Sun size={19} className="theme-sun" aria-hidden="true" />
      <Moon size={19} className="theme-moon" aria-hidden="true" />
    </button>
  );
}
