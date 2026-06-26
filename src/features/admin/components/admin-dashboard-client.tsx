"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  Play,
  Square,
  Activity,
  Cpu,
  Users,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Tv,
  Settings,
  ShieldAlert,
  Terminal,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreatorSyncStatus, useTriggerCreatorSync } from "../hooks/use-admin";

// ---------------------------------------------------------------------------
// Mock Data for Admin Panel
// ---------------------------------------------------------------------------

interface SystemLog {
  id: string;
  time: string;
  type: "info" | "success" | "warn" | "error";
  message: string;
}

const INITIAL_LOGS: SystemLog[] = [
  { id: "log-1", time: "00:01:05", type: "info", message: "Broadcaster system diagnostics started..." },
  { id: "log-2", time: "00:01:06", type: "success", message: "AV1 encoder profile 'Kick-Tactical' loaded successfully." },
  { id: "log-3", time: "00:01:08", type: "info", message: "Connecting to ingest endpoint: tr-ist-01.kick.com..." },
  { id: "log-4", time: "00:01:09", type: "success", message: "Stream handshake accepted. Bitrate stabilized at 8,200 kbps." },
  { id: "log-5", time: "00:01:10", type: "info", message: "Audio feeds synchronized: Focusrite Scarlett 2i2." },
  { id: "log-6", time: "00:01:12", type: "success", message: "Chat webhook active. Listeners connected." },
];

const RECENT_SUGGESTIONS = [
  { id: "as-1", game: "Hades II", votes: 428, submitter: "ZagreusFan" },
  { id: "as-2", game: "Cyberpunk 2077: Phantom Liberty", votes: 310, submitter: "Netrunner01" },
  { id: "as-3", game: "Helldivers 2", votes: 242, submitter: "DemocracyNow" },
];

