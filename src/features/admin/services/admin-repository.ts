import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import { fetchSteamGameDetails } from "@/lib/steam/steam-api";

export interface CreatorSyncStatus {
  status: "success" | "failed" | "syncing" | "idle";
  last_success_at: string | null;
  last_failed_at: string | null;
  last_response_time_ms: number;
  duration_ms: number;
  updated_records: number;
  updated_tables: number;
  error: string | null;
  provider: string;
  channel: string;
}

export interface AdminSuggestion {
  id: string;
  game: string;
  votes: number;
  submittedBy: string;
  adminNote: string;
  status: "pending" | "approved" | "rejected";
  steamAppId: number | null;
  platform?: string | null;
  coverImageUrl?: string | null;
  steamDetails?: {
    name: string;
    headerImage: string;
    shortDescription: string;
    releaseDate?: string;
    genres?: string[];
    price?: string;
    recommendations?: number;
    score?: number;
  } | null;
}

export interface AdminStreamHistory {
  id: string;
  title: string;
  category: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  peakViewers: number;
  averageViewers: number;
  totalViews: number;
  followersGained: number;
  status: "scheduled" | "live" | "ended" | "cancelled";
  vodUrl: string | null;
  endedReason: string | null;
  streamNumber: number;
}

export interface CreatorStats {
  isLive: boolean;
  currentGame: string | null;
  streamTitle: string | null;
  startedAt: string | null;
  viewerCount: number;
  thumbnailUrl: string | null;
  streamUrl: string | null;
  lastCheckedAt: string | null;
  totalFollowers: number | null;
  totalSubscribers: number | null;
  peakViewers: number | null;
  averageViewers: number | null;
  totalStreams: number;
  lastSync: CreatorSyncStatus | null;
  recentStream: {
    title: string;
    game: string;
    durationMinutes: number;
    date: string;
  } | null;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string | null;
  admin_username?: string;
  action: string;
  entity: string;
  entity_id: string | null;
  old_data: any;
  new_data: any;
  created_at: string;
}

