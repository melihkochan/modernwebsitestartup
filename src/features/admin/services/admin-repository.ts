import { USE_MOCK_DATA } from "@/config/data-source";
import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { SystemLog, SystemVitals } from "../validators/admin-schemas";

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

export interface AdminRepository {
  getSystemLogs(): Promise<SystemLog[]>;
  getVitals(): Promise<SystemVitals>;
  getSyncStatus(): Promise<CreatorSyncStatus>;
  triggerSync(): Promise<CreatorSyncStatus>;
}

// ---------------------------------------------------------------------------
// Mock Implementation
// ---------------------------------------------------------------------------

const INITIAL_LOGS: SystemLog[] = [
  { id: "log-1", time: "00:01:05", type: "info", message: "Broadcaster system diagnostics started..." },
  { id: "log-2", time: "00:01:06", type: "success", message: "AV1 encoder profile 'Kick-Tactical' loaded successfully." },
  { id: "log-3", time: "00:01:08", type: "info", message: "Connecting to ingest endpoint: tr-ist-01.kick.com..." },
  { id: "log-4", time: "00:01:09", type: "success", message: "Stream handshake accepted. Bitrate stabilized at 8,200 kbps." },
  { id: "log-5", time: "00:01:10", type: "info", message: "Audio feeds synchronized: Focusrite Scarlett 2i2." },
  { id: "log-6", time: "00:01:12", type: "success", message: "Chat webhook active. Listeners connected." },
];

let mockSyncStatus: CreatorSyncStatus = {
  status: "success",
  last_success_at: "2026-06-26T21:00:00.000Z",
  last_failed_at: null,
  last_response_time_ms: 342,
  duration_ms: 342,
  updated_records: 5,
  updated_tables: 4,
  error: null,
  provider: "kick",
  channel: "zehragn",
};

const mockAdminRepository: AdminRepository = {
  async getSystemLogs() { return INITIAL_LOGS; },
  async getVitals() {
    return {
      cpuUsage: 12,
      memoryUsage: 48,
      gpuTemp: 58,
      bitrate: 8200,
      viewerCount: 12438,
    };
  },
  async getSyncStatus(): Promise<CreatorSyncStatus> {
    return mockSyncStatus;
  },
  async triggerSync(): Promise<CreatorSyncStatus> {
    mockSyncStatus = {
      ...mockSyncStatus,
      status: "success",
      last_success_at: new Date().toISOString(),
      last_response_time_ms: Math.round(150 + Math.random() * 200),
      duration_ms: Math.round(150 + Math.random() * 200),
      updated_records: 5,
      updated_tables: 4,
      error: null,
    };
    return mockSyncStatus;
  },
};

// ---------------------------------------------------------------------------
// Supabase Implementation
// ---------------------------------------------------------------------------

const supabaseAdminRepository: AdminRepository = {
  async getSystemLogs(): Promise<SystemLog[]> {
    return INITIAL_LOGS;
  },

  async getVitals(): Promise<SystemVitals> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("stream_state")
        .select("*")
        .maybeSingle();
      if (error) throw new RepositoryError(error.message, "FETCH_VITALS_FAILED", error);
      if (!data) return mockAdminRepository.getVitals();
      
      return {
        cpuUsage: 15,
        memoryUsage: 52,
        gpuTemp: 62,
        bitrate: data.is_live ? data.viewer_count * 0.6 : 0, // Mock calculation derived from DB
        viewerCount: data.viewer_count,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      const message = err instanceof Error ? err.message : "Failed to fetch system vitals";
      throw new RepositoryError(message, "FETCH_VITALS_FAILED", err);
    }
  },

  async getSyncStatus(): Promise<CreatorSyncStatus> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "kick_sync_status")
        .maybeSingle();

      if (error) throw new RepositoryError(error.message, "FETCH_SYNC_STATUS_FAILED", error);
      if (!data) {
        return {
          status: "idle",
          last_success_at: null,
          last_failed_at: null,
          last_response_time_ms: 0,
          duration_ms: 0,
          updated_records: 0,
          updated_tables: 0,
          error: null,
          provider: "kick",
          channel: "zehragn",
        };
      }
      return data.value as unknown as CreatorSyncStatus;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      const message = err instanceof Error ? err.message : "Failed to fetch creator sync status";
      throw new RepositoryError(message, "FETCH_SYNC_STATUS_FAILED", err);
    }
  },

  async triggerSync(): Promise<CreatorSyncStatus> {
    const supabase = createClient();
    try {
      // Invoke the Edge Function using the standard Supabase invoke client method
      const { error } = await supabase.functions.invoke("kick-sync", {
        method: "POST",
      });

      if (error) throw new RepositoryError(error.message, "TRIGGER_SYNC_FAILED", error);
      
      // Load the freshly written sync status from the settings table
      return this.getSyncStatus();
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      const message = err instanceof Error ? err.message : "Failed to execute manual creator synchronization";
      throw new RepositoryError(message, "TRIGGER_SYNC_FAILED", err);
    }
  },
};

// ---------------------------------------------------------------------------
// Unified Export Selector
// ---------------------------------------------------------------------------

export const adminRepository: AdminRepository = USE_MOCK_DATA
  ? mockAdminRepository
  : supabaseAdminRepository;

