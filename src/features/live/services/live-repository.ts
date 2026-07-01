import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { StreamInfo, ScheduleItem } from "../validators/live-schemas";

export interface LiveRepository {
  getStreamInfo(): Promise<StreamInfo>;
  getSchedule(): Promise<ScheduleItem[]>;
}

const STATIC_SCHEDULE: ScheduleItem[] = [
  { day: "Tuesday", time: "20:00 - 00:00", game: "Valorant Ranked Grind", platform: "Kick" },
  { day: "Thursday", time: "20:00 - 00:00", game: "Variety Games / CS2", platform: "Kick" },
  { day: "Friday", time: "20:00 - 01:00", game: "ZehrArmy Custom Match Night", platform: "Kick" },
  { day: "Saturday", time: "Spontaneous Stream", game: "Apex / Just Chatting", platform: "Kick" },
];

export const liveRepository: LiveRepository = {
  async getStreamInfo(): Promise<StreamInfo> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("stream_state")
        .select("is_live, viewer_count, current_game, stream_title, started_at, thumbnail_url")
        .maybeSingle();

      if (error) {
        throw new RepositoryError(
          `[LiveRepository] [stream_state] [SELECT] [is_live, viewer_count, current_game, stream_title, started_at, thumbnail_url] - ${error.message}`,
          "FETCH_STREAM_INFO_FAILED",
          error
        );
      }

      if (!data) {
        return {
          isLive: false,
          viewerCount: 0,
          currentGame: "Kategori bilgisi alınamadı.",
          streamTitle: "Güncel yayın bulunmuyor.",
          startedAt: "",
          thumbnailUrl: null,
        };
      }

      const isLive = data.is_live ?? false;
      return {
        isLive,
        viewerCount: data.viewer_count ?? 0,
        currentGame: isLive ? (data.current_game || "Kategori bilgisi alınamadı.") : "Kategori bilgisi alınamadı.",
        streamTitle: isLive ? (data.stream_title || "Başlıksız Yayın") : "Güncel yayın bulunmuyor.",
        startedAt: isLive ? (data.started_at || "") : "",
        thumbnailUrl: isLive ? (data.thumbnail_url || null) : null,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[LiveRepository] [stream_state] [SELECT] - Failed to get stream info`,
        "FETCH_STREAM_INFO_FAILED",
        err
      );
    }
  },

  async getSchedule(): Promise<ScheduleItem[]> {
    // Return the hardcoded stream schedule
    return Promise.resolve(STATIC_SCHEDULE);
  },
};
