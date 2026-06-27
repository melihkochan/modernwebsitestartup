import type { Metadata } from "next";
import { NavbarLiveWrapper } from "@/components/layout/navbar-live-wrapper";
import { Footer } from "@/components/layout/footer";
import { GalleryPageClient } from "@/features/gallery/components/gallery-page-client";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Browse behind-the-scenes moments, stream setup snapshots, fan art creations, and highlights from events with Zehragn.",
};

export default function GalleryPage() {
  return (
    <>
      <NavbarLiveWrapper />
      <main id="main-content">
        <GalleryPageClient />
      </main>
      <Footer />
    </>
  );
}
