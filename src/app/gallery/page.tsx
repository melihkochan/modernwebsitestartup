import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GalleryPageClient } from "@/features/gallery/components/gallery-page-client";
import { MOCK_STREAM } from "@/features/home/data/mock-data";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Browse behind-the-scenes moments, stream setup snapshots, fan art creations, and highlights from events with Zehragn.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar isLive={MOCK_STREAM.isLive} viewerCount={MOCK_STREAM.viewerCount} />
      <main id="main-content">
        <GalleryPageClient />
      </main>
      <Footer />
    </>
  );
}
