import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/features/home/components/hero-section";
import { LivePreviewSection } from "@/features/home/components/live-preview-section";
import { AnalyticsPreviewSection } from "@/features/home/components/analytics-preview-section";
import { FeaturedClipSection } from "@/features/home/components/featured-clip-section";
import { CommunityPreviewSection } from "@/features/home/components/community-preview-section";
import { TimelinePreviewSection } from "@/features/home/components/timeline-preview-section";
import { SetupPreviewSection } from "@/features/home/components/setup-preview-section";
import { GalleryPreviewSection } from "@/features/home/components/gallery-preview-section";
import { FaqPreviewSection } from "@/features/home/components/faq-preview-section";
import { MOCK_STREAM } from "@/features/home/data/mock-data";

export const metadata: Metadata = {
  title: {
    absolute: siteConfig.name,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} — Official Streaming Universe`,
    description: siteConfig.description,
    url: siteConfig.url,
    type: "website",
  },
};

/**
 * Homepage — Sprint 3 Implementation
 *
 * Sections (top to bottom):
 *   1. Hero          — Full viewport cinematic opener
 *   2. Live Preview  — Current stream snapshot
 *   3. Analytics     — Animated stat cards
 *   4. Featured Clip — Cinematic clip showcase
 *   5. Community     — Suggestions, polls, fan messages
 *   6. Timeline      — Career milestones
 *   7. Setup         — Hardware showcase
 *   8. Gallery       — Masonry photo grid
 *   9. FAQ           — Accordion Q&A
 *  10. Footer        — Minimal social links
 *
 * All data is mocked — no Supabase, no API calls.
 */
export default function HomePage() {
  return (
    <>
      <Navbar isLive={MOCK_STREAM.isLive} viewerCount={MOCK_STREAM.viewerCount} />

      <main id="main-content">
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Live Preview */}
        <LivePreviewSection />

        {/* 3. Analytics */}
        <AnalyticsPreviewSection />

        {/* 4. Featured Clip */}
        <FeaturedClipSection />

        {/* 5. Community */}
        <CommunityPreviewSection />

        {/* 6. Timeline */}
        <TimelinePreviewSection />

        {/* 7. Setup */}
        <SetupPreviewSection />

        {/* 8. Gallery */}
        <GalleryPreviewSection />

        {/* 9. FAQ */}
        <FaqPreviewSection />
      </main>

      <Footer />
    </>
  );
}
