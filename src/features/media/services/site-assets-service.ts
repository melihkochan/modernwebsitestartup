import { createClient } from "@/lib/supabase/client";
import type { SiteAssets } from "../types/media-types";

const FALLBACK_ASSETS: SiteAssets = {
  logoUrl: null,
  faviconUrl: null,
  avatarPlaceholderUrl: null,
  imagePlaceholderUrl: null,
  ogImageUrl: null,
};

/**
 * site_assets tablosundan site genelinde kullanılan statik varlıkları çeker.
 * Tablo boşsa veya hata olursa null değerler içeren fallback döner.
 * Kod içine URL gömülmez.
 *
 * Not: site_assets tablosu Sprint 11 migration'ı çalıştıktan sonra
 * Supabase'de oluşturulur. Migration çalıştırılmadan önce boş fallback döner.
 */
export async function getSiteAssets(): Promise<SiteAssets> {
  const supabase = createClient();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("site_assets")
      .select("logo_url, favicon_url, avatar_placeholder_url, image_placeholder_url, og_image_url")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_ASSETS;
    }

    return {
      logoUrl: (data as { logo_url?: string | null }).logo_url ?? null,
      faviconUrl: (data as { favicon_url?: string | null }).favicon_url ?? null,
      avatarPlaceholderUrl:
        (data as { avatar_placeholder_url?: string | null }).avatar_placeholder_url ?? null,
      imagePlaceholderUrl:
        (data as { image_placeholder_url?: string | null }).image_placeholder_url ?? null,
      ogImageUrl: (data as { og_image_url?: string | null }).og_image_url ?? null,
    };
  } catch {
    return FALLBACK_ASSETS;
  }
}

/**
 * site_assets tablosunu günceller (sadece admin).
 */
export async function updateSiteAssets(updates: Partial<SiteAssets>): Promise<void> {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("site_assets")
    .update({
      logo_url: updates.logoUrl,
      favicon_url: updates.faviconUrl,
      avatar_placeholder_url: updates.avatarPlaceholderUrl,
      image_placeholder_url: updates.imagePlaceholderUrl,
      og_image_url: updates.ogImageUrl,
    })
    .eq("id", "00000000-0000-0000-0000-000000000001");

  if (error) {
    throw new Error(`Site varlıkları güncellenemedi: ${error.message}`);
  }
}
