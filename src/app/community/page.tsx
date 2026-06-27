import type { Metadata } from "next";
import { NavbarLiveWrapper } from "@/components/layout/navbar-live-wrapper";
import { Footer } from "@/components/layout/footer";
import { CommunityPageClient } from "@/features/community/components/community-page-client";

export const metadata: Metadata = {
  title: "Community Center",
  description: "Connect with the ZehrArmy community. Suggest games for the weekly variety streams, vote in live broadcast polls, and leave a message.",
};

export default function CommunityPage() {
  return (
    <>
      <NavbarLiveWrapper />
      <main id="main-content">
        <CommunityPageClient />
      </main>
      <Footer />
    </>
  );
}
