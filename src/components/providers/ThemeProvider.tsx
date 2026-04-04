"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  // Applique le thème sur <html> et sauvegarde dans localStorage
  const applyTheme = useCallback((theme: ResolvedTheme) => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(theme);
    setResolvedTheme(theme);
    localStorage.setItem("yow-theme", theme);
  }, []);

  // Initialisation : localStorage → préférence système
  useEffect(() => {
    const stored = localStorage.getItem("yow-theme") as ResolvedTheme | null;
    if (stored === "light" || stored === "dark") {
      applyTheme(stored);
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(systemDark ? "dark" : "light");

      // Écoute les changements système (uniquement si pas de préférence manuelle)
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem("yow-theme")) {
          applyTheme(e.matches ? "dark" : "light");
        }
      };
      mq.addEventListener("change", handleChange);
      return () => mq.removeEventListener("change", handleChange);
    }
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    applyTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ resolvedTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
