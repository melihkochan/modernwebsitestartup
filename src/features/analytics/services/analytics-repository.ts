import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { AnalyticsMetric, AnalyticsTrendItem } from "../validators/analytics-schemas";

export interface AnalyticsRepository {
  getMetrics(): Promise<AnalyticsMetric[]>;
  getDailyData(): Promise<AnalyticsTrendItem[]>;
  getWeeklyData(): Promise<AnalyticsTrendItem[]>;
  getMonthlyData(): Promise<AnalyticsTrendItem[]>;
}

export const analyticsRepository: AnalyticsRepository = {
  async getMetrics(): Promise<AnalyticsMetric[]> {
    const supabase = createClient();
    try {
      const { data: historyData, error: historyError } = await supabase
        .from("stream_history")
        .select("peak_viewers, started_at, ended_at");

      if (historyError) {
        throw new RepositoryError(
          `[AnalyticsRepository] [stream_history] [SELECT] - ${historyError.message}`,
          "FETCH_ANALYTICS_FAILED",
          historyError
        );
      }

      let maxPeak: number | null = null;
      let totalHours: number | null = null;

      if (historyData && historyData.length > 0) {
        maxPeak = Math.max(...historyData.map((h) => h.peak_viewers || 0));
        
        let totalMs = 0;
        historyData.forEach((h) => {
          if (h.started_at && h.ended_at) {
            const start = new Date(h.started_at).getTime();
            const end = new Date(h.ended_at).getTime();
            if (!isNaN(start) && !isNaN(end) && end > start) {
              totalMs += (end - start);
            }
          }
        });
        totalHours = totalMs > 0 ? parseFloat((totalMs / 3600000).toFixed(1)) : 0;
      }

      const { data: dailyData, error: dailyError } = await supabase
        .from("analytics_daily")
        .select("followers_gained");

      if (dailyError) {
        throw new RepositoryError(
          `[AnalyticsRepository] [analytics_daily] [SELECT] - ${dailyError.message}`,
          "FETCH_ANALYTICS_FAILED",
          dailyError
        );
      }

      let totalFollowersGained: number | null = null;
      if (dailyData && dailyData.length > 0) {
        totalFollowersGained = dailyData.reduce((sum, d) => sum + (d.followers_gained || 0), 0);
      }

      return [
        {
          label: "Peak Viewers",
          value: maxPeak,
          change: null,
          isPositive: null,
          textColor: "text-[var(--live-red)]",
          glowColor: "rgba(0,242,154,0.15)",
        },
        {
          label: "Followers Gained",
          value: totalFollowersGained,
          change: null,
          isPositive: null,
          textColor: "text-purple-400",
          glowColor: "rgba(168,85,247,0.15)",
        },
        {
          label: "Hours Streamed",
          value: totalHours,
          change: null,
          isPositive: null,
          textColor: "text-blue-400",
          glowColor: "rgba(59,130,246,0.15)",
        },
        {
          label: "Estimated Views",
          value: null,
          change: null,
          isPositive: null,
          textColor: "text-amber-400",
          glowColor: "rgba(245,158,11,0.15)",
        },
      ];
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[AnalyticsRepository] [stream_history] [SELECT] - Failed to fetch metrics`,
        "FETCH_ANALYTICS_FAILED",
        err
      );
    }
  },

  async getDailyData(): Promise<AnalyticsTrendItem[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("analytics_daily")
        .select("date, average_viewers, followers_gained, hours_streamed")
        .order("date", { ascending: true })
        .limit(7);

      if (error) {
        throw new RepositoryError(
          `[AnalyticsRepository] [analytics_daily] [SELECT] [date, average_viewers, followers_gained, hours_streamed] - ${error.message}`,
          "FETCH_DAILY_ANALYTICS_FAILED",
          error
        );
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map((d) => {
        const dayName = new Date(d.date).toLocaleDateString("tr-TR", { weekday: "short" });
        return {
          name: dayName,
          viewers: d.average_viewers ?? 0,
          followers: d.followers_gained ?? 0,
          hours: Number(d.hours_streamed) || 0,
        };
      });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[AnalyticsRepository] [analytics_daily] [SELECT] - Failed to fetch daily analytics`,
        "FETCH_DAILY_ANALYTICS_FAILED",
        err
      );
    }
  },

  async getWeeklyData(): Promise<AnalyticsTrendItem[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("analytics_weekly")
        .select("week_start_date, average_viewers, followers_gained, hours_streamed")
        .order("week_start_date", { ascending: true })
        .limit(4);

      if (error) {
        throw new RepositoryError(
          `[AnalyticsRepository] [analytics_weekly] [SELECT] [week_start_date, average_viewers, followers_gained, hours_streamed] - ${error.message}`,
          "FETCH_WEEKLY_ANALYTICS_FAILED",
          error
        );
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map((d, idx) => ({
        name: `Hafta ${idx + 1}`,
        viewers: d.average_viewers ?? 0,
        followers: d.followers_gained ?? 0,
        hours: Number(d.hours_streamed) || 0,
      }));
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[AnalyticsRepository] [analytics_weekly] [SELECT] - Failed to fetch weekly analytics`,
        "FETCH_WEEKLY_ANALYTICS_FAILED",
        err
      );
    }
  },

  async getMonthlyData(): Promise<AnalyticsTrendItem[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("analytics_monthly")
        .select("month_start_date, average_viewers, followers_gained, hours_streamed")
        .order("month_start_date", { ascending: true })
        .limit(5);

      if (error) {
        throw new RepositoryError(
          `[AnalyticsRepository] [analytics_monthly] [SELECT] [month_start_date, average_viewers, followers_gained, hours_streamed] - ${error.message}`,
          "FETCH_MONTHLY_ANALYTICS_FAILED",
          error
        );
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map((d) => {
        const monthName = new Date(d.month_start_date).toLocaleDateString("tr-TR", { month: "short" });
        return {
          name: monthName,
          viewers: d.average_viewers ?? 0,
          followers: d.followers_gained ?? 0,
          hours: Number(d.hours_streamed) || 0,
        };
      });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[AnalyticsRepository] [analytics_monthly] [SELECT] - Failed to fetch monthly analytics`,
        "FETCH_MONTHLY_ANALYTICS_FAILED",
        err
      );
    }
  },
};
