import type { Metadata } from "next";
import { NavbarLiveWrapper } from "@/components/layout/navbar-live-wrapper";
import { Footer } from "@/components/layout/footer";
import { FaqPageClient } from "@/features/faq/components/faq-page-client";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Get answers to questions about Zehragn — streaming schedules, Valorant gaming setups, PC specs, and community Discord server.",
};

export default function FaqPage() {
  return (
    <>
      <NavbarLiveWrapper />
      <main id="main-content">
        <FaqPageClient />
      </main>
      <Footer />
    </>
  );
}
