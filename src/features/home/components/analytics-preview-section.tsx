"use client";

import { TrendingUp } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/analytics/section-title";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { RevealOnScroll, StaggerChildren } from "@/components/motion";
import { MOCK_STATS } from "../data/mock-data";

export function AnalyticsPreviewSection() {
  return (
    <Section id="analytics" padding="lg" divided accentGlow>
      <Container>
        <RevealOnScroll animation="fade">
          <SectionTitle
            eyebrow="By the Numbers"
            title="The Stats Speak For Themselves"
            description="Real-time analytics pulled from the Kick API every 60 seconds. Every viewer, every stream, every milestone."
            align="center"
          />
        </RevealOnScroll>

        <div className="mt-12">
          <StaggerChildren staggerDelay={0.1} initialDelay={0.1} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MOCK_STATS.map((stat) => (
              <div
                key={stat.id}
                className="group relative flex flex-col gap-5 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 overflow-hidden transition-all duration-300 hover:border-[var(--border-default)] hover:bg-[var(--bg-elevated)]"
              >
                {/* Accent gradient background on hover */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(ellipse at top left, rgba(139,92,246,0.06) 0%, transparent 60%)",
                  }}
                />

                {/* Label */}
                <span
                  className="label-eyebrow"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {stat.label}
                </span>

                {/* Value */}
                <div>
                  <p
                    className="text-5xl font-bold tracking-tight text-[var(--text-primary)] tabular-nums"
                    style={{ fontFamily: "var(--font-outfit)" }}
                    aria-label={`${stat.label}: ${stat.value.toLocaleString()}`}
                  >
                    <AnimatedCounter
                      value={stat.id === "followers" || stat.id === "peak-viewers"
                        ? Math.round(stat.value / 1000)
                        : stat.value}
                      duration={1.8}
                    />
                    {(stat.id === "followers" || stat.id === "peak-viewers") && (
                      <span className="text-2xl text-[var(--text-secondary)]">K</span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                    {stat.description}
                  </p>
                </div>

                {/* Trend */}
                <div className="flex items-center gap-1.5 text-xs text-[var(--success)]">
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                  <span className="font-medium">+{stat.trend.value}%</span>
                  <span className="text-[var(--text-tertiary)] font-normal">
                    {stat.trend.label}
                  </span>
                </div>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </Container>
    </Section>
  );
}
