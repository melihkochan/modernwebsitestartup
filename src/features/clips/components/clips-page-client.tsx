"use client";

import { useState } from "react";
import { Play, Eye, Heart, X, Film } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { useClips } from "../hooks/use-clips";
import type { Clip } from "../validators/clips-schemas";

export function ClipsPageClient() {
  const { data: clips, isLoading } = useClips();
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-[var(--bg-base)]">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse h-[200px] rounded-[var(--radius-lg)] bg-[var(--bg-overlay)]" />
            ))}
          </div>
        </Container>
      </div>
    );
  }

  if (!clips || clips.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-[var(--bg-base)]">
        <Container className="flex flex-col items-center justify-center text-center gap-3">
          <Film className="w-12 h-12 text-zinc-600 animate-bounce" />
          <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Henüz paylaşılmış klip bulunmuyor.
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Admin tarafından yüklenen yayın klipleri burada listelenecektir.
          </p>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[var(--bg-base)] relative overflow-hidden">
      <div className="absolute top-[10%] left-[-10%] w-[700px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,242,154,0.02),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[700px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.02),transparent_60%)] pointer-events-none z-0" />

      <Container className="relative z-10 flex flex-col gap-12">
        <div className="flex flex-col gap-3 max-w-xl">
          <Badge variant="outline" className="border-emerald-400/25 text-emerald-400 font-bold bg-emerald-500/5 uppercase self-start">
            KLİPLER
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Öne Çıkan Yayın Anları
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Zehragn&apos;ın yayınlarındaki en komik, en heyecanlı ve en efsane anları klipler sayfasında keşfedin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clips.map((clip) => {
            const minutes = Math.floor(clip.duration / 60);
            const seconds = Math.floor(clip.duration % 60);
            const durationLabel = `${minutes}:${seconds.toString().padStart(2, "0")}`;

            return (
              <GlassCard
                key={clip.id}
                onClick={() => setSelectedClip(clip)}
                className="group border border-[var(--border-default)] hover:border-[var(--border-strong)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-sm)] cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={clip.thumbnailUrl}
                    alt={clip.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={process.env.NODE_ENV === "development"}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)]/90 flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 z-10">
                    <span className="rounded-[var(--radius-sm)] bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white">
                      {durationLabel}
                    </span>
                  </div>

                  {clip.isFeatured && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="bg-[var(--accent-primary)] text-white text-[9px] uppercase tracking-wider font-bold">
                        ÖNE ÇIKAN
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col gap-3">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent-primary)] transition-colors" style={{ fontFamily: "var(--font-outfit)" }}>
                    {clip.title}
                  </h3>
                  {clip.description && (
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {clip.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-[var(--text-tertiary)] pt-2 border-t border-[var(--border-subtle)] font-medium">
                    <span className="truncate max-w-[120px]">{clip.game || "Diğer"}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {clip.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {clip.likes.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </Container>

      {selectedClip && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <GlassCard className="relative w-full max-w-3xl border border-[var(--border-default)] overflow-hidden rounded-[var(--radius-xl)] bg-[rgba(10,10,10,0.95)] flex flex-col">
            <button
              onClick={() => setSelectedClip(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-video bg-black">
              <video
                src={selectedClip.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Badge variant="outline" className="border-purple-400/20 text-purple-400 bg-purple-500/5 self-start text-[10px] uppercase font-bold">
                  {selectedClip.game || "Yayın Klibi"}
                </Badge>
                <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                  {selectedClip.title}
                </h2>
              </div>

              {selectedClip.description && (
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {selectedClip.description}
                </p>
              )}

              <div className="flex items-center gap-6 text-xs text-[var(--text-tertiary)] pt-3 border-t border-[var(--border-subtle)] font-medium">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {selectedClip.views.toLocaleString()} izlenme
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  {selectedClip.likes.toLocaleString()} beğeni
                </span>
                {selectedClip.createdAt && (
                  <span className="ml-auto">
                    Yüklenme: {new Date(selectedClip.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
