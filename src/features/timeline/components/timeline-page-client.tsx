"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Radio,
} from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Mock Data for Timeline
// ---------------------------------------------------------------------------

interface TimelineEvent {
  id: string;
  year: string;
  date: string;
  title: string;
  category: "milestone" | "career" | "esports" | "charity";
  description: string;
  extendedDetails: string;
  stats: { label: string; value: string }[];
  highlight?: boolean;
}

const TIMELINE_YEARS = ["all", "2026", "2025", "2024", "2023", "2022", "2021"] as const;

const MOCK_EVENTS: TimelineEvent[] = [
  {
    id: "evt-1",
    year: "2026",
    date: "June 2026",
    title: "285K Followers & Brand New Space",
    category: "milestone",
    description: "Celebrating five years of streaming! We launched our official custom web experience Zehragn.com and upgraded the physical studio space.",
    extendedDetails: "A brand new dual-PC build was integrated with professional acoustic treatments. Viewership reached new heights, with active chatters exceeding 4,000 per hour on avg.",
    stats: [
      { label: "Followers", value: "285,400" },
      { label: "Average Viewers", value: "12,438" },
      { label: "Stream Count", value: "85 streams" },
    ],
    highlight: true,
  },
  {
    id: "evt-2",
    year: "2025",
    date: "November 2025",
    title: "Kick Esports Championship Partner",
    category: "esports",
    description: "Invited as the official broadcast co-host for the Valorant Challengers Kick Finals, presenting live analysis from the arena stage.",
    extendedDetails: "Co-streamed the grand finals with peak concurrent viewership topping 18,240 concurrent viewers. Conducted stage interviews with pro players.",
    stats: [
      { label: "Peak Viewers", value: "18,240" },
      { label: "Arena Interviews", value: "8 players" },
      { label: "Co-stream Hours", value: "32 hours" },
    ],
  },
  {
    id: "evt-3",
    year: "2025",
    date: "July 2025",
    title: "Annual Charity Marathon — $25,000 Raised",
    category: "charity",
    description: "Hosted a 24-hour non-stop gaming marathon to support Hope Children's Hospital, rallying the ZehrArmy to crush our initial goal.",
    extendedDetails: "Initially set a target of $10,000, which was met in the first 4 hours of the broadcast. Zehragn completed 12 consecutive wins in Valorant to wrap the stream.",
    stats: [
      { label: "Total Raised", value: "$25,480" },
      { label: "Duration", value: "24 hours" },
      { label: "Individual Donors", value: "1,420 fans" },
    ],
    highlight: true,
  },
  {
    id: "evt-4",
    year: "2024",
    date: "October 2024",
    title: "The 100,000 Followers Milestone",
    category: "milestone",
    description: "Hit 100k followers live on broadcast. Celebrated with special sub matches, fan call-ins, and a custom cake smash on stream.",
    extendedDetails: "Follower growth accelerated after adding variety horror slots on Thursdays. Celebrated with our biggest emote pack update in channel history.",
    stats: [
      { label: "Followers Count", value: "100,000" },
      { label: "Hype Trains", value: "Level 15" },
      { label: "Subscriptions Gained", value: "2,400" },
    ],
  },
  {
    id: "evt-5",
    year: "2023",
    date: "March 2023",
    title: "Official Migration to Kick.com",
    category: "career",
    description: "Made the strategic decision to transition our primary broadcast channel to Kick, signing a creator support agreement.",
    extendedDetails: "The transition proved highly successful, with the channel ranking in the Top 10 trending streamers list in Turkey within the first month.",
    stats: [
      { label: "Initial Stream Viewers", value: "4,500" },
      { label: "Growth Rate", value: "+300% monthly" },
      { label: "Subscriber Count", value: "1,200" },
    ],
    highlight: true,
  },
  {
    id: "evt-6",
    year: "2022",
    date: "May 2022",
    title: "The ZehrArmy Community Birth",
    category: "career",
    description: "Surpassed 10,000 followers! The community officially voted to name themselves 'ZehrArmy' and launched our Discord server.",
    extendedDetails: "Our Discord server reached 5,000 members in the first week. We established the weekly community custom match nights on Fridays.",
    stats: [
      { label: "Followers", value: "10,000" },
      { label: "Discord Members", value: "5,800" },
      { label: "Friday Custom Lobby", value: "10 players avg" },
    ],
  },
  {
    id: "evt-7",
    year: "2021",
    date: "June 2021",
    title: "The Very First Stream",
    category: "career",
    description: "Fired up the broadcast for the first time using a borrowed PC and a basic web camera. Peak viewer count was 3, all close friends.",
    extendedDetails: "Began streaming Valorant beta with low-graphics settings. Despite technical limitations, we laid the foundation of interactive chat engagement.",
    stats: [
      { label: "Peak Viewers", value: "3" },
      { label: "Stream Duration", value: "2.5 hours" },
      { label: "Equipment Cost", value: "$450" },
    ],
  },
];

