"use client";

import {
  Activity,
  Users,
  Tv,
  RefreshCw,
  Clock,
  LayoutDashboard,
  Sliders,
  Calendar,
  ThumbsUp,
  Settings,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreatorStats, useTriggerCreatorSync } from "../hooks/use-admin";

export function AdminDashboardClient() {
  const { data: stats, isLoading, isError } = useCreatorStats();
  const { mutate: triggerSync, isPending: isSyncing } = useTriggerCreatorSync();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <RefreshCw className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Kanal verileri yükleniyor...</span>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <AlertCircle className="w-8 h-8 text-rose-500" />
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Kanal verileri yüklenirken bir hata oluştu.</span>
      </div>
    );
  }

  const isLive = stats.isLive;

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Console Header */}
      <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.45)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Badge className="border-none text-white text-[10px] font-bold px-2 py-0.5 bg-[var(--accent-primary)]/80">
              YAYINCI PANELİ
            </Badge>
            <span className="text-xs text-[var(--text-tertiary)] font-mono">
              Kanal: @{stats.lastSync?.channel || "zehragn"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Genel Bakış
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Yayınınızın anlık durumunu, takipçi sayılarını ve genel kanal performansınızı tek bir ekrandan inceleyin.
          </p>
        </div>
      </GlassCard>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col justify-between gap-1">
          <div>
            <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Yayın Durumu</span>
            <span className="text-lg font-extrabold text-[var(--text-primary)] font-mono mt-1 flex items-center gap-2">
              <span className={cn("w-2.5 h-2.5 rounded-full", isLive ? "bg-[var(--live-red)] animate-pulse" : "bg-zinc-600")} />
              {isLive ? "Canlı Yayında" : "Çevrimdışı"}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[9px] text-[var(--text-tertiary)]">
            <Tv className="w-3 h-3 text-zinc-500" />
            <span className="truncate">{isLive ? `Oyun: ${stats.currentGame}` : "Yayın kapalı"}</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col justify-between gap-1">
          <div>
            <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Takipçi</span>
            <span className={cn("font-mono mt-1 block", stats.totalFollowers !== null ? "text-lg font-extrabold text-[var(--text-primary)]" : "text-[11px] font-medium text-[var(--text-secondary)] leading-tight")}>
              {stats.totalFollowers !== null ? stats.totalFollowers.toLocaleString() : "Takipçi verisi şu anda alınamıyor."}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[9px] text-[var(--text-tertiary)]">
            <Users className="w-3 h-3 text-emerald-400" />
            <span>Kick verilerinden güncellendi</span>
          </div>
        </GlassCard>

        {stats.totalSubscribers !== null && stats.totalSubscribers > 0 && (
          <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col justify-between gap-1">
            <div>
              <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Abone Sayısı</span>
              <span className="text-lg font-extrabold text-[var(--text-primary)] font-mono mt-1 block">
                {stats.totalSubscribers.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[9px] text-[var(--text-tertiary)]">
              <Users className="w-3 h-3 text-amber-400" />
              <span>Aktif aboneler (Kick API)</span>
            </div>
          </GlassCard>
        )}

        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col justify-between gap-1">
          <div>
            <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Ortalama İzleyici</span>
            <span className={cn("font-mono mt-1 block", stats.averageViewers !== null ? "text-lg font-extrabold text-[var(--text-primary)]" : "text-[11px] font-medium text-[var(--text-secondary)] leading-tight")}>
              {stats.averageViewers !== null ? stats.averageViewers.toLocaleString() : "Henüz yayın verisi bulunmuyor."}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[9px] text-[var(--text-tertiary)]">
            <Activity className="w-3 h-3 text-blue-400" />
            <span>Son yayınların ortalaması</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col justify-between gap-1">
          <div>
            <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">En Yüksek İzleyici (Peak)</span>
            <span className={cn("font-mono mt-1 block", stats.peakViewers !== null ? "text-lg font-extrabold text-[var(--text-primary)]" : "text-[11px] font-medium text-[var(--text-secondary)] leading-tight")}>
              {stats.peakViewers !== null ? stats.peakViewers.toLocaleString() : "Henüz yayın verisi bulunmuyor."}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[9px] text-[var(--text-tertiary)]">
            <TrendingUp className="w-3 h-3 text-purple-400" />
            <span>Kanal rekoru izlenme</span>
          </div>
        </GlassCard>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Last Stream details & Activity Log */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Last Stream Overview */}
          <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-5">
            <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Tv className="w-4 h-4 text-[var(--accent-primary)]" />
              Son Yayın Bilgileri
            </h2>

            {stats.recentStream ? (
              <div className="p-5 bg-[rgba(10,10,10,0.15)] border border-[var(--border-default)] rounded-xl flex flex-col sm:flex-row justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                    {stats.recentStream.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <Badge variant="outline" className="border-zinc-800 text-[var(--text-secondary)] text-[10px]">
                      Kategori: {stats.recentStream.game}
                    </Badge>
                    <span className="text-xs text-[var(--text-tertiary)] font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      Yayın Süresi: {Math.floor(stats.recentStream.durationMinutes / 60)}sa {stats.recentStream.durationMinutes % 60}dk
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end justify-center shrink-0">
                  <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Yayın Tarihi</span>
                  <span className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{stats.recentStream.date}</span>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[var(--text-tertiary)] border border-dashed border-[var(--border-default)] rounded-xl">
                Yakın zamanda yapılmış yayın kaydı bulunamadı.
              </div>
            )}
          </GlassCard>

          {/* Quick Shortcuts */}
          <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-5">
            <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-purple-400" />
              Yönetici Kısayolları
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/admin/live">
                <div className="p-4 bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-xl flex items-center justify-between group hover:border-[var(--accent-primary)]/40 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Sliders className="w-5 h-5 text-[var(--accent-primary)]" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[var(--text-primary)]">Canlı Yayın</span>
                      <span className="text-[10px] text-[var(--text-tertiary)]">Yayını ve sohbeti takip et</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link href="/admin/schedule">
                <div className="p-4 bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-xl flex items-center justify-between group hover:border-[var(--accent-primary)]/40 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[var(--text-primary)]">Yayın Geçmişi</span>
                      <span className="text-[10px] text-[var(--text-tertiary)]">Tamamlanan eski yayınları listele</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link href="/admin/suggestions">
                <div className="p-4 bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-xl flex items-center justify-between group hover:border-[var(--accent-primary)]/40 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <ThumbsUp className="w-5 h-5 text-amber-400" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[var(--text-primary)]">Topluluk Oyun Önerileri</span>
                      <span className="text-[10px] text-[var(--text-tertiary)]">İzleyicilerin önerdiği oyunlar</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link href="/admin/settings">
                <div className="p-4 bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-xl flex items-center justify-between group hover:border-[var(--accent-primary)]/40 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-blue-400" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[var(--text-primary)]">Ayarlar</span>
                      <span className="text-[10px] text-[var(--text-tertiary)]">Sistem ve Discord entegrasyonu</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>
          </GlassCard>

        </div>

        {/* Right Column (4 cols): Sync settings engine widget */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Creator Sync status summary */}
          <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className={cn("w-5 h-5 text-[var(--accent-primary)]", isSyncing && "animate-spin")} />
                <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Kick Senkronizasyonu
                </h2>
              </div>
              <Badge className={cn(
                "border-none text-white text-[10px] font-bold px-2 py-0.5 rounded-full",
                isSyncing ? "bg-amber-500 animate-pulse" :
                stats.lastSync?.status === "success" ? "bg-emerald-500" :
                stats.lastSync?.status === "failed" ? "bg-[var(--live-red)]" : "bg-zinc-700"
              )}>
                {isSyncing ? "Eşitleniyor..." :
                 stats.lastSync?.status === "success" ? "Başarılı" :
                 stats.lastSync?.status === "failed" ? "Hata" : "Boşta"}
              </Badge>
            </div>

            <div className="flex flex-col gap-3 font-mono text-[11px] text-[var(--text-secondary)]">
              <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                <span className="text-[var(--text-tertiary)]">Platform</span>
                <span className="font-bold text-[var(--text-primary)] capitalize">
                  {stats.lastSync?.provider || "kick"}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                <span className="text-[var(--text-tertiary)]">Son Başarı</span>
                <span className="text-[10px] text-[var(--text-primary)]">
                  {stats.lastSync?.last_success_at
                    ? new Date(stats.lastSync.last_success_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : "Hiçbir zaman"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[var(--text-tertiary)]">Gecikme</span>
                <span className="text-[var(--text-primary)] font-bold">
                  {stats.lastSync?.duration_ms || stats.lastSync?.last_response_time_ms || 0} ms
                </span>
              </div>
            </div>

            <Button
              onClick={() => triggerSync()}
              disabled={isSyncing}
              className="w-full h-9 bg-gradient-to-r from-[var(--accent-primary)] to-indigo-600 hover:from-[var(--accent-primary)]/90 hover:to-indigo-600/90 text-white font-bold text-[10px] tracking-wider uppercase rounded-lg shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isSyncing ? "Senkronize Ediliyor..." : "Şimdi Eşitle"}
            </Button>
          </GlassCard>

        </div>

      </div>

    </div>
  );
}

// Fallback AlertCircle component
function AlertCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}
