"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Download,
  Share2,
  Grid,
  Image as ImageIcon,
  Camera,
  Paintbrush,
  Sparkles,
  Info,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Mock Data for Gallery
// ---------------------------------------------------------------------------

interface GalleryItem {
  id: string;
  category: "setups" | "irl" | "highlights" | "fanart";
  aspect: "landscape" | "portrait" | "square";
  gradient: string;
  label: string;
  date: string;
  details: string;
}

const GALLERY_CATEGORIES = [
  { id: "all", label: "All Items", icon: Grid },
  { id: "setups", label: "Setups", icon: Sparkles },
  { id: "irl", label: "IRL & Events", icon: Camera },
  { id: "highlights", label: "Highlights", icon: ImageIcon },
  { id: "fanart", label: "Fan Art", icon: Paintbrush },
] as const;

const MOCK_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    category: "setups",
    aspect: "landscape",
    gradient: "linear-gradient(135deg, #1a0533 0%, #2d0f5e 50%, #0d0d2e 100%)",
    label: "Zehragn Dual PC Setup Reveal",
    date: "June 2026",
    details: "The ultimate streaming powerhouse setup featuring Ryzen 7950X, RTX 4090, and dedicated capture card system.",
  },
  {
    id: "gal-2",
    category: "irl",
    aspect: "portrait",
    gradient: "linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #051022 100%)",
    label: "ZehrArmy Meetup at Gamescom",
    date: "August 2025",
    details: "Incredible turnout at the main hall! It was wonderful meeting so many community members in person.",
  },
  {
    id: "gal-3",
    category: "highlights",
    aspect: "square",
    gradient: "linear-gradient(135deg, #0d1a0d 0%, #1a3d1a 50%, #082008 100%)",
    label: "Radiant Promotion Celebration Screen",
    date: "May 2026",
    details: "After weeks of grinding solo queues, we finally secured the Radiant rank live with 15k active viewers.",
  },
  {
    id: "gal-4",
    category: "fanart",
    aspect: "landscape",
    gradient: "linear-gradient(135deg, #2d0a1a 0%, #5e1f3d 50%, #1a050f 100%)",
    label: "Zehragn Anime Digital Drawing",
    date: "April 2026",
    details: "Beautiful custom digital canvas illustration sent in by community moderator SniperX.",
  },
  {
    id: "gal-5",
    category: "setups",
    aspect: "portrait",
    gradient: "linear-gradient(135deg, #0a1a2d 0%, #1f3d5e 50%, #050f1a 100%)",
    label: "Ambient Setup Glow in Dark",
    date: "March 2026",
    details: "Late night vibes with custom neon green and deep violet lighting bars around the studio deck.",
  },
  {
    id: "gal-6",
    category: "irl",
    aspect: "square",
    gradient: "linear-gradient(135deg, #1a0a2d 0%, #3d1f5e 50%, #0f051a 100%)",
    label: "Signing merch at Kick Finals",
    date: "November 2025",
    details: "Signed over 500 cards and shirts. Huge thanks to everyone who waited in queue!",
  },
  {
    id: "gal-7",
    category: "highlights",
    aspect: "landscape",
    gradient: "linear-gradient(135deg, #1a1a0a 0%, #3d3d1f 50%, #0d0d05 100%)",
    label: "Charity Stream Milestone Chart",
    date: "December 2025",
    details: "Raised over $25,000 for children's hospitals during our annual 24-hour charity broadcast.",
  },
  {
    id: "gal-8",
    category: "fanart",
    aspect: "portrait",
    gradient: "linear-gradient(135deg, #0a1a1a 0%, #1f3d3d 50%, #050d0d 100%)",
    label: "ZehrArmy Logo Fan Concept",
    date: "February 2026",
    details: "Futuristic coat of arms concept made by community designer Ayz_Design.",
  },
  {
    id: "gal-9",
    category: "setups",
    aspect: "landscape",
    gradient: "linear-gradient(135deg, #1a0d00 0%, #3d2000 50%, #0d0600 100%)",
    label: "Custom Custom Keyboard Macros Detail",
    date: "January 2026",
    details: "Visual macro keys mapping close-up. Custom switches lubed for stream quietness.",
  },
];

