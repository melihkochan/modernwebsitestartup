"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Settings,
  Users,
  Clock,
  Calendar,
  MessageSquare,
  Radio,
  Gamepad2,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Mock Data for Live Page
// ---------------------------------------------------------------------------

const MOCK_CHAT_MESSAGES_POOL = [
  { username: "SnipezGG", message: "That shot was absolutely insane! 🔥", role: "user", color: "#3b82f6" },
  { username: "ayz_tv", message: "Radiant grind is going good today", role: "moderator", color: "#10b981" },
  { username: "PurpleKnight99", message: "What sens do you play on now?", role: "user", color: "#a855f7" },
  { username: "ValorantPro", message: "Can we get custom matches after this?", role: "user", color: "#ec4899" },
  { username: "ZehrArmy_Mod", message: "Remember to follow and join the Discord! Link below!", role: "moderator", color: "#10b981" },
  { username: "StreamerFan_TR", message: "W stream as always!", role: "user", color: "#f59e0b" },
  { username: "melih_dev", message: "This site interface looks so premium!", role: "user", color: "#ef4444" },
  { username: "GamerGirl99", message: "Apex next week please!", role: "user", color: "#06b6d4" },
  { username: "X_Clipper", message: "CLIP THAT OMFG!!!", role: "user", color: "#84cc16" },
  { username: "Lurker_01", message: "chill streams are the best", role: "user", color: "#6b7280" },
];

const UPCOMING_SCHEDULE = [
  { day: "Tuesday", time: "20:00 - 00:00", game: "Valorant Ranked Grind", platform: "Kick" },
  { day: "Thursday", time: "20:00 - 00:00", game: "Variety Games / CS2", platform: "Kick" },
  { day: "Friday", time: "20:00 - 01:00", game: "ZehrArmy Custom Match Night", platform: "Kick" },
  { day: "Saturday", time: "Spontaneous Stream", game: "Apex / Just Chatting", platform: "Kick" },
];

const PREVIOUS_CLIPS = [
  {
    id: "clip-1",
    title: "18 Kill Ace Round in Ranked",
    views: "24.5K views",
    date: "2 days ago",
    duration: "1:47",
    game: "Valorant",
    gradient: "linear-gradient(135deg, #1a0533 0%, #0d1117 100%)",
  },
  {
    id: "clip-2",
    title: "Zehragn Clutch 1v4 Retake",
    views: "18.2K views",
    date: "5 days ago",
    duration: "0:58",
    game: "Valorant",
    gradient: "linear-gradient(135deg, #0d1a2d 0%, #050f1a 100%)",
  },
  {
    id: "clip-3",
    title: "Scaring the lobby with Sheriff only",
    views: "12.8K views",
    date: "1 week ago",
    duration: "1:12",
    game: "Valorant",
    gradient: "linear-gradient(135deg, #1a0f0a 0%, #0d0600 100%)",
  },
];

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  role: string;
  color: string;
  timestamp: string;
}

