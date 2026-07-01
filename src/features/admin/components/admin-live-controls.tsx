"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Users, Tv, Clock, RefreshCw, Info } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCreatorStats } from "../hooks/use-admin";

export function AdminLiveControls() {
  const { data: stats, isLoading } = useCreatorStats();
  const isLive = stats?.isLive ?? false;
  const viewerCount = stats?.viewerCount ?? 0;

  const [uptime, setUptime] = useState<string>("00:00:00");

  useEffect(() => {
    if (!isLive || !stats?.startedAt) {
      return;
    }

    const calculateUptime = () => {
      const start = new Date(stats.startedAt!).getTime();
      const diff = Math.max(0, Date.now() - start);
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      return [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
      ].join(":");
    };

    const timer = setInterval(() => {
      setUptime(calculateUptime());
    }, 1000);

    const initialTimeout = setTimeout(() => {
      setUptime(calculateUptime());
    }, 0);

    return () => {
      clearInterval(timer);
      clearTimeout(initialTimeout);
    };
  }, [isLive, stats?.startedAt]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <RefreshCw className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Canlı yayın verileri yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.45)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Badge className={cn("border-none text-white text-[10px] font-bold px-2 py-0.5", isLive ? "bg-[var(--live-red)] animate-pulse" : "bg-zinc-700")}>
              {isLive ? "CANLI YAYIN AKTİF" : "YAYIN DIŞI"}
            </Badge>
            {isLive && (
              <span className="text-xs text-[var(--text-secondary)] font-mono flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-400" /> {viewerCount.toLocaleString()} İzleyici
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Canlı Yayın İzleme
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Yayınınızın anlık durumunu, aktif izleyici sayısını, kategori bilgilerini ve senkronizasyon verilerini izleyin.
          </p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-6 animate-fade-in">
            <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
              <Tv className="w-4.5 h-4.5 text-[var(--accent-primary)]" />
              Canlı Yayın Özeti
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-4 relative aspect-[16/9] w-full bg-zinc-950 border border-[var(--border-default)] rounded-xl overflow-hidden shadow-md">
                {stats?.thumbnailUrl ? (
                  <Image
                    src={stats.thumbnailUrl}
                    alt={stats.streamTitle || "Canlı Yayın"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-zinc-900/60 gap-2">
                    <Tv className="w-8 h-8 text-zinc-500" />
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Yayın Thumbnail Bulunmuyor</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 z-10">
                  <Badge className={cn("border-none text-white text-[9px] font-bold px-1.5 py-0.5", isLive ? "bg-[var(--live-red)] animate-pulse" : "bg-zinc-700")}>
                    {isLive ? "CANLI" : "ÇEVRİMDIŞI"}
                  </Badge>
                </div>
              </div>

              <div className="md:col-span-8 flex flex-col gap-4 font-sans text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 border-b border-[var(--border-subtle)] pb-2.5">
                    <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Yayın Başlığı</span>
                    <span className="font-bold text-[var(--text-primary)] truncate mt-0.5" title={stats?.streamTitle || "Güncel yayın bulunmuyor."}>
                      {stats?.streamTitle || "Güncel yayın bulunmuyor."}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-[var(--border-subtle)] pb-2.5">
                    <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Kategori / Oyun</span>
                    <span className="font-bold text-[var(--text-primary)] truncate mt-0.5" title={stats?.currentGame || "Kategori bilgisi alınamadı."}>
                      {stats?.currentGame || "Kategori bilgisi alınamadı."}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-[11px]">
                  <div className="p-3 bg-[rgba(10,10,10,0.15)] border border-[var(--border-default)] rounded-xl flex flex-col justify-center">
                    <span className="text-[9px] text-[var(--text-tertiary)] uppercase font-semibold">İzleyici Sayısı</span>
                    <span className="text-sm font-extrabold text-[var(--text-primary)] mt-1 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      {isLive ? viewerCount.toLocaleString() : 0}
                    </span>
                  </div>
                  <div className="p-3 bg-[rgba(10,10,10,0.15)] border border-[var(--border-default)] rounded-xl flex flex-col justify-center">
                    <span className="text-[9px] text-[var(--text-tertiary)] uppercase font-semibold">Yayın Süresi</span>
                    <span className="text-sm font-extrabold text-[var(--text-primary)] mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {isLive ? uptime : "00:00:00"}
                    </span>
                  </div>
                  <div className="p-3 bg-[rgba(10,10,10,0.15)] border border-[var(--border-default)] rounded-xl flex flex-col justify-center">
                    <span className="text-[9px] text-[var(--text-tertiary)] uppercase font-semibold">Son Eşitleme</span>
                    <span className="text-[10px] font-extrabold text-[var(--text-primary)] mt-1 truncate">
                      {stats?.lastCheckedAt ? new Date(stats.lastCheckedAt).toLocaleTimeString("tr-TR") : "Bilinmiyor"}
                    </span>
                  </div>
                </div>

                {stats?.streamUrl && (
                  <a
                    href={stats.streamUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="self-start text-[10px] font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1 bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/20 px-2.5 py-1 rounded-lg transition-all"
                  >
                    Yayını Kick&apos;te İzle →
                  </a>
                )}
              </div>
            </div>
          </GlassCard>


        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-4">
            <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
              <RefreshCw className="w-4 h-4 text-purple-400" />
              Senkronizasyon Telemetrisi
            </h2>

            {stats?.lastSync ? (
              <div className="flex flex-col gap-3.5 font-mono text-[11px] text-[var(--text-secondary)]">
                <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[var(--text-tertiary)]">Son Eşitleme</span>
                  <span className="text-[var(--text-primary)] font-semibold">
                    {stats.lastSync.last_success_at
                      ? new Date(stats.lastSync.last_success_at).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                      : "Hiçbir zaman"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[var(--text-tertiary)]">Gecikme (Süre)</span>
                  <span className="text-[var(--text-primary)] font-semibold">
                    {stats.lastSync.duration_ms || stats.lastSync.last_response_time_ms || 0} ms
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[var(--text-tertiary)]">Güncellenen Tablolar</span>
                  <span className="text-[var(--text-primary)] font-semibold">
                    {stats.lastSync.updated_tables || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[var(--text-tertiary)]">Güncellenen Kayıtlar</span>
                  <span className="text-[var(--text-primary)] font-semibold">
                    {stats.lastSync.updated_records || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-tertiary)]">Senkronizasyon Durumu</span>
                  <Badge className={cn(
                    "border-none text-white text-[9px] font-bold px-2 py-0.5 rounded-full",
                    stats.lastSync.status === "success" ? "bg-emerald-500" : "bg-[var(--live-red)] animate-pulse"
                  )}>
                    {stats.lastSync.status === "success" ? "BAŞARILI" : "HATA"}
                  </Badge>
                </div>

                {stats.lastSync.status === "failed" && stats.lastSync.error && (
                  <div className="p-3 bg-red-950/20 border border-red-900/30 rounded text-[10px] text-rose-400 mt-2 whitespace-normal break-all font-sans leading-normal">
                    <strong>Hata Detayı:</strong> {stats.lastSync.error}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-[var(--text-tertiary)] border border-dashed border-[var(--border-default)] rounded-xl">
                Henüz senkronizasyon kaydı bulunmuyor.
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
