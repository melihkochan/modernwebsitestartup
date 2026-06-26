import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { analyticsRepository } from "../services/analytics-repository";

/**
 * Hook to retrieve core analytics metrics cards.
 */
export function useAnalyticsMetrics() {
  return useQuery({
    queryKey: queryKeys.analytics.metrics(),
    queryFn: () => analyticsRepository.getMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to retrieve analytics trend data based on timeframe.
 */
export function useAnalyticsTrends(timeframe: "daily" | "weekly" | "monthly") {
  return useQuery({
    queryKey: queryKeys.analytics.trends(timeframe),
    queryFn: () => {
      switch (timeframe) {
        case "daily":
          return analyticsRepository.getDailyData();
        case "weekly":
          return analyticsRepository.getWeeklyData();
        case "monthly":
          return analyticsRepository.getMonthlyData();
        default:
          throw new Error(`Invalid analytics timeframe: ${timeframe}`);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
