"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Star,
  Cpu,
  Layers,
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

// ---------------------------------------------------------------------------
// Mock Data for Setup
// ---------------------------------------------------------------------------

interface SetupProduct {
  id: string;
  category: "pc" | "peripherals" | "audio" | "comfort";
  name: string;
  brand: string;
  desc: string;
  rating: number;
  specs: { name: string; value: string }[];
  gradient: string;
  url: string;
  highlight?: boolean;
}

const SETUP_CATEGORIES = [
  { id: "all", label: "Full Station", icon: Layers },
  { id: "pc", label: "PC Hardware", icon: Cpu },
  { id: "peripherals", label: "Peripherals", icon: Keyboard },
  { id: "audio", label: "Audio & Mic", icon: Mic },
  { id: "comfort", label: "Comfort", icon: Bookmark },
] as const;

const MOCK_SETUP_PRODUCTS: SetupProduct[] = [
  {
    id: "prod-1",
    category: "pc",
    name: "GeForce RTX 4090 Founders Edition",
    brand: "NVIDIA",
    desc: "The absolute pinnacle of graphics processing. Powering flawless 240fps gameplay in 1440p resolution while encoding high-bitrate streaming feeds synchronously.",
    rating: 4.9,
    specs: [
      { name: "Memory", value: "24GB GDDR6X" },
      { name: "CUDA Cores", value: "16384" },
      { name: "Boost Clock", value: "2.52 GHz" },
      { name: "TDP Power", value: "450W" },
    ],
    gradient: "linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)",
    url: "https://amazon.com",
    highlight: true,
  },
  {
    id: "prod-2",
    category: "pc",
    name: "Ryzen 9 7950X Processor",
    brand: "AMD",
    desc: "16 cores and 32 threads of pure compute. Handily handles massive background processes, Discord bots, and encoding feeds without affecting game performance.",
    rating: 4.8,
    specs: [
      { name: "Cores/Threads", value: "16 Cores / 32 Threads" },
      { name: "Base Speed", value: "4.5 GHz" },
      { name: "Max Boost Speed", value: "Up to 5.7 GHz" },
      { name: "Cache Size", value: "80MB" },
    ],
    gradient: "linear-gradient(135deg, #1a0a00 0%, #2d1500 100%)",
    url: "https://amazon.com",
  },
  {
    id: "prod-3",
    category: "peripherals",
    name: "ROG Swift PG27AQN 360Hz",
    brand: "ASUS",
    desc: "The world's fastest 1440p gaming monitor. Offers crystalline motion clarity, ultra-low input lag, and critical response rates for competitive Valorant play.",
    rating: 5.0,
    specs: [
      { name: "Refresh Rate", value: "360Hz" },
      { name: "Resolution", value: "2560 x 1440 (QHD)" },
      { name: "Panel Type", value: "Ultrafast IPS" },
      { name: "Response Time", value: "1ms (GTG)" },
    ],
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    url: "https://amazon.com",
    highlight: true,
  },
  {
    id: "prod-4",
    category: "peripherals",
    name: "G Pro X Superlight 2",
    brand: "Logitech",
    desc: "The definitive competitive gaming mouse. Ultra lightweight at 60 grams, featuring LIGHTFORCE hybrid switches and the advanced HERO 2 sensor.",
    rating: 4.9,
    specs: [
      { name: "Weight", value: "60 grams" },
      { name: "Sensor", value: "HERO 2 (32,000 DPI)" },
      { name: "Battery Life", value: "Up to 95 Hours" },
      { name: "Polling Rate", value: "4000Hz" },
    ],
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    url: "https://amazon.com",
  },
  {
    id: "prod-5",
    category: "peripherals",
    name: "Wooting 60HE Keyboard",
    brand: "Wooting",
    desc: "Analog keyboard utilizing magnetic Hall effect switches. Offers rapid trigger technology for instant input response and micro-stutter reduction.",
    rating: 4.9,
    specs: [
      { name: "Switches", value: "Lekker Analog Magnetic" },
      { name: "Actuation Range", value: "0.1mm - 4.0mm" },
      { name: "Layout", value: "60% Compact Layout" },
      { name: "Keycaps", value: "Double-shot PBT" },
    ],
    gradient: "linear-gradient(135deg, #2d0f5e 0%, #1a0533 100%)",
    url: "https://amazon.com",
  },
  {
    id: "prod-6",
    category: "audio",
    name: "SM7B Vocal Microphone",
    brand: "Shure",
    desc: "The gold standard for broadcasting. Offers warm, smooth voice capture with electromagnetic shielding and built-in pop filter protection.",
    rating: 4.8,
    specs: [
      { name: "Type", value: "Dynamic" },
      { name: "Polar Pattern", value: "Cardioid" },
      { name: "Frequency Range", value: "50 to 20,000 Hz" },
      { name: "Connection", value: "XLR" },
    ],
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    url: "https://amazon.com",
    highlight: true,
  },
  {
    id: "prod-7",
    category: "audio",
    name: "ATH-R70x Professional Headset",
    brand: "Audio-Technica",
    desc: "Reference open-back monitoring headphones. Lightweight comfort with accurate spatial soundstage to identify step locations in tactical games.",
    rating: 4.7,
    specs: [
      { name: "Design", value: "Open-back Reference" },
      { name: "Impedance", value: "470 Ohms" },
      { name: "Weight", value: "210 grams" },
      { name: "Driver Size", value: "45 mm" },
    ],
    gradient: "linear-gradient(135deg, #0a1a0a 0%, #0f2d0f 100%)",
    url: "https://amazon.com",
  },
  {
    id: "prod-8",
    category: "comfort",
    name: "Aeron Chair Ergonomic",
    brand: "Herman Miller",
    desc: "Pioneering posture support. Keeps posture perfectly aligned during long 8-hour sessions, preventing fatigue with cooling Pellicle mesh.",
    rating: 4.8,
    specs: [
      { name: "Size", value: "Size B (Medium)" },
      { name: "Material", value: "8Z Pellicle Mesh" },
      { name: "Adjustments", value: "PostureFit SL Fully Adjustable" },
      { name: "Warranty", value: "12 Years" },
    ],
    gradient: "linear-gradient(135deg, #0a0a1a 0%, #1a1a2d 100%)",
    url: "https://amazon.com",
  },
];

