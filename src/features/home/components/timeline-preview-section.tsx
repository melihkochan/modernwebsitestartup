"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/analytics/section-title";
import { RevealOnScroll } from "@/components/motion";
import { cn } from "@/lib/utils";
import { MOCK_TIMELINE } from "../data/mock-data";

export function TimelinePreviewSection() {
  return (
    <Section padding="lg" divided>
      {/* Asymmetric background */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute right-0 top-0 h-full w-1/2 opacity-[0.015]"
          style={{
            background:
              "radial-gradient(ellipse at right center, rgba(139,92,246,1) 0%, transparent 70%)",
          }}
        />
      </div>

      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Left: Title */}
          <div className="lg:col-span-4 lg:pt-2">
            <RevealOnScroll animation="fade">
              <SectionTitle
                eyebrow="The Journey"
                title="From Zero to 285K"
                description="Every milestone that defined the Zehragn story — one stream at a time."
                align="left"
              />
            </RevealOnScroll>
          </div>

          {/* Right: Timeline */}
          <div className="lg:col-span-8">
            <div className="relative flex flex-col gap-0">
              {/* Vertical line */}
              <div
                aria-hidden
                className="absolute left-[5.5rem] top-0 bottom-0 w-px"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, var(--border-default) 10%, var(--border-default) 90%, transparent)",
                }}
              />

              {MOCK_TIMELINE.map((item, i) => (
                <RevealOnScroll
                  key={item.id}
                  animation="slide-left"
                  delay={i * 0.08}
                  threshold={0.1}
                >
                  <div className="relative flex gap-8 pb-10 last:pb-0">
                    {/* Year */}
                    <div className="w-16 shrink-0 text-right">
                      <span
                        className={cn(
                          "text-sm font-bold tabular-nums",
                          item.highlight
                            ? "text-[var(--accent-primary)]"
                            : "text-[var(--text-tertiary)]"
                        )}
                        style={{ fontFamily: "var(--font-outfit)" }}
                      >
                        {item.year}
                      </span>
                    </div>

                    {/* Dot */}
                    <div className="relative flex items-start justify-center w-4 shrink-0 mt-1">
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full border-2 z-10 relative",
                          item.highlight
                            ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]"
                            : "border-[var(--border-strong)] bg-[var(--bg-base)]"
                        )}
                      />
                      {item.highlight && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-[var(--accent-primary)]"
                          animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-1.5 pb-2 flex-1">
                      <h3
                        className={cn(
                          "text-sm font-semibold",
                          item.highlight
                            ? "text-[var(--text-primary)]"
                            : "text-[var(--text-secondary)]"
                        )}
                        style={{ fontFamily: "var(--font-outfit)" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm text-[var(--text-tertiary)] leading-relaxed max-w-lg">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
