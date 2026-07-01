"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Gamepad, Plus, ThumbsUp, Sparkles } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useSiteAssets } from "@/features/media/hooks/use-site-assets";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { SteamGamePicker, type SteamGame } from "@/components/ui/steam-game-picker";
import {
  useSuggestions,
  useSuggestGame,
  useUpvoteSuggestion,
} from "../hooks/use-community";
import { cn } from "@/lib/utils";
import { tr } from "@/config/tr";

export function CommunityPageClient() {
  const { data: siteAssets } = useSiteAssets();
  const { data: suggestions = [] } = useSuggestions();
  const { data: currentUser } = useCurrentUser();

  const suggestMutation = useSuggestGame();
  const upvoteMutation = useUpvoteSuggestion();

  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);
  const [selectedSteamGame, setSelectedSteamGame] = useState<SteamGame | null>(null);
  const [newGameDesc, setNewGameDesc] = useState("");

  const handleOpenSuggestModal = () => {
    setIsSubmittedSuccessfully(false);
    setSelectedSteamGame(null);
    setNewGameDesc("");
    setIsSuggestModalOpen(true);
  };

  const handleUpvote = (id: string) => {
    upvoteMutation.mutate(id);
  };

  const handleSuggestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedSteamGame) return;

    try {
      await suggestMutation.mutateAsync({
        game: selectedSteamGame.name,
        platform: selectedSteamGame.platform || "PC",
        description: newGameDesc || "Açıklama belirtilmedi.",
        submittedBy: currentUser.id,
        steamAppId: selectedSteamGame.steamAppId,
        coverImageUrl: selectedSteamGame.headerImage,
      });

      setIsSubmittedSuccessfully(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden bg-[var(--bg-base)]">
      {/* Background Spotlights */}
      <div className="absolute top-[10%] left-[-10%] w-[700px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,242,154,0.03),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[700px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.03),transparent_60%)] pointer-events-none z-0" />

      <Container className="relative z-10 flex flex-col gap-10">
        {/* Title and Avatar */}
        <div className="flex flex-col gap-3 max-w-xl">
          <Badge variant="outline" className="border-purple-400/25 text-purple-400 font-bold bg-purple-500/5 uppercase self-start">
            ZEHRARMY
          </Badge>
          <div className="flex items-center gap-4">
            {siteAssets?.avatarUrl && (
              <Image
                src={siteAssets.avatarUrl}
                alt="Avatar"
                width={48}
                height={48}
                className="rounded-full object-cover border border-[var(--border-default)]"
                unoptimized={process.env.NODE_ENV === "development"}
              />
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
              {tr.community.title}
            </h1>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Zehragn'ın yayınlarında oynamasını istediğiniz oyunları önerin ve en çok oylanan oyunların canlı yayına gelmesini sağlayın.
          </p>
        </div>

        {/* Dynamic Game Recommendations Grid */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Gamepad className="w-5 h-5 text-[var(--accent-primary)]" />
              <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                {tr.community.topRequestedGames}
              </h2>
            </div>
            <Button
              onClick={handleOpenSuggestModal}
              className="h-9 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {tr.community.suggestGame}
            </Button>
          </div>

          {suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-[var(--border-default)] rounded-2xl bg-[var(--bg-surface)]">
              <Gamepad className="h-12 w-12 text-[var(--text-tertiary)] mb-4" />
              <p className="text-[var(--text-secondary)] font-medium">Henüz onaylanmış oyun önerisi bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence initial={false}>
                {suggestions.map((item) => (
                  <motion.div
                    key={item.id}
                    layoutId={`card-${item.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <GlassCard className="p-5 border border-[var(--border-default)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)] transition-all duration-300 flex gap-4 items-stretch relative overflow-hidden group">
                      {item.coverImageUrl && (
                        <div className="w-20 h-28 relative bg-zinc-950 rounded-lg overflow-hidden shrink-0 shadow-[var(--shadow-sm)] border border-[var(--border-default)]">
                          <Image
                            src={item.coverImageUrl}
                            alt={item.game}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-[var(--text-primary)] truncate max-w-[150px]">
                              {item.game}
                            </h3>
                            <Badge className="bg-[var(--bg-overlay)] text-[var(--text-secondary)] border border-[var(--border-default)] text-[8px] font-bold">
                              {item.platform}
                            </Badge>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex flex-col gap-0.5 mt-2">
                          <span className="text-[9px] text-[var(--text-tertiary)] uppercase font-semibold">Kaynak</span>
                          <span className="text-xs font-bold text-[var(--accent-primary)]">Topluluk</span>
                        </div>
                      </div>

                      {/* Vote container */}
                      <div className="flex items-center">
                        <button
                          onClick={() => handleUpvote(item.id)}
                          className={cn(
                            "flex flex-col items-center justify-center min-w-[60px] py-2 px-1 rounded-lg border transition-all cursor-pointer shadow-[var(--shadow-sm)]",
                            item.isUpvoted
                              ? "bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 text-[var(--accent-primary)] scale-[1.03]"
                              : "bg-[var(--bg-overlay)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                          )}
                        >
                          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-bold tracking-wider mb-1">Oy</span>
                          <ThumbsUp className={cn("w-3.5 h-3.5 mb-1 transition-transform", item.isUpvoted && "scale-110 fill-current")} />
                          <span className="text-xs font-mono font-bold text-[var(--text-primary)]">{item.votes}</span>
                        </button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </Container>

      <Dialog
        open={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
        title={isSubmittedSuccessfully ? "" : "Oyun Önerisinde Bulun"}
        size="md"
      >
        {isSubmittedSuccessfully ? (
          <div className="flex flex-col items-center justify-center p-6 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 flex items-center justify-center text-[var(--accent-primary)] animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Öneriniz Alındı!
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
                Oyun öneriniz başarıyla kaydedildi. Admin panelinde onaylandıktan sonra topluluk listesinde ve oylamada yerini alacaktır. Katkınız için teşekkürler!
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setIsSuggestModalOpen(false)}
              className="h-9 px-6 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none cursor-pointer"
            >
              Kapat
            </Button>
          </div>
        ) : !currentUser ? (
          <div className="flex flex-col items-center justify-center p-6 text-center gap-4">
            <p className="text-xs text-[var(--text-secondary)] font-semibold">
              Oyun önerisinde bulunmak için önce sisteme giriş yapmalısınız.
            </p>
            <Button
              type="button"
              onClick={() => setIsSuggestModalOpen(false)}
              className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none cursor-pointer"
            >
              Tamam
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSuggestSubmit} className="flex flex-col gap-4 pt-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Oyun Seçin</label>
              <SteamGamePicker
                value={selectedSteamGame}
                onSelect={setSelectedSteamGame}
                placeholder="Steam'de oyun arayın..."
              />
            </div>
            
            {selectedSteamGame && (
              <div className="p-3 rounded-lg bg-[var(--bg-overlay)] border border-[var(--border-default)] flex items-center gap-3 animate-fade-in">
                <div className="w-16 h-8 relative bg-black/40 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={selectedSteamGame.headerImage}
                    alt={selectedSteamGame.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">{selectedSteamGame.name}</h4>
                  <p className="text-[9px] text-[var(--text-tertiary)] uppercase font-bold tracking-wider">{selectedSteamGame.platform}</p>
                </div>
              </div>
            )}

            <Textarea
              label="Neden Zehragn bu oyunu oynamalı?"
              placeholder="Zorluk seviyesi, eğlenceli yönleri veya oyun hakkında detaylar..."
              value={newGameDesc}
              onChange={(e) => setNewGameDesc(e.target.value)}
              required
              className="min-h-[80px] text-xs resize-none"
            />
            
            <div className="flex justify-end gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSuggestModalOpen(false)}
                className="h-9 px-4 text-xs font-semibold cursor-pointer"
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={!selectedSteamGame}
                className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Öneriyi Gönder
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
