import type { Metadata } from "next";
import { AdminSettingsControls } from "@/features/admin/components/admin-settings-controls";

export const metadata: Metadata = {
  title: "Ayarlar · Yönetim",
  description: "Zehragn Yönetim Paneli Sistem Ayarları.",
};

export default function AdminSettingsPage() {
  return <AdminSettingsControls />;
}
