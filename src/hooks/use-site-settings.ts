import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
}

export interface BrandingSettings {
  streamerName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
}

export interface SocialSettings {
  kickUrl: string;
  discordUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
}

export interface SiteSettingsData {
  seo: SeoSettings;
  branding: BrandingSettings;
  social: SocialSettings;
}

export function usePublicSiteSettings() {
  return useQuery<SiteSettingsData>({
    queryKey: ["public", "site-settings"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      const settings: Record<string, any> = {};
      (data || []).forEach((row) => {
        settings[row.key] = row.value;
      });

      return {
        seo: {
          title: settings.seo?.title ?? "Zehragn - Streamer Platform",
          description: settings.seo?.description ?? "Zehragn official streamer website",
          keywords: settings.seo?.keywords ?? "Zehragn, Kick, streamer, gaming",
        },
        branding: {
          streamerName: settings.site?.streamerName ?? settings.branding?.streamerName ?? "Zehragn",
          logoUrl: settings.site?.logoUrl ?? settings.branding?.logoUrl ?? null,
          faviconUrl: settings.site?.faviconUrl ?? settings.branding?.faviconUrl ?? null,
          avatarUrl: settings.site?.avatarUrl ?? settings.branding?.avatarUrl ?? null,
          coverUrl: settings.site?.coverUrl ?? settings.branding?.coverUrl ?? null,
        },
        social: {
          kickUrl: settings.social?.kick ?? settings.social?.kickUrl ?? "https://kick.com/zehragn",
          discordUrl: settings.social?.discord ?? settings.social?.discordUrl ?? "https://discord.gg/zehragn",
          instagramUrl: settings.social?.instagram ?? settings.social?.instagramUrl ?? "https://instagram.com/zehragn",
          youtubeUrl: settings.social?.youtube ?? settings.social?.youtubeUrl ?? "https://youtube.com/zehragn",
          twitterUrl: settings.social?.twitter ?? settings.social?.twitterUrl ?? "https://x.com/zehragn",
        }
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
}
