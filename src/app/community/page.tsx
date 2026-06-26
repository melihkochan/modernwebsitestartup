import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CommunityPageClient } from "@/features/community/components/community-page-client";
import { MOCK_STREAM } from "@/features/home/data/mock-data";

export const metadata: Metadata = {
  title: "Community Center",
  description: "Connect with the ZehrArmy community. Suggest games for the weekly variety streams, vote in live broadcast polls, and leave a message.",
};

export default function CommunityPage() {
  return (
    <>
      <Navbar isLive={MOCK_STREAM.isLive} viewerCount={MOCK_STREAM.viewerCount} />
      <main id="main-content">
        <CommunityPageClient />
      </main>
      <Footer />
    </>
  );
}
