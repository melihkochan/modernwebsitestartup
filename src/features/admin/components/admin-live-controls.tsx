"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, Activity, Users, Tv, CheckCircle2, Terminal } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SystemLog {
  id: string;
  time: string;
  type: "info" | "success" | "warn" | "error";
  message: string;
}

const INITIAL_LOGS: SystemLog[] = [
  { id: "log-1", time: "00:01:05", type: "info", message: "Yayıncı sistemi tanılama başlatıldı..." },
  { id: "log-2", time: "00:01:06", type: "success", message: "AV1 kodlayıcı profili 'Kick-Tactical' başarıyla yüklendi." },
  { id: "log-3", time: "00:01:08", type: "info", message: "Yayın sunucusuna bağlanılıyor: tr-ist-01.kick.com..." },
  { id: "log-4", time: "00:01:09", type: "success", message: "Yayın el sıkışması kabul edildi. Bitrate 8.200 kbps seviyesinde sabitlendi." },
  { id: "log-5", time: "00:01:10", type: "info", message: "Ses girişleri senkronize edildi: Focusrite Scarlett 2i2." },
  { id: "log-6", time: "00:01:12", type: "success", message: "Sohbet botu aktif edildi. Dinleyiciler bağlandı." },
];

export function AdminLiveControls() {
  const [isLive, setIsLive] = useState(false);
  const [bitrate, setBitrate] = useState(8200);
  const [viewerCount, setViewerCount] = useState(12438);
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);

  // Simulate updating vitals and logs
  useEffect(() => {
    if (!isLive) return;

    const vitalsInterval = setInterval(() => {
      setBitrate((prev) => Math.max(7800, Math.min(8500, prev + Math.round(Math.random() * 100 - 50))));
      setViewerCount((prev) => Math.max(12100, Math.min(12800, prev + Math.round(Math.random() * 20 - 10))));
    }, 2000);

    return () => clearInterval(vitalsInterval);
  }, [isLive]);

  // Simulate scrolling logs
  useEffect(() => {
    const logPool = [
      { type: "info" as const, message: "Yayın sunucuları pingleniyor... RTT 14ms." },
      { type: "success" as const, message: "Sahne arabelleği 'Oyun İçi Arayüz' olarak değiştirildi." },
      { type: "warn" as const, message: "Ufak kare gecikmesi algılandı: 2 kare atlandı." },
      { type: "success" as const, message: "Sohbet botu spam koruması başarıyla tetiklendi." },
      { type: "info" as const, message: "Senkronizasyon sinyali arayüze gönderildi." },
    ];

    const logsInterval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setLogs((prev) => {
        const next = [
          ...prev,
          {
            id: `log-${Date.now()}`,
            time,
            type: randomLog.type,
            message: randomLog.message,
          },
        ];
        return next.slice(-10); // Son 10 günlüğü tut
      });
    }, 5000);

    return () => clearInterval(logsInterval);
  }, []);

  const handleToggleLive = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    if (isLive) {
      setLogs((prev) => [
        ...prev,
        { id: `log-${Date.now()}`, time, type: "warn", message: "Yayın sinyali sonlandırıldı. Kodlayıcı boşta." },
      ]);
      setIsLive(false);
    } else {
      setLogs((prev) => [
        ...prev,
        { id: `log-${Date.now()}`, time, type: "success", message: "Yayın bağlantısı başarılı. CANLI YAYIN BAŞLADI." },
      ]);
      setIsLive(true);
      setBitrate(8200);
      setViewerCount(12438);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Console Header Control Panel */}
      <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.45)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Badge className={cn("border-none text-white text-[10px] font-bold px-2 py-0.5", isLive ? "bg-[var(--live-red)] animate-pulse" : "bg-zinc-700")}>
              {isLive ? "CANLI YAYIN AKTİF" : "KONSOL BEKLEMEDE"}
            </Badge>
            <span className="text-xs text-[var(--text-tertiary)] font-mono">
              Sunucu: tr-ist-01
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Canlı Yayın Kontrol Merkezi
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Yayını başlatın veya durdurun, anlık aktarım hızını (bitrate) izleyin ve yayın sunucusu günlüklerini takip edin.
          </p>
        </div>

        <Button
          onClick={handleToggleLive}
          className={cn(
            "h-10 px-6 font-bold text-xs border-none cursor-pointer tracking-wider uppercase transition-all shadow-[var(--shadow-sm)] flex items-center gap-2 rounded-full",
            isLive
              ? "bg-zinc-800 text-red-500 hover:bg-zinc-700 hover:text-red-400"
              : "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] hover:shadow-[0_0_20px_var(--accent-glow)]"
          )}
        >
          {isLive ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              Yayını Durdur
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Yayını Başlat
            </>
          )}
        </Button>
      </GlassCard>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col gap-1">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Yayın Bitrate Değeri</span>
          <span className="text-lg font-extrabold text-[var(--text-primary)] font-mono mt-1">
            {isLive ? `${(bitrate / 1000).toFixed(1)} Mbps` : "0.0 Mbps"}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] text-[var(--text-tertiary)]">
            <Activity className="w-3 h-3 text-[var(--accent-primary)]" />
            <span>AV1 / Opus Ses Kodları</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col gap-1">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Aktif İzleyiciler</span>
          <span className="text-lg font-extrabold text-[var(--text-primary)] font-mono mt-1">
            {isLive ? viewerCount.toLocaleString() : "0"}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] text-[var(--text-tertiary)]">
            <Users className="w-3 h-3 text-blue-400" />
            <span>Kick Canlı Akışı</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col gap-1">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Yayın Süresi</span>
          <span className="text-lg font-extrabold text-[var(--text-primary)] font-mono mt-1">
            {isLive ? "00sa 42dk 12sn" : "00sa 00dk 00sn"}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] text-[var(--text-tertiary)]">
            <Tv className="w-3 h-3 text-purple-400" />
            <span>Oturum Süresi</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col gap-1">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Kare Kaybı (Drop)</span>
          <span className="text-lg font-extrabold text-[var(--text-primary)] font-mono mt-1">
            {isLive ? "%0.01" : "%0.00"}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] text-[var(--text-tertiary)]">
            <CheckCircle2 className="w-3 h-3 text-[var(--accent-primary)]" />
            <span>Çıktı Durumu: Kararlı</span>
          </div>
        </GlassCard>
      </div>

      {/* System Logs Console */}
      <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-4 overflow-hidden rounded-[var(--radius-lg)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Yayın Konsol Günlükleri (Log)
            </h2>
          </div>
          <Badge className="bg-[rgba(255,255,255,0.05)] border border-white/5 text-[9px] font-mono text-[var(--text-secondary)] px-2 py-0.5">
            ANLIK ÇIKTI
          </Badge>
        </div>

        <div className="bg-[rgba(10,10,10,0.85)] border border-[var(--border-subtle)] p-4 rounded-lg font-mono text-xs flex flex-col gap-2 min-h-[220px] max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 select-all">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2.5 text-zinc-300"
              >
                <span className="text-zinc-600 shrink-0 select-none">[{log.time}]</span>
                <span
                  className={cn(
                    "font-extrabold uppercase shrink-0 text-[10px] px-1 rounded select-none",
                    log.type === "success"
                      ? "text-emerald-400 bg-emerald-950/20"
                      : log.type === "warn"
                      ? "text-amber-400 bg-amber-950/20"
                      : log.type === "error"
                      ? "text-red-400 bg-red-950/20"
                      : "text-blue-400 bg-blue-950/20"
                  )}
                >
                  {log.type === "success" ? "BAŞARILI" : log.type === "warn" ? "UYARI" : log.type === "error" ? "HATA" : "BİLGİ"}
                </span>
                <span className="leading-normal">{log.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </GlassCard>
    </div>
  );
}
