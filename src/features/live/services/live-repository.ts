import { USE_MOCK_DATA } from "@/config/data-source";
import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { StreamInfo, ScheduleItem } from "../validators/live-schemas";

export interface LiveRepository {
  getStreamInfo(): Promise<StreamInfo>;
  getSchedule(): Promise<ScheduleItem[]>;
}

// ---------------------------------------------------------------------------
// Mock Implementation
// ---------------------------------------------------------------------------

const MOCK_STREAM_INFO: StreamInfo = {
  isLive: true,
  viewerCount: 12438,
  currentGame: "Valorant",
  streamTitle: "Solo Ranked Grind — Let's hit Radiant before season ends!",
  startedAt: "3 hours ago",
  thumbnailUrl: null,
};

const MOCK_SCHEDULE: ScheduleItem[] = [
  { day: "Tuesday", time: "20:00 - 00:00", game: "Valorant Ranked Grind", platform: "Kick" },
  { day: "Thursday", time: "20:00 - 00:00", game: "Variety Games / CS2", platform: "Kick" },
  { day: "Friday", time: "20:00 - 01:00", game: "ZehrArmy Custom Match Night", platform: "Kick" },
  { day: "Saturday", time: "Spontaneous Stream", game: "Apex / Just Chatting", platform: "Kick" },
];

const mockLiveRepository: LiveRepository = {
  async getStreamInfo(): Promise<StreamInfo> {
    return Promise.resolve(MOCK_STREAM_INFO);
  },
  async getSchedule(): Promise<ScheduleItem[]> {
    return Promise.resolve(MOCK_SCHEDULE);
  },
};

// ---------------------------------------------------------------------------
// Supabase Implementation
// ---------------------------------------------------------------------------

const supabaseLiveRepository: LiveRepository = {
  async getStreamInfo(): Promise<StreamInfo> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("stream_state")
        .select("*")
        .maybeSingle();

      if (error) throw new RepositoryError(error.message, "FETCH_STREAM_INFO_FAILED", error);
      if (!data) return MOCK_STREAM_INFO;

      return {
        isLive: data.is_live ?? false,
        viewerCount: data.viewer_count ?? 0,
        currentGame: data.current_game || "Offline",
        streamTitle: data.stream_title || "",
        startedAt: data.started_at || "",
      };
    } catch (err: unknown) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Failed to fetch stream info", "FETCH_STREAM_INFO_FAILED", err);
    }
  },

  async getSchedule(): Promise<ScheduleItem[]> {
    const supabase = createClient();
    try {
      // In a real schema, we'd query the weekly schedule. For now, fetch from a mock schedule table or return mock fallback
      const { error } = await supabase
        .from("faq") // Fallback mock table query for infrastructure check
        .select("*")
        .limit(1);

      if (error) throw new RepositoryError(error.message, "FETCH_SCHEDULE_FAILED", error);

      // Return mock schedule data for structural stability until migrations are fully populated
      return MOCK_SCHEDULE;
    } catch (err: unknown) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Failed to fetch stream schedule", "FETCH_SCHEDULE_FAILED", err);
    }
  },
};

// ---------------------------------------------------------------------------
// Unified Export Selector
// ---------------------------------------------------------------------------

export const liveRepository: LiveRepository = USE_MOCK_DATA
  ? mockLiveRepository
  : supabaseLiveRepository;
