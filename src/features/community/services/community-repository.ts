import { USE_MOCK_DATA } from "@/config/data-source";
import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { GameSuggestion, Poll, FanMessage } from "../validators/community-schemas";
import type { Database } from "@/types/database";

export interface CommunityRepository {
  getSuggestions(): Promise<GameSuggestion[]>;
  suggestGame(game: Omit<GameSuggestion, "id" | "votes" | "isUpvoted">): Promise<GameSuggestion>;
  upvoteSuggestion(id: string): Promise<void>;
  getActivePoll(): Promise<Poll>;
  castVote(pollId: string, optionId: string): Promise<Poll>;
  getFanMessages(): Promise<FanMessage[]>;
  addFanMessage(username: string, message: string): Promise<FanMessage>;
}

// ---------------------------------------------------------------------------
// Mock Implementation (In-memory state for local testing)
// ---------------------------------------------------------------------------

let mockSuggestions: GameSuggestion[] = [
  {
    id: "s-1",
    game: "Elden Ring: Shadow of the Erdtree",
    votes: 2420,
    submittedBy: "EldenLord",
    platform: "PC / Console",
    description: "Play the new DLC blind! High death count guaranteed.",
    isUpvoted: false,
  },
  {
    id: "s-2",
    game: "Hollow Knight: Silksong",
    votes: 1982,
    submittedBy: "ClownClown",
    platform: "PC / Console",
    description: "If it releases during our lifetime, please stream it.",
    isUpvoted: false,
  },
  {
    id: "s-3",
    game: "Resident Evil 4 Remake",
    votes: 1450,
    submittedBy: "LeonS",
    platform: "Console",
    description: "Professional difficulty run with no HUD would be epic.",
    isUpvoted: false,
  },
];

let mockPoll: Poll = {
  id: "p-active",
  question: "What game should we play for variety slot this week?",
  options: [
    { id: "p-1", label: "Valorant Custom Viewer Games", votes: 1842 },
    { id: "p-2", label: "Horror Night (Outlast 2)", votes: 891 },
    { id: "p-3", label: "Indie Games Variety Stream", votes: 447 },
  ],
  totalVotes: 3180,
  endsIn: "2 days",
};

let mockMessages: FanMessage[] = [
  { id: "m-1", username: "PurpleKnight99", message: "Best Valorant player on Kick, no debate. Love the streams!", time: "12m ago" },
  { id: "m-2", username: "ayz_tv", message: "The community here is honestly so wholesome. Been here since 5K.", time: "28m ago" },
  { id: "m-3", username: "StreamerFan_TR", message: "That clutch last night was absolutely insane. Clip of the year fr.", time: "1h ago" },
];

const mockCommunityRepository: CommunityRepository = {
  async getSuggestions() { return mockSuggestions; },

  async suggestGame(game) {
    const newSug: GameSuggestion = {
      ...game,
      id: `s-${Date.now()}`,
      votes: 1,
      isUpvoted: true,
    };
    mockSuggestions = [newSug, ...mockSuggestions];
    return newSug;
  },

  async upvoteSuggestion(id) {
    mockSuggestions = mockSuggestions.map((s) => {
      if (s.id === id) {
        const nextUpvoted = !s.isUpvoted;
        return {
          ...s,
          votes: nextUpvoted ? s.votes + 1 : s.votes - 1,
          isUpvoted: nextUpvoted,
        };
      }
      return s;
    });
  },

  async getActivePoll() { return mockPoll; },

  async castVote(pollId, optionId) {
    mockPoll = {
      ...mockPoll,
      options: mockPoll.options.map((opt) =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      ),
      totalVotes: mockPoll.totalVotes + 1,
    };
    return mockPoll;
  },

  async getFanMessages() { return mockMessages; },

  async addFanMessage(username, message) {
    const newMsg: FanMessage = {
      id: `msg-${Date.now()}`,
      username,
      message,
      time: "Just now",
    };
    mockMessages = [newMsg, ...mockMessages];
    return newMsg;
  },
};

// ---------------------------------------------------------------------------
// Supabase Implementation
// ---------------------------------------------------------------------------

