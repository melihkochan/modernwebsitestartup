"use client";

import Link from "next/link";
import { usePublicSiteSettings } from "@/hooks/use-site-settings";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const { data: settings } = usePublicSiteSettings();
  const year = new Date().getFullYear();

  const streamerName = settings?.branding?.streamerName || "Zehragn";
  const kickUrl = settings?.social?.kickUrl || "https://kick.com/zehragn";

  const socialLinks = [
    { label: "Kick", href: settings?.social?.kickUrl || "https://kick.com/zehragn" },
    { label: "YouTube", href: settings?.social?.youtubeUrl || "https://youtube.com/@zehragn" },
    { label: "X / Twitter", href: settings?.social?.twitterUrl || "https://x.com/zehragn" },
    { label: "Instagram", href: settings?.social?.instagramUrl || "https://instagram.com/zehragn" },
    { label: "Discord", href: settings?.social?.discordUrl || "https://discord.gg/zehragn" },
  ];

  const navGroups = [
    {
      label: "Gezinti",
      links: siteConfig.nav,
    },
    {
      label: "Bağlantılar",
      links: socialLinks.map((s) => ({ ...s, isExternal: true })),
    },
    {
      label: "Yasal",
      links: [
        { label: "Gizlilik Politikası", href: "/privacy" },
        { label: "Kullanım Şartları", href: "/terms" },
        { label: "İletişim", href: "/contact" },
      ],
    },
  ];

  return (
    <footer
      className={cn(
        "relative overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--bg-base)]",
        className
      )}
    >
      {/* Ghosted wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-end justify-center overflow-hidden pb-4 select-none"
      >
        <span
          className="text-[clamp(5rem,20vw,14rem)] font-extrabold leading-none text-[var(--text-primary)] opacity-[0.02] tracking-tighter"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {streamerName}
        </span>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-[var(--max-width)] px-8 md:px-12 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="text-2xl font-bold text-[var(--text-primary)] tracking-tight"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {streamerName}
            </Link>
            <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed max-w-[200px]">
              Yayıncı {streamerName}'ın resmi web sitesi. Kick'te canlı yayında.
            </p>
            <a
              href={kickUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            >
              <span className="h-2 w-2 rounded-full bg-[var(--success)]" aria-hidden />
              {kickUrl.replace("https://", "")}
            </a>
          </div>

          {/* Link columns */}
          {navGroups.map((group) => (
            <div key={group.label}>
              <h3
                className="label-eyebrow mb-4 animate-fade-in"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {group.label}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {"isExternal" in link && link.isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[var(--border-subtle)] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-[var(--text-tertiary)]">
            © {year} {streamerName}. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-[var(--text-tertiary)]">
            Topluluk tarafından ❤️ ile yapılmıştır
          </p>
        </div>
      </div>
    </footer>
  );
}
