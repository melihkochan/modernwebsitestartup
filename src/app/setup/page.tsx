import type { Metadata } from "next";
import { NavbarLiveWrapper } from "@/components/layout/navbar-live-wrapper";
import { Footer } from "@/components/layout/footer";
import { SetupPageClient } from "@/features/setup/components/setup-page-client";

export const metadata: Metadata = {
  title: "Stream Setup & Gear",
  description: "Browse the gaming setup, PC specs, peripherals and microphone audio gear used by Zehragn for broadcasts.",
};

export default function SetupPage() {
  return (
    <>
      <NavbarLiveWrapper />
      <main id="main-content">
        <SetupPageClient />
      </main>
      <Footer />
    </>
  );
}
