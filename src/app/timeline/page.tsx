import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TimelinePageClient } from "@/features/timeline/components/timeline-page-client";
import { MOCK_STREAM } from "@/features/home/data/mock-data";

export const metadata: Metadata = {
  title: "Stream Timeline & Milestones",
  description: "Follow the career milestones and streaming journey of Zehragn on Kick from the first stream to the present.",
};

export default function TimelinePage() {
  return (
    <>
      <Navbar isLive={MOCK_STREAM.isLive} viewerCount={MOCK_STREAM.viewerCount} />
      <main id="main-content">
        <TimelinePageClient />
      </main>
      <Footer />
    </>
  );
}
