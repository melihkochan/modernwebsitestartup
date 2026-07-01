import type { Metadata } from "next";
import { NavbarLiveWrapper } from "@/components/layout/navbar-live-wrapper";
import { Footer } from "@/components/layout/footer";
import { BroadcastsPageClient } from "@/features/broadcasts/components/broadcasts-page-client";

export const metadata: Metadata = {
  title: "Geçmiş Yayınlar",
  description: "Zehragn'ın gerçekleştirdiği tüm yayınların veritabanı kayıtları.",
};

export default function BroadcastsPage() {
  return (
    <>
      <NavbarLiveWrapper />
      <main id="main-content">
        <BroadcastsPageClient />
      </main>
      <Footer />
    </>
  );
}
