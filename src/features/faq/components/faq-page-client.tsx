"use client";

import {
  HelpCircle,
  Globe,
  Radio,
  Cpu,
  Users,
  Search,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Accordion } from "@/components/ui/accordion";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Mock FAQ items categorized
// ---------------------------------------------------------------------------

interface FAQItem {
  id: string;
  category: "general" | "broadcast" | "setup" | "community";
  question: string;
  answer: string;
}

const FAQ_CATEGORIES = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "general", label: "General", icon: Globe },
  { id: "broadcast", label: "Broadcast", icon: Radio },
  { id: "setup", label: "Setup & Gear", icon: Cpu },
  { id: "community", label: "Community & Discord", icon: Users },
] as const;

const MOCK_FAQS: FAQItem[] = [
  {
    id: "faq-g1",
    category: "general",
    question: "When does Zehragn stream?",
    answer: "Streams typically go live on Tuesday, Thursday, and Friday evenings starting at 20:00 (UTC+3). Weekend streams are more spontaneous — follow on Kick and enable notifications so you never miss a live stream.",
  },
  {
    id: "faq-g2",
    category: "general",
    question: "How did Zehragn get into streaming?",
    answer: "Zehragn started streaming in June 2021 as a hobby after playing competitive tactical games. The channel quickly shifted into a full-time passion as the ZehrArmy community grew rapidly.",
  },
  {
    id: "faq-b1",
    category: "broadcast",
    question: "What games are streamed?",
    answer: "The primary game is Valorant at a Radiant level. Occasionally, CS2, Apex Legends, and single-player narrative titles (horror/variety) are featured. The community votes on new game suggestions every two weeks.",
  },
  {
    id: "faq-b2",
    category: "broadcast",
    question: "What are the chat moderation guidelines?",
    answer: "We prioritize maintaining a welcoming and supportive environment. Basic rules: Be respectful, avoid backseating unless asked, no discrimination/harassment, and do not spam links. Our moderator team strictly enforces these guidelines.",
  },
  {
    id: "faq-s1",
    category: "setup",
    question: "What PC hardware specifications are utilized?",
    answer: "The streaming setup runs a dual-PC configuration. The gaming PC runs an AMD Ryzen 7950X, NVIDIA RTX 4090 GPU, and 64GB DDR5 RAM. The streaming PC is equipped with a Ryzen 7700X and an RTX 4070 for static AV1 encoding.",
  },
  {
    id: "faq-s2",
    category: "setup",
    question: "What monitor and peripherals are in use?",
    answer: "We use an ASUS ROG Swift PG27AQN (360Hz, 1440p) as the primary gaming display, paired with a Logitech G Pro X Superlight 2 mouse and a Wooting 60HE analog keyboard.",
  },
  {
    id: "faq-c1",
    category: "community",
    question: "How can I suggest games or stream ideas?",
    answer: "You can submit game ideas directly through the Community Hub page of this website. Our system allows you to submit games and upvote recommendations from others. The most upvoted suggestion is featured monthly.",
  },
  {
    id: "faq-c2",
    category: "community",
    question: "Is there a Discord server?",
    answer: "Yes! The official ZehrArmy Discord server is home to over 40,000 members. You can join via discord.gg/zehragn to interact with moderators, participate in events, and receive announcement alerts.",
  },
];

export function FaqPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredFaqs = MOCK_FAQS.filter((faq) => {
    // Category match
    const categoryMatches = activeCategory === "all" ? true : faq.category === activeCategory;
    // Search query match
    const searchMatches =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatches && searchMatches;
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
            KNOWLEDGE BASE
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Find answers to commonly asked questions regarding stream schedules, games played, hardware specifications, and community activities.
          </p>
        </div>

        {/* Filter Bar & Search Panel */}
        <div className="flex flex-col gap-6 bg-[rgba(10,10,10,0.35)] p-5 rounded-2xl border border-[var(--border-default)] shadow-[var(--shadow-sm)]">
          <div className="w-full">
            <SearchInput
              placeholder="Search by keywords (e.g. Valorant, setup, Discord)..."
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
        {accordionItems.length > 0 ? (
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
                No matching questions found
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
                Try searching for other keywords, checking another category filter, or ask directly on the community Discord channel.
              </p>
            </div>
            <a href={siteConfig.social.discord} target="_blank" rel="noopener noreferrer" className="mt-2">
              <Button className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none cursor-pointer flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                Ask on Discord
              </Button>
            </a>
          </GlassCard>
        )}

      </Container>
    </div>
  );
}
