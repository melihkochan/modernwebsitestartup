"use client";

import { ThumbsUp, CheckCircle2, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

const MOCK_SUGGESTIONS = [
  { id: "as-1", game: "Hades II", votes: 428, submitter: "ZagreusFan", desc: "Zorlayıcı Roguelike aksiyon. Canlı yayında bitirmeyi dene!" },
  { id: "as-2", game: "Cyberpunk 2077: Phantom Liberty", votes: 310, submitter: "Netrunner01", desc: "Hikaye odaklı RPG DLC paketi. Ek görevler çok zevkli." },
  { id: "as-3", game: "Helldivers 2", votes: 242, submitter: "DemocracyNow", desc: "Topluluk ile oynamalık kaos dolu coop aksiyon." },
  { id: "as-4", game: "Detroit: Become Human", votes: 198, submitter: "Android800", desc: "Karar verme temalı interaktif dramatik hikaye." },
];

export function AdminSuggestionsControls() {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.45)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Badge className="border-none text-white text-[10px] font-bold px-2 py-0.5 bg-[var(--accent-primary)]">
              ÖNERİ ONAYLAMA
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Topluluk Oyun Öneri Sırası
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Kullanıcıların `/community` sayfası üzerinden gönderdiği oyun önerilerini onaylayın veya listeden kaldırın.
          </p>
        </div>
      </GlassCard>

      {/* Suggestion Queue List */}
      <div className="flex flex-col gap-4">
        {MOCK_SUGGESTIONS.map((item) => (
          <GlassCard
            key={item.id}
            className="p-4 border border-[var(--border-default)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-[var(--border-strong)] transition-all duration-300"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                  {item.game}
                </h3>
                <Badge variant="outline" className="border-zinc-800 text-[var(--text-tertiary)] text-[9px] font-mono">
                  Gönderen: {item.submitter}
                </Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5">
                {item.desc}
              </p>
              <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1 mt-2.5 font-bold">
                <ThumbsUp className="w-3 h-3 text-[var(--accent-primary)]" />
                {item.votes} Oy Alındı
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-[var(--bg-base)] cursor-pointer transition-all">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Onayla
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer transition-all">
                <Trash2 className="w-3.5 h-3.5" />
                Sil
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
