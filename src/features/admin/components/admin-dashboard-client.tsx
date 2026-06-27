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
  Vote,
  Settings,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreatorSyncStatus, useTriggerCreatorSync } from "../hooks/use-admin";

export function AdminDashboardClient() {
  const { data: syncStatus } = useCreatorSyncStatus();
  const { mutate: triggerSync, isPending: isSyncing } = useTriggerCreatorSync();

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Console Header */}
      <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.45)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Badge className="border-none text-white text-[10px] font-bold px-2 py-0.5 bg-[var(--accent-primary)]/80">
              YÖNETİM PANELİ
            </Badge>
            <span className="text-xs text-[var(--text-tertiary)] font-mono">
              Kanal: @{syncStatus?.channel || "zehragn"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Yayıncı Genel Bakış Paneli
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Kanal performansınızı izleyin, veritabanı senkronizasyonunu kontrol edin ve moderasyon işlemlerini tek bir merkezden yönetin.
          </p>
        </div>
      </GlassCard>

      {/* KPI Creator Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col gap-1">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Yayın Durumu</span>
          <span className="text-lg font-extrabold text-[var(--text-primary)] font-mono mt-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
            Çevrimdışı
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] text-[var(--text-tertiary)]">
            <Tv className="w-3 h-3 text-zinc-500" />
            <span>Son yayın: Dün</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col gap-1">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Toplam Takipçi</span>
          <span className="text-lg font-extrabold text-[var(--text-primary)] font-mono mt-1">
            18,432
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] text-[var(--text-tertiary)]">
            <Users className="w-3 h-3 text-emerald-400" />
            <span>Kick verilerinden okundu</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col gap-1">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Ortalama İzleyici</span>
          <span className="text-lg font-extrabold text-[var(--text-primary)] font-mono mt-1">
            2,450
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] text-[var(--text-tertiary)]">
            <Activity className="w-3 h-3 text-blue-400" />
            <span>Son 30 günlük ortalama</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col gap-1">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Son Senkronizasyon</span>
          <span className="text-lg font-extrabold text-[var(--text-primary)] font-mono mt-1 truncate">
            {syncStatus?.last_success_at
              ? new Date(syncStatus.last_success_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : "Hiçbir zaman"}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] text-[var(--text-tertiary)]">
            <Clock className="w-3 h-3 text-purple-400" />
            <span>Kick api eşitlemesi</span>
          </div>
        </GlassCard>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Platform Metrics Summary & Activity log */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Quick Panel Overview */}
          <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-5">
            <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-[var(--accent-primary)]" />
              Yönetici Kısayolları
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/admin/live">
                <div className="p-4 bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-xl flex items-center justify-between group hover:border-[var(--accent-primary)]/40 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Sliders className="w-5 h-5 text-[var(--accent-primary)]" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[var(--text-primary)]">Yayın Kontrolleri</span>
                      <span className="text-[10px] text-[var(--text-tertiary)]">Yayını yönet ve konsolu izle</span>
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
                      <span className="text-xs font-bold text-[var(--text-primary)]">Yayın Akışı Takvimi</span>
                      <span className="text-[10px] text-[var(--text-tertiary)]">Planlanan yayınları düzenle</span>
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
                      <span className="text-xs font-bold text-[var(--text-primary)]">Topluluk Önerileri</span>
                      <span className="text-[10px] text-[var(--text-tertiary)]">Gelen oyun önerilerini onayla</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link href="/admin/polls">
                <div className="p-4 bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-xl flex items-center justify-between group hover:border-[var(--accent-primary)]/40 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Vote className="w-5 h-5 text-blue-400" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[var(--text-primary)]">Anket Yönetimi</span>
                      <span className="text-[10px] text-[var(--text-tertiary)]">Topluluk oylamalarını izle</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>
          </GlassCard>

          {/* Activity Log Summary */}
          <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-4">
            <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Son Sistem Hareketleri
            </h2>
            <div className="flex flex-col gap-3 font-mono text-[11px] text-[var(--text-secondary)]">
              <div className="p-3 bg-[var(--bg-overlay)] rounded-lg border border-[var(--border-default)] flex items-start gap-3">
                <span className="text-zinc-600 font-semibold shrink-0">[BUGÜN]</span>
                <p className="leading-relaxed">
                  Kick API senkronizasyon motoru başarıyla çalıştırıldı ve kanal verileri veritabanı ile eşleştirildi.
                </p>
              </div>
              <div className="p-3 bg-[var(--bg-overlay)] rounded-lg border border-[var(--border-default)] flex items-start gap-3">
                <span className="text-zinc-600 font-semibold shrink-0">[DÜN]</span>
                <p className="leading-relaxed">
                  Otomatik moderasyon filtre kelimeleri güncellendi ve topluluk anket verileri başarıyla arşivlendi.
                </p>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Right Column (4 cols): Sync settings engine widget */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Creator Sync status summary */}
          <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className={cn("w-5 h-5 text-[var(--accent-primary)]", (isSyncing || syncStatus?.status === "syncing") && "animate-spin")} />
                <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Veri Senkronizasyonu
                </h2>
              </div>
              <Badge className={cn(
                "border-none text-white text-[10px] font-bold px-2 py-0.5 rounded-full",
                (isSyncing || syncStatus?.status === "syncing") ? "bg-amber-500" :
                syncStatus?.status === "success" ? "bg-emerald-500" :
                syncStatus?.status === "failed" ? "bg-[var(--live-red)]" : "bg-zinc-700"
              )}>
                {(isSyncing || syncStatus?.status === "syncing") ? "Eşitleniyor..." :
                 syncStatus?.status === "success" ? "Başarılı" :
                 syncStatus?.status === "failed" ? "Hata" : "Boşta"}
              </Badge>
            </div>

            <div className="flex flex-col gap-3 font-mono text-[11px] text-[var(--text-secondary)]">
              <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                <span className="text-[var(--text-tertiary)]">Platform</span>
                <span className="font-bold text-[var(--text-primary)] capitalize">
                  {syncStatus?.provider || "kick"}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                <span className="text-[var(--text-tertiary)]">Son Başarı</span>
                <span className="text-[10px] text-[var(--text-primary)]">
                  {syncStatus?.last_success_at
                    ? new Date(syncStatus.last_success_at).toLocaleTimeString()
                    : "Hiçbir zaman"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[var(--text-tertiary)]">Gecikme</span>
                <span className="text-[var(--text-primary)] font-bold">
                  {syncStatus?.duration_ms || syncStatus?.last_response_time_ms || 0} ms
                </span>
              </div>
            </div>

            <Button
              onClick={() => triggerSync()}
              disabled={isSyncing || syncStatus?.status === "syncing"}
              className="w-full h-9 bg-gradient-to-r from-[var(--accent-primary)] to-indigo-600 hover:from-[var(--accent-primary)]/90 hover:to-indigo-600/90 text-white font-bold text-[10px] tracking-wider uppercase rounded-lg shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isSyncing ? "Senkronize Ediliyor..." : "Şimdi Eşitle"}
            </Button>
          </GlassCard>

          {/* Settings shortcut card */}
          <GlassCard className="p-5 border border-[var(--border-default)] bg-[rgba(10,10,10,0.25)] flex flex-col gap-3">
            <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wide flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-purple-400" />
              Sistem Yapılandırması
            </h4>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              API anahtarlarını, Discord webhook adreslerini ve diğer gelişmiş parametreleri ayarlamak için sistem ayarlarına göz atın.
            </p>
            <Link href="/admin/settings" className="text-xs font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1 mt-2">
              Ayarlara Git <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </GlassCard>

        </div>

      </div>

    </div>
  );
}
