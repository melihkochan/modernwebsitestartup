import type { Metadata } from "next";
import { AdminLiveControls } from "@/features/admin/components/admin-live-controls";

export const metadata: Metadata = {
  title: "Yayın Kontrolleri · Admin",
  description: "Zehragn Admin Panel Canlı Yayın Kontrol Merkezi.",
};

export default function AdminLivePage() {
  return <AdminLiveControls />;
}
