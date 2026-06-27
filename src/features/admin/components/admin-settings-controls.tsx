"use client";

import { useCreatorSyncStatus, useTriggerCreatorSync } from "../hooks/use-admin";
import { RefreshCw, Activity, Users, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminSettingsControls() {
  const { data: syncStatus, isLoading, isError } = useCreatorSyncStatus();
  const { mutate: triggerSync, isPending: isSyncing } = useTriggerCreatorSync();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <RefreshCw className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Ayarlar yükleniyor...</span>
      </div>
    );
  }

  if (isError || !syncStatus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <AlertCircle className="w-8 h-8 text-rose-500" />
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Ayarlar yüklenirken hata oluştu.</span>
      </div>
    );
  }

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
            Ayarlar
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Veritabanı senkronizasyon motorunu yönetin ve Discord entegrasyon ayarlarını kontrol edin.
          </p>
        </div>
      </GlassCard>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Kick Synchronization Panel (8 cols) */}
        <GlassCard className="lg:col-span-8 p-6 border border-[var(--border-default)] flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className={cn("w-5 h-5 text-[var(--accent-primary)]", isSyncing && "animate-spin")} />
              <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Kick Senkronizasyon Ayarları
              </h2>
            </div>
            <Badge className={cn(
              "border-none text-white text-[10px] font-bold px-2 py-0.5 rounded-full",
              isSyncing ? "bg-amber-500 animate-pulse" :
              syncStatus.status === "success" ? "bg-emerald-500" :
              syncStatus.status === "failed" ? "bg-[var(--live-red)]" : "bg-zinc-700"
            )}>
              {isSyncing ? "EŞİTLENİYOR..." :
               syncStatus.status === "success" ? "BAŞARILI" :
               syncStatus.status === "failed" ? "HATA" : "BOŞTA"}
            </Badge>
          </div>

          <div className="flex flex-col gap-3.5 font-mono text-[11px] text-[var(--text-secondary)]">
            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2.5">
              <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-zinc-500" /> Platform
              </span>
              <span className="font-bold text-[var(--text-primary)] capitalize">
                {syncStatus.provider || "kick"}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2.5">
              <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-zinc-500" /> Kanal İsmi (Slug)
              </span>
              <span className="font-bold text-zinc-400">
                @{syncStatus.channel || "zehragn"}
              </span>
            </div>

            <div className="flex flex-col gap-1 border-b border-[var(--border-subtle)] pb-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Son Başarılı Eşitleme
                </span>
                <span className="text-[10px] text-[var(--text-primary)]">
                  {syncStatus.last_success_at
                    ? new Date(syncStatus.last_success_at).toLocaleTimeString()
                    : "Hiçbir zaman"}
                </span>
              </div>
              {syncStatus.last_success_at && (
                <span className="text-[9px] text-[var(--text-tertiary)] text-right">
                  {new Date(syncStatus.last_success_at).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1 border-b border-[var(--border-subtle)] pb-1">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Son Başarısız Eşitleme
                </span>
                <span className="text-[10px] text-[var(--text-primary)]">
                  {syncStatus.last_failed_at
                    ? new Date(syncStatus.last_failed_at).toLocaleTimeString()
                    : "Yok"}
                </span>
              </div>
              {syncStatus.last_failed_at && (
                <span className="text-[9px] text-[var(--text-tertiary)] text-right">
                  {new Date(syncStatus.last_failed_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {syncStatus.error && (
            <div className="p-2.5 rounded-lg border border-red-500/20 bg-red-500/5 text-[10px] text-red-400 font-mono break-all max-h-[80px] overflow-y-auto">
              Hata Mesajı: {syncStatus.error}
            </div>
          )}

          <Button
            onClick={() => triggerSync()}
            disabled={isSyncing}
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
                Şimdi Eşitle
              </>
            )}
          </Button>
        </GlassCard>

        {/* Sync Engine Facts & Information (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <GlassCard className="p-5 border border-[var(--border-default)] bg-[rgba(10,10,10,0.25)] relative overflow-hidden flex flex-col gap-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_90%,rgba(168,85,247,0.05),transparent_60%)] pointer-events-none" />
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wide">
                Senkronizasyon Motoru Bilgileri
              </h4>
              <ul className="text-[10px] text-[var(--text-secondary)] leading-relaxed list-disc pl-4 flex flex-col gap-1.5">
                <li>
                  <strong className="text-[var(--text-primary)]">Takipçi Sayısı:</strong> Kick API istemci kimlik bilgileri akışında takipçi sayısını doğrudan sunmadığından, bu değer şu anda panelde güncellenememektedir.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Abone Sayısı:</strong> Kick API üzerinden gerçek zamanlı aktif aboneler çekilir ve panelde ayrı bir kart olarak gösterilir.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Yayın Geçmişi:</strong> Canlı durumdan çevrimdışı duruma geçişler sistem tarafından tespit edilerek otomatik bir yayın kaydı oluşturulur.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Anlık İzleyici:</strong> Yayın canlıyken izleyici sayıları belirli aralıklarla kaydedilir ve sonrasında ortalama/peak değerleri hesaplanır.
                </li>
              </ul>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}


