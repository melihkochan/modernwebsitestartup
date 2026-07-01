import type { Metadata } from "next";
import { AdminFaqControls } from "@/features/admin/components/admin-faq-controls";

export const metadata: Metadata = {
  title: "Soru & Cevaplar · Yönetim",
  description: "Sıkça Sorulan Sorular yönetim kontrol paneli.",
};

export default function AdminFaqPage() {
  return <AdminFaqControls />;
}
