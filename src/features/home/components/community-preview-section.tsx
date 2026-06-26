"use client";

import { MessageSquare, ThumbsUp } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/analytics/section-title";
import { GlassCard } from "@/components/ui/glass-card";
import { RevealOnScroll, StaggerChildren } from "@/components/motion";
import {
  MOCK_ACTIVE_POLL,
  MOCK_FAN_MESSAGES,
  MOCK_TOP_SUGGESTION,
} from "../data/mock-data";

export function CommunityPreviewSection() {
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
            <GlassCard intensity="medium" padding="md" glow="accent" hoverable className="flex flex-col gap-5">
              <div>
                <span
                  className="label-eyebrow"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Top Voted Game
                </span>
                <h3
                  className="mt-2 text-xl font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {MOCK_TOP_SUGGESTION.game}
                </h3>
                <span className="mt-1.5 inline-block rounded-[var(--radius-sm)] border border-[var(--accent-primary)]/20 bg-[var(--accent-glow)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--accent-primary)]">
                  {MOCK_TOP_SUGGESTION.category}
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-[var(--text-tertiary)] mb-2">
                  <span>{MOCK_TOP_SUGGESTION.votes.toLocaleString()} votes</span>
                  <span>
                    {Math.round(
                      (MOCK_TOP_SUGGESTION.votes / MOCK_TOP_SUGGESTION.totalVotes) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-overlay)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent-primary)]"
                    style={{
                      width: `${Math.round(
                        (MOCK_TOP_SUGGESTION.votes / MOCK_TOP_SUGGESTION.totalVotes) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">
                  by {MOCK_TOP_SUGGESTION.submittedBy}
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)]/50 hover:text-[var(--accent-primary)]"
                >
                  <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
                  Vote
                </button>
              </div>
            </GlassCard>

            {/* ── Card 2: Active Poll ──────────────────────────── */}
            <GlassCard intensity="medium" padding="md" className="flex flex-col gap-5">
              <div>
                <span
                  className="label-eyebrow"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Active Poll
                </span>
                <h3
                  className="mt-2 text-base font-semibold text-[var(--text-primary)] leading-snug"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {MOCK_ACTIVE_POLL.question}
                </h3>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2.5">
                {MOCK_ACTIVE_POLL.options.map((opt) => (
                  <div key={opt.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--text-secondary)] truncate max-w-[160px]">
                        {opt.label}
                      </span>
                      <span className="text-[var(--text-tertiary)] shrink-0 ml-2">
                        {opt.percentage}%
                      </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--bg-overlay)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${opt.percentage}%`,
                          background:
                            opt.percentage === 58
                              ? "var(--accent-primary)"
                              : "var(--border-strong)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                <span>{MOCK_ACTIVE_POLL.totalVotes.toLocaleString()} votes</span>
                <span>Ends in {MOCK_ACTIVE_POLL.endsIn}</span>
              </div>
            </GlassCard>

            {/* ── Card 3: Fan Messages ─────────────────────────── */}
            <GlassCard intensity="medium" padding="md" className="flex flex-col gap-4">
              <div>
                <span
                  className="label-eyebrow"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Fan Messages
                </span>
                <div className="mt-1 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-[var(--text-tertiary)]" aria-hidden />
                  <span className="text-xs text-[var(--text-tertiary)]">Latest from the community</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {MOCK_FAN_MESSAGES.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-overlay)] p-3"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-[var(--accent-primary)] truncate">
                        {msg.username}
                      </span>
                      <span className="text-[10px] text-[var(--text-tertiary)] shrink-0">
                        {msg.time}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </StaggerChildren>
        </div>
      </Container>
    </Section>
  );
}
