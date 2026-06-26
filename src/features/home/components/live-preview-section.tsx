"use client";

import { motion } from "framer-motion";
import { Clock, ExternalLink, Gamepad2, Users } from "lucide-react";
import { LiveBadge } from "@/components/analytics";
import { GlassCard } from "@/components/ui/glass-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HoverGlow, RevealOnScroll, SlideUp } from "@/components/motion";
import { siteConfig } from "@/config/site";
import { formatNumber } from "@/lib/utils";
import { MOCK_STREAM } from "../data/mock-data";

export function LivePreviewSection() {
  return (
    <Section padding="lg" divided>
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 items-center">

          {/* ── Left: Stream thumbnail ────────────────────────────── */}
          <RevealOnScroll animation="scale" delay={0.1}>
            <HoverGlow color="var(--accent-primary)" size={360} opacity={0.08}>
              <div
                className="relative w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)]"
                style={{ aspectRatio: "16 / 9" }}
              >
                {/* Mock thumbnail background */}
                <div
                  className="absolute inset-0"
                  style={{ background: MOCK_STREAM.thumbnailGradient }}
                />

                {/* Grid overlay */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.a
                    href={siteConfig.kick.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Watch live stream on Kick"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    {/* Play triangle */}
                    <div
                      className="ml-1 h-0 w-0"
                      style={{
                        borderTop: "10px solid transparent",
                        borderBottom: "10px solid transparent",
                        borderLeft: "18px solid rgba(255,255,255,0.9)",
                      }}
                    />
                  </motion.a>
                </div>

                {/* Live badge overlay */}
                <div className="absolute top-4 left-4">
                  <LiveBadge isLive={MOCK_STREAM.isLive} variant="compact" />
                </div>

                {/* Duration badge */}
                <div className="absolute top-4 right-4">
                  <span className="rounded-[var(--radius-sm)] bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {MOCK_STREAM.duration}
                  </span>
                </div>

                {/* Bottom info overlay */}
                <div
                  className="absolute inset-x-0 bottom-0 p-4"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                  }}
                >
                  <p className="text-sm font-semibold text-white line-clamp-1">
                    {MOCK_STREAM.title}
                  </p>
                  <p className="mt-0.5 text-xs text-white/60">{MOCK_STREAM.game}</p>
                </div>
              </div>
            </HoverGlow>
          </RevealOnScroll>

          {/* ── Right: Stream details ─────────────────────────────── */}
          <div className="flex flex-col gap-8">
            <SlideUp delay={0.15}>
              <div className="flex flex-col gap-2">
                <span
                  className="label-eyebrow"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Live Now
                </span>
                <h2
                  className="text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Tune In
                </h2>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-md">
                  {MOCK_STREAM.title}
                </p>
              </div>
            </SlideUp>

            {/* Stats row */}
            <SlideUp delay={0.25}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    icon: Users,
                    label: "Viewers",
                    value: formatNumber(MOCK_STREAM.viewerCount),
                    accent: "var(--accent-primary)",
                  },
                  {
                    icon: Clock,
                    label: "Duration",
                    value: MOCK_STREAM.duration,
                    accent: "var(--text-tertiary)",
                  },
                  {
                    icon: Gamepad2,
                    label: "Game",
                    value: MOCK_STREAM.game,
                    accent: "var(--text-tertiary)",
                  },
                ].map((stat) => (
                  <GlassCard key={stat.label} padding="sm" intensity="subtle">
                    <div className="flex flex-col gap-1.5">
                      <stat.icon
                        className="h-4 w-4"
                        style={{ color: stat.accent }}
                        aria-hidden
                      />
                      <span
                        className="text-lg font-bold text-[var(--text-primary)] tabular-nums"
                        style={{ fontFamily: "var(--font-outfit)" }}
                      >
                        {stat.value}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)]">
                        {stat.label}
                      </span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </SlideUp>

            {/* CTA */}
            <SlideUp delay={0.35}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={siteConfig.kick.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-primary-hover)] hover:shadow-[0_0_32px_var(--accent-glow)]"
                >
                  Watch on Kick
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
                <span className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] px-6 py-3 text-sm text-[var(--text-tertiary)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" aria-hidden />
                  Started {MOCK_STREAM.startedAt}
                </span>
              </div>
            </SlideUp>
          </div>
        </div>
      </Container>
    </Section>
  );
}
