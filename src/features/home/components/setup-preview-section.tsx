"use client";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/analytics/section-title";
import { HoverLift, RevealOnScroll, StaggerChildren } from "@/components/motion";
import { MOCK_SETUP_ITEMS } from "../data/mock-data";

export function SetupPreviewSection() {
  return (
    <Section padding="lg" divided>
      <Container>
        <RevealOnScroll animation="slide-up">
          <SectionTitle
            eyebrow="The Setup"
            title="Built to Perform"
            description="Every piece of hardware chosen for precision, longevity, and the best possible experience for the community."
            align="center"
          />
        </RevealOnScroll>

        <div className="mt-12">
          <StaggerChildren
            staggerDelay={0.07}
            initialDelay={0.1}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            {MOCK_SETUP_ITEMS.map((item) => (
              <HoverLift key={item.id} amount={6} scale={1.02}>
                <div
                  className="group relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-colors duration-300 hover:border-[var(--border-default)]"
                >
                  {/* Product image area */}
                  <div
                    className="relative h-32 w-full overflow-hidden"
                    style={{ background: item.gradient }}
                  >
                    {/* Corner accent line */}
                    <div
                      aria-hidden
                      className="absolute top-0 right-0 h-px w-1/2 bg-gradient-to-l from-[var(--border-default)] to-transparent opacity-60"
                    />
                    <div
                      aria-hidden
                      className="absolute top-0 right-0 w-px h-1/2 bg-gradient-to-b from-[var(--border-default)] to-transparent opacity-60"
                    />

                    {/* Abstract icon placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="h-12 w-12 rounded-[var(--radius-md)] opacity-30"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-1 p-3">
                    <span
                      className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--text-tertiary)]"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {item.category}
                    </span>
                    <h3
                      className="text-xs font-semibold text-[var(--text-primary)] leading-snug line-clamp-2"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-[var(--text-tertiary)] leading-snug">
                      {item.spec}
                    </p>
                  </div>
                </div>
              </HoverLift>
            ))}
          </StaggerChildren>
        </div>

        {/* View full setup link */}
        <RevealOnScroll animation="fade" delay={0.3}>
          <div className="mt-10 flex justify-center">
            <a
              href="/setup"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] group"
            >
              View Full Setup
              <span
                className="inline-block transition-transform group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </a>
          </div>
        </RevealOnScroll>
      </Container>
    </Section>
  );
}
