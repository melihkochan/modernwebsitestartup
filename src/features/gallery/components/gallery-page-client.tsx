"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ImageIcon,
  RefreshCw,
  Play,
  Download,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGalleryItems } from "../hooks/use-gallery";
import {
  GALLERY_CATEGORY_LABELS,
  type GalleryCategory,
} from "@/features/media/types/media-types";

// ---------------------------------------------------------------------------
// Kategori Sekme Listesi
// ---------------------------------------------------------------------------

const CATEGORIES: Array<{ id: GalleryCategory | "hepsi"; label: string }> = [
  { id: "hepsi", label: "Tümü" },
  { id: "yayin", label: "Yayın" },
  { id: "hayran-sanati", label: "Hayran Sanatı" },
  { id: "irl", label: "IRL" },
  { id: "etkinlik", label: "Etkinlik" },
  { id: "diger", label: "Diğer" },
];

// ---------------------------------------------------------------------------
// Galeri Kartı Bileşeni
// ---------------------------------------------------------------------------

interface GalleryCardProps {
  imageUrl: string;
  thumbnailUrl?: string | null;
  title: string;
  altText?: string | null;
  category: string;
  createdAt: string;
  width?: number | null;
  height?: number | null;
  onClick: () => void;
}

const isVideoUrl = (url: string) => {
  const lowercase = url.toLowerCase();
  return (
    lowercase.endsWith(".mp4") ||
    lowercase.endsWith(".webm") ||
    lowercase.endsWith(".mov") ||
    (lowercase.includes("/storage/v1/object/public/gallery/") &&
      !lowercase.endsWith(".webp") &&
      !lowercase.endsWith(".png") &&
      !lowercase.endsWith(".jpg") &&
      !lowercase.endsWith(".jpeg") &&
      !lowercase.endsWith(".gif"))
  );
};

