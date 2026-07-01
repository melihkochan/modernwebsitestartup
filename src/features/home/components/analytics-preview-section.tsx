"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/analytics/section-title";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { RevealOnScroll, StaggerChildren } from "@/components/motion";
import { useAnalyticsMetrics } from "@/features/analytics/hooks/use-analytics";

// Skeleton placeholder for loading state
function MetricSkeleton() {
  return (
    <div className="flex flex-col gap-5 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 overflow-hidden">
      <div className="h-3 w-24 animate-pulse rounded bg-[var(--bg-overlay)]" />
      <div className="h-12 w-32 animate-pulse rounded bg-[var(--bg-overlay)]" />
      <div className="h-3 w-20 animate-pulse rounded bg-[var(--bg-overlay)]" />
    </div>
  );
}

export function AnalyticsPreviewSection() {
  const { data: metrics, isLoading } = useAnalyticsMetrics();

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
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <MetricSkeleton key={i} />
              ))}
            </div>
          ) : (
            <StaggerChildren staggerDelay={0.1} initialDelay={0.1} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(metrics ?? []).map((metric) => (
                <div
                  key={metric.label}
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
                    {metric.label}
                  </span>

                  {/* Value */}
                  <div>
                    <p
                      className="text-5xl font-bold tracking-tight text-[var(--text-primary)] tabular-nums"
                      style={{ fontFamily: "var(--font-outfit)" }}
                      aria-label={`${metric.label}: ${metric.value !== null && metric.value !== undefined ? metric.value.toLocaleString() : "Not available"}`}
                    >
                      {metric.value !== null && metric.value !== undefined ? (
                        <>
                          <AnimatedCounter
                            value={metric.value > 1000 ? Math.round(metric.value / 1000) : metric.value}
                            duration={1.8}
                          />
                          {metric.value > 1000 && (
                            <span className="text-2xl text-[var(--text-secondary)]">K</span>
                          )}
                        </>
                      ) : (
                        <span className="text-lg font-bold text-[var(--text-secondary)]">Not available</span>
                      )}
                    </p>
                  </div>

                  {/* Trend */}
                  {metric.change !== null && metric.change !== undefined && metric.isPositive !== null && metric.isPositive !== undefined ? (
                    <div
                      className={`flex items-center gap-1.5 text-xs ${
                        metric.isPositive ? "text-[var(--success)]" : "text-[var(--live-red)]"
                      }`}
                    >
                      {metric.isPositive ? (
                        <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" aria-hidden />
                      )}
                      <span className="font-medium">{metric.change}</span>
                      <span className="text-[var(--text-tertiary)] font-normal">vs last month</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-[var(--text-tertiary)]">
                      Veri bekleniyor
                    </div>
                  )}
                </div>
              ))}
            </StaggerChildren>
          )}
        </div>
      </Container>
    </Section>
  );
}
