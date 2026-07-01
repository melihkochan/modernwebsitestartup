import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { NavbarLiveWrapper } from "@/components/layout/navbar-live-wrapper";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/features/home/components/hero-section";
import { LivePreviewSection } from "@/features/home/components/live-preview-section";
import { AnalyticsPreviewSection } from "@/features/home/components/analytics-preview-section";
import { CommunityPreviewSection } from "@/features/home/components/community-preview-section";
import { TimelinePreviewSection } from "@/features/home/components/timeline-preview-section";
import { SetupPreviewSection } from "@/features/home/components/setup-preview-section";
import { GalleryPreviewSection } from "@/features/home/components/gallery-preview-section";
import { FaqPreviewSection } from "@/features/home/components/faq-preview-section";

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
 * Homepage — Sprint 9 Update
 *
 * All data is now repository-driven via hooks.
 * NavbarLiveWrapper reads stream state from useStreamInfo() automatically.
 */
export default function HomePage() {
  return (
    <>
      <NavbarLiveWrapper />

      <main id="main-content">
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Live Preview */}
        <LivePreviewSection />

        {/* 3. Analytics */}
        <AnalyticsPreviewSection />

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
