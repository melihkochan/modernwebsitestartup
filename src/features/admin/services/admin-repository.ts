import { USE_MOCK_DATA } from "@/config/data-source";
import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { SystemLog, SystemVitals } from "../validators/admin-schemas";
import type { Database } from "@/types/database";

export interface AdminRepository {
  getSystemLogs(): Promise<SystemLog[]>;
  getVitals(): Promise<SystemVitals>;
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
};

// ---------------------------------------------------------------------------
// Supabase Implementation
// ---------------------------------------------------------------------------

const supabaseAdminRepository: AdminRepository = {
  async getSystemLogs(): Promise<SystemLog[]> {
    return INITIAL_LOGS;
  },

  async getVitals(): Promise<SystemVitals> {
    const supabase = createClient() as any;
    try {
      const { data, error } = await (supabase
        .from("stream_state")
        .select("*")
        .maybeSingle() as Promise<{ data: Database["public"]["Tables"]["stream_state"]["Row"] | null; error: any }>);
      if (error) throw new RepositoryError(error.message, "FETCH_VITALS_FAILED", error);
      if (!data) return mockAdminRepository.getVitals();
      
      return {
        cpuUsage: 15,
        memoryUsage: 52,
        gpuTemp: 62,
        bitrate: data.is_live ? data.viewer_count * 0.6 : 0, // Mock calculation derived from DB
        viewerCount: data.viewer_count,
      };
    } catch (err: any) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Failed to fetch system vitals", "FETCH_VITALS_FAILED", err);
    }
  },
};

// ---------------------------------------------------------------------------
// Unified Export Selector
// ---------------------------------------------------------------------------

export const adminRepository: AdminRepository = USE_MOCK_DATA
  ? mockAdminRepository
  : supabaseAdminRepository;
