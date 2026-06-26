import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LivePageClient } from "@/features/live/components/live-page-client";
import { MOCK_STREAM } from "@/features/home/data/mock-data";

export const metadata: Metadata = {
  title: "Live Stream",
  description: "Watch Zehragn stream live on Kick, see current game, viewer count, schedules and chat.",
};

export default function LivePage() {
  return (
    <>
      <Navbar isLive={MOCK_STREAM.isLive} viewerCount={MOCK_STREAM.viewerCount} />
      <main id="main-content">
        <LivePageClient />
      </main>
      <Footer />
    </>
  );
}
