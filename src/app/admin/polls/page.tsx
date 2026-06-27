import type { Metadata } from "next";
import { AdminPollsControls } from "@/features/admin/components/admin-polls-controls";

export const metadata: Metadata = {
  title: "Topluluk Anketleri · Admin",
  description: "Zehragn Admin Panel Topluluk Anket Yönetimi.",
};

export default function AdminPollsPage() {
  return <AdminPollsControls />;
}
