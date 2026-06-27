import type { Metadata } from "next";
import { NavbarLiveWrapper } from "@/components/layout/navbar-live-wrapper";
import { Footer } from "@/components/layout/footer";
import { LivePageClient } from "@/features/live/components/live-page-client";

export const metadata: Metadata = {
  title: "Live Stream",
  description: "Watch Zehragn stream live on Kick, see current game, viewer count, schedules and chat.",
};

export default function LivePage() {
  return (
    <>
      <NavbarLiveWrapper />
      <main id="main-content">
        <LivePageClient />
      </main>
      <Footer />
    </>
  );
}
