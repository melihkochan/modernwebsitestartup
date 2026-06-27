"use client";

import { MessageSquare, ThumbsUp } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/analytics/section-title";
import { GlassCard } from "@/components/ui/glass-card";
import { RevealOnScroll, StaggerChildren } from "@/components/motion";
import { useSuggestions, useActivePoll, useFanMessages } from "@/features/community/hooks/use-community";

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="h-3 w-20 animate-pulse rounded bg-[var(--bg-overlay)]" />
      <div className="h-5 w-40 animate-pulse rounded bg-[var(--bg-overlay)]" />
      <div className="h-2 w-full animate-pulse rounded bg-[var(--bg-overlay)]" />
      <div className="h-2 w-4/5 animate-pulse rounded bg-[var(--bg-overlay)]" />
    </div>
  );
}

export function CommunityPreviewSection() {
  const { data: suggestions, isLoading: loadingSuggestions } = useSuggestions();
  const { data: poll, isLoading: loadingPoll } = useActivePoll();
  const { data: messages, isLoading: loadingMessages } = useFanMessages();

  // Pick the top voted suggestion
  const topSuggestion = suggestions?.sort((a, b) => b.votes - a.votes)[0] ?? null;
  const totalVotes = suggestions?.reduce((sum, s) => sum + s.votes, 0) ?? 0;

  // Show max 3 fan messages in the preview
  const previewMessages = (messages ?? []).slice(0, 3);

  return (
    <Section padding="lg" divided>
      <Container>
        <RevealOnScroll animation="slide-up">
          <SectionTitle
            eyebrow="The ZehrArmy"
            title="Community in Motion"
            description="A living, breathing community. Suggest games, vote on polls, and leave your mark."
            align="left"
          />
        </RevealOnScroll>

        <div className="mt-12">
          <StaggerChildren
            staggerDelay={0.12}
            initialDelay={0.1}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {/* ── Card 1: Game Suggestion ──────────────────────── */}
            {loadingSuggestions ? (
              <CardSkeleton />
            ) : topSuggestion ? (
              <GlassCard intensity="medium" padding="md" glow="accent" hoverable className="flex flex-col gap-5">
                <div>
                  <span
                    className="label-eyebrow"
                    style={{ fontFamily: "var(--font-inter)", color: "var(--accent-primary)" }}
                  >
                    Top Voted Game
                  </span>
                  <h3
                    className="mt-2 text-xl font-bold"
                    style={{ fontFamily: "var(--font-outfit)", color: "#ededed" }}
                  >
                    {topSuggestion.game}
                  </h3>
                  {topSuggestion.platform && (
                    <span className="mt-1.5 inline-block rounded-[var(--radius-sm)] border border-[var(--accent-primary)]/20 bg-[var(--accent-glow)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--accent-primary)]">
                      {topSuggestion.platform}
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-2" style={{ color: "#a1a1aa" }}>
                    <span>{topSuggestion.votes.toLocaleString()} votes</span>
                    <span>
                      {totalVotes > 0 ? Math.round((topSuggestion.votes / totalVotes) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-overlay)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent-primary)]"
                      style={{
                        width: `${totalVotes > 0 ? Math.round((topSuggestion.votes / totalVotes) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#a1a1aa" }}>
                    by {topSuggestion.submittedBy}
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium transition-colors hover:border-[var(--accent-primary)]/50 hover:text-[var(--accent-primary)]"
                    style={{ color: "#d4d4d8" }}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
                    Vote
                  </button>
                </div>
              </GlassCard>
            ) : (
              <GlassCard intensity="medium" padding="md" className="flex items-center justify-center">
                <p className="text-sm" style={{ color: "#a1a1aa" }}>No suggestions yet</p>
              </GlassCard>
            )}

            {/* ── Card 2: Active Poll ──────────────────────────── */}
            {loadingPoll ? (
              <CardSkeleton />
            ) : poll ? (
              <GlassCard intensity="medium" padding="md" className="flex flex-col gap-5">
                <div>
                  <span
                    className="label-eyebrow"
                    style={{ fontFamily: "var(--font-inter)", color: "var(--accent-primary)" }}
                  >
                    Active Poll
                  </span>
                  <h3
                    className="mt-2 text-base font-semibold leading-snug"
                    style={{ fontFamily: "var(--font-outfit)", color: "#ededed" }}
                  >
                    {poll.question}
                  </h3>
                </div>

                {/* Options */}
                <div className="flex flex-col gap-2.5">
                  {poll.options.map((opt) => {
                    const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                    const isLeading = opt.votes === Math.max(...poll.options.map((o) => o.votes));
                    return (
                      <div key={opt.id}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="truncate max-w-[160px]" style={{ color: "#d4d4d8" }}>
                            {opt.label}
                          </span>
                          <span className="shrink-0 ml-2" style={{ color: "#a1a1aa" }}>
                            {pct}%
                          </span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--bg-overlay)]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: isLeading
                                ? "var(--accent-primary)"
                                : "var(--border-strong)",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-auto flex items-center justify-between text-xs" style={{ color: "#a1a1aa" }}>
                  <span>{poll.totalVotes.toLocaleString()} votes</span>
                  {poll.endsIn && <span>Ends in {poll.endsIn}</span>}
                </div>
              </GlassCard>
            ) : (
              <GlassCard intensity="medium" padding="md" className="flex items-center justify-center">
                <p className="text-sm" style={{ color: "#a1a1aa" }}>No active poll</p>
              </GlassCard>
            )}

            {/* ── Card 3: Fan Messages ─────────────────────────── */}
            {loadingMessages ? (
              <CardSkeleton />
            ) : (
              <GlassCard intensity="medium" padding="md" className="flex flex-col gap-4">
                <div>
                  <span
                    className="label-eyebrow"
                    style={{ fontFamily: "var(--font-inter)", color: "var(--accent-primary)" }}
                  >
                    Fan Messages
                  </span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" style={{ color: "#a1a1aa" }} aria-hidden />
                    <span className="text-xs" style={{ color: "#a1a1aa" }}>Latest from the community</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {previewMessages.length > 0 ? (
                    previewMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-overlay)] p-3"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-semibold text-[var(--accent-primary)] truncate">
                            {msg.username}
                          </span>
                          <span className="text-[10px] shrink-0" style={{ color: "#a1a1aa" }}>
                            {msg.time}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#d4d4d8" }}>
                          {msg.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: "#a1a1aa" }}>No messages yet</p>
                  )}
                </div>
              </GlassCard>
            )}
          </StaggerChildren>
        </div>
      </Container>
    </Section>
  );
}
