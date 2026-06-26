"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Root provider composition.
 *
 * Wraps the entire application with all required context providers
 * in the correct dependency order:
 *
 * ThemeProvider   — outermost, applies data-theme to document root
 *   QueryProvider — requires DOM, must be inside theme
 *     ToastProvider — renders the toast portal (requires DOM + client)
 *       {children}  — application tree
 *
 * Add new providers here as the application grows.
 * Never add business-logic context providers here — those belong
 * in their respective feature providers or page-level boundaries.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryProvider>
        <ToastProvider>{children}</ToastProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
