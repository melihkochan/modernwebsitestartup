import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { GameSuggestion, Poll } from "../validators/community-schemas";

export interface CommunityRepository {
  getSuggestions(): Promise<GameSuggestion[]>;
  suggestGame(game: Omit<GameSuggestion, "id" | "votes" | "isUpvoted">): Promise<GameSuggestion>;
  upvoteSuggestion(id: string): Promise<void>;
}

export const communityRepository: CommunityRepository = {
  async getSuggestions(): Promise<GameSuggestion[]> {
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
        .eq("status", "approved")
        .order("votes_count", { ascending: false });

      if (error) {
        throw new RepositoryError(
          `[CommunityRepository] [game_suggestions] [SELECT] [votes_count, game_title] - ${error.message}`,
          "FETCH_SUGGESTIONS_FAILED",
          error
        );
      }
      if (!data) return [];

      return data.map((d) => ({
        id: d.id,
        game: d.game_title || "",
        votes: d.votes_count ?? 0,
        submittedBy: (d as any).profiles?.username || "Anonim",
        platform: d.platform || "PC",
        description: d.admin_note || "",
        isUpvoted: false,
        steamAppId: d.steam_appid,
        coverImageUrl: d.cover_image_url || "",
      }));
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[CommunityRepository] [game_suggestions] [SELECT] - Failed to fetch suggestions`,
        "FETCH_SUGGESTIONS_FAILED",
        err
      );
    }
  },

  async suggestGame(game: Omit<GameSuggestion, "id" | "votes" | "isUpvoted">): Promise<GameSuggestion> {
    const supabase = createClient();
    try {
      let existing = null;
      if (game.steamAppId) {
        const { data } = await supabase
          .from("game_suggestions")
          .select("id, status")
          .eq("steam_appid", game.steamAppId)
          .maybeSingle();
        existing = data;
      } else {
        const { data } = await supabase
          .from("game_suggestions")
          .select("id, status")
          .ilike("game_title", game.game)
          .maybeSingle();
        existing = data;
      }

      if (existing) {
        const { error: rpcError } = await supabase.rpc("increment_suggestion_votes", { suggestion_id: existing.id });
        if (rpcError) throw rpcError;

        if (existing.status === "rejected") {
          await supabase
            .from("game_suggestions")
            .update({ status: "pending" })
            .eq("id", existing.id);
        }

        return {
          id: existing.id,
          game: game.game,
          votes: 1,
          submittedBy: "Topluluk",
          platform: game.platform || "PC",
          description: game.description,
          isUpvoted: true,
          steamAppId: game.steamAppId,
          coverImageUrl: game.coverImageUrl || "",
          isDuplicate: true,
          existingStatus: existing.status,
        } as any;
      }

      const { data, error } = await supabase
        .from("game_suggestions")
        .insert({
          game_title: game.game,
          suggested_by: game.submittedBy,
          votes_count: 1,
          status: "pending",
          admin_note: game.description,
          steam_appid: game.steamAppId || null,
          cover_image_url: game.coverImageUrl || null,
          platform: game.platform || null,
        })
        .select(`
          *,
          profiles:suggested_by (
            username
          )
        `)
        .single();

      if (error) {
        throw new RepositoryError(
          `[CommunityRepository] [game_suggestions] [INSERT] [game_title, suggested_by] - ${error.message}`,
          "SUGGEST_GAME_FAILED",
          error
        );
      }
      if (!data) {
        throw new RepositoryError(
          `[CommunityRepository] [game_suggestions] [INSERT] - No data returned from insert`,
          "SUGGEST_GAME_FAILED"
        );
      }

      return {
        id: data.id,
        game: data.game_title || "",
        votes: data.votes_count ?? 1,
        submittedBy: (data as any).profiles?.username || "Anonim",
        platform: data.platform || "PC",
        description: data.admin_note || "",
        isUpvoted: true,
        steamAppId: data.steam_appid,
        coverImageUrl: data.cover_image_url || "",
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[CommunityRepository] [game_suggestions] [INSERT] - Failed to submit game suggestion`,
        "SUGGEST_GAME_FAILED",
        err
      );
    }
  },

  async upvoteSuggestion(id: string): Promise<void> {
    const supabase = createClient();
    try {
      const { error } = await supabase.rpc("increment_suggestion_votes", { suggestion_id: id });
      if (error) {
        throw new RepositoryError(
          `[CommunityRepository] [game_suggestions] [RPC:increment_suggestion_votes] [suggestion_id] - ${error.message}`,
          "UPVOTE_FAILED",
          error
        );
      }
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[CommunityRepository] [game_suggestions] [RPC] - Failed to cast upvote`,
        "UPVOTE_FAILED",
        err
      );
    }
  },
};
