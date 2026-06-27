import type { Metadata } from "next";
import { AdminSettingsControls } from "@/features/admin/components/admin-settings-controls";

export const metadata: Metadata = {
  title: "Ayarlar · Admin",
  description: "Zehragn Admin Panel Ayarlar ve Senkronizasyon.",
};

export default function AdminSettingsPage() {
  return <AdminSettingsControls />;
}
