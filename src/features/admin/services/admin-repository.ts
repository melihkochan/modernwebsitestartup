import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import { fetchSteamGameDetails } from "@/lib/steam/steam-api";

// ---------------------------------------------------------------------------
// Interface Definitions
// ---------------------------------------------------------------------------

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
  status: "pending" | "considering" | "approved" | "played" | "rejected";
  steamAppId: number | null;
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
  gamePlayed: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  peakViewers: number;
  averageViewers: number;
}

export interface CreatorStats {
  isLive: boolean;
  currentGame: string | null;
  streamTitle: string | null;
  startedAt: string | null;
  viewerCount: number;
  // null = Kick API did not return this data — must show unavailable state, never a fallback number
  totalFollowers: number | null;
  // null = API did not return subscriber count for this sync cycle
  totalSubscribers: number | null;
  // null = no stream_history data exists yet
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

export interface AdminRepository {
  getSuggestions(): Promise<AdminSuggestion[]>;
  approveSuggestion(id: string): Promise<void>;
  deleteSuggestion(id: string): Promise<void>;
  getStreamHistory(): Promise<AdminStreamHistory[]>;
  getSyncStatus(): Promise<CreatorSyncStatus | null>;
  triggerSync(): Promise<CreatorSyncStatus | null>;
  getCreatorStats(): Promise<CreatorStats>;
}

// ---------------------------------------------------------------------------
// Supabase Implementation (single implementation — no mock fallback)
// ---------------------------------------------------------------------------

const supabaseAdminRepository: AdminRepository = {
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

      if (error) throw new RepositoryError(error.message, "FETCH_SUGGESTIONS_FAILED", error);
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
            game: d.game_title,
            votes: d.votes_count,
            submittedBy: (d.profiles as { username?: string })?.username || "Anonim",
            adminNote: d.admin_note || "",
            status: d.status as AdminSuggestion["status"],
            steamAppId: d.steam_appid,
            steamDetails,
          };
        })
      );

      return suggestions;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Oyun önerileri alınamadı", "FETCH_SUGGESTIONS_FAILED", err);
    }
  },

  async approveSuggestion(id: string): Promise<void> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("game_suggestions")
        .update({ status: "approved" })
        .eq("id", id);
      if (error) throw new RepositoryError(error.message, "APPROVE_SUGGESTION_FAILED", error);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Öneri onaylanamadı", "APPROVE_SUGGESTION_FAILED", err);
    }
  },

  async deleteSuggestion(id: string): Promise<void> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("game_suggestions")
        .delete()
        .eq("id", id);
      if (error) throw new RepositoryError(error.message, "DELETE_SUGGESTION_FAILED", error);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Öneri silinemedi", "DELETE_SUGGESTION_FAILED", err);
    }
  },

  async getStreamHistory(): Promise<AdminStreamHistory[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("stream_history")
        .select("*")
        .order("started_at", { ascending: false });

      if (error) throw new RepositoryError(error.message, "FETCH_STREAM_HISTORY_FAILED", error);

      // Return empty array if no data — the UI will show a proper empty state
      if (!data || data.length === 0) return [];

      return data.map((d) => {
        const start = new Date(d.started_at);
        const end = new Date(d.ended_at);
        const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
        return {
          id: d.id,
          title: d.title,
          gamePlayed: d.game_played,
          startedAt: d.started_at,
          endedAt: d.ended_at,
          durationMinutes,
          peakViewers: d.peak_viewers ?? 0,
          averageViewers: d.average_viewers ?? 0,
        };
      });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Yayın geçmişi alınamadı", "FETCH_STREAM_HISTORY_FAILED", err);
    }
  },

  async getSyncStatus(): Promise<CreatorSyncStatus | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "kick_sync_status")
        .maybeSingle();
      if (error) throw new RepositoryError(error.message, "FETCH_SYNC_STATUS_FAILED", error);
      if (!data) return null;
      return data.value as unknown as CreatorSyncStatus;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Senkronizasyon durumu alınamadı", "FETCH_SYNC_STATUS_FAILED", err);
    }
  },

  async triggerSync(): Promise<CreatorSyncStatus | null> {
    const supabase = createClient();
    try {
      const { error } = await supabase.functions.invoke("kick-sync", { method: "POST" });
      if (error) throw new RepositoryError(error.message, "TRIGGER_SYNC_FAILED", error);
      return this.getSyncStatus();
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Senkronizasyon tetiklenemedi", "TRIGGER_SYNC_FAILED", err);
    }
  },

  async getCreatorStats(): Promise<CreatorStats> {
    const supabase = createClient();
    try {
      // Read current live state
      const { data: streamState } = await supabase
        .from("stream_state")
        .select("*")
        .maybeSingle();

      // Read latest subscriber count (official Kick metric)
      const { data: subData } = await supabase
        .from("subscriber_history")
        .select("active_count")
        .order("timestamp", { ascending: false })
        .limit(1)
        .maybeSingle();

      // Read stream history for aggregate calculations
      const { data: history } = await supabase
        .from("stream_history")
        .select("peak_viewers, average_viewers, title, game_played, started_at, ended_at")
        .order("started_at", { ascending: false });

      // Sync status
      const syncStatus = await this.getSyncStatus();

      // Aggregate peak and average viewers from real stream_history
      // If no history exists, these are null (not 0, not fake numbers)
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
          game: last.game_played,
          durationMinutes,
          date: new Date(last.started_at).toLocaleDateString("tr-TR"),
        };
      }

      return {
        isLive: streamState?.is_live ?? false,
        currentGame: streamState?.current_game ?? null,
        streamTitle: streamState?.stream_title ?? null,
        startedAt: streamState?.started_at ?? null,
        viewerCount: streamState?.viewer_count ?? 0,
        // follower_count: Kick API does not expose this via client credentials — null is correct
        totalFollowers: null,
        // subscriber count from subscriber_history table (official Kick metric)
        totalSubscribers: subData?.active_count ?? null,
        peakViewers,
        averageViewers,
        totalStreams,
        lastSync: syncStatus,
        recentStream,
      };
    } catch {
      // On database errors, return safe null values — never hardcoded statistics
      return {
        isLive: false,
        currentGame: null,
        streamTitle: null,
        startedAt: null,
        viewerCount: 0,
        totalFollowers: null,
        totalSubscribers: null,
        peakViewers: null,
        averageViewers: null,
        totalStreams: 0,
        lastSync: null,
        recentStream: null,
      };
    }
  },
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const adminRepository: AdminRepository = supabaseAdminRepository;