export function SetupPageClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedProductIds, setExpandedProductIds] = useState<Record<string, boolean>>({});

  const toggleSpecs = (id: string) => {
    setExpandedProductIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredProducts = MOCK_SETUP_PRODUCTS.filter((prod) =>
    activeCategory === "all" ? true : prod.category === activeCategory
  );

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden bg-[var(--bg-base)]">
      {/* Background spotlights */}
      <div className="absolute top-[-20%] left-[50%] -translate-x-[50%] w-[1000px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(0,242,154,0.04),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.02),transparent_70%)] pointer-events-none z-0" />

      <Container className="relative z-10 flex flex-col gap-12">
        
        {/* Affiliate Disclosure Banner */}
        <GlassCard className="p-4 border border-[var(--border-default)] bg-[rgba(10,10,10,0.35)] rounded-2xl flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            <strong>Affiliate Disclosure:</strong> The links on this page are mock affiliate links. Purchasing through them helps support the stream equipment upgrades at no extra cost to you.
          </p>
        </GlassCard>

        {/* Title area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-xl">
            <Badge variant="outline" className="border-blue-400/25 text-blue-400 font-bold bg-blue-500/5 uppercase self-start">
              THE BATTLE STATION
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
              Gear & Stream Setup
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Explore the professional hardware, audio gear, and comfort equipment utilized by Zehragn to deliver premium broadcast quality daily.
            </p>
          </div>

          {/* Categories select tabs */}
          <div className="flex flex-wrap gap-2 bg-[var(--bg-overlay)] p-1 rounded-2xl border border-[var(--border-default)] shadow-[var(--shadow-sm)] self-start md:self-auto">
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
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((prod) => {
              const isExpanded = !!expandedProductIds[prod.id];
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
                      prod.highlight
                        ? "border-[var(--accent-primary)]/40 shadow-[0_0_24px_rgba(0,242,154,0.05)] bg-[rgba(10,10,10,0.6)]"
                        : "border-[var(--border-default)] hover:border-[var(--border-strong)] bg-[rgba(10,10,10,0.4)]"
                    )}
                  >
                    {/* Visual Card Top Image-Box (Simulated Gradient Display) */}
                    <div
                      className="h-[180px] w-full relative flex items-center justify-center overflow-hidden"
                      style={{ background: prod.gradient }}
                    >
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                      
                      <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/10 flex items-center justify-center text-white/50 group-hover:scale-105 group-hover:text-white transition-all">
                        <Package className="w-8 h-8" />
                      </div>

                      {prod.highlight && (
                        <span className="absolute top-4 right-4 bg-[var(--accent-primary)] text-[var(--bg-base)] text-[9px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-full uppercase shadow-md select-none animate-pulse">
                          STREAM FAVORITE
                        </span>
                      )}

                      <div className="absolute bottom-4 left-4 z-10">
                        <Badge className="bg-[rgba(10,10,10,0.6)] backdrop-blur-md text-[var(--text-secondary)] text-[9px] font-bold border border-white/5 px-2 py-0.5 rounded">
                          {prod.brand}
                        </Badge>
                      </div>
                    </div>

                    {/* Card Content details */}
                    <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent-primary)] transition-colors" style={{ fontFamily: "var(--font-outfit)" }}>
                            {prod.name}
                          </h3>

                          {/* Star Rating details */}
                          <div className="flex items-center gap-1 text-amber-400 mt-1 shrink-0">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-xs font-mono font-bold text-[var(--text-secondary)]">
                              {prod.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {prod.desc}
                        </p>
                      </div>

                      {/* Expandable Specifications block */}
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => toggleSpecs(prod.id)}
                          className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1.5 border-b border-dashed border-[var(--border-default)] cursor-pointer"
                        >
                          <span>Detailed Specifications</span>
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
                                {prod.specs.map((spec, idx) => (
                                  <div key={idx} className="flex flex-col">
                                    <span className="text-[var(--text-tertiary)] font-medium">
                                      {spec.name}
                                    </span>
                                    <span className="text-[var(--text-primary)] font-bold mt-0.5">
                                      {spec.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Affiliate Purchase button */}
                        <div className="flex items-center justify-between gap-4 mt-3">
                          <span className="text-[10px] text-[var(--text-tertiary)] font-medium italic">
                            Amazon Affiliate Link
                          </span>
                          <a
                            href={prod.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0"
                          >
                            <Button className="h-9 text-xs font-bold bg-[var(--bg-overlay)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 border border-[var(--border-default)] text-[var(--text-primary)] px-4 flex items-center gap-1.5 cursor-pointer transition-all">
                              Buy Hardware
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </Container>
    </div>
  );
}
