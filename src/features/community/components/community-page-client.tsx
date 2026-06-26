"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  ThumbsUp,
  Vote,
  Plus,
  Users,
  Gamepad,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

interface GameSuggestion {
  id: string;
  game: string;
  votes: number;
  submittedBy: string;
  platform: string;
  description: string;
  isUpvoted?: boolean;
}

interface PollOption {
  id: string;
  label: string;
  votes: number;
}

interface FanMessage {
  id: string;
  username: string;
  message: string;
  time: string;
}

export function CommunityPageClient() {
  // 1. Suggestions State
  const [suggestions, setSuggestions] = useState<GameSuggestion[]>([
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
    {
      id: "s-4",
      game: "Minecraft Viewers Realm",
      votes: 980,
      submittedBy: "CreeperLover",
      platform: "PC",
      description: "Host a server and let the ZehrArmy build a monument.",
      isUpvoted: false,
    },
  ]);

  // 2. Poll State
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: "p-1", label: "Valorant Custom Viewer Games", votes: 1842 },
    { id: "p-2", label: "Horror Night (Outlast 2)", votes: 891 },
    { id: "p-3", label: "Indie Games Variety Stream", votes: 447 },
  ]);

  // 3. Fan Messages State
  const [fanMessages, setFanMessages] = useState<FanMessage[]>([
    {
      id: "m-1",
      username: "PurpleKnight99",
      message: "Best Valorant player on Kick, no debate. Love the streams!",
      time: "12m ago",
    },
    {
      id: "m-2",
      username: "ayz_tv",
      message: "The community here is honestly so wholesome. Been here since 5K.",
      time: "28m ago",
    },
    {
      id: "m-3",
      username: "StreamerFan_TR",
      message: "That clutch last night was absolutely insane. Clip of the year fr.",
      time: "1h ago",
    },
  ]);

  // Modals / Suggestion Form state
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [newGameName, setNewGameName] = useState("");
  const [newGamePlatform, setNewGamePlatform] = useState("");
  const [newGameDesc, setNewGameDesc] = useState("");

  // Fan message submit state
  const [newMessageText, setNewMessageText] = useState("");
  const [newMessageUser, setNewMessageUser] = useState("");

  // Upvoting handler
  const handleUpvote = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const upvoted = !s.isUpvoted;
          return {
            ...s,
            votes: upvoted ? s.votes + 1 : s.votes - 1,
            isUpvoted: upvoted,
          };
        }
        return s;
      })
    );
  };

  // Suggest game submit handler
  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameName.trim()) return;

    const newSug: GameSuggestion = {
      id: `s-${Date.now()}`,
      game: newGameName,
      platform: newGamePlatform || "PC",
      description: newGameDesc || "No description provided.",
      votes: 1,
      submittedBy: "Anonymous Fan",
      isUpvoted: true,
    };

    setSuggestions((prev) => [newSug, ...prev]);
    setNewGameName("");
    setNewGamePlatform("");
    setNewGameDesc("");
    setIsSuggestModalOpen(false);
  };

  // Poll Vote handler
  const handleVote = (optionId: string) => {
    if (hasVoted) return;
    setSelectedOption(optionId);
    setPollOptions((prev) =>
      prev.map((opt) => (opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt))
    );
    setHasVoted(true);
  };

  // Fan Message Submit handler
  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const newMsg: FanMessage = {
      id: `msg-${Date.now()}`,
      username: newMessageUser.trim() || "AnonymousHero",
      message: newMessageText,
      time: "Just now",
    };

    setFanMessages((prev) => [newMsg, ...prev]);
    setNewMessageText("");
    setNewMessageUser("");
  };

  // Compute total poll votes
  const totalPollVotes = pollOptions.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden bg-[var(--bg-base)]">
      {/* Background spotlights */}
      <div className="absolute top-[10%] left-[-10%] w-[700px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,242,154,0.03),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[700px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.03),transparent_60%)] pointer-events-none z-0" />

      <Container className="relative z-10 flex flex-col gap-12">
        {/* Page title area */}
        <div className="flex flex-col gap-3 max-w-xl">
          <Badge variant="outline" className="border-purple-400/25 text-purple-400 font-bold bg-purple-500/5 uppercase self-start">
            ZEHRARMY HUB
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Community Center
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Suggest next games, participate in live broadcast decisions, and write public messages on the wall.
          </p>
        </div>

        {/* 3 KPI stats panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-5 border border-[var(--border-default)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)]">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[var(--text-tertiary)] uppercase font-semibold">Active Members</span>
              <span className="text-lg font-bold text-[var(--text-primary)]">42,850 fans</span>
            </div>
          </GlassCard>
          <GlassCard className="p-5 border border-[var(--border-default)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Vote className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[var(--text-tertiary)] uppercase font-semibold">Poll votes cast</span>
              <span className="text-lg font-bold text-[var(--text-primary)]">3,180 votes</span>
            </div>
          </GlassCard>
          <GlassCard className="p-5 border border-[var(--border-default)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[var(--text-tertiary)] uppercase font-semibold">Game recommendations</span>
              <span className="text-lg font-bold text-[var(--text-primary)]">148 suggestions</span>
            </div>
          </GlassCard>
        </div>

        {/* Split Grid: Suggestions (Left, 7 cols) & Poll + Guestbook (Right, 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Game Suggestions Section (Left) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Gamepad className="w-5 h-5 text-[var(--accent-primary)]" />
                <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                  Game Recommendations
                </h2>
              </div>
              <Button
                onClick={() => setIsSuggestModalOpen(true)}
                className="h-8 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Suggest Game
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {suggestions.map((item) => (
                  <motion.div
                    key={item.id}
                    layoutId={`card-${item.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <GlassCard className="p-5 border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-300 flex items-start justify-between gap-4 relative group">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[var(--text-primary)]">
                            {item.game}
                          </h3>
                          <Badge className="bg-[var(--bg-overlay)] text-[var(--text-secondary)] border border-[var(--border-default)] text-[9px] font-bold">
                            {item.platform}
                          </Badge>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-tertiary)] font-medium">
                          <span>Suggested by: <span className="text-[var(--text-secondary)] font-bold">{item.submittedBy}</span></span>
                        </div>
                      </div>

                      {/* Vote trigger container */}
                      <button
                        onClick={() => handleUpvote(item.id)}
                        className={cn(
                          "flex flex-col items-center justify-center min-w-[54px] py-2 px-1 rounded-lg border transition-all cursor-pointer shadow-[var(--shadow-sm)]",
                          item.isUpvoted
                            ? "bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 text-[var(--accent-primary)] scale-[1.03]"
                            : "bg-[var(--bg-overlay)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                        )}
                      >
                        <ThumbsUp className={cn("w-3.5 h-3.5 mb-1 transition-transform", item.isUpvoted && "scale-110 fill-current")} />
                        <span className="text-xs font-mono font-bold">{item.votes}</span>
                      </button>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Section: Poll (Top) & Fan Message wall (Bottom) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Live Poll Container */}
            <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                  Active Decisions Poll
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    What game should we play for variety slot this week?
                  </h3>
                  <span className="text-[10px] text-[var(--text-tertiary)] font-medium uppercase tracking-wider">
                    Total: {totalPollVotes} votes • Ends in 2 days
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {pollOptions.map((opt) => {
                    const percentage = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
                    return (
                      <button
                        key={opt.id}
                        disabled={hasVoted}
                        onClick={() => handleVote(opt.id)}
                        className={cn(
                          "relative w-full text-left p-3.5 rounded-lg border transition-all overflow-hidden flex justify-between items-center",
                          hasVoted
                            ? selectedOption === opt.id
                              ? "border-[var(--accent-primary)]/40 text-[var(--text-primary)]"
                              : "border-[var(--border-default)] opacity-60"
                            : "border-[var(--border-default)] hover:border-[var(--border-strong)] cursor-pointer"
                        )}
                      >
                        {/* Vote Percent background bar */}
                        {hasVoted && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            className="absolute inset-y-0 left-0 bg-[var(--accent-primary)]/5 pointer-events-none"
                          />
                        )}

                        <span className="text-xs font-semibold relative z-10 flex items-center gap-2 text-[var(--text-primary)]">
                          {hasVoted && selectedOption === opt.id && <Check className="w-4.5 h-4.5 text-[var(--accent-primary)] shrink-0" />}
                          {opt.label}
                        </span>

                        <span className="text-xs font-mono font-bold text-[var(--text-secondary)] relative z-10 shrink-0">
                          {hasVoted ? `${percentage}%` : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {hasVoted && (
                  <span className="text-[10px] text-[var(--text-secondary)] font-semibold text-center italic mt-1 bg-[var(--bg-overlay)] p-2 rounded border border-[var(--border-subtle)]">
                    Thank you for voting! Decisions will be shown on stream.
                  </span>
                )}
              </div>
            </GlassCard>

            {/* Fan Message Wall (Guestbook) */}
            <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-5 overflow-hidden">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                  Fan Wall Messages
                </h2>
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleMessageSubmit} className="flex flex-col gap-3 bg-[rgba(10,10,10,0.25)] p-4 rounded-lg border border-[var(--border-subtle)]">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nickname"
                    value={newMessageUser}
                    onChange={(e) => setNewMessageUser(e.target.value)}
                    className="h-8 text-xs bg-[var(--bg-base)]"
                    maxLength={15}
                  />
                  <Badge variant="outline" className="border-amber-400/20 text-amber-400 font-bold shrink-0 self-center">
                    GUEST
                  </Badge>
                </div>
                <Textarea
                  placeholder="Leave a message on the wall..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="min-h-[64px] text-xs bg-[var(--bg-base)] resize-none"
                  maxLength={100}
                />
                <Button
                  type="submit"
                  disabled={!newMessageText.trim()}
                  className="h-8 text-xs font-semibold bg-amber-500 hover:bg-amber-600 border-none text-[var(--bg-base)] cursor-pointer self-end"
                >
                  Post Message
                </Button>
              </form>

              {/* Messages display area */}
              <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-[var(--border-default)]">
                <AnimatePresence initial={false}>
                  {fanMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="p-3 bg-[var(--bg-overlay)] rounded-lg border border-[var(--border-default)] flex flex-col gap-1 text-xs"
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-[var(--text-secondary)]">{msg.username}</span>
                        <span className="text-[10px] text-[var(--text-tertiary)] font-mono">{msg.time}</span>
                      </div>
                      <p className="text-[var(--text-primary)] pl-0.5 leading-relaxed font-medium">
                        {msg.message}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </GlassCard>

          </div>
        </div>
      </Container>

      {/* Recommend Game Dialog (Modal) */}
      <Dialog
        open={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
        title="Recommend a Game"
        size="md"
      >
        <form onSubmit={handleSuggestSubmit} className="flex flex-col gap-4 pt-4">
          <Input
            label="Game Name"
            placeholder="e.g. Elden Ring"
            value={newGameName}
            onChange={(e) => setNewGameName(e.target.value)}
            required
            className="text-xs"
          />
          <Input
            label="Platforms"
            placeholder="e.g. PC, PS5, Switch"
            value={newGamePlatform}
            onChange={(e) => setNewGamePlatform(e.target.value)}
            className="text-xs"
          />
          <Textarea
            label="Why should Zehragn play it?"
            placeholder="Tell us about the game details, difficulty level, or features..."
            value={newGameDesc}
            onChange={(e) => setNewGameDesc(e.target.value)}
            className="min-h-[80px] text-xs resize-none"
          />
          
          <div className="flex justify-end gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSuggestModalOpen(false)}
              className="h-9 px-4 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none cursor-pointer"
            >
              Submit Recommendation
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
