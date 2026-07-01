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

    // ── 1. Automatic client-side background sync interval ────────────────────
    const syncKick = async () => {
      try {
        await supabase.functions.invoke("kick-sync", { method: "POST" });
      } catch (err) {
        console.error("[RealtimeSubscriptions] Failed to invoke automatic synchronization:", err);
      }
    };

    // Run once on mount and then every 60 seconds
    void syncKick();
    const syncInterval = setInterval(syncKick, 60000);

    // ── 2. Admin DOM Injection for Telemetry Monitoring ──────────────────────
    const monitorInterval = setInterval(() => {
      if (typeof window === "undefined" || !window.location.pathname.includes("/admin")) {
        return;
      }
      
      const parent = Array.from(document.querySelectorAll("div")).find(
        (el) =>
          el.className.includes("flex-col") &&
          el.className.includes("gap-3.5") &&
          el.className.includes("font-mono")
      );
      if (!parent) return;

      const rows = parent.querySelectorAll(".flex.justify-between.items-center");
      if (rows.length === 0) return;

      const lastSyncRow = rows[0];
      const lastSyncTimeStr = lastSyncRow.querySelector(".font-semibold")?.textContent || "";
      if (!lastSyncTimeStr || lastSyncTimeStr === "Hiçbir zaman" || lastSyncTimeStr === "Bilinmiyor") return;

      const existingNextRow = parent.querySelector("[data-injected-next-sync]");
      if (existingNextRow) {
        const lastTimeChecked = existingNextRow.getAttribute("data-last-sync-time");
        if (lastTimeChecked === lastSyncTimeStr) {
          return;
        }
        existingNextRow.remove();
      }

      const parts = lastSyncTimeStr.split(":");
      if (parts.length === 3) {
        const lastDate = new Date();
        lastDate.setHours(parseInt(parts[0], 10));
        lastDate.setMinutes(parseInt(parts[1], 10));
        lastDate.setSeconds(parseInt(parts[2], 10));

        const nextDate = new Date(lastDate.getTime() + 60000);
        const nextTimeStr = nextDate.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const nextRow = document.createElement("div");
        nextRow.className = "flex justify-between items-center border-b border-[var(--border-subtle)] pb-2";
        nextRow.setAttribute("data-injected-next-sync", "true");
        nextRow.setAttribute("data-last-sync-time", lastSyncTimeStr);
        nextRow.innerHTML = `
          <span class="text-[var(--text-tertiary)]">Sonraki Planlanan</span>
          <span class="text-[var(--text-primary)] font-semibold">${nextTimeStr}</span>
        `;
        lastSyncRow.after(nextRow);

        const labelSpan = lastSyncRow.querySelector("span:first-child");
        if (labelSpan) {
          labelSpan.textContent = "Son Otomatik Eşitleme";
        }
      }
    }, 1000);

    // ── 3. Realtime table subscriptions and dynamic invalidation ────────────
    const streamChannel = supabase
      .channel("realtime:stream_state")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stream_state" },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.live.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          queryClient.setQueryDefaults(queryKeys.live.all, { refetchInterval: 60000 });
          queryClient.setQueryDefaults(queryKeys.admin.all, { refetchInterval: 60000 });
          queryClient.setQueryDefaults(queryKeys.analytics.all, { refetchInterval: 60000 });
        } else {
          queryClient.setQueryDefaults(queryKeys.live.all, { refetchInterval: 15000 });
          queryClient.setQueryDefaults(queryKeys.admin.all, { refetchInterval: 15000 });
          queryClient.setQueryDefaults(queryKeys.analytics.all, { refetchInterval: 15000 });
        }
      });

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

    // Cleanup: remove all intervals and channels on unmount
    return () => {
      clearInterval(syncInterval);
      clearInterval(monitorInterval);
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
