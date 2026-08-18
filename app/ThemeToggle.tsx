"use client";

import { useEffect } from "react";

export default function ThemeToggle() {
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = (event: MediaQueryListEvent) => {
      if (localStorage.getItem("milindyadav-theme")) return;
      const next = event.matches ? "dark" : "light";
      root.dataset.theme = next;
      root.style.colorScheme = next;
    };

    media.addEventListener("change", followSystem);
    return () => media.removeEventListener("change", followSystem);
  }, []);

  const toggleTheme = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    localStorage.setItem("milindyadav-theme", next);
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
    >
      <span className="theme-icon theme-icon-sun" aria-hidden="true">☀</span>
      <span className="theme-icon theme-icon-moon" aria-hidden="true">◐</span>
      <span className="theme-label">Theme</span>
    </button>
  );
}
