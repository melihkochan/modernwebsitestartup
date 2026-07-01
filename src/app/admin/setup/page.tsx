import type { Metadata } from "next";
import { AdminSetupControls } from "@/features/admin/components/admin-setup-controls";

export const metadata: Metadata = {
  title: "Setup Ekipmanları · Yönetim",
  description: "Yayın ekipmanları ve donanımları yönetim kontrol paneli.",
};

export default function AdminSetupPage() {
  return <AdminSetupControls />;
}
