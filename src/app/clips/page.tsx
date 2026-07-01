import type { Metadata } from "next";
import { NavbarLiveWrapper } from "@/components/layout/navbar-live-wrapper";
import { Footer } from "@/components/layout/footer";
import { ClipsPageClient } from "@/features/clips/components/clips-page-client";

export const metadata: Metadata = {
  title: "Klipler — Zehragn",
  description: "Watch the best Zehragn stream clips — featured highlights, funny moments, and top plays.",
};

export default function ClipsPage() {
  return (
    <>
      <NavbarLiveWrapper />
      <main id="main-content">
        <ClipsPageClient />
      </main>
      <Footer />
    </>
  );
}
