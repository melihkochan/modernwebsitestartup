"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Clock,
  MessageSquare,
  Radio,
  Gamepad2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { useSiteAssets } from "@/features/media/hooks/use-site-assets";
import { useStreamInfo } from "../hooks/use-live";
import { useSuggestions } from "@/features/community/hooks/use-community";

export function LivePageClient() {
  const { data: streamInfo, isLoading: isStreamLoading } = useStreamInfo();
  const { data: siteAssets } = useSiteAssets();
  const { data: suggestions = [], isLoading: suggestionsLoading } = useSuggestions();

  const isLive = streamInfo?.isLive ?? false;
  const viewerCount = streamInfo?.viewerCount ?? 0;

  const [uptime, setUptime] = useState<string>("00:00:00");

  useEffect(() => {
    if (!isLive || !streamInfo?.startedAt) {
      return;
    }

    const calculateUptime = () => {
      const parsedDate = Date.parse(streamInfo.startedAt!);
      if (isNaN(parsedDate)) {
        return streamInfo.startedAt || "Bilinmiyor";
      }
      const diff = Math.max(0, Date.now() - parsedDate);
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      return `${hours.toString().padStart(2, "0")}sa ${minutes.toString().padStart(2, "0")}dk ${seconds.toString().padStart(2, "0")}sn`;
    };

    const timer = setInterval(() => {
      setUptime(calculateUptime());
    }, 1000);

    const initialTimeout = setTimeout(() => {
      setUptime(calculateUptime());
    }, 0);

    return () => {
      clearInterval(timer);
      clearTimeout(initialTimeout);
      setUptime("00:00:00");
    };
  }, [isLive, streamInfo?.startedAt]);

  if (isStreamLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <RefreshCw className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Kanal verileri yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden bg-[var(--bg-base)]">
      {/* Background radial highlight glow */}
      <div className="absolute top-[-20%] left-[50%] -translate-x-[50%] w-[1000px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(0,242,154,0.06),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.02),transparent_70%)] pointer-events-none z-0" />

      <Container className="relative z-10">
        <AnimatePresence mode="wait">
          {isLive ? (
            /* =========================================================================
               ONLINE STATE (STREAM ACTIVE)
               ========================================================================= */
            <motion.div
              key="online-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Player & Metadata (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Visual Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--live-red)] opacity-75 animate-ping" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--live-red)]" />
                    </span>
                    <Badge variant="outline" className="border-[var(--live-red)]/30 text-[var(--live-red)] font-bold bg-[var(--live-red-glow)] animate-pulse">
                      CANLI YAYIN
                    </Badge>
                    <span className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                      <Gamepad2 className="w-4 h-4 text-[var(--accent-primary)]" />
                      Oynuyor: <span className="text-[var(--text-primary)] font-semibold">{streamInfo?.currentGame || "Bilinmiyor"}</span>
                    </span>
                  </div>

                  <a
                    href={siteConfig.kick.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] group transition-colors"
                  >
                    {"Kick.com'da İzle"}
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>

                {/* Real Embed Player Container */}
                <div className="relative aspect-video rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-default)] bg-[black] shadow-[var(--shadow-lg)]">
                  <iframe
                    src={`https://player.kick.com/${siteConfig.kick.channelSlug}`}
                    className="w-full h-full border-none"
                    allowFullScreen
                  />
                </div>

                {/* Metadata Details Card */}
                <GlassCard className="p-6 border border-[var(--border-default)]">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                        {streamInfo?.streamTitle || "Başlıksız Yayın"}
                      </h1>
                    </div>

                    <div className="h-px bg-[var(--border-subtle)]" />

                    {/* Stream info list */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
                          Mevcut Oyun
                        </span>
                        <span className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5 mt-1">
                          <Gamepad2 className="w-4 h-4 text-[var(--accent-primary)]" />
                          {streamInfo?.currentGame || "Bilinmiyor"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
                          Yayın Süresi
                        </span>
                        <span className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5 mt-1">
                          <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                          {uptime}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
                          İzleyici Sayısı
                        </span>
                        <span className="text-sm font-bold text-[var(--live-red)] flex items-center gap-1.5 mt-1">
                          <Users className="w-4 h-4" />
                          {viewerCount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
                          Yayıncı Kanalı
                        </span>
                        <span className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 mt-1 font-mono">
                          {siteAssets?.avatarUrl ? (
                            <Image
                              src={siteAssets.avatarUrl}
                              alt="Avatar"
                              width={20}
                              height={20}
                              className="rounded-full object-cover"
                              unoptimized={process.env.NODE_ENV === "development"}
                            />
                          ) : siteAssets?.avatarPlaceholderUrl ? (
                            <Image
                              src={siteAssets.avatarPlaceholderUrl}
                              alt="Avatar Placeholder"
                              width={20}
                              height={20}
                              className="rounded-full object-cover"
                              unoptimized={process.env.NODE_ENV === "development"}
                            />
                          ) : null}
                          @{siteConfig.kick.channelSlug}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Right Column: Chat Feed (4 cols) */}
              <div className="lg:col-span-4 flex flex-col h-[600px] lg:h-auto">
                <GlassCard className="flex flex-col h-full border border-[var(--border-default)] overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-[var(--border-subtle)] bg-[rgba(10,10,10,0.3)] flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <MessageSquare className="w-4.5 h-4.5 text-[var(--accent-primary)]" />
                      Canlı Yayın Sohbeti
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[rgba(10,10,10,0.1)] gap-3">
                    <MessageSquare className="w-8 h-8 text-zinc-600 animate-pulse" />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-[var(--text-secondary)]">Gerçek sohbet entegrasyonu henüz tamamlanmadı.</span>
                      <span className="text-[10px] text-[var(--text-tertiary)] max-w-[220px] mx-auto">
                        Gelecekteki Kick WebSocket entegrasyonu için şablon soket yapısı hazırlandı.
                      </span>
                    </div>
                  </div>

                  {/* Chat Input Placeholder */}
                  <div className="p-4 border-t border-[var(--border-subtle)] bg-[rgba(10,10,10,0.3)] flex gap-2">
                    <input
                      disabled
                      placeholder="Sohbet etmek için giriş yapın..."
                      type="text"
                      className="flex-1 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-[var(--radius-md)] px-3 py-2 text-xs text-[var(--text-tertiary)] focus:outline-none cursor-not-allowed"
                    />
                    <Button disabled className="h-8 text-xs font-semibold px-3 cursor-not-allowed bg-[var(--border-default)] border-none">
                      Gönder
                    </Button>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          ) : (
            /* =========================================================================
               OFFLINE STATE
               ========================================================================= */
            <motion.div
              key="offline-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-12"
            >
              {/* Offline Hero & Banner */}
              <GlassCard className="relative overflow-hidden p-8 border border-[var(--border-default)] flex flex-col md:flex-row md:items-center justify-between gap-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-md)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.03),transparent_50%)] pointer-events-none" />

                <div className="flex flex-col gap-4 max-w-xl relative z-10">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-[var(--border-default)] text-[var(--text-secondary)] font-bold bg-[var(--bg-overlay)]">
                      ÇEVRİMDIŞI
                    </Badge>
                    <span className="text-xs text-[var(--text-tertiary)] font-semibold tracking-wider uppercase">
                      Yayıncı şu anda çevrimdışı
                    </span>
                  </div>

                  <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                    Bir Sonraki Yayını Kaçırmayın!
                  </h1>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Zehragn şu anda canlı yayında değil. Ancak haftalık yayın takvimini inceleyebilir, oyun önerisinde bulunabilir veya Discord topluluğumuza katılabilirsiniz.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <a href={siteConfig.social.discord} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="h-9 px-4 text-xs font-semibold hover:bg-[var(--accent-primary)]/10 hover:border-[var(--accent-primary)]/30 hover:text-[var(--accent-primary)] cursor-pointer">
                        Discord Topluluğuna Katıl
                      </Button>
                    </a>
                    <a href={siteConfig.kick.channelUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none cursor-pointer">
                        {"Kick'te Takip Et"}
                      </Button>
                    </a>
                  </div>
                </div>

                {siteAssets?.avatarUrl ? (
                  <div className="hidden md:flex shrink-0 w-32 h-32 rounded-full overflow-hidden border border-[var(--border-default)] shadow-[var(--shadow-md)]">
                    <Image
                      src={siteAssets.avatarUrl}
                      alt="Broadcaster Avatar"
                      width={128}
                      height={128}
                      className="object-cover"
                      unoptimized={process.env.NODE_ENV === "development"}
                    />
                  </div>
                ) : (
                  <div className="hidden md:flex items-center justify-center shrink-0 w-32 h-32 rounded-full bg-gradient-to-tr from-[var(--accent-primary)]/10 to-indigo-500/10 border border-[var(--border-default)]">
                    <Radio className="w-12 h-12 text-[var(--accent-primary)]" />
                  </div>
                )}
              </GlassCard>


            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 flex flex-col gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center">
              <Gamepad2 className="w-4.5 h-4.5 text-[var(--accent-primary)]" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
              Topluluğun Son Oyun Önerileri
            </h2>
          </div>

          {suggestionsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse h-[140px] rounded-xl bg-[var(--bg-overlay)]" />
              ))}
            </div>
          ) : suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500 text-xs border border-dashed border-[var(--border-default)] rounded-xl bg-[rgba(10,10,10,0.1)] gap-2">
              <Gamepad2 className="w-8 h-8 text-zinc-600" />
              <span className="font-semibold text-[var(--text-secondary)]">Henüz oyun önerisi bulunmuyor.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestions.slice(0, 4).map((sug) => (
                <GlassCard
                  key={sug.id}
                  className="p-5 border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-[var(--accent-primary)] group-hover:to-purple-500 transition-colors" />

                  <div className="flex flex-col gap-3">
                    <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
                      {sug.platform}
                    </span>
                    <div className="flex flex-col">
                      <h3 className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">
                        {sug.game}
                      </h3>
                      <p className="text-[10px] text-[var(--text-secondary)] line-clamp-2 mt-1 leading-relaxed">
                        {sug.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-tertiary)] pt-3 border-t border-[var(--border-subtle)] mt-3">
                    <span className="truncate max-w-[90px]">Öneren: {sug.submittedBy}</span>
                    <span className="flex items-center gap-1 text-[var(--accent-primary)]">
                      <Users className="w-3.5 h-3.5" />
                      {sug.votes} oy
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
