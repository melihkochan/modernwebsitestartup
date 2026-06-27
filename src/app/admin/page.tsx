import type { Metadata } from "next";
import { AdminDashboardClient } from "@/features/admin/components/admin-dashboard-client";

export const metadata: Metadata = {
  title: "Genel Bakış · Yönetim",
  description: "Zehragn Yönetim Paneli Genel Bakış Ekranı.",
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