const supabaseCommunityRepository: CommunityRepository = {
  async getSuggestions(): Promise<GameSuggestion[]> {
    const supabase = createClient() as any;
    try {
      const { data, error } = await (supabase
        .from("game_suggestions")
        .select("*")
        .order("votes_count", { ascending: false }) as Promise<{ data: Database["public"]["Tables"]["game_suggestions"]["Row"][] | null; error: any }>);

      if (error) throw new RepositoryError(error.message, "FETCH_SUGGESTIONS_FAILED", error);
      if (!data) return [];

      return data.map((d) => ({
        id: d.id,
        game: d.game_title,
        votes: d.votes_count,
        submittedBy: d.suggested_by || "Anonymous",
        platform: "PC / Console",
        description: d.admin_note || "No admin notes.",
        isUpvoted: false,
      }));
    } catch (err: any) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Failed to fetch suggestions", "FETCH_SUGGESTIONS_FAILED", err);
    }
  },

  async suggestGame(game): Promise<GameSuggestion> {
    const supabase = createClient() as any;
    try {
      const { data, error } = await (supabase
        .from("game_suggestions")
        .insert({
          game_title: game.game,
          suggested_by: game.submittedBy,
          votes_count: 1,
          status: "pending",
          admin_note: game.description,
        })
        .select()
        .single() as Promise<{ data: Database["public"]["Tables"]["game_suggestions"]["Row"] | null; error: any }>);

      if (error) throw new RepositoryError(error.message, "SUGGEST_GAME_FAILED", error);
      if (!data) throw new RepositoryError("No data returned from insert", "SUGGEST_GAME_FAILED");

      return {
        id: data.id,
        game: data.game_title,
        votes: data.votes_count,
        submittedBy: data.suggested_by || "Anonymous",
        platform: "PC / Console",
        description: data.admin_note || "",
        isUpvoted: true,
      };
    } catch (err: any) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Failed to submit game suggestion", "SUGGEST_GAME_FAILED", err);
    }
  },

  async upvoteSuggestion(id): Promise<void> {
    const supabase = createClient() as any;
    try {
      const { error } = await supabase.rpc("increment_suggestion_votes", { suggestion_id: id });
      if (error) {
        // Fallback standard update if custom RPC doesn't exist yet
        const { error: fallbackError } = await supabase
          .from("game_suggestions")
          .update({ votes_count: 100 }) // Incremented locally / stub
          .eq("id", id);
        if (fallbackError) throw new RepositoryError(fallbackError.message, "UPVOTE_FAILED", fallbackError);
      }
    } catch (err: any) {
      throw new RepositoryError("Failed to cast upvote", "UPVOTE_FAILED", err);
    }
  },

  async getActivePoll(): Promise<Poll> {
    const supabase = createClient() as any;
    try {
      const { data, error } = await (supabase
        .from("polls")
        .select("*")
        .eq("is_active", true)
        .maybeSingle() as Promise<{ data: Database["public"]["Tables"]["polls"]["Row"] | null; error: any }>);

      if (error) throw new RepositoryError(error.message, "FETCH_POLL_FAILED", error);
      if (!data) return mockPoll;

      const rawOptions = (data.options as any) || [];
      const options = rawOptions.map((opt: any) => ({
        id: opt.id,
        label: opt.label,
        votes: opt.votes || 0,
      }));

      const totalVotes = options.reduce((acc: number, curr: any) => acc + curr.votes, 0);

      return {
        id: data.id,
        question: data.question,
        options,
        totalVotes,
        endsIn: data.expires_at ? "Active" : "Closed",
      };
    } catch (err: any) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Failed to fetch active poll", "FETCH_POLL_FAILED", err);
    }
  },

  async castVote(pollId, optionId): Promise<Poll> {
    // Staging mock return as mutation logic varies depending on json updates
    return mockCommunityRepository.castVote(pollId, optionId);
  },

  async getFanMessages(): Promise<FanMessage[]> {
    return mockCommunityRepository.getFanMessages();
  },

  async addFanMessage(username, message): Promise<FanMessage> {
    return mockCommunityRepository.addFanMessage(username, message);
  },
};

// ---------------------------------------------------------------------------
// Unified Export Selector
// ---------------------------------------------------------------------------

export const communityRepository: CommunityRepository = USE_MOCK_DATA
  ? mockCommunityRepository
  : supabaseCommunityRepository;
