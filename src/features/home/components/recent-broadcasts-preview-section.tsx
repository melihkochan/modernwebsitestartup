"use client";

import Link from "next/link";
import { Tv, Clock, Users, Eye } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/analytics/section-title";
import { RevealOnScroll, StaggerChildren } from "@/components/motion";
import { useRecentBroadcasts } from "@/features/broadcasts/hooks/use-broadcasts";
import { tr } from "@/config/tr";

function BroadcastSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 overflow-hidden animate-pulse">
      <div className="aspect-video w-full rounded-lg bg-[var(--bg-overlay)]" />
      <div className="h-6 w-3/4 rounded bg-[var(--bg-overlay)]" />
      <div className="h-4 w-1/2 rounded bg-[var(--bg-overlay)]" />
      <div className="flex justify-between mt-2">
        <div className="h-4 w-16 rounded bg-[var(--bg-overlay)]" />
        <div className="h-4 w-16 rounded bg-[var(--bg-overlay)]" />
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (!seconds) return "Veri Yok";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) {
    return `${h} ${tr.analytics.hours} ${m} ${tr.analytics.minutes}`;
  }
  return `${m} ${tr.analytics.minutes}`;
}

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Tarih Yok";
  }
}

export function RecentBroadcastsPreviewSection() {
  const { data: broadcasts, isLoading } = useRecentBroadcasts(3);

  return (
    <Section id="broadcasts-preview" padding="lg" divided accentGlow>
      <Container>
        <RevealOnScroll animation="fade">
          <SectionTitle
            eyebrow={tr.home.recentBroadcasts}
            title="Geçmiş Yayın Arşivi"
            description="Son canlı yayınlarda neler oldu? Kaçırdığınız yayınların detaylı istatistikleri ve özetleri."
            align="center"
          />
        </RevealOnScroll>

        <div className="mt-12">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <BroadcastSkeleton key={i} />
              ))}
            </div>
          ) : !broadcasts || broadcasts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] p-12 text-center">
              <Tv className="h-12 w-12 text-[var(--text-tertiary)] mb-4" />
              <p className="text-[var(--text-secondary)] font-medium">
                {tr.common.noData}
              </p>
            </div>
          ) : (
            <StaggerChildren
              staggerDelay={0.1}
              initialDelay={0.1}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {broadcasts.map((broadcast) => {
                const durationText = formatDuration(broadcast.duration_seconds || 0);
                const dateText = formatDate(broadcast.started_at);

                return (
                  <div
                    key={broadcast.id}
                    className="group relative flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 overflow-hidden transition-all duration-300 hover:border-[var(--border-default)] hover:bg-[var(--bg-elevated)]"
                  >
                    {/* Hover Glow */}
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background:
                          "radial-gradient(ellipse at top left, rgba(139,92,246,0.06) 0%, transparent 60%)",
                      }}
                    />

                    {/* Thumbnail placeholder or real stored path */}
                    <div className="aspect-video w-full relative overflow-hidden rounded-lg bg-[var(--bg-overlay)] border border-[var(--border-subtle)]">
                      {broadcast.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={broadcast.thumbnail}
                          alt={broadcast.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Tv className="h-8 w-8 text-[var(--text-tertiary)]" />
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider">
                        #{broadcast.stream_number || 0}
                      </div>
                      <div className="absolute bottom-2 right-2 rounded bg-black/75 px-2 py-0.5 text-[10px] font-semibold text-white">
                        {dateText}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-col gap-1.5 z-10">
                      <span className="text-xs font-semibold text-[var(--violet-light)] tracking-wide uppercase">
                        {broadcast.category}
                      </span>
                      <h3 className="text-lg font-bold text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--violet-light)] transition-colors duration-200">
                        {broadcast.title}
                      </h3>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 border-t border-[var(--border-subtle)] pt-4 mt-auto text-xs text-[var(--text-secondary)] z-10">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Süre</span>
                        <div className="flex items-center gap-1 font-medium text-[var(--text-primary)]">
                          <Clock className="h-3 w-3 text-[var(--violet-light)]" />
                          <span>{durationText}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">En Yüksek</span>
                        <div className="flex items-center gap-1 font-medium text-[var(--text-primary)]">
                          <Users className="h-3 w-3 text-emerald-400" />
                          <span>{broadcast.peak_viewers?.toLocaleString() || "N/A"}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">İzlenme</span>
                        <div className="flex items-center gap-1 font-medium text-[var(--text-primary)]">
                          <Eye className="h-3 w-3 text-cyan-400" />
                          <span>{broadcast.total_views?.toLocaleString() || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </StaggerChildren>
          )}

          {/* View All Button */}
          <div className="mt-12 flex justify-center">
            <Link
              href="/analytics"
              className="button-primary inline-flex items-center gap-2"
            >
              <span>{tr.home.viewAllBroadcasts}</span>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
