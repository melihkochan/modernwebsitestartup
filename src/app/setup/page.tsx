import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SetupPageClient } from "@/features/setup/components/setup-page-client";
import { MOCK_STREAM } from "@/features/home/data/mock-data";

export const metadata: Metadata = {
  title: "Stream Setup & Gear",
  description: "Browse the gaming setup, PC specs, peripherals and microphone audio gear used by Zehragn for broadcasts.",
};

export default function SetupPage() {
  return (
    <>
      <Navbar isLive={MOCK_STREAM.isLive} viewerCount={MOCK_STREAM.viewerCount} />
      <main id="main-content">
        <SetupPageClient />
      </main>
      <Footer />
    </>
  );
}