export function LivePageClient() {
  const [isSimulatedLive, setIsSimulatedLive] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    return Array.from({ length: 6 }).map((_, index) => {
      const msg = MOCK_CHAT_MESSAGES_POOL[index % MOCK_CHAT_MESSAGES_POOL.length];
      return {
        id: `initial-${index}`,
        username: msg.username,
        message: msg.message,
        role: msg.role,
        color: msg.color,
        timestamp: "Now",
      };
    });
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simulate scrolling chat
  useEffect(() => {
    if (!isSimulatedLive) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * MOCK_CHAT_MESSAGES_POOL.length);
      const randomMsg = MOCK_CHAT_MESSAGES_POOL[randomIndex];
      const now = new Date();
      const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setChatMessages((prev) => {
        const next = [
          ...prev,
          {
            id: `msg-${Date.now()}-${Math.random()}`,
            username: randomMsg.username,
            message: randomMsg.message,
            role: randomMsg.role,
            color: randomMsg.color,
            timestamp,
          },
        ];
        // Keep last 30 messages
        return next.slice(-30);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulatedLive]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden bg-[var(--bg-base)]">
      {/* Background radial highlight glow */}
      <div className="absolute top-[-20%] left-[50%] -translate-x-[50%] w-[1000px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(0,242,154,0.06),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.02),transparent_70%)] pointer-events-none z-0" />

      <Container className="relative z-10">
        {/* Simulator Toggle Panel */}
        <div className="flex justify-end mb-6">
          <GlassCard className="p-2 border border-[var(--border-subtle)] flex items-center gap-2 rounded-full shadow-[var(--shadow-sm)]">
            <span className="text-xs text-[var(--text-secondary)] font-semibold px-3 uppercase tracking-wider">
              Simulator Sandbox
            </span>
            <div className="flex items-center gap-1 bg-[var(--bg-base)] rounded-full p-0.5 border border-[var(--border-default)]">
              <button
                onClick={() => setIsSimulatedLive(true)}
                className={cn(
                  "px-4 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer",
                  isSimulatedLive
                    ? "bg-[var(--live-red)] text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                Online
              </button>
              <button
                onClick={() => setIsSimulatedLive(false)}
                className={cn(
                  "px-4 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer",
                  !isSimulatedLive
                    ? "bg-[var(--text-secondary)] text-[var(--bg-base)] font-bold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                Offline
              </button>
            </div>
          </GlassCard>
        </div>

        <AnimatePresence mode="wait">
          {isSimulatedLive ? (
            /* =========================================================================
               ONLINE STATE (STREAM ACTIVE)
               ========================================================================= */
            <motion.div
              key="online-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Player & Metadata (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Visual Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--live-red)] opacity-75 animate-ping" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--live-red)]" />
                    </span>
                    <Badge variant="outline" className="border-[var(--live-red)]/30 text-[var(--live-red)] font-bold bg-[var(--live-red-glow)] animate-pulse">
                      LIVE STREAM
                    </Badge>
                    <span className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                      <Gamepad2 className="w-4 h-4 text-[var(--accent-primary)]" />
                      Playing: <span className="text-[var(--text-primary)] font-semibold">Valorant</span>
                    </span>
                  </div>

                  <a
                    href={siteConfig.kick.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] group transition-colors"
                  >
                    Watch on Kick.com
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>

                {/* Simulated Player Container */}
                <div className="relative aspect-video rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-default)] bg-[black] shadow-[var(--shadow-lg)] group/player">
                  {/* Dynamic Gradient Particle Animation Loop */}
                  <div
                    className="absolute inset-0 z-0 transition-transform duration-[4000ms]"
                    style={{
                      background: "linear-gradient(135deg, #10061e 0%, #090a14 50%, #03080e 100%)",
                    }}
                  >
                    {/* Simulated visual effects inside player when playing */}
                    {isPlaying && (
                      <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(0,242,154,0.1),transparent_50%)] animate-pulse" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_50%)] animate-pulse" style={{ animationDelay: "1s" }} />
                        {/* Interactive UI element showing Zehragn avatar watermark */}
                        <div className="absolute bottom-16 left-6 flex items-center gap-3 bg-[rgba(10,10,10,0.5)] backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 opacity-40 select-none pointer-events-none">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--live-red)] animate-spin" style={{ animationDuration: "10s" }} />
                          <span className="text-xs font-bold text-white tracking-widest uppercase">zehragn.com</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Pause Overlay */}
                  {!isPlaying && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2">
                      <button
                        onClick={togglePlay}
                        className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all text-white cursor-pointer"
                      >
                        <Play className="w-8 h-8 fill-current ml-1" />
                      </button>
                      <span className="text-sm font-semibold text-[var(--text-secondary)]">Stream Paused</span>
                    </div>
                  )}

                  {/* Video Watermark or Interactive elements */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <Badge className="bg-[var(--live-red)] text-white font-bold border-none px-2 py-0.5 text-[10px]">
                      KICK.COM/ZEHRAGN
                    </Badge>
                  </div>

                  {/* Custom Player Controls Bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 z-20 opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-white">
                      <button onClick={togglePlay} className="p-1 hover:text-[var(--accent-primary)] transition-colors cursor-pointer">
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                      </button>

                      <div className="flex items-center gap-2 group/volume">
                        <button onClick={toggleMute} className="p-1 hover:text-[var(--accent-primary)] transition-colors cursor-pointer">
                          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => {
                            setVolume(Number(e.target.value));
                            if (isMuted) setIsMuted(false);
                          }}
                          className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)] transition-all group-hover/volume:w-24"
                        />
                      </div>

                      <span className="text-xs font-mono font-medium text-white/70">
                        {isPlaying ? "LIVE • 03:24:15" : "PAUSED"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-white">
                      <button className="p-1 hover:text-[var(--accent-primary)] transition-colors cursor-pointer">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:text-[var(--accent-primary)] transition-colors cursor-pointer">
                        <Maximize2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Metadata Details Card */}
                <GlassCard className="p-6 border border-[var(--border-default)]">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                        {"Solo Ranked Grind — Let's hit Radiant before season ends!"}
                      </h1>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[var(--bg-overlay)] hover:bg-[var(--bg-overlay)] text-[var(--text-secondary)] border border-[var(--border-default)]">
                          FPS
                        </Badge>
                        <Badge className="bg-[var(--bg-overlay)] hover:bg-[var(--bg-overlay)] text-[var(--text-secondary)] border border-[var(--border-default)]">
                          Competitive
                        </Badge>
                      </div>
                    </div>

                    <div className="h-px bg-[var(--border-subtle)]" />

                    {/* Stream info list */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
                          Current Game
                        </span>
                        <span className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5 mt-1">
                          <Gamepad2 className="w-4 h-4 text-[var(--accent-primary)]" />
                          Valorant
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
                          Uptime
                        </span>
                        <span className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5 mt-1">
                          <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                          03h 24m
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
                          Viewer Count
                        </span>
                        <span className="text-sm font-bold text-[var(--live-red)] flex items-center gap-1.5 mt-1">
                          <Users className="w-4 h-4" />
                          12,438
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
                          Hype Level
                        </span>
                        <span className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5 mt-1">
                          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                          Max
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Right Column: Chat Feed (4 cols) */}
              <div className="lg:col-span-4 flex flex-col h-[600px] lg:h-auto">
                <GlassCard className="flex flex-col h-full border border-[var(--border-default)] overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-[var(--border-subtle)] bg-[rgba(10,10,10,0.3)] flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <MessageSquare className="w-4.5 h-4.5 text-[var(--accent-primary)]" />
                      Live Stream Chat
                    </span>
                    <Badge variant="outline" className="border-[var(--live-red)]/20 text-[var(--live-red)] font-semibold text-[10px] bg-[var(--live-red-glow)] animate-pulse">
                      SCROLLING
                    </Badge>
                  </div>

                  {/* Chat Message List */}
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 scrollbar-thin scrollbar-thumb-[var(--border-default)]">
                    <AnimatePresence initial={false}>
                      {chatMessages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="flex flex-col gap-0.5 text-xs text-[var(--text-secondary)] leading-relaxed"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              {msg.role === "moderator" && (
                                <Badge className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 text-[9px] font-extrabold border border-[var(--accent-primary)]/20 px-1 py-0 rounded">
                                  MOD
                                </Badge>
                              )}
                              <span className="font-bold cursor-pointer hover:underline" style={{ color: msg.color }}>
                                {msg.username}
                              </span>
                            </div>
                            <span className="text-[10px] text-[var(--text-tertiary)] font-mono">{msg.timestamp}</span>
                          </div>
                          <span className="text-[var(--text-primary)] font-medium pl-1">{msg.message}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Input Placeholder */}
                  <div className="p-4 border-t border-[var(--border-subtle)] bg-[rgba(10,10,10,0.3)] flex gap-2">
                    <input
                      disabled
                      placeholder="Login to join the conversation..."
                      type="text"
                      className="flex-1 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-[var(--radius-md)] px-3 py-2 text-xs text-[var(--text-tertiary)] focus:outline-none cursor-not-allowed"
                    />
                    <Button disabled className="h-8 text-xs font-semibold px-3 cursor-not-allowed bg-[var(--border-default)] border-none">
                      Send
                    </Button>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          ) : (
            /* =========================================================================
               OFFLINE STATE
               ========================================================================= */
            <motion.div
              key="offline-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-12"
            >
              {/* Offline Hero & Banner */}
              <GlassCard className="relative overflow-hidden p-8 border border-[var(--border-default)] flex flex-col md:flex-row md:items-center justify-between gap-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-md)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.03),transparent_50%)] pointer-events-none" />

                <div className="flex flex-col gap-4 max-w-xl relative z-10">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-[var(--border-default)] text-[var(--text-secondary)] font-bold bg-[var(--bg-overlay)]">
                      OFFLINE
                    </Badge>
                    <span className="text-xs text-[var(--text-tertiary)] font-semibold tracking-wider uppercase">
                      Streamer is currently offline
                    </span>
                  </div>

                  <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                    You missed the grind!
                  </h1>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {"Zehragn isn't live right now, but you can explore the upcoming stream calendar, watch recent clips, suggest new games, or join our community Discord server."}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <a href={siteConfig.social.discord} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="h-9 px-4 text-xs font-semibold hover:bg-[var(--accent-primary)]/10 hover:border-[var(--accent-primary)]/30 hover:text-[var(--accent-primary)] cursor-pointer">
                        Join Discord Community
                      </Button>
                    </a>
                    <a href={siteConfig.kick.channelUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none cursor-pointer">
                        Follow on Kick
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Countdown Timer to Next Scheduled Stream */}
                <GlassCard className="p-6 border border-[var(--border-subtle)] bg-[rgba(10,10,10,0.45)] min-w-[280px] flex flex-col items-center justify-center relative z-10 shadow-[var(--shadow-sm)]">
                  <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-bold mb-4 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[var(--accent-primary)] animate-pulse" />
                    Next Scheduled Live
                  </span>

                  <div className="flex items-center gap-3 text-center">
                    <div className="flex flex-col">
                      <span className="text-2xl font-extrabold text-[var(--text-primary)] font-mono">18</span>
                      <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mt-0.5">Hours</span>
                    </div>
                    <span className="text-xl font-bold text-[var(--text-tertiary)] font-mono -translate-y-2.5">:</span>
                    <div className="flex flex-col">
                      <span className="text-2xl font-extrabold text-[var(--text-primary)] font-mono">42</span>
                      <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mt-0.5">Mins</span>
                    </div>
                    <span className="text-xl font-bold text-[var(--text-tertiary)] font-mono -translate-y-2.5">:</span>
                    <div className="flex flex-col">
                      <span className="text-2xl font-extrabold text-[var(--accent-primary)] font-mono animate-pulse">05</span>
                      <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mt-0.5">Secs</span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[var(--text-secondary)] mt-4 bg-[var(--bg-overlay)] px-3 py-1 rounded-full border border-[var(--border-default)]">
                    Thursday @ 20:00 (UTC+3)
                  </span>
                </GlassCard>
              </GlassCard>

              {/* Previous Clips showcase */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                    Catch Up on What You Missed
                  </h2>
                  <a href="/clips" className="text-xs font-semibold text-[var(--accent-primary)] hover:underline flex items-center gap-0.5">
                    View all clips <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {PREVIOUS_CLIPS.map((clip) => (
                    <GlassCard key={clip.id} className="relative overflow-hidden group/clip border border-[var(--border-default)] cursor-pointer hover:border-[var(--border-strong)] transition-all duration-300">
                      {/* Thumbnail Placeholder */}
                      <div
                        className="aspect-video relative z-0 flex items-center justify-center"
                        style={{ background: clip.gradient }}
                      >
                        {/* Play button hover reveal */}
                        <div className="absolute inset-0 bg-black/25 opacity-100 group-hover/clip:bg-black/40 transition-colors z-10" />
                        <div className="w-12 h-12 rounded-full bg-[rgba(10,10,10,0.6)] backdrop-blur-md border border-white/10 flex items-center justify-center text-white scale-95 group-hover/clip:scale-105 group-hover/clip:bg-[var(--accent-primary)] group-hover/clip:border-none transition-all z-20">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white bg-black/60 z-20">
                          {clip.duration}
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="p-4 flex flex-col gap-2 relative z-10 bg-[rgba(10,10,10,0.2)]">
                        <span className="text-[10px] text-[var(--accent-primary)] font-bold tracking-wider uppercase">
                          {clip.game}
                        </span>
                        <h3 className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">
                          {clip.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] font-medium">
                          <span>{clip.views}</span>
                          <span>•</span>
                          <span>{clip.date}</span>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
           UPCOMING SCHEDULE CALENDAR (COMMON TO BOTH STATES)
           ========================================================================= */}
        <div className="mt-16 flex flex-col gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5 text-[var(--accent-primary)]" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
              Weekly Broadcast Calendar
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {UPCOMING_SCHEDULE.map((sched, index) => (
              <GlassCard
                key={index}
                className="p-5 border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-300 relative overflow-hidden group"
              >
                {/* Visual hover top gradient strip */}
                <div className="absolute top-0 inset-x-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-[var(--accent-primary)] group-hover:to-purple-500 transition-colors" />

                <div className="flex flex-col gap-3">
                  <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
                    {sched.day}
                  </span>
                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">
                      {sched.game}
                    </h3>
                    <span className="text-xs font-mono text-[var(--text-secondary)] mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                      {sched.time}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-tertiary)] mt-2">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                      {sched.platform}
                    </span>
                    <span className="text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      Notify me
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
