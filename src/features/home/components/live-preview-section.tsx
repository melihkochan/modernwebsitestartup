"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ExternalLink, Gamepad2, Users } from "lucide-react";
import { LiveBadge } from "@/components/analytics";
import { GlassCard } from "@/components/ui/glass-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HoverGlow, RevealOnScroll, SlideUp } from "@/components/motion";
import { siteConfig } from "@/config/site";
import { formatNumber } from "@/lib/utils";
import { useStreamInfo } from "@/features/live/hooks/use-live";
import { useSiteAssets } from "@/features/media/hooks/use-site-assets";

export function LivePreviewSection() {
  const { data: streamInfo, isLoading } = useStreamInfo();
  const { data: siteAssets } = useSiteAssets();

  const isLive = streamInfo?.isLive ?? false;
  const viewerCount = streamInfo?.viewerCount ?? 0;
  const streamTitle = streamInfo?.streamTitle ?? "Güncel yayın bulunmuyor.";
  const currentGame = streamInfo?.currentGame ?? "Kategori bilgisi alınamadı.";
  const startedAt = streamInfo?.startedAt ?? "";

  const durationLabel = startedAt
    ? new Date(startedAt).toLocaleString("tr-TR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })
    : "—";
  const skeletonCls = "animate-pulse rounded bg-[var(--bg-overlay)]";

  const imageUrl = isLive ? (streamInfo?.thumbnailUrl || siteAssets?.defaultThumbnailUrl || null) : (siteAssets?.offlineCoverUrl || null);

  return (
    <Section padding="lg" divided>
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 items-center">

          <RevealOnScroll animation="scale" delay={0.1}>
            <HoverGlow color="var(--accent-primary)" size={360} opacity={0.08}>
              <div
                className="relative w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)]"
                style={{ aspectRatio: "16 / 9" }}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={streamTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    unoptimized={process.env.NODE_ENV === "development"}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-white/40">
                    <span className="text-sm font-semibold tracking-wider uppercase">Çevrimdışı</span>
                  </div>
                )}

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.a
                    href={siteConfig.kick.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Watch live stream on Kick"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    {/* Play triangle */}
                    <div
                      className="ml-1 h-0 w-0"
                      style={{
                        borderTop: "10px solid transparent",
                        borderBottom: "10px solid transparent",
                        borderLeft: "18px solid rgba(255,255,255,0.9)",
                      }}
                    />
                  </motion.a>
                </div>

                {/* Live badge overlay */}
                <div className="absolute top-4 left-4">
                  <LiveBadge isLive={isLive} variant="compact" />
                </div>

                {/* Stream title overlay */}
                <div
                  className="absolute inset-x-0 bottom-0 p-4"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                  }}
                >
                  {isLoading ? (
                    <div className={`h-4 w-3/4 ${skeletonCls}`} />
                  ) : (
                    <p className="text-sm font-semibold text-white line-clamp-1">
                      {streamTitle}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-white/60">{currentGame}</p>
                </div>
              </div>
            </HoverGlow>
          </RevealOnScroll>

          {/* ── Right: Stream details ─────────────────────────────── */}
          <div className="flex flex-col gap-8">
            <SlideUp delay={0.15}>
              <div className="flex flex-col gap-2">
                <span
                  className="label-eyebrow"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {isLive ? "Live Now" : "Currently Offline"}
                </span>
                <h2
                  className="text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Tune In
                </h2>
                {isLoading ? (
                  <div className={`h-4 w-full max-w-md ${skeletonCls}`} />
                ) : (
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-md">
                    {streamTitle}
                  </p>
                )}
              </div>
            </SlideUp>

            {/* Stats row */}
            <SlideUp delay={0.25}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    icon: Users,
                    label: "Viewers",
                    value: isLoading ? "—" : formatNumber(viewerCount),
                    accent: "var(--accent-primary)",
                  },
                  {
                    icon: Clock,
                    label: "Started",
                    value: isLoading ? "—" : durationLabel,
                    accent: "var(--text-tertiary)",
                  },
                  {
                    icon: Gamepad2,
                    label: "Game",
                    value: isLoading ? "—" : currentGame,
                    accent: "var(--text-tertiary)",
                  },
                ].map((stat) => (
                  <GlassCard key={stat.label} padding="sm" intensity="subtle">
                    <div className="flex flex-col gap-1.5">
                      <stat.icon
                        className="h-4 w-4"
                        style={{ color: stat.accent }}
                        aria-hidden
                      />
                      <span
                        className="text-lg font-bold text-[var(--text-primary)] tabular-nums"
                        style={{ fontFamily: "var(--font-outfit)" }}
                      >
                        {stat.value}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)]">
                        {stat.label}
                      </span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </SlideUp>

            {/* CTA */}
            <SlideUp delay={0.35}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={siteConfig.kick.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-primary-hover)] hover:shadow-[0_0_32px_var(--accent-glow)]"
                >
                  Watch on Kick
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
                {startedAt && (
                  <span className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] px-6 py-3 text-sm text-[var(--text-tertiary)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" aria-hidden />
                    Başlangıç: {durationLabel}
                  </span>
                )}
              </div>
            </SlideUp>
          </div>
        </div>
      </Container>
    </Section>
  );
}
