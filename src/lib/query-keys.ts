/**
 * Unified Query Key Factory for TanStack Query caching.
 *
 * Helps avoid duplicate keys, magic strings, and ensures caching invalidation remains clean.
 */
export const queryKeys = {
  live: {
    all: ["live"] as const,
    streamInfo: () => [...queryKeys.live.all, "stream-info"] as const,
    schedule: () => [...queryKeys.live.all, "schedule"] as const,
  },
  analytics: {
    all: ["analytics"] as const,
    metrics: () => [...queryKeys.analytics.all, "metrics"] as const,
    trends: (timeframe: string) => [...queryKeys.analytics.all, "trends", timeframe] as const,
  },
  community: {
    all: ["community"] as const,
    suggestions: () => [...queryKeys.community.all, "suggestions"] as const,
    poll: () => [...queryKeys.community.all, "poll"] as const,
    messages: () => [...queryKeys.community.all, "messages"] as const,
  },
  gallery: {
    all: ["gallery"] as const,
    items: (category: string) => [...queryKeys.gallery.all, "items", category] as const,
  },
  timeline: {
    all: ["timeline"] as const,
    milestones: (year: string) => [...queryKeys.timeline.all, "milestones", year] as const,
  },
  setup: {
    all: ["setup"] as const,
    products: (category: string) => [...queryKeys.setup.all, "products", category] as const,
  },
  faq: {
    all: ["faq"] as const,
    items: (category: string) => [...queryKeys.faq.all, "items", category] as const,
  },
  admin: {
    all: ["admin"] as const,
    logs: () => [...queryKeys.admin.all, "logs"] as const,
    vitals: () => [...queryKeys.admin.all, "vitals"] as const,
  },
} as const;
