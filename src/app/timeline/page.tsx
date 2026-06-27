import type { Metadata } from "next";
import { NavbarLiveWrapper } from "@/components/layout/navbar-live-wrapper";
import { Footer } from "@/components/layout/footer";
import { TimelinePageClient } from "@/features/timeline/components/timeline-page-client";

export const metadata: Metadata = {
  title: "Stream Timeline & Milestones",
  description: "Follow the career milestones and streaming journey of Zehragn on Kick from the first stream to the present.",
};

export default function TimelinePage() {
  return (
    <>
      <NavbarLiveWrapper />
      <main id="main-content">
        <TimelinePageClient />
      </main>
      <Footer />
    </>
  );
}
