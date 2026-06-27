import type { Metadata } from "next";
import { AdminSuggestionsControls } from "@/features/admin/components/admin-suggestions-controls";

export const metadata: Metadata = {
  title: "Öneri Havuzu · Admin",
  description: "Zehragn Admin Panel Oyun Öneri Sırası.",
};

export default function AdminSuggestionsPage() {
  return <AdminSuggestionsControls />;
}