function GalleryCard({
  imageUrl,
  thumbnailUrl,
  title,
  altText,
  category,
  createdAt,
  width,
  height,
  onClick,
}: GalleryCardProps) {
  const displayUrl = thumbnailUrl && thumbnailUrl.trim() !== "" ? thumbnailUrl : imageUrl;
  const isVideo = isVideoUrl(displayUrl);

  const categoryLabel =
    GALLERY_CATEGORY_LABELS[category as GalleryCategory] ?? category;
  const dateLabel = new Date(createdAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
  });

  const imgWidth = width ?? 800;
  const imgHeight = height ?? 600;
  const aspectRatio =
    imgHeight > imgWidth * 1.2
      ? "aspect-[3/4]"
      : imgHeight < imgWidth * 0.6
        ? "aspect-video"
        : "aspect-square";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      className="break-inside-avoid relative rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-default)] bg-[var(--bg-surface)] group/item cursor-pointer shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] transition-all duration-300"
      aria-label={altText ?? title}
    >
      {/* Görsel veya Video */}
      <div className={cn("w-full relative overflow-hidden", aspectRatio)}>
        {isVideo ? (
          <div className="w-full h-full relative bg-[var(--bg-overlay)]">
            <video
              src={`${displayUrl}#t=0.001`}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white border border-white/20 shadow-md">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          </div>
        ) : (
          <Image
            src={displayUrl}
            alt={altText ?? title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover/item:scale-[1.03]"
            loading="lazy"
            placeholder="empty"
            unoptimized={process.env.NODE_ENV === "development"}
          />
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 flex flex-col justify-end opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 z-10">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Badge className="bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[9px] font-bold border border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/20 px-1.5 py-0.5 rounded capitalize">
            {categoryLabel}
          </Badge>
          <span className="text-[10px] text-white/50 font-mono">{dateLabel}</span>
        </div>
        <h3 className="text-sm font-bold text-white line-clamp-1">{title}</h3>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ana Bileşen
// ---------------------------------------------------------------------------

export function GalleryPageClient() {
  const [activeCategory, setActiveCategory] = useState<string>("hepsi");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { data: items = [], isLoading, error } = useGalleryItems(activeCategory);

  const handleDownload = async (url: string, title: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const extension = url.split("?")[0].split(".").pop() || "bin";
      a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => setSelectedIndex(null);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => ((prev ?? 0) + 1) % items.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => ((prev ?? 0) - 1 + items.length) % items.length);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, items]);

  const activeItem = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden bg-[var(--bg-base)]">
      {/* Arka plan efektleri */}
      <div className="absolute top-[-10%] left-[-15%] w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(0,242,154,0.04),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.03),transparent_70%)] pointer-events-none z-0" />

      <Container className="relative z-10 flex flex-col gap-12">
        {/* Başlık */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-xl">
            <Badge
              variant="outline"
              className="border-teal-400/25 text-teal-400 font-bold bg-teal-500/5 uppercase self-start"
            >
              GÖRSEL GÜNLÜK
            </Badge>
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-outfit)", color: "#ededed" }}
            >
              Galeri & Anlar
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "#a1a1aa" }}>
              Yayın kesitleri, IRL buluşmaları, özel anlar ve hayran sanatlarından seçkiler.
            </p>
          </div>

          {/* Kategori sekmeleri */}
          <div className="flex flex-wrap gap-1.5 bg-[var(--bg-overlay)] p-1 rounded-2xl border border-[var(--border-default)] shadow-[var(--shadow-sm)] self-start md:self-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer",
                  activeCategory === cat.id
                    ? "bg-[var(--bg-base)] shadow-[var(--shadow-sm)] border border-[var(--border-subtle)]"
                    : "hover:bg-[var(--bg-base)]/50"
                )}
                style={{
                  color:
                    activeCategory === cat.id ? "#ededed" : "#a1a1aa",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Yükleniyor */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin" style={{ color: "var(--accent-primary)" }} />
            <span className="text-sm" style={{ color: "#a1a1aa" }}>
              Görseller yükleniyor...
            </span>
          </div>
        )}

        {/* Hata */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)]">
            <ImageIcon className="w-10 h-10" style={{ color: "#71717a" }} />
            <p className="text-sm font-medium" style={{ color: "#a1a1aa" }}>
              Görseller yüklenirken bir hata oluştu.
            </p>
          </div>
        )}

        {/* Boş durum */}
        {!isLoading && !error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)]">
            <ImageIcon className="w-10 h-10 mb-3" style={{ color: "#71717a" }} />
            <p className="text-sm font-medium" style={{ color: "#a1a1aa" }}>
              Bu kategoride henüz görsel bulunmuyor.
            </p>
            <p className="text-xs mt-1" style={{ color: "#71717a" }}>
              Admin panelinden görseller yükleyebilirsiniz.
            </p>
          </div>
        )}

        {/* Masonry galeri */}
        {!isLoading && !error && items.length > 0 && (
          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layoutId={`gallery-card-${item.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <GalleryCard
                    imageUrl={item.imageUrl}
                    thumbnailUrl={item.thumbnailUrl}
                    title={item.title}
                    altText={item.altText}
                    category={item.category}
                    createdAt={item.createdAt}
                    width={item.width}
                    height={item.height}
                    onClick={() => openLightbox(index)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </Container>

      {/* Lightbox */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between"
            onClick={closeLightbox}
          >
            {/* Üst çubuk */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-b from-black/80 to-transparent relative z-20">
              <div className="flex flex-col gap-0.5 text-left">
                <div className="flex items-center gap-2">
                  <Badge className="bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary)] text-[10px] font-bold border-none px-2 py-0.5 capitalize">
                    {GALLERY_CATEGORY_LABELS[activeItem.category as GalleryCategory] ?? activeItem.category}
                  </Badge>
                  <span className="text-xs text-white/60 font-mono">
                    {new Date(activeItem.createdAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                  {activeItem.title}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {!isVideoUrl(activeItem.imageUrl) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(activeItem.imageUrl, "_blank");
                    }}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/5"
                    title="Tam Boyut Görüntüle"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(activeItem.imageUrl, activeItem.title);
                  }}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/5"
                  title="İndir"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={closeLightbox}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/10"
                  aria-label="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Ana görsel */}
            <div className="flex-1 flex items-center justify-between px-4 md:px-8 relative">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 hover:scale-105 flex items-center justify-center text-white transition-all cursor-pointer relative z-20 border border-white/5 select-none"
                aria-label="Önceki"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="max-w-4xl w-full flex items-center justify-center px-4 relative z-10">
                <motion.div
                  layoutId={`gallery-card-${activeItem.id}`}
                  className="relative w-full max-h-[60dvh] rounded-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden bg-black"
                  style={{ aspectRatio: activeItem.width && activeItem.height ? `${activeItem.width}/${activeItem.height}` : "16/9" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {isVideoUrl(activeItem.imageUrl) ? (
                    <video
                      src={activeItem.imageUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain max-h-[60vh] rounded-xl"
                    />
                  ) : (
                    <Image
                      src={activeItem.imageUrl}
                      alt={activeItem.altText ?? activeItem.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 80vw"
                      className="object-contain"
                      priority
                      unoptimized={process.env.NODE_ENV === "development"}
                    />
                  )}
                </motion.div>
              </div>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 hover:scale-105 flex items-center justify-center text-white transition-all cursor-pointer relative z-20 border border-white/5 select-none"
                aria-label="Sonraki"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Alt bilgi */}
            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent relative z-20 text-center max-w-2xl mx-auto flex flex-col gap-2">
              {activeItem.description && (
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {activeItem.description}
                </p>
              )}
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">
                {(selectedIndex ?? 0) + 1} / {items.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