export const adminRepository = {
  // Activity Logging helper
  async logActivity(action: string, entity: string, entityId: string | null, oldData: any = null, newData: any = null): Promise<void> {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("admin_activity_logs").insert({
        admin_id: user?.id || null,
        action,
        entity,
        entity_id: entityId,
        old_data: oldData,
        new_data: newData,
      });
    } catch (err) {
      console.warn("Failed to write activity log:", err);
    }
  },

  async getActivityLogs(): Promise<AdminActivityLog[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("admin_activity_logs")
        .select(`
          *,
          profiles:admin_id (
            username
          )
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []).map((d) => ({
        id: d.id,
        admin_id: d.admin_id,
        admin_username: (d as any).profiles?.username || "Anonim Admin",
        action: d.action,
        entity: d.entity,
        entity_id: d.entity_id,
        old_data: d.old_data,
        new_data: d.new_data,
        created_at: d.created_at,
      }));
    } catch (err) {
      throw new RepositoryError("Failed to fetch activity logs", "FETCH_LOGS_FAILED", err);
    }
  },

  async getSuggestions(): Promise<AdminSuggestion[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("game_suggestions")
        .select(`
          *,
          profiles:suggested_by (
            username
          )
        `)
        .order("votes_count", { ascending: false });

      if (error) throw error;
      if (!data) return [];

      const suggestions = await Promise.all(
        data.map(async (d) => {
          let steamDetails = null;
          if (d.steam_appid) {
            const details = await fetchSteamGameDetails(d.steam_appid);
            if (details) {
              steamDetails = {
                name: details.name,
                headerImage: details.header_image,
                shortDescription: details.short_description,
                releaseDate: details.release_date?.date,
                genres: details.genres?.map((g) => g.description),
                price: details.price_overview?.final_formatted,
                recommendations: details.recommendations?.total,
                score: details.metacritic?.score,
              };
            }
          }

          return {
            id: d.id,
            game: d.game_title || "",
            votes: d.votes_count ?? 0,
            submittedBy: (d as any).profiles?.username || "Anonim",
            adminNote: d.admin_note || "",
            status: (d.status || "pending") as AdminSuggestion["status"],
            steamAppId: d.steam_appid,
            platform: d.platform || "PC",
            coverImageUrl: d.cover_image_url,
            steamDetails,
          };
        })
      );

      return suggestions;
    } catch (err) {
      throw new RepositoryError("Failed to load admin suggestions", "FETCH_SUGGESTIONS_FAILED", err);
    }
  },

  async updateSuggestionStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<void> {
    const supabase = createClient();
    try {
      const { data: oldData } = await supabase.from("game_suggestions").select("status").eq("id", id).maybeSingle();
      const { error } = await supabase
        .from("game_suggestions")
        .update({ status })
        .eq("id", id);
      if (error) throw error;

      await this.logActivity(
        `Oyun Önerisi Durumu Güncellendi: ${status.toUpperCase()}`,
        "game_suggestions",
        id,
        oldData,
        { status }
      );
    } catch (err) {
      throw new RepositoryError("Failed to update suggestion status", "UPDATE_SUGGESTION_FAILED", err);
    }
  },

  async deleteSuggestion(id: string): Promise<void> {
    const supabase = createClient();
    try {
      const { data: oldData } = await supabase.from("game_suggestions").select("*").eq("id", id).maybeSingle();
      const { error } = await supabase
        .from("game_suggestions")
        .delete()
        .eq("id", id);
      if (error) throw error;

      await this.logActivity(
        "Oyun Önerisi Silindi",
        "game_suggestions",
        id,
        oldData,
        null
      );
    } catch (err) {
      throw new RepositoryError("Failed to delete suggestion", "DELETE_SUGGESTION_FAILED", err);
    }
  },

  // Stream History Management
  async getStreamHistory(): Promise<AdminStreamHistory[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("stream_history")
        .select("*")
        .order("started_at", { ascending: false });

      if (error) throw error;
      return (data || []).map((d) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        startedAt: d.started_at,
        endedAt: d.ended_at,
        durationSeconds: d.duration_seconds ?? 0,
        peakViewers: d.peak_viewers ?? 0,
        averageViewers: d.average_viewers ?? 0,
        totalViews: d.total_views ?? 0,
        followersGained: d.followers_gained ?? 0,
        status: (d.status || "ended") as AdminStreamHistory["status"],
        vodUrl: d.vod_url,
        endedReason: d.ended_reason,
        streamNumber: d.stream_number ?? 0,
      }));
    } catch (err) {
      throw new RepositoryError("Failed to retrieve stream history", "FETCH_STREAM_HISTORY_FAILED", err);
    }
  },

  async updateStreamHistory(id: string, fields: Partial<AdminStreamHistory>): Promise<void> {
    const supabase = createClient();
    try {
      const { data: oldData } = await supabase.from("stream_history").select("*").eq("id", id).maybeSingle();
      
      const payload: any = {};
      if (fields.title !== undefined) payload.title = fields.title;
      if (fields.category !== undefined) payload.category = fields.category;
      if (fields.status !== undefined) payload.status = fields.status;
      if (fields.vodUrl !== undefined) payload.vod_url = fields.vodUrl;

      const { error } = await supabase
        .from("stream_history")
        .update(payload)
        .eq("id", id);

      if (error) throw error;

      await this.logActivity(
        "Yayın Geçmişi Güncellendi",
        "stream_history",
        id,
        oldData,
        payload
      );
    } catch (err) {
      throw new RepositoryError("Failed to update stream history", "UPDATE_STREAM_HISTORY_FAILED", err);
    }
  },

  async deleteStreamHistory(id: string): Promise<void> {
    const supabase = createClient();
    try {
      const { data: oldData } = await supabase.from("stream_history").select("*").eq("id", id).maybeSingle();
      const { error } = await supabase
        .from("stream_history")
        .delete()
        .eq("id", id);
      if (error) throw error;

      await this.logActivity(
        "Yayın Geçmişi Silindi",
        "stream_history",
        id,
        oldData,
        null
      );
    } catch (err) {
      throw new RepositoryError("Failed to delete stream history", "DELETE_STREAM_HISTORY_FAILED", err);
    }
  },

  // Sync Controls
  async getSyncStatus(): Promise<CreatorSyncStatus | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "kick_sync_status")
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return data.value as unknown as CreatorSyncStatus;
    } catch (err) {
      throw new RepositoryError("Failed to retrieve sync status metadata", "FETCH_SYNC_STATUS_FAILED", err);
    }
  },

  async triggerSync(): Promise<CreatorSyncStatus | null> {
    const supabase = createClient();
    try {
      const { error } = await supabase.functions.invoke("kick-sync", { method: "POST" });
      if (error) throw error;
      return this.getSyncStatus();
    } catch (err) {
      throw new RepositoryError("Failed to trigger Kick sync function", "TRIGGER_SYNC_FAILED", err);
    }
  },

  async getCreatorStats(): Promise<CreatorStats> {
    const supabase = createClient();
    try {
      const { data: streamState, error: stateError } = await supabase
        .from("stream_state")
        .select("*")
        .maybeSingle();

      if (stateError) throw stateError;

      const { data: subData, error: subError } = await supabase
        .from("subscriber_history")
        .select("active_count")
        .order("timestamp", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subError) throw subError;

      const { data: history, error: historyError } = await supabase
        .from("stream_history")
        .select("peak_viewers, average_viewers, title, category, started_at, ended_at")
        .order("started_at", { ascending: false });

      if (historyError) throw historyError;

      const syncStatus = await this.getSyncStatus();

      let peakViewers: number | null = null;
      let averageViewers: number | null = null;
      let recentStream: CreatorStats["recentStream"] = null;
      const totalStreams = history?.length ?? 0;

      if (history && history.length > 0) {
        const peaks = history.map((h) => h.peak_viewers ?? 0).filter((v) => v > 0);
        const avgs = history.map((h) => h.average_viewers ?? 0).filter((v) => v > 0);

        peakViewers = peaks.length > 0 ? Math.max(...peaks) : null;
        averageViewers = avgs.length > 0 ? Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length) : null;

        const last = history[0];
        const start = new Date(last.started_at);
        const end = new Date(last.ended_at);
        const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
        recentStream = {
          title: last.title,
          game: last.category,
          durationMinutes,
          date: new Date(last.started_at).toLocaleDateString("tr-TR"),
        };
      }

      const isLive = streamState?.is_live ?? false;

      return {
        isLive,
        currentGame: streamState?.current_game || "Kategori bilgisi alınamadı.",
        streamTitle: streamState?.stream_title || "Güncel yayın bulunmuyor.",
        startedAt: streamState?.started_at || null,
        viewerCount: streamState?.viewer_count ?? 0,
        thumbnailUrl: streamState?.thumbnail_url || null,
        streamUrl: streamState?.stream_url || null,
        lastCheckedAt: streamState?.last_checked_at || null,
        totalFollowers: null,
        totalSubscribers: subData?.active_count ?? null,
        peakViewers,
        averageViewers,
        totalStreams,
        lastSync: syncStatus,
        recentStream,
      };
    } catch (err) {
      throw new RepositoryError("Failed to load creator statistics", "FETCH_CREATOR_STATS_FAILED", err);
    }
  },

  // Site Settings Management
  async getSiteSettings(): Promise<Record<string, any>> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      const settings: Record<string, any> = {};
      (data || []).forEach((row) => {
        settings[row.key] = row.value;
      });
      return settings;
    } catch (err) {
      throw new RepositoryError("Failed to load site settings", "FETCH_SETTINGS_FAILED", err);
    }
  },

  async updateSiteSetting(key: string, value: any): Promise<void> {
    const supabase = createClient();
    try {
      const { data: oldData } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() });
      if (error) throw error;

      await this.logActivity(
        `Site Ayarları Güncellendi: ${key.toUpperCase()}`,
        "site_settings",
        key,
        oldData?.value,
        value
      );
    } catch (err) {
      throw new RepositoryError("Failed to update site setting", "UPDATE_SETTING_FAILED", err);
    }
  },

  // Setup Items Management (CRUD)
  async getSetupItems(): Promise<any[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("setup_items")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (err) {
      throw new RepositoryError("Failed to list setup items", "FETCH_SETUP_FAILED", err);
    }
  },

  async createSetupItem(item: any): Promise<void> {
    const supabase = createClient();
    try {
      const { error } = await supabase.from("setup_items").insert(item);
      if (error) throw error;
      await this.logActivity("Setup Ürünü Eklendi", "setup_items", item.slug, null, item);
    } catch (err) {
      throw new RepositoryError("Failed to create setup item", "CREATE_SETUP_FAILED", err);
    }
  },

  async updateSetupItem(id: string, item: any): Promise<void> {
    const supabase = createClient();
    try {
      const { data: oldData } = await supabase.from("setup_items").select("*").eq("id", id).maybeSingle();
      const { error } = await supabase
        .from("setup_items")
        .update({ ...item, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      await this.logActivity("Setup Ürünü Güncellendi", "setup_items", id, oldData, item);
    } catch (err) {
      throw new RepositoryError("Failed to update setup item", "UPDATE_SETUP_FAILED", err);
    }
  },

  async deleteSetupItem(id: string): Promise<void> {
    const supabase = createClient();
    try {
      const { data: oldData } = await supabase.from("setup_items").select("*").eq("id", id).maybeSingle();
      const { error } = await supabase.from("setup_items").delete().eq("id", id);
      if (error) throw error;
      await this.logActivity("Setup Ürünü Silindi", "setup_items", id, oldData, null);
    } catch (err) {
      throw new RepositoryError("Failed to delete setup item", "DELETE_SETUP_FAILED", err);
    }
  },

  // FAQ CRUD
  async getFaqs(): Promise<any[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("faq")
        .select("*")
        .order("order_weight", { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (err) {
      throw new RepositoryError("Failed to fetch FAQs", "FETCH_FAQ_FAILED", err);
    }
  },

  async createFaq(faq: any): Promise<void> {
    const supabase = createClient();
    try {
      const { error } = await supabase.from("faq").insert(faq);
      if (error) throw error;
      await this.logActivity("FAQ Soru Eklendi", "faq", null, null, faq);
    } catch (err) {
      throw new RepositoryError("Failed to create FAQ", "CREATE_FAQ_FAILED", err);
    }
  },

  async updateFaq(id: string, faq: any): Promise<void> {
    const supabase = createClient();
    try {
      const { data: oldData } = await supabase.from("faq").select("*").eq("id", id).maybeSingle();
      const { error } = await supabase
        .from("faq")
        .update({ ...faq, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      await this.logActivity("FAQ Soru Güncellendi", "faq", id, oldData, faq);
    } catch (err) {
      throw new RepositoryError("Failed to update FAQ", "UPDATE_FAQ_FAILED", err);
    }
  },

  async deleteFaq(id: string): Promise<void> {
    const supabase = createClient();
    try {
      const { data: oldData } = await supabase.from("faq").select("*").eq("id", id).maybeSingle();
      const { error } = await supabase.from("faq").delete().eq("id", id);
      if (error) throw error;
      await this.logActivity("FAQ Soru Silindi", "faq", id, oldData, null);
    } catch (err) {
      throw new RepositoryError("Failed to delete FAQ", "DELETE_FAQ_FAILED", err);
    }
  },
};
