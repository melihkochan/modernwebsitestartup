"use client";

import { useCreatorSyncStatus, useTriggerCreatorSync } from "../hooks/use-admin";
import { RefreshCw, Activity, Users, CheckCircle2, AlertCircle, Clock, Cpu, Settings, ShieldAlert } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminSettingsControls() {
  const { data: syncStatus } = useCreatorSyncStatus();
  const { mutate: triggerSync, isPending: isSyncing } = useTriggerCreatorSync();

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.45)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Badge className="border-none text-white text-[10px] font-bold px-2 py-0.5 bg-[var(--accent-primary)]">
              SİSTEM AYARLARI
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Ayarlar ve Senkronizasyon
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Platform verilerini harici sağlayıcılarla senkronize edin, Discord entegrasyon ayarlarını yapılandırın ve geliştirici günlüklerini inceleyin.
          </p>
        </div>
      </GlassCard>

      {/* Grid: Sync Engine & Discord Bot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Creator Sync Engine Panel (8 cols) */}
        <GlassCard className="lg:col-span-8 p-6 border border-[var(--border-default)] flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className={cn("w-5 h-5 text-[var(--accent-primary)]", (isSyncing || syncStatus?.status === "syncing") && "animate-spin")} />
              <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Yayıncı Senkronizasyon Motoru (Creator Sync)
              </h2>
            </div>
            <Badge className={cn(
              "border-none text-white text-[10px] font-bold px-2 py-0.5 rounded-full",
              (isSyncing || syncStatus?.status === "syncing") ? "bg-amber-500 animate-pulse" :
              syncStatus?.status === "success" ? "bg-emerald-500" :
              syncStatus?.status === "failed" ? "bg-[var(--live-red)]" : "bg-zinc-700"
            )}>
              {(isSyncing || syncStatus?.status === "syncing") ? "EŞİTLENİYOR..." :
               syncStatus?.status === "success" ? "BAŞARILI" :
               syncStatus?.status === "failed" ? "HATA" : "BOŞTA"}
            </Badge>
          </div>

          <div className="flex flex-col gap-3 font-mono text-[11px] text-[var(--text-secondary)]">
            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
              <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-zinc-500" /> Sağlayıcı (Provider)
              </span>
              <span className="font-bold text-[var(--text-primary)] capitalize">
                {syncStatus?.provider || "kick"}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
              <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-zinc-500" /> Kanal Adı (Slug)
              </span>
              <span className="font-bold text-zinc-400">
                @{syncStatus?.channel || "zehragn"}
              </span>
            </div>

            <div className="flex flex-col gap-1 border-b border-[var(--border-subtle)] pb-2">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Son Başarılı Eşitleme
                </span>
                <span className="text-[10px] text-[var(--text-primary)]">
                  {syncStatus?.last_success_at
                    ? new Date(syncStatus.last_success_at).toLocaleTimeString()
                    : "Hiçbir zaman"}
                </span>
              </div>
              {syncStatus?.last_success_at && (
                <span className="text-[9px] text-[var(--text-tertiary)] text-right">
                  {new Date(syncStatus.last_success_at).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1 border-b border-[var(--border-subtle)] pb-2">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Son Hata
                </span>
                <span className="text-[10px] text-[var(--text-primary)]">
                  {syncStatus?.last_failed_at
                    ? new Date(syncStatus.last_failed_at).toLocaleTimeString()
                    : "Yok"}
                </span>
              </div>
              {syncStatus?.last_failed_at && (
                <span className="text-[9px] text-[var(--text-tertiary)] text-right">
                  {new Date(syncStatus.last_failed_at).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
              <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" /> İstek Gecikmesi
              </span>
              <span className="text-[var(--text-primary)] font-bold">
                {syncStatus?.duration_ms || syncStatus?.last_response_time_ms || 0} ms
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
              <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-zinc-500" /> Güncellenen Tablo
              </span>
              <span className="text-[var(--text-primary)] font-bold">
                {syncStatus?.updated_tables ?? 0} tablo
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-zinc-500" /> Güncellenen Kayıt
              </span>
              <span className="text-[var(--text-primary)] font-bold">
                {syncStatus?.updated_records ?? 0} satır
              </span>
            </div>
          </div>

          {syncStatus?.error && (
            <div className="p-2.5 rounded-lg border border-red-500/20 bg-red-500/5 text-[10px] text-red-400 font-mono break-all max-h-[80px] overflow-y-auto">
              Hata Açıklaması: {syncStatus.error}
            </div>
          )}

          <Button
            onClick={() => triggerSync()}
            disabled={isSyncing || syncStatus?.status === "syncing"}
            className="w-full h-9 bg-gradient-to-r from-[var(--accent-primary)] to-indigo-600 hover:from-[var(--accent-primary)]/90 hover:to-indigo-600/90 text-white font-bold text-[10px] tracking-wider uppercase rounded-lg shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Senkronize ediliyor...
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                Şimdi Senkronize Et
              </>
            )}
          </Button>
        </GlassCard>

        {/* Right Info blocks (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <GlassCard className="p-5 border border-[var(--border-default)] bg-[rgba(10,10,10,0.25)] relative overflow-hidden flex flex-col gap-3">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_90%,rgba(168,85,247,0.05),transparent_60%)] pointer-events-none" />
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wide">
                Discord Entegrasyonu
              </h4>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Yönetici panelinizi Discord botunuzla bağlayarak moderatör komutlarını, engellenen kelimeleri ve log kayıtlarını anlık olarak senkronize edin.
              </p>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
