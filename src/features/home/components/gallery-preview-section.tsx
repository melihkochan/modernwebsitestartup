"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/analytics/section-title";
import { RevealOnScroll } from "@/components/motion";
import { useFeaturedGalleryItems } from "@/features/gallery/hooks/use-gallery";
import { Play } from "lucide-react";

function GallerySkeleton() {
  return (
    <div className="break-inside-avoid mb-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)]">
      <div className="h-44 w-full animate-pulse bg-[var(--bg-overlay)]" />
    </div>
  );
}

export function GalleryPreviewSection() {
  const { data: items, isLoading } = useFeaturedGalleryItems();

  const hasItems = !isLoading && items && items.length > 0;

  return (
    <Section padding="lg" divided>
      <Container>
        <RevealOnScroll animation="slide-up">
          <SectionTitle
            eyebrow="Galeri"
            title="Öne Çıkan Anlar"
            description="Yayın kesitleri, buluşmalar ve özel anlardan seçkiler."
            align="left"
          />
        </RevealOnScroll>

        <div className="mt-12">
          <div
            className="gallery-masonry"
            style={{ columnCount: 2, columnGap: "1rem" }}
          >
            <style>{`
              @media (min-width: 768px) { .gallery-masonry { column-count: 3 !important; } }
              @media (min-width: 1024px) { .gallery-masonry { column-count: 4 !important; } }
            `}</style>

            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => <GallerySkeleton key={i} />)}

            {hasItems &&
              items!.map((item, i) => {
                const displayUrl = item.thumbnailUrl && item.thumbnailUrl.trim() !== "" ? item.thumbnailUrl : item.imageUrl;
                const lowercase = displayUrl.toLowerCase();
                const isVideo = lowercase.endsWith(".mp4") || lowercase.endsWith(".webm") || lowercase.endsWith(".mov") || 
                  (lowercase.includes("/storage/v1/object/public/gallery/") &&
                    !lowercase.endsWith(".webp") && !lowercase.endsWith(".png") && !lowercase.endsWith(".jpg") && 
                    !lowercase.endsWith(".jpeg") && !lowercase.endsWith(".gif"));

                return (
                  <Link href="/gallery" key={item.id} className="block break-inside-avoid mb-4">
                    <motion.div
                      className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] group cursor-pointer"
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{
                        duration: 0.5,
                        delay: (i % 4) * 0.07,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="relative w-full h-44 overflow-hidden bg-[var(--bg-overlay)]">
                        {isVideo ? (
                          <div className="w-full h-full relative bg-gradient-to-br from-purple-950/20 via-slate-900 to-teal-950/20">
                            <video
                              src={`${displayUrl}#t=0.001`}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              preload="metadata"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                              <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white border border-white/20 shadow-md">
                                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={displayUrl}
                            alt={item.altText ?? item.title}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            loading="lazy"
                            unoptimized={process.env.NODE_ENV === "development"}
                          />
                        )}

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-3 z-10">
                          <p className="text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-snug line-clamp-2">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}

            {/* Boş durum (opsiyonel — ana sayfada sessizce göster) */}
            {!isLoading && (!items || items.length === 0) && (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="break-inside-avoid mb-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] h-44 bg-[var(--bg-overlay)] animate-pulse"
                />
              ))
            )}
          </div>
        </div>

        {/* Galeri bağlantısı */}
        <RevealOnScroll animation="fade" delay={0.2}>
          <div className="mt-8 flex justify-center">
            <a
              href="/gallery"
              className="inline-flex items-center gap-2 text-sm transition-colors hover:text-[var(--text-primary)] group"
              style={{ color: "#a1a1aa" }}
            >
              Tüm Galeriyi Gör
              <span
                className="inline-block transition-transform group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </a>
          </div>
        </RevealOnScroll>
      </Container>
    </Section>
  );
}
