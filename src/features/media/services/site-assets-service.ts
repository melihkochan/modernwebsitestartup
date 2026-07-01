import { createClient } from "@/lib/supabase/client";
import type { SiteAssets } from "../types/media-types";

const FALLBACK_ASSETS: SiteAssets = {
  logoUrl: null,
  faviconUrl: null,
  avatarPlaceholderUrl: null,
  imagePlaceholderUrl: null,
  ogImageUrl: null,
  avatarUrl: null,
  heroBannerUrl: null,
  whiteLogoUrl: null,
  darkLogoUrl: null,
  offlineCoverUrl: null,
  defaultThumbnailUrl: null,
  illustration404Url: null,
};

export async function getSiteAssets(): Promise<SiteAssets> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("site_assets")
      .select("logo_url, favicon_url, avatar_placeholder_url, image_placeholder_url, og_image_url, avatar_url, hero_banner_url, white_logo_url, dark_logo_url, offline_cover_url, default_thumbnail_url, illustration_404_url")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_ASSETS;
    }

    return {
      logoUrl: data.logo_url ?? null,
      faviconUrl: data.favicon_url ?? null,
      avatarPlaceholderUrl: data.avatar_placeholder_url ?? null,
      imagePlaceholderUrl: data.image_placeholder_url ?? null,
      ogImageUrl: data.og_image_url ?? null,
      avatarUrl: data.avatar_url ?? null,
      heroBannerUrl: data.hero_banner_url ?? null,
      whiteLogoUrl: data.white_logo_url ?? null,
      darkLogoUrl: data.dark_logo_url ?? null,
      offlineCoverUrl: data.offline_cover_url ?? null,
      defaultThumbnailUrl: data.default_thumbnail_url ?? null,
      illustration404Url: data.illustration_404_url ?? null,
    };
  } catch {
    return FALLBACK_ASSETS;
  }
}

export async function updateSiteAssets(updates: Partial<SiteAssets>): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("site_assets")
    .update({
      logo_url: updates.logoUrl,
      favicon_url: updates.faviconUrl,
      avatar_placeholder_url: updates.avatarPlaceholderUrl,
      image_placeholder_url: updates.imagePlaceholderUrl,
      og_image_url: updates.ogImageUrl,
      avatar_url: updates.avatarUrl,
      hero_banner_url: updates.heroBannerUrl,
      white_logo_url: updates.whiteLogoUrl,
      dark_logo_url: updates.darkLogoUrl,
      offline_cover_url: updates.offlineCoverUrl,
      default_thumbnail_url: updates.defaultThumbnailUrl,
      illustration_404_url: updates.illustration404Url,
    })
    .eq("id", "00000000-0000-0000-0000-000000000001");

  if (error) {
    throw new Error(`Site varlıkları güncellenemedi: ${error.message}`);
  }
}
