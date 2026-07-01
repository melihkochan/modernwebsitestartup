import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { Database } from "@/types/database";

export type Broadcast = Database["public"]["Tables"]["stream_history"]["Row"];

export interface BroadcastsFilter {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
  status?: string;
}

export interface BroadcastsResponse {
  data: Broadcast[];
  total: number;
}

export const broadcastRepository = {
  async getRecentBroadcasts(limit = 4): Promise<Broadcast[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("stream_history")
        .select("*")
        .eq("status", "ended")
        .order("started_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw new RepositoryError(
          `[BroadcastRepository] [stream_history] [SELECT] [limit: ${limit}] - ${error.message}`,
          "FETCH_RECENT_BROADCASTS_FAILED",
          error
        );
      }

      return data || [];
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        "[BroadcastRepository] Failed to get recent broadcasts",
        "FETCH_RECENT_BROADCASTS_FAILED",
        err
      );
    }
  },

  async getBroadcasts(filter: BroadcastsFilter): Promise<BroadcastsResponse> {
    const supabase = createClient();
    const { search, category, page = 1, pageSize = 10, status = "ended" } = filter;

    try {
      const offset = (page - 1) * pageSize;

      let query = supabase
        .from("stream_history")
        .select("*", { count: "exact" })
        .order("started_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      if (category) {
        query = query.ilike("category", `%${category}%`);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%`);
      }

      const { data, error, count } = await query
        .range(offset, offset + pageSize - 1);

      if (error) {
        throw new RepositoryError(
          `[BroadcastRepository] [stream_history] [SELECT] [page: ${page}] - ${error.message}`,
          "FETCH_BROADCASTS_FAILED",
          error
        );
      }

      return {
        data: data || [],
        total: count || 0,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        "[BroadcastRepository] Failed to list broadcasts",
        "FETCH_BROADCASTS_FAILED",
        err
      );
    }
  },
};
