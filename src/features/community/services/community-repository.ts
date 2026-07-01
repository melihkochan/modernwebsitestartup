import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { GameSuggestion, Poll } from "../validators/community-schemas";

export interface CommunityRepository {
  getSuggestions(): Promise<GameSuggestion[]>;
  suggestGame(game: Omit<GameSuggestion, "id" | "votes" | "isUpvoted">): Promise<GameSuggestion>;
  upvoteSuggestion(id: string): Promise<void>;
  getActivePoll(): Promise<Poll | null>;
  castVote(pollId: string, optionId: string): Promise<Poll | null>;
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

  async getActivePoll(): Promise<Poll | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("polls")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        throw new RepositoryError(
          `[CommunityRepository] [polls] [SELECT] [is_active] - ${error.message}`,
          "FETCH_POLL_FAILED",
          error
        );
      }
      if (!data) return null;

      const rawOptions = (data.options as unknown as Array<{ id: string; label: string; votes?: number }>) || [];
      const options = rawOptions.map((opt) => ({
        id: opt.id,
        label: opt.label,
        votes: opt.votes || 0,
      }));

      const totalVotes = options.reduce((acc: number, curr) => acc + curr.votes, 0);

      return {
        id: data.id,
        question: data.question || "",
        options,
        totalVotes,
        endsIn: data.expires_at ? "Active" : "Closed",
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[CommunityRepository] [polls] [SELECT] - Failed to fetch active poll`,
        "FETCH_POLL_FAILED",
        err
      );
    }
  },

  async castVote(pollId: string, optionId: string): Promise<Poll | null> {
    const supabase = createClient();
    try {
      let fingerprint = typeof window !== "undefined" ? localStorage.getItem("vote_fingerprint") : null;
      if (!fingerprint) {
        fingerprint = "anon_" + Math.random().toString(36).substring(2, 15);
        if (typeof window !== "undefined") {
          localStorage.setItem("vote_fingerprint", fingerprint);
        }
      }

      const { error } = await supabase.rpc("cast_poll_vote", {
        poll_id: pollId,
        option_id: optionId,
        fingerprint: fingerprint,
      });

      if (error) {
        throw new RepositoryError(
          `[CommunityRepository] [polls] [RPC:cast_poll_vote] [poll_id, option_id] - ${error.message}`,
          "CAST_VOTE_FAILED",
          error
        );
      }
      return this.getActivePoll();
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[CommunityRepository] [polls] [RPC] - Failed to cast vote`,
        "CAST_VOTE_FAILED",
        err
      );
    }
  },
};
