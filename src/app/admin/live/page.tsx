import type { Metadata } from "next";
import { AdminLiveControls } from "@/features/admin/components/admin-live-controls";

export const metadata: Metadata = {
  title: "Canlı Yayın · Yönetim",
  description: "Zehragn Yönetim Paneli Canlı Yayın Ekranı.",
};

export default function AdminLivePage() {
  return <AdminLiveControls />;
}
