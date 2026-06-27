import type { Metadata } from "next";
import { AdminScheduleControls } from "@/features/admin/components/admin-schedule-controls";

export const metadata: Metadata = {
  title: "Yayın Akışı · Admin",
  description: "Zehragn Admin Panel Haftalık Yayın Takvimi.",
};

export default function AdminSchedulePage() {
  return <AdminScheduleControls />;
}
