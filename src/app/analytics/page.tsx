import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AnalyticsPageClient } from "@/features/analytics/components/analytics-page-client";
import { MOCK_STREAM } from "@/features/home/data/mock-data";

export const metadata: Metadata = {
  title: "Stream Analytics",
  description: "Explore the growth stats and streaming history of Zehragn on Kick — viewer trends, followers and streaming hours.",
};

export default function AnalyticsPage() {
  return (
    <>
      <Navbar isLive={MOCK_STREAM.isLive} viewerCount={MOCK_STREAM.viewerCount} />
      <main id="main-content">
        <AnalyticsPageClient />
      </main>
      <Footer />
    </>
  );
}
