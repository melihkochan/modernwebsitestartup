"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, HelpCircle, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import {
  useAdminFaqs,
  useCreateFaq,
  useUpdateFaq,
  useDeleteFaq,
} from "../hooks/use-admin";

export function AdminFaqControls() {
  const { data: faqs = [], isLoading } = useAdminFaqs();
  const createMutation = useCreateFaq();
  const updateMutation = useUpdateFaq();
  const deleteMutation = useDeleteFaq();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("general");
  const [orderWeight, setOrderWeight] = useState("10");

  const handleOpenNew = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setCategory("general");
    setOrderWeight("10");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: any) => {
    setEditingFaq(faq);
    setQuestion(faq.question || "");
    setAnswer(faq.answer || "");
    setCategory(faq.category || "general");
    setOrderWeight(faq.order_weight ? faq.order_weight.toString() : "10");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      question,
      answer,
      category,
      order_weight: parseInt(orderWeight) || 10,
    };

    try {
      if (editingFaq) {
        await updateMutation.mutateAsync({ id: editingFaq.id, faq: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Hata oluştu.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bu soruyu silmek istediğinize emin misiniz?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.45)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Sıkça Sorulan Sorular (FAQ) Yönetimi
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Ana sayfada gösterilen SSS/FAQ listesini yönetin, soru ve cevapları güncelleyin.
          </p>
        </div>
        <Button
          onClick={handleOpenNew}
          className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Yeni Soru Ekle
        </Button>
      </GlassCard>

      {/* FAQs List */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
        </div>
      ) : faqs.length === 0 ? (
        <GlassCard className="p-12 text-center text-xs text-[var(--text-tertiary)] border border-dashed border-[var(--border-default)] rounded-xl">
          Henüz soru ve cevap eklenmemiş.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {faqs.map((faq) => (
            <GlassCard key={faq.id} className="p-5 border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] transition-all flex justify-between gap-4 items-start">
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="border-purple-800 text-[10px] text-purple-400">
                    {faq.category}
                  </Badge>
                  <span className="text-[10px] font-mono text-[var(--text-tertiary)]">Sıra: {faq.order_weight}</span>
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">{faq.question}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(faq)}
                  className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  title="Düzenle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFaq ? "Soruyu Düzenle" : "Yeni Soru Ekle"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
          <Input
            label="Soru"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="text-xs"
          />

          <Textarea
            label="Cevap"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            className="min-h-[100px] text-xs resize-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="text-xs"
              placeholder="Örn: general, setup, live"
            />
            <Input
              label="Sıralama Ağırlığı"
              type="number"
              value={orderWeight}
              onChange={(e) => setOrderWeight(e.target.value)}
              required
              className="text-xs"
              placeholder="Küçük sayılar üstte görünür"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-[var(--border-subtle)] pt-4 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="h-9 px-4 text-xs font-semibold cursor-pointer"
            >
              İptal
            </Button>
            <Button
              type="submit"
              className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none cursor-pointer"
            >
              Kaydet
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
