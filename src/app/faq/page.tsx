import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FaqPageClient } from "@/features/faq/components/faq-page-client";
import { MOCK_STREAM } from "@/features/home/data/mock-data";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Get answers to questions about Zehragn — streaming schedules, Valorant gaming setups, PC specs, and community Discord server.",
};

export default function FaqPage() {
  return (
    <>
      <Navbar isLive={MOCK_STREAM.isLive} viewerCount={MOCK_STREAM.viewerCount} />
      <main id="main-content">
        <FaqPageClient />
      </main>
      <Footer />
    </>
  );
}
