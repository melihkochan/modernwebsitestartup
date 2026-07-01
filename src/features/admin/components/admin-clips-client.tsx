"use client";

import { useState } from "react";
import { Plus, Trash2, Video, Eye, Heart, Film, Grid, List, Search, Play, FileVideo, Image as ImageIcon, Check } from "lucide-react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useClips, useCreateClip, useDeleteClip } from "@/features/clips/hooks/use-clips";
import { useMediaList } from "@/features/media/hooks/use-media";
import { SteamGamePicker, type SteamGame } from "@/components/ui/steam-game-picker";
import type { Clip } from "@/features/clips/validators/clips-schemas";
import type { MediaFile, MediaBucket } from "@/features/media/types/media-types";

export function AdminClipsClient() {
  const { data: clips, isLoading } = useClips();
  const createClipMutation = useCreateClip();
  const deleteClipMutation = useDeleteClip();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"video" | "thumbnail" | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [category, setCategory] = useState("yayin");
  const [selectedSteamGame, setSelectedSteamGame] = useState<SteamGame | null>(null);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);

  const [pickerBucket, setPickerBucket] = useState<MediaBucket>("gallery");
  const { data: mediaFiles } = useMediaList(pickerBucket);
  const [mediaSearch, setMediaSearch] = useState("");

  const filteredMedia = (mediaFiles ?? []).filter((f) =>
    f.name.toLowerCase().includes(mediaSearch.toLowerCase())
  );

  const handleCreateClip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim() || !thumbnailUrl.trim()) return;

    try {
      await createClipMutation.mutateAsync({
        title,
        description: description.trim() || null,
        duration: Number(duration),
        videoUrl,
        thumbnailUrl,
        category: category.trim() || null,
        game: selectedSteamGame?.name || null,
        visibility: "public",
        isFeatured,
        displayOrder: Number(displayOrder),
      });

      setTitle("");
      setDescription("");
      setDuration(30);
      setVideoUrl("");
      setThumbnailUrl("");
      setCategory("yayin");
      setSelectedSteamGame(null);
      setDisplayOrder(0);
      setIsFeatured(false);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClip = async (id: string) => {
    if (!confirm("Bu klibi silmek istediğinizden emin misiniz?")) return;
    try {
      await deleteClipMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectMedia = (url: string) => {
    if (pickerTarget === "video") setVideoUrl(url);
    if (pickerTarget === "thumbnail") setThumbnailUrl(url);
    setIsMediaPickerOpen(false);
    setPickerTarget(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Klip Yönetimi
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Yayın kliplerini ekleyin, düzenleyin veya öne çıkanları belirleyin.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 text-xs h-9 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white border-none cursor-pointer">
          <Plus className="w-4 h-4" />
          Yeni Klip Ekle
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-[200px] rounded-xl bg-[var(--bg-overlay)]" />
          ))}
        </div>
      ) : !clips || clips.length === 0 ? (
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center border border-dashed border-[var(--border-default)] rounded-xl bg-[rgba(10,10,10,0.1)] gap-3 text-zinc-500">
          <Film className="w-10 h-10 text-zinc-600" />
          <span className="text-xs font-semibold text-[var(--text-secondary)]">Henüz paylaşılmış klip bulunmuyor.</span>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clips.map((clip) => (
            <GlassCard key={clip.id} className="border border-[var(--border-default)] rounded-xl overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-video bg-black overflow-hidden">
                <Image
                  src={clip.thumbnailUrl}
                  alt={clip.title}
                  fill
                  className="object-cover"
                  unoptimized={process.env.NODE_ENV === "development"}
                />
                {clip.isFeatured && (
                  <Badge className="absolute top-2 left-2 bg-[var(--accent-primary)] text-white text-[8px] uppercase tracking-wider font-bold">
                    Öne Çıkarılan
                  </Badge>
                )}
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-white">
                  {Math.floor(clip.duration / 60)}:{(clip.duration % 60).toString().padStart(2, "0")}
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">{clip.game || "Diğer"}</span>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">{clip.title}</h3>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-tertiary)]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{clip.views}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{clip.likes}</span>
                  </div>
                  <button onClick={() => clip.id && handleDeleteClip(clip.id)} className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-lg border border-[var(--border-default)] rounded-xl p-6 bg-[rgba(15,15,15,0.98)] max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4" style={{ fontFamily: "var(--font-outfit)" }}>Yeni Klip Ekle</h2>
            <form onSubmit={handleCreateClip} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--text-secondary)] font-semibold">Başlık</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Klip başlığı" required className="h-9 text-xs" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--text-secondary)] font-semibold">Açıklama</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="İsteğe bağlı açıklama..." rows={2} className="text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[var(--text-secondary)] font-semibold">Süre (Saniye)</label>
                  <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} min={1} required className="h-9 text-xs" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[var(--text-secondary)] font-semibold">Sıralama Değeri</label>
                  <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} min={0} required className="h-9 text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[var(--text-secondary)] font-semibold">Kategori</label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Örn: yayin, IRL" className="h-9 text-xs" />
                </div>
                <div className="flex flex-col gap-1.5 justify-end">
                  <label className="text-xs text-[var(--text-secondary)] font-semibold">Oyun (Steam)</label>
                  <SteamGamePicker value={selectedSteamGame} onSelect={setSelectedSteamGame} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--text-secondary)] font-semibold">Video URL</label>
                <div className="flex gap-2">
                  <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." required className="h-9 text-xs flex-1" />
                  <Button type="button" onClick={() => { setPickerTarget("video"); setIsMediaPickerOpen(true); }} className="h-9 px-3 text-xs bg-zinc-800 border-none hover:bg-zinc-700 text-white cursor-pointer">Seç</Button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--text-secondary)] font-semibold">Thumbnail URL</label>
                <div className="flex gap-2">
                  <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." required className="h-9 text-xs flex-1" />
                  <Button type="button" onClick={() => { setPickerTarget("thumbnail"); setIsMediaPickerOpen(true); }} className="h-9 px-3 text-xs bg-zinc-800 border-none hover:bg-zinc-700 text-white cursor-pointer">Seç</Button>
                </div>
              </div>
              <div className="flex items-center gap-2 py-1">
                <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded border-zinc-700 bg-zinc-850 text-[var(--accent-primary)] focus:ring-0 cursor-pointer" />
                <label htmlFor="isFeatured" className="text-xs text-[var(--text-secondary)] font-semibold cursor-pointer select-none">Öne Çıkarılan Klip Olarak İşaretle</label>
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <Button type="button" onClick={() => setIsAddModalOpen(false)} variant="outline" className="h-9 px-4 text-xs cursor-pointer">Vazgeç</Button>
                <Button type="submit" disabled={createClipMutation.isPending} className="h-9 px-4 text-xs bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white border-none cursor-pointer">
                  {createClipMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {isMediaPickerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-2xl border border-[var(--border-default)] rounded-xl p-6 bg-[rgba(10,10,10,0.98)] max-h-[85vh] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                Medyadan Dosya Seç ({pickerTarget === "video" ? "Video" : "Görsel"})
              </h3>
              <button onClick={() => { setIsMediaPickerOpen(false); setPickerTarget(null); }} className="text-zinc-400 hover:text-zinc-200 text-xs font-semibold cursor-pointer">Kapat</button>
            </div>

            <div className="flex gap-2 p-0.5 bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-lg self-start">
              {(["gallery", "thumbnails"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setPickerBucket(b)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors cursor-pointer ${pickerBucket === b ? "bg-[var(--accent-primary)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                >
                  {b === "gallery" ? "Galeri" : "Küçük Resimler"}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <Input
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
                placeholder="Dosya adına göre ara..."
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-4 p-1 min-h-[250px]">
              {filteredMedia.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center text-zinc-500 text-xs py-8">
                  Dosya bulunamadı.
                </div>
              ) : (
                filteredMedia.map((file) => {
                  const isVideo = file.mimeType.startsWith("video/");
                  return (
                    <div
                      key={file.path}
                      onClick={() => handleSelectMedia(file.publicUrl)}
                      className="group relative aspect-video bg-zinc-950 border border-[var(--border-default)] hover:border-[var(--accent-primary)] rounded-lg overflow-hidden cursor-pointer transition-colors flex items-center justify-center"
                    >
                      {isVideo ? (
                        <div className="flex flex-col items-center gap-1 text-[10px] text-zinc-400">
                          <FileVideo className="w-6 h-6 text-[var(--accent-primary)]" />
                          <span className="max-w-[80px] truncate">{file.name}</span>
                        </div>
                      ) : (
                        <Image
                          src={file.publicUrl}
                          alt={file.name}
                          fill
                          className="object-cover"
                          unoptimized={process.env.NODE_ENV === "development"}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
