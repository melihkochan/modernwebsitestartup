import type { Metadata } from "next";
import { AdminSuggestionsControls } from "@/features/admin/components/admin-suggestions-controls";

export const metadata: Metadata = {
  title: "Topluluk Oyun Önerileri · Yönetim",
  description: "Zehragn Yönetim Paneli Topluluk Oyun Önerileri.",
};

export default function AdminSuggestionsPage() {
  return <AdminSuggestionsControls />;
}
