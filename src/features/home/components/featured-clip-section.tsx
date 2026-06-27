"use client";

import { motion } from "framer-motion";
import { Eye, Gamepad2, Heart } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HoverGlow, RevealOnScroll, SlideUp } from "@/components/motion";
import { formatNumber } from "@/lib/utils";

// Inline clip data — no clips repository in this sprint
// This section is purely visual/decorative content
const FEATURED_CLIP = {
  title: "18 Kill Ace Round in Ranked — Pure Insanity",
  game: "Valorant",
  views: 284_000,
  date: "2 weeks ago",
  duration: "1:47",
  likes: 14_200,
};


// Pre-compute particle data outside the component to avoid Math.random() during render
const PARTICLES = [
  { width: 130, left: 5, top: 22, duration: 3.8, delay: 0.0 },
  { width: 80, left: 18, top: 65, duration: 2.6, delay: 1.2 },
  { width: 160, left: 30, top: 40, duration: 4.2, delay: 0.7 },
  { width: 95, left: 47, top: 78, duration: 2.9, delay: 2.1 },
  { width: 140, left: 58, top: 15, duration: 3.5, delay: 0.3 },
  { width: 70, left: 68, top: 55, duration: 2.2, delay: 3.0 },
  { width: 110, left: 78, top: 30, duration: 3.1, delay: 1.5 },
  { width: 175, left: 85, top: 70, duration: 4.8, delay: 0.9 },
] as const;

export function FeaturedClipSection() {
  return (
    <Section padding="lg" divided>
      <Container>
        <RevealOnScroll animation="fade">
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <HoverGlow color="var(--accent-primary)" size={500} opacity={0.06}>
              <div className="grid grid-cols-1 lg:grid-cols-5">

                {/* ── Left: Thumbnail ─────────────────────────────── */}
                <div className="relative lg:col-span-3 overflow-hidden" style={{ minHeight: "340px" }}>
                  {/* Gradient thumbnail */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #0d0520 0%, #1a0a3d 30%, #0a0a1a 60%, #150530 100%)",
                    }}
                  />

                  {/* Animated particles — pre-computed positions */}
                  <div aria-hidden className="absolute inset-0 overflow-hidden">
                    {PARTICLES.map((p, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-px rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)",
                          width: `${p.width}px`,
                          left: `${p.left}%`,
                          top: `${p.top}%`,
                        }}
                        animate={{ x: ["-100%", "200%"], opacity: [0, 1, 0] }}
                        transition={{
                          duration: p.duration,
                          repeat: Infinity,
                          delay: p.delay,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="group flex h-20 w-20 items-center justify-center rounded-full border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 backdrop-blur-sm transition-colors hover:bg-[var(--accent-primary)]/20 hover:border-[var(--accent-primary)]/60"
                      aria-label="Play featured clip"
                    >
                      <div
                        className="ml-1.5 h-0 w-0"
                        style={{
                          borderTop: "12px solid transparent",
                          borderBottom: "12px solid transparent",
                          borderLeft: "22px solid rgba(139,92,246,0.9)",
                        }}
                      />
                    </motion.button>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-4 right-4">
                    <span className="rounded-[var(--radius-sm)] bg-black/70 px-2 py-1 text-xs font-mono text-white">
                      {FEATURED_CLIP.duration}
                    </span>
                  </div>

                  {/* Most watched label */}
                  <div className="absolute top-4 left-4">
                    <span className="rounded-[var(--radius-sm)] border border-[var(--accent-primary)]/30 bg-[var(--accent-glow)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--accent-primary)]">
                      Most Watched
                    </span>
                  </div>
                </div>

                {/* ── Right: Clip info ─────────────────────────────── */}
                <div className="flex flex-col justify-center gap-7 p-8 lg:col-span-2">
                  <SlideUp delay={0.2}>
                    <div className="flex flex-col gap-3">
                      <span
                        className="label-eyebrow"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        Featured Clip
                      </span>
                      <h2
                        className="text-2xl font-bold tracking-tight text-[var(--text-primary)] leading-snug"
                        style={{ fontFamily: "var(--font-outfit)" }}
                      >
                        {FEATURED_CLIP.title}
                      </h2>
                    </div>
                  </SlideUp>

                  {/* Meta tags */}
                  <SlideUp delay={0.3}>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-overlay)] px-2.5 py-1 text-xs text-[var(--text-secondary)]">
                        <Gamepad2 className="h-3 w-3" aria-hidden />
                        {FEATURED_CLIP.game}
                      </span>
                    </div>
                  </SlideUp>

                  {/* Stats */}
                  <SlideUp delay={0.38}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[var(--text-tertiary)]">
                          <Eye className="h-3.5 w-3.5" aria-hidden />
                          <span className="text-xs">Views</span>
                        </div>
                        <span
                          className="text-2xl font-bold text-[var(--text-primary)] tabular-nums"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          {formatNumber(FEATURED_CLIP.views)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[var(--text-tertiary)]">
                          <Heart className="h-3.5 w-3.5" aria-hidden />
                          <span className="text-xs">Likes</span>
                        </div>
                        <span
                          className="text-2xl font-bold text-[var(--text-primary)] tabular-nums"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          {formatNumber(FEATURED_CLIP.likes)}
                        </span>
                      </div>
                    </div>
                  </SlideUp>

                  <SlideUp delay={0.45}>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Clipped {FEATURED_CLIP.date}
                    </p>
                  </SlideUp>

                  <SlideUp delay={0.52}>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-primary-hover)] hover:shadow-[0_0_24px_var(--accent-glow)]"
                    >
                      Watch Clip
                    </button>
                  </SlideUp>
                </div>
              </div>
            </HoverGlow>
          </div>
        </RevealOnScroll>
      </Container>
    </Section>
  );
}
