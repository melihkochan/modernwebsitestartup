"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";

/**
 * Global Supabase Realtime subscription hook.
 *
 * Mount this once at the application root (inside QueryProvider).
 * It subscribes to all relevant postgres_changes and automatically
 * invalidates the affected TanStack Query cache keys — no polling,
 * no manual refresh.
 *
 * Subscriptions are cleaned up on component unmount to prevent leaks.
 * Duplicate subscriptions are prevented because each channel has a unique name.
 */
export function useRealtimeInvalidation(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    // ── stream_state: live status, viewer count, game, title ──────────────
    const streamChannel = supabase
      .channel("realtime:stream_state")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stream_state" },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.live.all });
        }
      )
      .subscribe();

    // ── viewer_history: historical viewer data for analytics ───────────────
    const viewerChannel = supabase
      .channel("realtime:viewer_history")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "viewer_history" },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.live.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
        }
      )
      .subscribe();

    // ── analytics_daily: daily aggregated analytics ────────────────────────
    const analyticsChannel = supabase
      .channel("realtime:analytics_daily")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "analytics_daily" },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
        }
      )
      .subscribe();

    // ── polls: active community polls ──────────────────────────────────────
    const pollsChannel = supabase
      .channel("realtime:polls")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "polls" },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.community.poll() });
        }
      )
      .subscribe();

    // ── game_suggestions: community game suggestion voting ─────────────────
    const suggestionsChannel = supabase
      .channel("realtime:game_suggestions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "game_suggestions" },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.community.suggestions() });
        }
      )
      .subscribe();

    // ── notifications: system notifications ───────────────────────────────
    const notificationsChannel = supabase
      .channel("realtime:notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
        }
      )
      .subscribe();

    // ── announcements: broadcast announcements ─────────────────────────────
    const announcementsChannel = supabase
      .channel("realtime:announcements")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
        }
      )
      .subscribe();

    // ── settings: kick-sync writes result here → invalidate live/analytics/admin ─
    const settingsChannel = supabase
      .channel("realtime:settings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "settings" },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.live.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
        }
      )
      .subscribe();

    // Cleanup: remove all channels on unmount
    return () => {
      void supabase.removeChannel(streamChannel);
      void supabase.removeChannel(viewerChannel);
      void supabase.removeChannel(analyticsChannel);
      void supabase.removeChannel(pollsChannel);
      void supabase.removeChannel(suggestionsChannel);
      void supabase.removeChannel(notificationsChannel);
      void supabase.removeChannel(announcementsChannel);
      void supabase.removeChannel(settingsChannel);
    };
  }, [queryClient]);
}
