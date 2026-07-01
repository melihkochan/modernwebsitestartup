"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Layers,
  Cpu,
  Keyboard,
  Mic,
  Bookmark,
  Info,
  Package,
} from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSetupProducts } from "../hooks/use-setup";
import { getStorageUrl } from "@/lib/supabase/storage";
import { tr } from "@/config/tr";
import { usePublicSiteSettings } from "@/hooks/use-site-settings";

const SETUP_CATEGORIES = [
  { id: "all", label: "Tüm Ekipmanlar", icon: Layers },
  { id: "pc", label: "PC Donanım", icon: Cpu },
  { id: "peripherals", label: "Ekipmanlar", icon: Keyboard },
  { id: "audio", label: "Ses & Yayın", icon: Mic },
  { id: "comfort", label: "Konfor", icon: Bookmark },
] as const;

export function SetupPageClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedProductIds, setExpandedProductIds] = useState<Record<string, boolean>>({});
  const { data: settings } = usePublicSiteSettings();

  const { data: products = [], isLoading } = useSetupProducts(activeCategory);
  
  const streamerName = settings?.branding?.streamerName || "Zehragn";

  const toggleSpecs = (id: string) => {
    setExpandedProductIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden bg-[var(--bg-base)]">
      {/* Background spotlights */}
      <div className="absolute top-[-20%] left-[50%] -translate-x-[50%] w-[1000px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(0,242,154,0.04),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.02),transparent_70%)] pointer-events-none z-0" />

      <Container className="relative z-10 flex flex-col gap-10">
        
        {/* Gelir Ortaklığı Bilgilendirmesi */}
        <GlassCard className="p-4 border border-[var(--border-default)] bg-[rgba(10,10,10,0.35)] rounded-2xl flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            <strong>Gelir Ortaklığı Açıklaması:</strong> Bu sayfadaki bazı bağlantılar gelir ortaklığı linkleridir. Bu linkler üzerinden yapılan alışverişler yayıncıya ek bir ücret yansımaksızın ekipman desteği sağlar.
          </p>
        </GlassCard>

        {/* Title area */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-xl">
            <Badge variant="outline" className="border-blue-400/25 text-blue-400 font-bold bg-blue-500/5 uppercase self-start">
              YAYIN ALANI (SETUP)
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
              {tr.setup.title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {streamerName}&apos;ın yayınlarında ve oyunlarda kullandığı tüm donanımları, profesyonel ekipmanları ve konfor ürünlerini inceleyin.
            </p>
          </div>

          {/* Categories select tabs */}
          <div className="flex flex-wrap gap-2 bg-[var(--bg-overlay)] p-1 rounded-2xl border border-[var(--border-default)] shadow-[var(--shadow-sm)] self-start lg:self-auto">
            {SETUP_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer",
                    activeCategory === cat.id
                      ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-[var(--shadow-sm)] border border-[var(--border-subtle)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-[var(--bg-overlay)]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-[var(--border-default)] rounded-2xl bg-[var(--bg-surface)]">
            <Package className="h-12 w-12 text-[var(--text-tertiary)] mb-4" />
            <p className="text-[var(--text-secondary)] font-medium">Bu kategoride henüz ekipman bulunmamaktadır.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {products.map((prod) => {
                const isExpanded = !!expandedProductIds[prod.id];
                const imageUrl = prod.storage_path
                  ? getStorageUrl(prod.storage_path.startsWith("setup/") ? prod.storage_path : `setup/${prod.storage_path}`)
                  : "";

                // specs logic: specifications flat object to array
                const specs = prod.specifications && typeof prod.specifications === "object"
                  ? Object.entries(prod.specifications as Record<string, string>)
                  : [];

                return (
                  <motion.div
                    key={prod.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GlassCard
                      className={cn(
                        "flex flex-col h-full border overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] transition-all duration-300 relative group",
                        prod.is_featured
                          ? "border-[var(--accent-primary)]/40 shadow-[0_0_24px_rgba(0,242,154,0.05)] bg-[rgba(10,10,10,0.6)]"
                          : "border-[var(--border-default)] hover:border-[var(--border-strong)] bg-[rgba(10,10,10,0.4)]"
                      )}
                    >
                      {/* Product Image top box */}
                      <div className="h-[220px] w-full relative flex items-center justify-center overflow-hidden bg-black/40 border-b border-[var(--border-subtle)]">
                        {prod.storage_path ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl}
                            alt={prod.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/10 flex items-center justify-center text-white/50 group-hover:scale-105 group-hover:text-white transition-all">
                            <Package className="w-8 h-8" />
                          </div>
                        )}

                        {prod.is_featured && (
                          <span className="absolute top-4 right-4 bg-[var(--accent-primary)] text-[var(--bg-base)] text-[9px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-full uppercase shadow-md select-none animate-pulse">
                            ÖNERİLEN
                          </span>
                        )}

                        {prod.availability && (
                          <span className={cn(
                            "absolute top-4 left-4 text-[9px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-full uppercase shadow-md select-none",
                            prod.availability === "stokta" ? "bg-emerald-500 text-black" :
                            prod.availability === "stokta_yok" ? "bg-rose-500 text-white" :
                            "bg-amber-500 text-black"
                          )}>
                            {prod.availability === "stokta" ? "Stokta" :
                             prod.availability === "stokta_yok" ? "Stokta Yok" : "Yakında"}
                          </span>
                        )}

                        <div className="absolute bottom-4 left-4 z-10">
                          <Badge className="bg-[rgba(10,10,10,0.6)] backdrop-blur-md text-[var(--text-secondary)] text-[9px] font-bold border border-white/5 px-2 py-0.5 rounded">
                            {prod.brand || "Bilinmeyen Marka"}
                          </Badge>
                        </div>
                      </div>

                      {/* Card Content details */}
                      <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent-primary)] transition-colors" style={{ fontFamily: "var(--font-outfit)" }}>
                              {prod.title}
                            </h3>
                            {prod.price && (
                              <span className="text-sm font-mono font-bold text-[var(--violet-light)] shrink-0">
                                {prod.price.toLocaleString("tr-TR")} {prod.currency || "TRY"}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                            {prod.description || "Açıklama girilmemiş."}
                          </p>
                        </div>

                        {/* Specifications list */}
                        <div className="flex flex-col gap-3">
                          {specs.length > 0 && (
                            <>
                              <button
                                onClick={() => toggleSpecs(prod.id)}
                                className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1.5 border-b border-dashed border-[var(--border-default)] cursor-pointer"
                              >
                                <span>Teknik Detaylar</span>
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-[var(--text-tertiary)]" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
                                )}
                              </button>

                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 py-2.5 bg-[rgba(10,10,10,0.2)] px-3 rounded-lg border border-[var(--border-subtle)] text-[11px]">
                                      {specs.map(([name, value], idx) => (
                                        <div key={idx} className="flex flex-col">
                                          <span className="text-[var(--text-tertiary)] font-medium">
                                            {name}
                                          </span>
                                          <span className="text-[var(--text-primary)] font-bold mt-0.5">
                                            {value}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          )}

                          {/* Purchase or Affiliate Links */}
                          <div className="flex items-center justify-between gap-4 mt-3 border-t border-[var(--border-subtle)] pt-4">
                            <span className="text-[10px] text-[var(--text-tertiary)] font-medium italic">
                              {prod.affiliate_url ? "Ortaklık Linki" : "Satın Alma Linki"}
                            </span>
                            <div className="flex items-center gap-2">
                              {prod.purchase_url && (
                                <a
                                  href={prod.purchase_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button variant="outline" className="h-8 text-xs font-semibold px-3 flex items-center gap-1 cursor-pointer">
                                    Normal Link
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </a>
                              )}
                              {prod.affiliate_url && (
                                <a
                                  href={prod.affiliate_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button className="h-8 text-xs font-bold bg-[var(--violet)] hover:bg-[var(--violet-light)] border-none text-white px-3 flex items-center gap-1 cursor-pointer">
                                    Satın Al
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </Container>
    </div>
  );
}
