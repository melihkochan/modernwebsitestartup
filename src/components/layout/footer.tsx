import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const socialLinks = [
  { label: "Kick", href: siteConfig.social.kick },
  { label: "YouTube", href: siteConfig.social.youtube },
  { label: "Twitter", href: siteConfig.social.twitter },
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "Discord", href: siteConfig.social.discord },
  { label: "TikTok", href: siteConfig.social.tiktok },
];

const navGroups = [
  {
    label: "Navigate",
    links: siteConfig.nav,
  },
  {
    label: "Connect",
    links: socialLinks.map((s) => ({ ...s, isExternal: true })),
  },
  {
    label: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/**
 * Global site footer — multi-column layout with ghosted wordmark backdrop.
 */
export function Footer({ className }: FooterProps) {
  const year = new Date().getFullYear();

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
          Zehragn
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
              Zehragn
            </Link>
            <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed max-w-[200px]">
              Official home of streamer Zehragn. Live on Kick.
            </p>
            <a
              href={siteConfig.kick.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            >
              <span className="h-2 w-2 rounded-full bg-[var(--success)]" aria-hidden />
              kick.com/zehragn
            </a>
          </div>

          {/* Link columns */}
          {navGroups.map((group) => (
            <div key={group.label}>
              <h3
                className="label-eyebrow mb-4"
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
            © {year} Zehragn. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-tertiary)]">
            Made with ❤️ by the community
          </p>
        </div>
      </div>
    </footer>
  );
}
