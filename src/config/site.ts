/**
 * Site-wide configuration constants.
 *
 * Source of truth for all static configuration values.
 * Dynamic values (from environment variables) are accessed
 * via process.env directly — not stored here.
 */
export const siteConfig = {
  name: "Zehragn",
  description:
    "The official home of streamer Zehragn — live status, community, analytics, game suggestions, and more.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zehragn.com",
  kick: {
    channelSlug: process.env.KICK_CHANNEL_SLUG ?? "zehragn",
    channelUrl: "https://kick.com/zehragn",
  },
  social: {
    kick: "https://kick.com/zehragn",
    youtube: "https://youtube.com/@zehragn",
    twitter: "https://twitter.com/zehragn",
    instagram: "https://instagram.com/zehragn",
    discord: "https://discord.gg/zehragn",
    tiktok: "https://tiktok.com/@zehragn",
  },
  /** Navigation items for the global header */
  nav: [
    { label: "Live", href: "/live" },
    { label: "Analytics", href: "/analytics" },
    { label: "Community", href: "/community" },
    { label: "Gallery", href: "/gallery" },
    { label: "Timeline", href: "/timeline" },
    { label: "Setup", href: "/setup" },
    { label: "FAQ", href: "/faq" },
  ],
  /** Default Open Graph image */
  ogImage: "/og-image.png",
} as const;

export type SiteConfig = typeof siteConfig;
