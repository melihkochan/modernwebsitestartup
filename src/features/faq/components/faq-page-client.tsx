"use client";

import {
  HelpCircle,
  Globe,
  Radio,
  Cpu,
  Users,
  Search,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Accordion } from "@/components/ui/accordion";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePublicSiteSettings } from "@/hooks/use-site-settings";
import { cn } from "@/lib/utils";
import { useFaqItems } from "../hooks/use-faq";

const FAQ_CATEGORIES = [
  { id: "all", label: "Tüm Sorular", icon: HelpCircle },
  { id: "general", label: "Genel", icon: Globe },
  { id: "broadcast", label: "Yayıncılık", icon: Radio },
  { id: "setup", label: "Ekipman & Setup", icon: Cpu },
  { id: "community", label: "Topluluk & Discord", icon: Users },
] as const;

export function FaqPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { data: settings } = usePublicSiteSettings();

  const { data: faqs = [], isLoading } = useFaqItems(activeCategory);

  const discordUrl = settings?.social?.discordUrl || "https://discord.gg/zehragn";

  const filteredFaqs = faqs.filter((faq) => {
    const searchMatches =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return searchMatches;
  });

  // Map to AccordionItemData format
  const accordionItems = filteredFaqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden bg-[var(--bg-base)]">
      {/* Background visual highlight */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-[50%] w-[900px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(0,242,154,0.04),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-15%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.02),transparent_70%)] pointer-events-none z-0" />

      <Container className="relative z-10 flex flex-col gap-12 max-w-4xl">

        {/* Title area */}
        <div className="flex flex-col gap-3">
          <Badge variant="outline" className="border-emerald-400/25 text-emerald-400 font-bold bg-emerald-500/5 uppercase self-start">
            BİLGİ BANKASI
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Zehragn&apos;ın yayın takvimi, donanım özellikleri, ekipmanları ve topluluk etkinlikleri hakkında merak ettiğiniz tüm soruların cevapları.
          </p>
        </div>

        {/* Filter Bar & Search Panel */}
        <div className="flex flex-col gap-6 bg-[rgba(10,10,10,0.35)] p-5 rounded-2xl border border-[var(--border-default)] shadow-[var(--shadow-sm)]">
          <div className="w-full">
            <SearchInput
              placeholder="Anahtar kelime ile arayın (Örn: Valorant, setup, Discord)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>

          <div className="h-px bg-[var(--border-subtle)]" />

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {FAQ_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer border",
                    activeCategory === cat.id
                      ? "bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 text-[var(--accent-primary)] font-bold"
                      : "bg-[var(--bg-overlay)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                  )}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion output */}
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
          </div>
        ) : accordionItems.length > 0 ? (
          <div className="flex flex-col gap-4">
            <Accordion items={accordionItems} multiple={false} />
          </div>
        ) : (
          /* Empty state */
          <GlassCard className="p-12 text-center border border-[var(--border-default)] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Search className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Aramanızla eşleşen soru bulunamadı
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
                Farklı anahtar kelimeler aramayı deneyebilir, kategori filtrelerini değiştirebilir veya resmî Discord sunucumuza gelerek sorabilirsiniz.
              </p>
            </div>
            <a href={discordUrl} target="_blank" rel="noopener noreferrer" className="mt-2">
              <Button className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none cursor-pointer flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                Discord Sunucumuza Katılın
              </Button>
            </a>
          </GlassCard>
        )}

      </Container>
    </div>
  );
}
