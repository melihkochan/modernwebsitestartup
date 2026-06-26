import { USE_MOCK_DATA } from "@/config/data-source";
import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { AnalyticsMetric, AnalyticsTrendItem } from "../validators/analytics-schemas";

export interface AnalyticsRepository {
  getMetrics(): Promise<AnalyticsMetric[]>;
  getDailyData(): Promise<AnalyticsTrendItem[]>;
  getWeeklyData(): Promise<AnalyticsTrendItem[]>;
  getMonthlyData(): Promise<AnalyticsTrendItem[]>;
}

// ---------------------------------------------------------------------------
// Mock Implementation
// ---------------------------------------------------------------------------

const MOCK_METRICS: AnalyticsMetric[] = [
  {
    label: "Peak Viewers",
    value: 18240,
    change: "+12.4%",
    isPositive: true,
    textColor: "text-[var(--live-red)]",
    glowColor: "rgba(0,242,154,0.15)",
  },
  {
    label: "Followers Gained",
    value: 14850,
    change: "+8.1%",
    isPositive: true,
    textColor: "text-purple-400",
    glowColor: "rgba(168,85,247,0.15)",
  },
  {
    label: "Hours Streamed",
    value: 124.5,
    change: "+22.7%",
    isPositive: true,
    textColor: "text-blue-400",
    glowColor: "rgba(59,130,246,0.15)",
  },
  {
    label: "Estimated Views",
    value: 485400,
    change: "-1.2%",
    isPositive: false,
    textColor: "text-amber-400",
    glowColor: "rgba(245,158,11,0.15)",
  },
];

const MOCK_DAILY: AnalyticsTrendItem[] = [
  { name: "Mon", viewers: 8400, followers: 120, hours: 4.5 },
  { name: "Tue", viewers: 11200, followers: 240, hours: 5.2 },
  { name: "Wed", viewers: 9800, followers: 180, hours: 4.0 },
  { name: "Thu", viewers: 12438, followers: 310, hours: 6.0 },
  { name: "Fri", viewers: 14800, followers: 450, hours: 6.5 },
  { name: "Sat", viewers: 10200, followers: 150, hours: 3.5 },
  { name: "Sun", viewers: 11500, followers: 210, hours: 4.8 },
];

const MOCK_WEEKLY: AnalyticsTrendItem[] = [
  { name: "Week 1", viewers: 9200, followers: 1200, hours: 22.0 },
  { name: "Week 2", viewers: 10500, followers: 1800, hours: 24.5 },
  { name: "Week 3", viewers: 11800, followers: 2400, hours: 26.0 },
  { name: "Week 4", viewers: 12438, followers: 3100, hours: 28.5 },
];

const MOCK_MONTHLY: AnalyticsTrendItem[] = [
  { name: "Jan", viewers: 6400, followers: 5200, hours: 88.0 },
  { name: "Feb", viewers: 7800, followers: 6800, hours: 94.0 },
  { name: "Mar", viewers: 9100, followers: 8400, hours: 104.5 },
  { name: "Apr", viewers: 10800, followers: 11200, hours: 112.0 },
  { name: "May", viewers: 12438, followers: 14850, hours: 124.5 },
];

const mockAnalyticsRepository: AnalyticsRepository = {
  async getMetrics() { return MOCK_METRICS; },
  async getDailyData() { return MOCK_DAILY; },
  async getWeeklyData() { return MOCK_WEEKLY; },
  async getMonthlyData() { return MOCK_MONTHLY; },
};

// ---------------------------------------------------------------------------
// Supabase Implementation
// ---------------------------------------------------------------------------

const supabaseAnalyticsRepository: AnalyticsRepository = {
  async getMetrics(): Promise<AnalyticsMetric[]> {
    const supabase = createClient();
    try {
      // Fetch channel stats or fallback to mocks
      const { error } = await supabase.from("stream_state").select("*").limit(1);
      if (error) throw new RepositoryError(error.message, "FETCH_ANALYTICS_FAILED", error);
      return MOCK_METRICS;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      const message = err instanceof Error ? err.message : "Failed to fetch metrics";
      throw new RepositoryError(message, "FETCH_ANALYTICS_FAILED", err);
    }
  },

  async getDailyData() { return MOCK_DAILY; },
  async getWeeklyData() { return MOCK_WEEKLY; },
  async getMonthlyData() { return MOCK_MONTHLY; },
};

// ---------------------------------------------------------------------------
// Unified Export Selector
// ---------------------------------------------------------------------------

export const analyticsRepository: AnalyticsRepository = USE_MOCK_DATA
  ? mockAnalyticsRepository
  : supabaseAnalyticsRepository;
