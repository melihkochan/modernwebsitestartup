"use client";

import { useAdminSuggestions, useApproveSuggestion, useDeleteSuggestion } from "../hooks/use-admin";
import { ThumbsUp, Check, Trash2, Calendar, Star, Tag, AlertCircle, RefreshCw, DollarSign, X } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

export function AdminSuggestionsControls() {
  const { data: suggestions, isLoading, isError } = useAdminSuggestions();
  const { mutate: approve, isPending: isApproving } = useApproveSuggestion();
  const { mutate: remove, isPending: isDeleting } = useDeleteSuggestion();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <RefreshCw className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Oyun önerileri yükleniyor...</span>
      </div>
    );
  }

  if (isError || !suggestions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <AlertCircle className="w-8 h-8 text-rose-500" />
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Öneriler alınırken hata oluştu.</span>
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
              ÖNERİ HAREKETLERİ
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Topluluk Oyun Önerileri
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            İzleyicilerinizin oyladığı oyun önerilerini Steam veritabanı eşleştirmesi ile inceleyin, onaylayın veya sıradan kaldırın.
          </p>
        </div>
      </GlassCard>

      {/* Suggestion Queue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {suggestions.map((item) => {
          const details = item.steamDetails;
          const statusColors =
            item.status === "approved"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : item.status === "rejected"
              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
              : "bg-zinc-800/40 text-[var(--text-secondary)] border-zinc-800";

          const statusLabels = {
            pending: "Beklemede",
            approved: "Onaylandı",
            rejected: "Reddedildi",
          };

          return (
            <GlassCard
              key={item.id}
              className="group border border-[var(--border-default)] rounded-2xl overflow-hidden flex flex-col h-[400px] hover:border-[var(--accent-primary)]/40 hover:shadow-[0_4px_30px_rgba(0,242,154,0.03)] transition-all duration-300 relative"
            >
              <div className="h-44 relative bg-zinc-950 overflow-hidden shrink-0">
                {(details?.headerImage || item.coverImageUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={details?.headerImage || item.coverImageUrl || ""}
                    alt={item.game}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center font-bold text-zinc-700">
                    Görsel Yok
                  </div>
                )}
                
              </div>
 
               {/* Main Info */}
               <div className="p-5 flex-1 flex flex-col justify-between relative overflow-hidden">
                 
                 {/* Standard view content */}
                 <div className="flex flex-col gap-2.5">
                   <div className="flex justify-between items-center gap-4">
                     <h3 className="text-sm font-extrabold text-[var(--text-primary)] leading-tight line-clamp-1 group-hover:text-[var(--accent-primary)] transition-colors" style={{ fontFamily: "var(--font-outfit)" }}>
                       {item.game}
                     </h3>
                     <Badge className={`border px-2 py-0.5 text-[9px] font-bold rounded-md shrink-0 ${statusColors}`}>
                       {statusLabels[item.status] || item.status}
                     </Badge>
                   </div>
 
                   {/* Metacritic & Release & Submitter stats */}
                   <div className="flex items-center gap-3.5 text-[10px] text-[var(--text-tertiary)] flex-wrap">
                     {details?.score && (
                       <span className="flex items-center gap-1 font-bold text-emerald-400">
                         <Star className="w-3.5 h-3.5 fill-current" />
                         Metacritic: {details.score}
                       </span>
                     )}
                     {details?.releaseDate && (
                       <span className="flex items-center gap-1 font-mono">
                         <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                         {details.releaseDate.split(" ").slice(-1)[0]}
                       </span>
                     )}
                     <span className="font-semibold text-zinc-400">
                       Öneren: @{item.submittedBy}
                     </span>
                   </div>

                  {/* Genres */}
                  {details?.genres && details.genres.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      {details.genres.slice(0, 2).map((g, idx) => (
                        <Badge key={idx} variant="outline" className="border-zinc-800 text-[10px] font-normal text-[var(--text-secondary)] bg-zinc-950/20">
                          {g}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submitter & Votes display */}
                <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3.5 mt-3">
                  <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1 font-bold">
                    <ThumbsUp className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    {item.votes.toLocaleString()} Oy
                  </span>

                  {item.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approve({ id: item.id, status: "approved" })}
                        disabled={isApproving || isDeleting}
                        className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-[var(--bg-base)] cursor-pointer transition-all disabled:opacity-50"
                        title="Öneriyi Onayla"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => approve({ id: item.id, status: "rejected" })}
                        disabled={isApproving || isDeleting}
                        className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white cursor-pointer transition-all disabled:opacity-50"
                        title="Öneriyi Reddet"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        disabled={isApproving || isDeleting}
                        className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer transition-all disabled:opacity-50"
                        title="Öneriyi Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Hover Reveal Card Overlay */}
                <div className="absolute inset-0 p-5 bg-[rgba(10,10,10,0.98)] border-t border-[var(--border-default)] flex flex-col justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-wider">Oyun Detayları</span>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed line-clamp-4">
                      {details?.shortDescription || item.adminNote || "Açıklama bulunamadı."}
                    </p>
                    {details?.releaseDate && (
                      <div className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        Çıkış Tarihi: {details.releaseDate}
                      </div>
                    )}
                    {details?.price && (
                      <div className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1.5 font-mono">
                        <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
                        Fiyat: {details.price}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                    <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-zinc-500" />
                      {details?.genres?.[0] || "PC / Konsol"}
                    </span>
                    {item.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            approve({ id: item.id, status: "approved" });
                          }}
                          disabled={isApproving || isDeleting}
                          className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-[var(--bg-base)] cursor-pointer transition-all disabled:opacity-50"
                          title="Öneriyi Onayla"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            approve({ id: item.id, status: "rejected" });
                          }}
                          disabled={isApproving || isDeleting}
                          className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white cursor-pointer transition-all disabled:opacity-50"
                          title="Öneriyi Reddet"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(item.id);
                          }}
                          disabled={isApproving || isDeleting}
                          className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer transition-all disabled:opacity-50"
                          title="Öneriyi Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-[var(--text-tertiary)] font-bold">
                        {item.votes.toLocaleString()} Oy
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