export function AdminDashboardClient() {
  const { data: syncStatus } = useCreatorSyncStatus();
  const { mutate: triggerSync, isPending: isSyncing } = useTriggerCreatorSync();

  const [isLive, setIsLive] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(12);
  const [memoryUsage, setMemoryUsage] = useState(48);
  const [gpuTemp, setGpuTemp] = useState(58);
  const [bitrate, setBitrate] = useState(8200);
  const [viewerCount, setViewerCount] = useState(12438);
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);

  // Simulate updating vitals and logs
  useEffect(() => {
    const vitalsInterval = setInterval(() => {
      // Random walk for vitals
      setCpuUsage((prev) => Math.max(5, Math.min(95, prev + (Math.random() * 6 - 3))));
      setMemoryUsage((prev) => Math.max(35, Math.min(85, prev + (Math.random() * 2 - 1))));
      setGpuTemp((prev) => Math.max(45, Math.min(85, prev + (Math.random() * 4 - 2))));
      
      if (isLive) {
        setBitrate((prev) => Math.max(7800, Math.min(8500, prev + Math.round(Math.random() * 100 - 50))));
        setViewerCount((prev) => Math.max(12100, Math.min(12800, prev + Math.round(Math.random() * 20 - 10))));
      } else {
        setBitrate(0);
        setViewerCount(0);
      }
    }, 2000);

    return () => clearInterval(vitalsInterval);
  }, [isLive]);

  // Simulate scrolling admin log outputs
  useEffect(() => {
    const logPool = [
      { type: "info" as const, message: "Pinging ingest servers... RTT 14ms." },
      { type: "success" as const, message: "Scene buffer swapped to 'Gameplay HUD'." },
      { type: "warn" as const, message: "Minor rendering delay detected: 2 dropped frames." },
      { type: "success" as const, message: "Chat bot AutoMod successfully filtered spam string." },
      { type: "info" as const, message: "Sync pulse sent to stream dashboard overlay." },
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
        return next.slice(-10); // Keep last 10 logs
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
        { id: `log-${Date.now()}`, time, type: "warn", message: "Broadcaster signal terminated. Encoder idle." },
      ]);
      setIsLive(false);
    } else {
      setLogs((prev) => [
        ...prev,
        { id: `log-${Date.now()}`, time, type: "success", message: "Broadcaster handshakes accepted. STREAMING LIVE NOW." },
      ]);
      setIsLive(true);
      setBitrate(8200);
      setViewerCount(12438);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      
      {/* Console Header Control Panel */}
      <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.45)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Badge className={cn("border-none text-white text-[10px] font-bold px-2 py-0.5", isLive ? "bg-[var(--live-red)] animate-pulse" : "bg-zinc-700")}>
              {isLive ? "LIVE BROADCAST ACTIVE" : "CONSOLE STANDBY"}
            </Badge>
            <span className="text-xs text-[var(--text-tertiary)] font-mono">
              Server: tr-ist-01
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Broadcaster Stream Console
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Manage channel parameters, monitor hardware vitals, and coordinate community moderation settings.
          </p>
        </div>

        {/* Console Go Live Trigger */}
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
              Stop Broadcast
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Initiate Stream
            </>
          )}
        </Button>
      </GlassCard>

      {/* KPI Vitals metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col gap-1">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Broadcasting Bitrate</span>
          <span className="text-lg font-extrabold text-[var(--text-primary)] font-mono mt-1">
            {isLive ? `${(bitrate / 1000).toFixed(1)} Mbps` : "0.0 Mbps"}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] text-[var(--text-tertiary)]">
            <Activity className="w-3 h-3 text-[var(--accent-primary)]" />
            <span>AV1 / Opus codecs</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col gap-1">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Active Viewers</span>
          <span className="text-lg font-extrabold text-[var(--text-primary)] font-mono mt-1">
            {isLive ? viewerCount.toLocaleString() : "0"}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] text-[var(--text-tertiary)]">
            <Users className="w-3 h-3 text-blue-400" />
            <span>Kick stream feed</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col gap-1">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Stream Duration</span>
          <span className="text-lg font-extrabold text-[var(--text-primary)] font-mono mt-1">
            {isLive ? "00h 42m 12s" : "00h 00m 00s"}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] text-[var(--text-tertiary)]">
            <Tv className="w-3 h-3 text-purple-400" />
            <span>Session uptime</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4.5 border border-[var(--border-default)] flex flex-col gap-1">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Frame dropped</span>
          <span className="text-lg font-extrabold text-[var(--text-primary)] font-mono mt-1">
            {isLive ? "0.01%" : "0.00%"}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[9px] text-[var(--text-tertiary)]">
            <CheckCircle2 className="w-3 h-3 text-[var(--accent-primary)]" />
            <span>Rendering: Stable</span>
          </div>
        </GlassCard>
      </div>

      {/* Widgets Grid: Vitals & Logging Console & Mod Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left widget block (8 cols): Health vitals dials & Live logging terminal */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Hardware Vitals Gauges */}
          <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[var(--accent-primary)] animate-pulse" />
              <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                System Hardware Vitals
              </h2>
            </div>

            {/* Visual animated SVG dials */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* CPU load circle dial */}
              <div className="flex flex-col items-center gap-2 bg-[rgba(10,10,10,0.15)] p-4 rounded-xl border border-[var(--border-subtle)]">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-zinc-800" strokeWidth="6" fill="none" />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      className="stroke-[var(--accent-primary)] transition-all duration-500"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="213"
                      strokeDashoffset={213 - (213 * cpuUsage) / 100}
                    />
                  </svg>
                  <span className="absolute text-xs font-mono font-extrabold text-[var(--text-primary)]">
                    {Math.round(cpuUsage)}%
                  </span>
                </div>
                <span className="text-[10px] text-[var(--text-secondary)] font-bold">CPU Thread Load</span>
              </div>

              {/* RAM memory dial */}
              <div className="flex flex-col items-center gap-2 bg-[rgba(10,10,10,0.15)] p-4 rounded-xl border border-[var(--border-subtle)]">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-zinc-800" strokeWidth="6" fill="none" />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      className="stroke-purple-500 transition-all duration-500"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="213"
                      strokeDashoffset={213 - (213 * memoryUsage) / 100}
                    />
                  </svg>
                  <span className="absolute text-xs font-mono font-extrabold text-[var(--text-primary)]">
                    {Math.round(memoryUsage)}%
                  </span>
                </div>
                <span className="text-[10px] text-[var(--text-secondary)] font-bold">RAM Memory Load</span>
              </div>

              {/* GPU temperature dial */}
              <div className="flex flex-col items-center gap-2 bg-[rgba(10,10,10,0.15)] p-4 rounded-xl border border-[var(--border-subtle)]">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-zinc-800" strokeWidth="6" fill="none" />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      className="stroke-amber-500 transition-all duration-500"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="213"
                      strokeDashoffset={213 - (213 * gpuTemp) / 100}
                    />
                  </svg>
                  <span className="absolute text-xs font-mono font-extrabold text-[var(--text-primary)]">
                    {Math.round(gpuTemp)}°C
                  </span>
                </div>
                <span className="text-[10px] text-[var(--text-secondary)] font-bold">GPU Core Temp</span>
              </div>
            </div>
          </GlassCard>

          {/* Broadcaster Log Terminal Console */}
          <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-4 overflow-hidden rounded-[var(--radius-lg)]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-400" />
                <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Broadcaster System Logs
                </h2>
              </div>
              <Badge className="bg-[rgba(255,255,255,0.05)] border border-white/5 text-[9px] font-mono text-[var(--text-secondary)] px-2 py-0.5">
                LIVE OUTPUT
              </Badge>
            </div>

            <div className="bg-[rgba(10,10,10,0.85)] border border-[var(--border-subtle)] p-4 rounded-lg font-mono text-xs flex flex-col gap-2 min-h-[180px] max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 select-all">
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
                      {log.type}
                    </span>
                    <span className="leading-normal">{log.message}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </GlassCard>

        </div>

        {/* Right widget block (4 cols): Suggestions & Mod Controls */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Recent Suggestions Mod Panel */}
          <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Recommendations Queue
              </h2>
              <Badge className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-[10px] font-bold border border-[var(--accent-primary)]/20 px-2 py-0.5 rounded-full">
                MODERATION
              </Badge>
            </div>

            <div className="flex flex-col gap-3">
              {RECENT_SUGGESTIONS.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-lg flex items-center justify-between gap-4 text-xs group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-[var(--text-primary)] truncate max-w-[140px]">
                      {item.game}
                    </span>
                    <span className="text-[10px] text-[var(--text-tertiary)]">
                      By {item.submitter} • {item.votes} votes
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-[var(--bg-base)] cursor-pointer transition-all">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="text-center text-[10px] font-bold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors py-1 cursor-pointer">
              View All Submissions (148)
            </button>
          </GlassCard>

          {/* Creator Sync Engine Panel */}
          <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className={cn("w-5 h-5 text-[var(--accent-primary)]", (isSyncing || syncStatus?.status === "syncing") && "animate-spin")} />
                <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Creator Sync Engine
                </h2>
              </div>
              <Badge className={cn(
                "border-none text-white text-[10px] font-bold px-2 py-0.5 rounded-full",
                (isSyncing || syncStatus?.status === "syncing") ? "bg-amber-500 animate-pulse" :
                syncStatus?.status === "success" ? "bg-emerald-500" :
                syncStatus?.status === "failed" ? "bg-[var(--live-red)]" : "bg-zinc-700"
              )}>
                {(isSyncing || syncStatus?.status === "syncing") ? "SYNCING..." : (syncStatus?.status || "IDLE").toUpperCase()}
              </Badge>
            </div>

            <div className="flex flex-col gap-3 font-mono text-[11px] text-[var(--text-secondary)]">
              <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-zinc-500" /> Current Provider
                </span>
                <span className="font-bold text-[var(--text-primary)] capitalize">
                  {syncStatus?.provider || "kick"}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-zinc-500" /> Channel Slug
                </span>
                <span className="font-bold text-zinc-400">
                  @{syncStatus?.channel || "zehragn"}
                </span>
              </div>

              <div className="flex flex-col gap-1 border-b border-[var(--border-subtle)] pb-2">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Last Success
                  </span>
                  <span className="text-[10px] text-[var(--text-primary)]">
                    {syncStatus?.last_success_at
                      ? new Date(syncStatus.last_success_at).toLocaleTimeString()
                      : "Never"}
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
                    <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Last Failure
                  </span>
                  <span className="text-[10px] text-[var(--text-primary)]">
                    {syncStatus?.last_failed_at
                      ? new Date(syncStatus.last_failed_at).toLocaleTimeString()
                      : "None"}
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
                  <Clock className="w-3.5 h-3.5 text-zinc-500" /> Sync Latency
                </span>
                <span className="text-[var(--text-primary)] font-bold">
                  {syncStatus?.duration_ms || syncStatus?.last_response_time_ms || 0} ms
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-zinc-500" /> Updated Tables
                </span>
                <span className="text-[var(--text-primary)] font-bold">
                  {syncStatus?.updated_tables ?? 0} tables
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-zinc-500" /> Updated Records
                </span>
                <span className="text-[var(--text-primary)] font-bold">
                  {syncStatus?.updated_records ?? 0} records
                </span>
              </div>
            </div>

            {syncStatus?.error && (
              <div className="p-2.5 rounded-lg border border-red-500/20 bg-red-500/5 text-[10px] text-red-400 font-mono break-all max-h-[80px] overflow-y-auto">
                Error: {syncStatus.error}
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
                  Syncing Database...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Sync Now
                </>
              )}
            </Button>
          </GlassCard>

          {/* Discord Mod Banner */}
          <GlassCard className="p-5 border border-[var(--border-default)] bg-[rgba(10,10,10,0.25)] relative overflow-hidden flex flex-col gap-3">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_90%,rgba(168,85,247,0.05),transparent_60%)] pointer-events-none" />

            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wide">
                Moderator Discord integration
              </h4>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Connect the admin panel with local chat bots to sync commands, mod assignments, and auto-banned phrases instantaneously.
              </p>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
}
