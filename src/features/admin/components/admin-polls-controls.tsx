"use client";

import { Vote, AlertCircle, Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ACTIVE_POLLS = [
  {
    id: "p-1",
    title: "Sıradaki yayında hangi oyunu oynayalım?",
    options: [
      { text: "Valorant Ranked", votes: 852 },
      { text: "Silent Hill 2 Remake", votes: 1204 },
      { text: "Toplulukla Aramızda (Customs)", votes: 412 },
    ],
    totalVotes: 2468,
  },
];

export function AdminPollsControls() {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.45)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Badge className="border-none text-white text-[10px] font-bold px-2 py-0.5 bg-[var(--accent-primary)]">
              TOPLULUK ANKETLERİ
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Topluluk Anket Yönetimi
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Aktif oylamaları yönetin, anket sonuçlarını anlık izleyin veya yayına yansıtmak üzere yeni anket başlatın.
          </p>
        </div>

        <Button className="h-10 px-6 font-bold text-xs bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none cursor-pointer tracking-wider uppercase transition-all shadow-[var(--shadow-sm)] flex items-center gap-2 rounded-full">
          <Plus className="w-4 h-4" />
          Yeni Anket Oluştur
        </Button>
      </GlassCard>

      {/* Active Poll */}
      <div className="flex flex-col gap-6">
        {ACTIVE_POLLS.map((poll) => (
          <GlassCard key={poll.id} className="p-6 border border-[var(--border-default)] flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="text-[10px] font-semibold text-[var(--accent-primary)] uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                <Vote className="w-4 h-4" />
                Aktif Yayında Oylanıyor
              </span>
              <span className="text-[10px] text-[var(--text-tertiary)] font-bold">
                Toplam Oy: {poll.totalVotes.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: "var(--font-outfit)" }}>
                {poll.title}
              </h3>

              <div className="flex flex-col gap-3">
                {poll.options.map((opt, i) => {
                  const pct = Math.round((opt.votes / poll.totalVotes) * 100);
                  return (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[var(--text-secondary)]">{opt.text}</span>
                        <span className="text-[var(--text-primary)] font-mono">{pct}% ({opt.votes})</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Beta Banner */}
      <GlassCard className="p-5 border border-[var(--border-default)] bg-[rgba(10,10,10,0.25)] relative overflow-hidden flex flex-col gap-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)]">
          <AlertCircle className="w-4.5 h-4.5" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wide">
            Anket Arayüz Entegrasyonu
          </h4>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            Burada başlattığınız anketler otomatik olarak canlı yayındaki video arayüzünde (stream overlay) anlık grafiklerle görüntülenebilir.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
