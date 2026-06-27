"use client";

import { Calendar, Clock, Users, Tv, RefreshCw, AlertCircle, Info } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { useStreamHistory } from "../hooks/use-admin";
 
export function AdminScheduleControls() {
  const { data: history, isLoading, isError } = useStreamHistory();
 
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <RefreshCw className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Yayın geçmişi yükleniyor...</span>
      </div>
    );
  }
 
  if (isError || !history) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <AlertCircle className="w-8 h-8 text-rose-500" />
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Yayın geçmişi alınırken hata oluştu.</span>
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
              GEÇMİŞ YAYIN KATALOĞU
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Yayın Geçmişi
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Daha önce tamamladığınız yayınların sürelerini, kategorilerini ve izleyici istatistiklerini bu listeden inceleyin.
          </p>
        </div>
      </GlassCard>
 
      {/* Grid Stream Slots */}
      {history.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((stream) => {
            const hours = Math.floor(stream.durationMinutes / 60);
            const mins = stream.durationMinutes % 60;
            const formattedDuration = `${hours > 0 ? `${hours}sa ` : ""}${mins}dk`;
 
            return (
              <GlassCard
                key={stream.id}
                className="p-5 border border-[var(--border-default)] flex flex-col gap-4 hover:border-[var(--border-strong)] transition-all duration-300 relative overflow-hidden"
              >
                {/* Top Accent line */}
                <div aria-hidden className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[var(--accent-primary)] to-blue-500" />
 
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-semibold text-[var(--accent-primary)] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(stream.startedAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                  <Badge variant="outline" className="border-zinc-800 text-[var(--text-secondary)] text-[9px] font-bold">
                    {stream.gamePlayed}
                  </Badge>
                </div>
 
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-extrabold text-[var(--text-primary)] leading-snug line-clamp-2" style={{ fontFamily: "var(--font-outfit)" }}>
                    {stream.title}
                  </h3>
                  <div className="flex items-center gap-3.5 text-[10px] text-[var(--text-tertiary)] font-mono mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      Süre: {formattedDuration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-zinc-500" />
                      Ort. İzleyici: {stream.averageViewers.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tv className="w-3.5 h-3.5 text-zinc-500" />
                      Peak: {stream.peakViewers.toLocaleString()}
                    </span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <GlassCard className="p-8 text-center text-xs text-[var(--text-tertiary)] border border-dashed border-[var(--border-default)] rounded-xl flex flex-col items-center justify-center gap-2 bg-[rgba(10,10,10,0.1)]">
          <Info className="w-6 h-6 text-zinc-500" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Henüz tamamlanmış yayın kaydı bulunmuyor.</span>
            <span className="text-[10px] text-[var(--text-tertiary)]">
              Kick senkronizasyonu her yayın bitiminde otomatik olarak bu tabloyu günceller.
            </span>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
