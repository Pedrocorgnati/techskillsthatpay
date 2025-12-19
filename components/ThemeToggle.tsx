/*
 * Theme toggle uses next-themes to avoid hydration mismatch (waits for mount).
 */
"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = theme === "system" ? systemTheme : theme;

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {!mounted ? (
        <span className="h-5 w-5 rounded-full bg-slate-300 dark:bg-slate-600" />
      ) : current === "dark" ? (
        <SunIcon className="h-5 w-5 text-amber-300" />
      ) : (
        <MoonIcon className="h-5 w-5 text-text-primary" />
      )}
    </button>
  );
}
