"use client";

import Link from "next/link";
import { Gamepad, ThumbsUp } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/common";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { RevealOnScroll, StaggerChildren } from "@/components/motion";
import { useSuggestions } from "@/features/community/hooks/use-community";
import { tr } from "@/config/tr";
import Image from "next/image";

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="h-3 w-20 animate-pulse rounded bg-[var(--bg-overlay)]" />
      <div className="h-5 w-40 animate-pulse rounded bg-[var(--bg-overlay)]" />
      <div className="h-2 w-full animate-pulse rounded bg-[var(--bg-overlay)]" />
    </div>
  );
}

export function CommunityPreviewSection() {
  const { data: suggestions, isLoading } = useSuggestions();

  // Show top 3 game suggestions by votes
  const topSuggestions = suggestions
    ? [...suggestions].sort((a, b) => b.votes - a.votes).slice(0, 3)
    : [];

  return (
    <Section padding="lg" divided>
      <Container>
        <RevealOnScroll animation="slide-up">
          <SectionTitle
            eyebrow={tr.home.communitySuggestions}
            title="En Çok İstenen Oyunlar"
            description="Topluluk tarafından önerilen ve en çok oylanan oyunlar. Bir sonraki yayında ne oynanacağını siz belirleyin."
            align="center"
          />
        </RevealOnScroll>

        <div className="mt-12">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : topSuggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[var(--border-default)] rounded-2xl bg-[var(--bg-surface)]">
              <Gamepad className="h-10 w-10 text-[var(--text-tertiary)] mb-4" />
              <p className="text-[var(--text-secondary)] font-medium">Henüz oyun önerisi bulunmamaktadır.</p>
            </div>
          ) : (
            <StaggerChildren
              staggerDelay={0.1}
              initialDelay={0.1}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {topSuggestions.map((item) => (
                <GlassCard
                  key={item.id}
                  intensity="medium"
                  hoverable
                  className="p-3.5 flex flex-row gap-3.5 items-stretch group overflow-hidden border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-300 rounded-xl"
                >
                  {item.coverImageUrl && (
                    <div className="w-14 h-20 relative bg-zinc-950 rounded-md overflow-hidden shrink-0 border border-[var(--border-default)] shadow-[var(--shadow-sm)]">
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
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-xs font-bold text-[var(--text-primary)] truncate">
                          {item.game}
                        </h3>
                        <span className="bg-[var(--bg-overlay)] text-[var(--text-secondary)] border border-[var(--border-default)] text-[7px] font-bold px-1.5 py-0 rounded">
                          {item.platform}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-normal line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-[10px] text-[var(--text-tertiary)] border-t border-[var(--border-subtle)] pt-1.5">
                      <span className="text-[8px] uppercase font-bold text-[var(--accent-primary)]">Topluluk ({item.votes} kişi istedi)</span>
                      <div className="flex items-center gap-1 text-[var(--text-primary)] font-semibold">
                        <ThumbsUp className="h-3 w-3 text-[var(--accent-primary)]" />
                        <span className="font-mono text-xs">{item.votes} Oy</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </StaggerChildren>
          )}

          {/* Action Button */}
          <div className="mt-12 flex justify-center">
            <Link href="/community">
              <Button
                type="button"
                className="h-10 px-6 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none flex items-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(0,242,154,0.15)] hover:scale-105 transition-all duration-300"
              >
                {tr.community.suggestGame}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