export function GalleryPageClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  // Filtered gallery items
  const filteredItems = MOCK_GALLERY.filter((item) =>
    activeCategory === "all" ? true : item.category === activeCategory
  );

  const openLightbox = (id: string) => {
    const index = filteredItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      setSelectedItemIndex(index);
      setZoomScale(1);
    }
  };

  const closeLightbox = () => {
    setSelectedItemIndex(null);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedItemIndex !== null) {
      setSelectedItemIndex((prev) => (prev! + 1) % filteredItems.length);
      setZoomScale(1);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedItemIndex !== null) {
      setSelectedItemIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
      setZoomScale(1);
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedItemIndex === null) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemIndex, filteredItems]);

  const activeItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden bg-[var(--bg-base)]">
      {/* Background glow highlights */}
      <div className="absolute top-[-10%] left-[-15%] w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(0,242,154,0.04),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.03),transparent_70%)] pointer-events-none z-0" />

      <Container className="relative z-10 flex flex-col gap-12">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-xl">
            <Badge variant="outline" className="border-teal-400/25 text-teal-400 font-bold bg-teal-500/5 uppercase self-start">
              VISUAL JOURNAL
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
              Gallery & Moments
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Explore photo captures from stream setups, IRL meetups, milestones, and amazing artwork submitted by fans.
            </p>
          </div>

          {/* Categories select tabs */}
          <div className="flex flex-wrap gap-2 bg-[var(--bg-overlay)] p-1 rounded-2xl border border-[var(--border-default)] shadow-[var(--shadow-sm)] self-start md:self-auto">
            {GALLERY_CATEGORIES.map((cat) => {
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

        {/* Masonry CSS Column layout */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layoutId={`img-card-${item.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="break-inside-avoid relative rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-default)] bg-[rgba(10,10,10,0.5)] group/item cursor-pointer shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] transition-all duration-300"
                onClick={() => openLightbox(item.id)}
              >
                {/* Column block image gradient placeholder */}
                <div
                  className={cn(
                    "w-full transition-transform duration-700 ease-out group-hover/item:scale-[1.03]",
                    item.aspect === "landscape" ? "aspect-video" : item.aspect === "portrait" ? "aspect-[3/4]" : "aspect-square"
                  )}
                  style={{ background: item.gradient }}
                />

                {/* Glassmorphic hover overlay detailing text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 flex flex-col justify-end opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 z-10">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Badge className="bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[9px] font-bold border border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/20 px-1.5 py-0.5 rounded capitalize">
                      {item.category}
                    </Badge>
                    <span className="text-[10px] text-white/50 font-mono">{item.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {item.label}
                  </h3>
                  <p className="text-[11px] text-white/70 line-clamp-2 mt-1 leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)]">
            <ImageIcon className="w-10 h-10 text-[var(--text-tertiary)] mb-3" />
            <p className="text-sm text-[var(--text-secondary)] font-medium">
              No items in this category yet.
            </p>
          </div>
        )}
      </Container>

      {/* Lightbox Fullscreen Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between"
            onClick={closeLightbox}
          >
            {/* Header controls bar */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-b from-black/80 to-transparent relative z-20">
              <div className="flex flex-col gap-0.5 text-left">
                <div className="flex items-center gap-2">
                  <Badge className="bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary)] text-[10px] font-bold border-none px-2 py-0.5 capitalize">
                    {activeItem.category}
                  </Badge>
                  <span className="text-xs text-white/60 font-mono">{activeItem.date}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                  {activeItem.label}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomScale((z) => (z === 1 ? 1.4 : 1));
                  }}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/5"
                  title="Toggle Zoom"
                >
                  <Maximize2 className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/5"
                  title="Download File"
                >
                  <Download className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={closeLightbox}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Central presentation area */}
            <div className="flex-1 flex items-center justify-between px-4 md:px-8 relative">
              {/* Prev button */}
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 hover:scale-105 flex items-center justify-center text-white transition-all cursor-pointer relative z-20 border border-white/5 select-none"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Main image container */}
              <div className="max-w-4xl w-full flex items-center justify-center px-4 relative z-10">
                <motion.div
                  layoutId={`img-card-${activeItem.id}`}
                  className="w-full max-h-[60dvh] aspect-video rounded-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300"
                  style={{
                    background: activeItem.gradient,
                    scale: zoomScale,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomScale((z) => (z === 1 ? 1.4 : 1));
                  }}
                />
              </div>

              {/* Next button */}
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 hover:scale-105 flex items-center justify-center text-white transition-all cursor-pointer relative z-20 border border-white/5 select-none"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Footer description bar */}
            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent relative z-20 text-center max-w-2xl mx-auto flex flex-col gap-2">
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed pl-1.5">
                {activeItem.details}
              </p>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">
                Image {selectedItemIndex! + 1} of {filteredItems.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
