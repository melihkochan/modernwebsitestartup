"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "zehragn-theme";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

/**
 * Theme provider implementing dark-mode-first strategy.
 *
 * Per the Architecture Document (Section 9.5):
 * "Dark mode is default. Light mode is not in scope for MVP."
 *
 * The provider is included for future light-mode support without
 * requiring a refactor. For now, it always resolves to "dark".
 *
 * Note: theme state is initialised lazily from localStorage to avoid
 * calling setState inside useEffect (react-hooks/set-state-in-effect lint rule).
 */
export function ThemeProvider({ children, defaultTheme = "dark" }: ThemeProviderProps) {
  // Lazy initializer reads localStorage on first render (client-side only)
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    return (localStorage.getItem(STORAGE_KEY) as Theme) ?? defaultTheme;
  });

  // Derive resolvedTheme without extra state — computed from theme + system preference
  const resolvedTheme: "dark" | "light" =
    theme === "system"
      ? typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  // Apply data-theme attribute to document root whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
