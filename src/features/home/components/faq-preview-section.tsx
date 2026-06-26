"use client";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/analytics/section-title";
import { Accordion } from "@/components/ui/accordion";
import { RevealOnScroll } from "@/components/motion";
import { MOCK_FAQ_ITEMS } from "../data/mock-data";

export function FaqPreviewSection() {
  return (
    <Section padding="lg" divided>
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left: Title */}
          <div className="lg:col-span-4">
            <RevealOnScroll animation="fade">
              <SectionTitle
                eyebrow="FAQ"
                title="Questions, Answered"
                description="Everything you need to know about Zehragn, the streams, and the community."
                align="left"
              />

              <div className="mt-8">
                <a
                  href="/faq"
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] group"
                >
                  View all questions
                  <span
                    className="inline-block transition-transform group-hover:translate-x-1"
                    aria-hidden
                  >
                    →
                  </span>
                </a>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right: Accordion */}
          <div className="lg:col-span-8">
            <RevealOnScroll animation="slide-left" delay={0.1}>
              <Accordion
                items={MOCK_FAQ_ITEMS.map((item) => ({
                  id: item.id,
                  question: item.question,
                  answer: item.answer,
                }))}
                multiple={false}
              />
            </RevealOnScroll>
          </div>
        </div>
      </Container>
    </Section>
  );
}
