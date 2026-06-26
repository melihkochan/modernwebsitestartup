"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/analytics/section-title";
import { RevealOnScroll } from "@/components/motion";
import { MOCK_GALLERY_ITEMS } from "../data/mock-data";

const heightMap = {
  landscape: "h-44",
  portrait: "h-72",
  square: "h-56",
} as const;

export function GalleryPreviewSection() {
  return (
    <Section padding="lg" divided>
      <Container>
        <RevealOnScroll animation="slide-up">
          <SectionTitle
            eyebrow="Gallery"
            title="Moments That Matter"
            description="Milestones, meetups, and memories captured across the journey."
            align="left"
          />
        </RevealOnScroll>

        {/* Masonry using CSS columns */}
        <div
          className="mt-12"
          style={{
            columnCount: "var(--gallery-cols, 2)",
            columnGap: "1rem",
            // @ts-expect-error -- CSS custom property for responsive columns
            "--gallery-cols": "2",
          }}
        >
          <style>{`
            @media (min-width: 768px) { .gallery-masonry { column-count: 3 !important; } }
            @media (min-width: 1024px) { .gallery-masonry { column-count: 4 !important; } }
          `}</style>

          <div
            className="gallery-masonry"
            style={{ columnCount: 2, columnGap: "1rem" }}
          >
            {MOCK_GALLERY_ITEMS.map((item, i) => (
              <motion.div
                key={item.id}
                className="break-inside-avoid mb-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] group cursor-pointer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.01 }}
              >
                {/* Image placeholder */}
                <div
                  className={`relative w-full overflow-hidden ${heightMap[item.aspect]}`}
                  style={{ background: item.gradient }}
                >
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-3">
                    <p className="text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-snug">
                      {item.label}
                    </p>
                  </div>

                  {/* Subtle gradient shimmer */}
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-30"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View all link */}
        <RevealOnScroll animation="fade" delay={0.2}>
          <div className="mt-8 flex justify-center">
            <a
              href="/gallery"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] group"
            >
              View Full Gallery
              <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </a>
          </div>
        </RevealOnScroll>
      </Container>
    </Section>
  );
}
