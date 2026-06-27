import type { Metadata } from "next";
import { NavbarLiveWrapper } from "@/components/layout/navbar-live-wrapper";
import { Footer } from "@/components/layout/footer";
import { AnalyticsPageClient } from "@/features/analytics/components/analytics-page-client";

export const metadata: Metadata = {
  title: "Stream Analytics",
  description: "Explore the growth stats and streaming history of Zehragn on Kick — viewer trends, followers and streaming hours.",
};

export default function AnalyticsPage() {
  return (
    <>
      <NavbarLiveWrapper />
      <main id="main-content">
        <AnalyticsPageClient />
      </main>
      <Footer />
    </>
  );
}
