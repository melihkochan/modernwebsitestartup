"use client";

import { useState } from "react";
import { Tv, Search, Clock, Users, Eye, ArrowLeft, ArrowRight, Play } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { useBroadcasts } from "../hooks/use-broadcasts";
import { cn } from "@/lib/utils";
import { tr } from "@/config/tr";

function formatDuration(seconds: number): string {
  if (!seconds) return "0 dk";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) {
    return `${h} sa ${m} dk`;
  }
  return `${m} dk`;
}

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
}

function formatLanguage(lang: string | null | undefined): string {
  if (!lang) return "Türkçe";
  const l = lang.toLowerCase();
  if (l === "tr") return "Türkçe";
  if (l === "en") return "İngilizce";
  return lang.toUpperCase();
}

function formatStatus(status: string | null | undefined): { label: string; className: string } {
  const s = status || "ended";
  switch (s) {
    case "scheduled":
      return { label: "Planlandı", className: "bg-blue-500/10 text-blue-400 border border-blue-500/20" };
    case "live":
      return { label: "Canlı", className: "bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse" };
    case "ended":
      return { label: "Bitti", className: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20" };
    case "cancelled":
      return { label: "İptal Edildi", className: "bg-orange-500/10 text-orange-400 border border-orange-500/20" };
    default:
      return { label: s.toUpperCase(), className: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20" };
  }
}

export function BroadcastsPageClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useBroadcasts({
    search: search || undefined,
    page,
    pageSize,
  });

  const totalPages = data ? Math.ceil(data.total / pageSize) : 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page
  };

  return (
    <Section id="broadcasts-archive" padding="lg" accentGlow>
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
              {tr.analytics.title}
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Zehragn'ın gerçekleştirdiği tüm yayınların veritabanı kayıtları ve istatistikleri.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Yayın veya kategori ara..."
              value={search}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-2 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none focus:border-[var(--violet)] focus:ring-1 focus:ring-[var(--violet)]"
            />
          </div>
        </div>

        {/* Table/List content */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 w-full animate-pulse rounded-lg bg-[var(--bg-overlay)]" />
              ))}
            </div>
          ) : !data || data.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] p-16 text-center">
              <Tv className="h-12 w-12 text-[var(--text-tertiary)] mb-4" />
              <p className="text-[var(--text-secondary)] font-medium">
                {tr.common.noData}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 text-[10px] uppercase font-bold tracking-wider text-[var(--text-tertiary)]">
                    <th className="py-4 px-6 text-center w-16">No</th>
                    <th className="py-4 px-6">{tr.analytics.date}</th>
                    <th className="py-4 px-6">{tr.analytics.broadcastTitle}</th>
                    <th className="py-4 px-6">{tr.analytics.category}</th>
                    <th className="py-4 px-6 text-center">Dil</th>
                    <th className="py-4 px-6 text-center">{tr.analytics.duration}</th>
                    <th className="py-4 px-6 text-center">{tr.analytics.avgViewers}</th>
                    <th className="py-4 px-6 text-center">{tr.analytics.peakViewers}</th>
                    <th className="py-4 px-6 text-center">{tr.analytics.totalViews}</th>
                    <th className="py-4 px-6 text-center">Yayın Durumu</th>
                    <th className="py-4 px-6 text-center">VOD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-sm text-[var(--text-secondary)]">
                  {data.data.map((broadcast) => (
                    <tr
                      key={broadcast.id}
                      className="hover:bg-[var(--bg-elevated)]/40 transition-colors duration-150 group"
                    >
                      <td className="py-4 px-6 text-center font-semibold text-[var(--text-tertiary)]">
                        #{broadcast.stream_number || 0}
                      </td>
                      <td className="py-4 px-6 font-medium text-[var(--text-primary)]">
                        {formatDate(broadcast.started_at)}
                      </td>
                      <td className="py-4 px-6 font-bold text-[var(--text-primary)] max-w-xs truncate group-hover:text-[var(--violet-light)] transition-colors">
                        {broadcast.title}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center rounded-full bg-[var(--bg-overlay)] px-2.5 py-0.5 text-xs font-semibold text-[var(--violet-light)]">
                          {broadcast.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-xs font-semibold text-[var(--text-secondary)]">
                          {formatLanguage(broadcast.language)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center gap-1.5 justify-center font-medium">
                          <Clock className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
                          <span>{formatDuration(broadcast.duration_seconds || 0)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-semibold text-[var(--text-primary)]">
                        {broadcast.average_viewers?.toLocaleString() || "-"}
                      </td>
                      <td className="py-4 px-6 text-center font-semibold text-[var(--text-primary)]">
                        <div className="inline-flex items-center gap-1 justify-center text-emerald-400">
                          <Users className="h-3.5 w-3.5" />
                          <span>{broadcast.peak_viewers?.toLocaleString() || "-"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-semibold text-[var(--text-primary)]">
                        <div className="inline-flex items-center gap-1 justify-center text-cyan-400">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{broadcast.total_views?.toLocaleString() || "-"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {(() => {
                          const statusDetails = formatStatus(broadcast.status);
                          return (
                            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", statusDetails.className)}>
                              {statusDetails.label}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {broadcast.vod_url ? (
                          <a
                            href={broadcast.vod_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--violet)] text-white hover:bg-[var(--violet-light)] transition-all duration-200"
                            title="Yayın Kaydını İzle"
                          >
                            <Play className="h-3 w-3 fill-current ml-0.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-[var(--text-tertiary)] font-normal">Kayıt Yok</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <span className="text-xs text-[var(--text-tertiary)]">
                Toplam <strong>{data?.total}</strong> yayından <strong>{(page - 1) * pageSize + 1} - {Math.min(page * pageSize, data?.total || 0)}</strong> arası gösteriliyor
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--border-default)] disabled:opacity-50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="text-xs text-[var(--text-primary)] font-semibold">
                  {page} / {totalPages}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--border-default)] disabled:opacity-50 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
