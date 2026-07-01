"use client";

import { useState } from "react";
import { Edit2, Trash2, Calendar, Clock, Users, Tv, Play, Search, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { useStreamHistory, useUpdateStreamHistory, useDeleteStreamHistory } from "../hooks/use-admin";

function formatDuration(seconds: number): string {
  if (!seconds) return "0 dk";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}sa ${m}dk`;
  return `${m}dk`;
}

export function AdminScheduleControls() {
  const { data: history = [], isLoading } = useStreamHistory();
  const updateMutation = useUpdateStreamHistory();
  const deleteMutation = useDeleteStreamHistory();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStream, setEditingStream] = useState<any | null>(null);

  // Edit fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("ended");
  const [vodUrl, setVodUrl] = useState("");

  const handleOpenEdit = (stream: any) => {
    setEditingStream(stream);
    setTitle(stream.title || "");
    setCategory(stream.category || "");
    setStatus(stream.status || "ended");
    setVodUrl(stream.vodUrl || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStream) return;

    try {
      await updateMutation.mutateAsync({
        id: editingStream.id,
        fields: {
          title,
          category,
          status,
          vodUrl: vodUrl || null,
        },
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Düzenleme başarısız oldu.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bu yayın kaydını veritabanından tamamen silmek istediğinize emin misiniz?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const filteredHistory = history.filter((stream) =>
    stream.title.toLowerCase().includes(search.toLowerCase()) ||
    stream.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.45)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Yayın Geçmişi Yönetimi
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Kick API&apos;den veya Edge Function&apos;lardan kaydedilen tüm geçmiş yayınları inceleyin, başlık ve VOD linklerini güncelleyin.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Yayınlarda ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-1.5 pl-9 pr-4 text-xs text-[var(--text-primary)] focus:border-[var(--violet)] focus:outline-none"
          />
        </div>
      </GlassCard>

      {/* Main List */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
        </div>
      ) : filteredHistory.length === 0 ? (
        <GlassCard className="p-12 text-center text-xs text-[var(--text-tertiary)] border border-dashed border-[var(--border-default)] rounded-xl">
          Yayın kaydı bulunamadı.
        </GlassCard>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 text-[10px] uppercase font-bold tracking-wider text-[var(--text-tertiary)]">
                <th className="py-4 px-6 text-center w-16">No</th>
                <th className="py-4 px-6">Tarih</th>
                <th className="py-4 px-6">Yayın Başlığı</th>
                <th className="py-4 px-6">Kategori</th>
                <th className="py-4 px-6 text-center">Süre</th>
                <th className="py-4 px-6 text-center">Ort/Peak</th>
                <th className="py-4 px-6 text-center">Durum</th>
                <th className="py-4 px-6 text-center">Kayıt (VOD)</th>
                <th className="py-4 px-6 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-sm text-[var(--text-secondary)]">
              {filteredHistory.map((stream) => (
                <tr key={stream.id} className="hover:bg-[var(--bg-elevated)]/40 transition-colors">
                  <td className="py-4 px-6 text-center font-mono text-zinc-500 font-bold">
                    #{stream.streamNumber}
                  </td>
                  <td className="py-4 px-6 text-xs whitespace-nowrap">
                    {new Date(stream.startedAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-6 font-bold text-[var(--text-primary)] max-w-xs truncate">
                    {stream.title}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="outline" className="border-zinc-800 text-[10px] text-[var(--violet-light)]">
                      {stream.category}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-center text-xs">
                    {formatDuration(stream.durationSeconds)}
                  </td>
                  <td className="py-4 px-6 text-center font-mono text-xs whitespace-nowrap">
                    {stream.averageViewers} / {stream.peakViewers}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      stream.status === "live" ? "bg-red-500/10 text-red-400" :
                      stream.status === "ended" ? "bg-emerald-500/10 text-emerald-400" :
                      "bg-zinc-800 text-zinc-400"
                    }`}>
                      {stream.status === "live" ? "Canlı" :
                       stream.status === "ended" ? "Bitti" :
                       stream.status === "scheduled" ? "Planlı" : "İptal"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {stream.vodUrl ? (
                      <a
                        href={stream.vodUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--violet)] text-white hover:bg-[var(--violet-light)]"
                        title="VOD Aç"
                      >
                        <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-zinc-600">Kayıt Yok</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        onClick={() => handleOpenEdit(stream)}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(stream.id)}
                        className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yayın Kaydını Düzenle"
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
          <Input
            label="Yayın Başlığı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-xs"
          />

          <Input
            label="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="text-xs"
          />

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">Yayın Durumu</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-2 px-3 text-xs text-[var(--text-primary)] focus:border-[var(--violet)] focus:outline-none"
            >
              <option value="scheduled">Planlı (Scheduled)</option>
              <option value="live">Canlı (Live)</option>
              <option value="ended">Bitti (Ended)</option>
              <option value="cancelled">İptal (Cancelled)</option>
            </select>
          </div>

          <Input
            label="Yayın Kaydı Bağlantısı (VOD URL)"
            value={vodUrl}
            onChange={(e) => setVodUrl(e.target.value)}
            className="text-xs"
            placeholder="https://kick.com/video/..."
          />

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
