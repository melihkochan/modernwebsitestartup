import type { Metadata } from "next";
import { AdminDashboardClient } from "@/features/admin/components/admin-dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard · Admin",
  description: "Zehragn Admin Panel Stream Console.",
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
