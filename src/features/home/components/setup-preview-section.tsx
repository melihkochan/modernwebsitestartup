"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/common";
import { HoverLift, RevealOnScroll, StaggerChildren } from "@/components/motion";
import { useSetupProducts } from "@/features/setup/hooks/use-setup";
import { getStorageUrl } from "@/lib/supabase/storage";
import { usePublicSiteSettings } from "@/hooks/use-site-settings";
import { tr } from "@/config/tr";

function SetupSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="h-32 w-full animate-pulse bg-[var(--bg-overlay)]" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-2 w-14 animate-pulse rounded bg-[var(--bg-overlay)]" />
        <div className="h-3 w-20 animate-pulse rounded bg-[var(--bg-overlay)]" />
      </div>
    </div>
  );
}

export function SetupPreviewSection() {
  const { data: settings } = usePublicSiteSettings();
  const { data: products = [], isLoading } = useSetupProducts("all");

  const streamerName = settings?.branding?.streamerName || "Zehragn";
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 3);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);

  return (
    <Section padding="lg" divided>
      <Container>
        <RevealOnScroll animation="slide-up">
          <SectionTitle
            eyebrow={tr.home.gearShowcase}
            title="Yayın Ekipmanları"
            description={`${streamerName}'ın en yüksek yayın kalitesine ulaşmak için tercih ettiği profesyonel ekipmanlar.`}
            align="center"
          />
        </RevealOnScroll>

        <div className="mt-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <SetupSkeleton key={i} />
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[var(--border-default)] rounded-2xl bg-[var(--bg-surface)]">
              <Package className="h-10 w-10 text-[var(--text-tertiary)] mb-4" />
              <p className="text-[var(--text-secondary)] font-medium">Henüz ekipman eklenmemiş.</p>
            </div>
          ) : (
            <StaggerChildren
              staggerDelay={0.07}
              initialDelay={0.1}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayProducts.map((item) => {
                const imageUrl = item.storage_path
                  ? getStorageUrl(item.storage_path.startsWith("setup/") ? item.storage_path : `setup/${item.storage_path}`)
                  : "";

                return (
                  <HoverLift key={item.id} amount={6} scale={1.02}>
                    <div
                      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-colors duration-300 hover:border-[var(--border-default)] h-full"
                    >
                      {/* Product image area */}
                      <div className="relative h-44 w-full overflow-hidden bg-black/30 border-b border-[var(--border-subtle)] flex items-center justify-center">
                        {item.storage_path ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-[var(--text-tertiary)]" />
                        )}
                        
                        {item.availability && (
                          <span className="absolute top-3 left-3 bg-black/75 text-[8px] font-extrabold tracking-widest px-2 py-0.5 rounded text-white uppercase">
                            {item.availability === "stokta" ? "Stokta" :
                             item.availability === "stokta_yok" ? "Stokta Yok" : "Yakında"}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex flex-col gap-1 p-4 mt-auto">
                        <span
                          className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--violet-light)]"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {item.category}
                        </span>
                        <h3
                          className="text-sm font-bold text-[var(--text-primary)] leading-snug line-clamp-1 group-hover:text-[var(--violet-light)] transition-colors"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          {item.title}
                        </h3>
                        <p className="text-xs text-[var(--text-tertiary)]">
                          {item.brand}
                        </p>
                      </div>
                    </div>
                  </HoverLift>
                );
              })}
            </StaggerChildren>
          )}
        </div>

        {/* View full setup link */}
        <RevealOnScroll animation="fade" delay={0.3}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/setup"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] group font-semibold"
            >
              <span>{tr.home.viewFullSetup}</span>
              <span
                className="inline-block transition-transform group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>
          </div>
        </RevealOnScroll>
      </Container>
    </Section>
  );
}
