"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";
import { useRealtimeInvalidation } from "@/lib/supabase/realtime-subscriptions";

/**
 * TanStack Query provider with production-optimized defaults.
 *
 * Cache Strategy (per Software Architecture Document — Section 5.1):
 * - staleTime: 5 minutes — data is considered fresh, no background refetch
 * - gcTime: 10 minutes — unused cache entries are garbage collected
 * - refetchOnWindowFocus: false — prevents jarring refetches when tab switches
 * - retry: 1 — retry once on failure before showing error state
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is fresh for 5 minutes — no unnecessary background fetches
        staleTime: 1000 * 60 * 5,
        // Cache survives for 10 minutes after component unmount
        gcTime: 1000 * 60 * 10,
        // Don't re-fetch when user switches browser tabs
        refetchOnWindowFocus: false,
        // Retry once on transient network failure
        retry: 1,
        // Retry delay with exponential backoff (capped at 30s)
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Don't retry mutations — user actions should fail explicitly
        retry: false,
      },
    },
  });
}

// Singleton for server — prevents creating a new client on every SSR request
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server-side: always create a new client (no singleton)
    return makeQueryClient();
  }
  // Browser-side: reuse the same client instance
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

/**
 * Mounts Supabase Realtime subscriptions inside the QueryClient context.
 * Must be a separate component so it can call useQueryClient() after the provider renders.
 */
function RealtimeProvider({ children }: { children: ReactNode }) {
  useRealtimeInvalidation();
  return <>{children}</>;
}

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // useState ensures client is not recreated on re-render
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <RealtimeProvider>
        {children}
      </RealtimeProvider>
      {/* DevTools only loaded in development — zero production bundle cost */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}
