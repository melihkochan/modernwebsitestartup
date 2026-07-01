import type { Metadata } from "next";
import { AdminScheduleControls } from "@/features/admin/components/admin-schedule-controls";

export const metadata: Metadata = {
  title: "Yayın Geçmişi · Yönetim",
  description: "Zehragn Yönetim Paneli Geçmiş Yayınlar Listesi.",
};

export default function AdminSchedulePage() {
  return <AdminScheduleControls />;
}