export function TimelinePageClient() {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [expandedEventIds, setExpandedEventIds] = useState<Record<string, boolean>>({});

  const toggleEvent = (id: string) => {
    setExpandedEventIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredEvents = MOCK_EVENTS.filter((evt) =>
    selectedYear === "all" ? true : evt.year === selectedYear
  );

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "esports":
        return <Badge className="bg-red-500/10 border-red-500/20 hover:bg-red-500/10 text-red-400 text-[10px] font-bold">ESPORTS</Badge>;
      case "charity":
        return <Badge className="bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">CHARITY</Badge>;
      case "milestone":
        return <Badge className="bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-[10px] font-bold">MILESTONE</Badge>;
      default:
        return <Badge className="bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/10 text-blue-400 text-[10px] font-bold">STREAM CAREER</Badge>;
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden bg-[var(--bg-base)]">
      {/* Background spotlights */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(0,242,154,0.04),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-15%] w-[800px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.02),transparent_70%)] pointer-events-none z-0" />

      <Container className="relative z-10 flex flex-col gap-12">
        {/* Title area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-xl">
            <Badge variant="outline" className="border-indigo-400/25 text-indigo-400 font-bold bg-indigo-500/5 uppercase self-start">
              OUR CHRONICLE
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
              The Stream Journey
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Trace the historical milestones, major community events, charity achievements, and esports activations from the very first broadcast in 2021.
            </p>
          </div>

          {/* Year selector anchors */}
          <div className="flex flex-wrap gap-1.5 bg-[var(--bg-overlay)] p-1 rounded-2xl border border-[var(--border-default)] shadow-[var(--shadow-sm)] self-start md:self-auto">
            {TIMELINE_YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all cursor-pointer",
                  selectedYear === y
                    ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-[var(--shadow-sm)] border border-[var(--border-subtle)] font-bold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Central Vertical Timeline */}
        <div className="relative border-l border-[var(--border-default)] ml-4 sm:ml-6 flex flex-col gap-12 py-4">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((evt) => {
              const isExpanded = !!expandedEventIds[evt.id];
              return (
                <motion.div
                  key={evt.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative pl-8 sm:pl-10"
                >
                  {/* Outer circle node on timeline */}
                  <div
                    className={cn(
                      "absolute top-1.5 -left-[9px] w-[18px] h-[18px] rounded-full border bg-[var(--bg-base)] flex items-center justify-center transition-all z-10",
                      evt.highlight
                        ? "border-[var(--accent-primary)] ring-4 ring-[var(--accent-primary)]/10"
                        : "border-[var(--border-strong)]"
                    )}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        evt.highlight ? "bg-[var(--accent-primary)] animate-pulse" : "bg-[var(--text-secondary)]"
                      )}
                    />
                  </div>

                  {/* Card wrapper */}
                  <GlassCard
                    className={cn(
                      "p-6 border overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 relative group max-w-4xl",
                      evt.highlight
                        ? "border-[var(--accent-primary)]/30 bg-[rgba(10,10,10,0.55)] shadow-[0_0_24px_rgba(0,242,154,0.03)]"
                        : "border-[var(--border-default)] hover:border-[var(--border-strong)] bg-[rgba(10,10,10,0.35)]"
                    )}
                  >
                    {/* Hover Glow background */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1%_1%,rgba(0,242,154,0.015),transparent_50%)] pointer-events-none" />

                    <div className="flex flex-col gap-3 relative z-10">
                      {/* Top Header metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[var(--accent-primary)] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {evt.date}
                          </span>
                          {getCategoryBadge(evt.category)}
                        </div>

                        {evt.highlight && (
                          <Badge className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 text-[9px] font-bold border border-[var(--accent-primary)]/20 px-2 py-0.5 rounded-full">
                            KEY EVENT
                          </Badge>
                        )}
                      </div>

                      {/* Main Title text */}
                      <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight leading-snug" style={{ fontFamily: "var(--font-outfit)" }}>
                        {evt.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {evt.description}
                      </p>

                      {/* Expanded Section toggle */}
                      <div className="flex flex-col gap-3 mt-1.5">
                        <button
                          onClick={() => toggleEvent(evt.id)}
                          className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-2 border-t border-dashed border-[var(--border-default)] cursor-pointer"
                        >
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                            Event Details & Stats
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[var(--text-tertiary)]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
                          )}
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-col gap-4 py-3 bg-[rgba(10,10,10,0.15)] px-4 rounded-lg border border-[var(--border-subtle)]">
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-1 border-l-2 border-[var(--accent-primary)]/40">
                                  {evt.extendedDetails}
                                </p>

                                {/* Event stats display */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                                  {evt.stats.map((stat, sIdx) => (
                                    <div key={sIdx} className="flex flex-col p-2.5 bg-[var(--bg-base)]/50 rounded border border-[var(--border-subtle)]">
                                      <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">
                                        {stat.label}
                                      </span>
                                      <span className="text-sm font-extrabold text-[var(--text-primary)] font-mono mt-0.5">
                                        {stat.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)]">
            <Radio className="w-10 h-10 text-[var(--text-tertiary)] mb-3 animate-pulse" />
            <p className="text-sm text-[var(--text-secondary)] font-medium">
              No milestones discovered in this year filter.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
