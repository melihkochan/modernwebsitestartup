"use client";

import { Calendar, Clock, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

const PLANNED_STREAMS = [
  { id: "s-1", date: "Pazartesi, 29 Haziran", time: "20:00 - 00:00", game: "Valorant Ranked Grind", status: "planned" },
  { id: "s-2", date: "Çarşamba, 1 Temmuz", time: "20:00 - 01:00", game: "Elden Ring: Shadow of the Erdtree DLC", status: "planned" },
  { id: "s-3", date: "Cuma, 3 Temmuz", time: "21:00 - 03:00", game: "Korku Gecesi: Silent Hill", status: "highlight" },
  { id: "s-4", date: "Cumartesi, 4 Temmuz", time: "18:00 - 22:00", game: "Topluluk Günü & Özel Anketler", status: "planned" },
];

export function AdminScheduleControls() {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.45)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Badge className="border-none text-white text-[10px] font-bold px-2 py-0.5 bg-[var(--accent-primary)]">
              YAYIN AKIŞI PROGRAMI
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Haftalık Yayın Takvimi
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Gelecek yayın planlarını organize edin, yayın saatlerini ve oynanacak oyunları topluluk için güncelleyin.
          </p>
        </div>
      </GlassCard>

      {/* Grid Schedule Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLANNED_STREAMS.map((stream) => (
          <GlassCard
            key={stream.id}
            className="p-5 border border-[var(--border-default)] flex flex-col gap-4 hover:border-[var(--border-strong)] transition-all duration-300 relative overflow-hidden"
          >
            {stream.status === "highlight" && (
              <div aria-hidden className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-purple-500 to-indigo-500" />
            )}

            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] font-semibold text-[var(--accent-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {stream.date}
              </span>
              <Badge variant="outline" className={stream.status === "highlight" ? "border-purple-500/20 text-purple-400 bg-purple-500/5 text-[9px] font-bold" : "border-zinc-800 text-[var(--text-tertiary)] text-[9px]"}>
                {stream.status === "highlight" ? "ÖNE ÇIKAN" : "STANDART"}
              </Badge>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                {stream.game}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 mt-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                {stream.time}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Beta Notice Banner */}
      <GlassCard className="p-5 border border-[var(--border-default)] bg-[rgba(10,10,10,0.25)] relative overflow-hidden flex flex-col gap-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)]">
          <AlertCircle className="w-4.5 h-4.5" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wide">
            Takvim Otomasyonu (Yakında)
          </h4>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            Kick etkinlik API entegrasyonu ile oluşturduğunuz takvim etkinlikleri otomatik olarak yayına aktarılacaktır.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
