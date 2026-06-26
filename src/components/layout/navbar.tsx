"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface NavbarProps {
  /** Whether the streamer is currently live. */
  isLive?: boolean;
  /** Current viewer count (only shown when isLive). */
  viewerCount?: number;
}

/**
 * Global site navigation — sticky header with scroll-aware glass effect.
 *
 * Features:
 * - Transparent at page top → glass blur after 10px scroll
 * - Live status indicator with pulsing dot and viewer count
 * - Mobile: hamburger → full-screen slide-down menu
 * - Active route highlighting via Framer Motion layoutId
 */
export function Navbar({ isLive = false, viewerCount }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when the route changes (but not on first render)
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      // Defer to avoid calling setState synchronously inside the effect
      const id = setTimeout(() => setMobileOpen(false), 0);
      return () => clearTimeout(id);
    }
  }, [pathname]);

  const formattedViewers =
    viewerCount !== undefined
      ? viewerCount >= 1000
        ? `${(viewerCount / 1000).toFixed(1)}K`
        : viewerCount.toString()
      : null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40 h-[var(--header-height)] transition-all duration-300",
          scrolled
            ? "bg-[rgba(10,10,10,0.85)] backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-[var(--shadow-sm)]"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-full max-w-[var(--max-width)] items-center justify-between px-8 md:px-12">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-[var(--text-primary)] tracking-tight transition-opacity hover:opacity-80"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Zehragn
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {siteConfig.nav.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-1.5 text-sm font-medium transition-colors duration-150 rounded-[var(--radius-md)]",
                    isActive
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-[var(--radius-md)] bg-[var(--bg-overlay)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            {isLive && (
              <a
                href={siteConfig.kick.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--live-red)]/20 bg-[var(--live-red-glow)] px-3 py-1 text-xs font-semibold text-[var(--live-red)] transition-opacity hover:opacity-80"
              >
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                  <span
                    className="absolute inline-flex h-full w-full rounded-full bg-[var(--live-red)] opacity-75 animate-ping"
                  />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--live-red)]" />
                </span>
                LIVE
                {formattedViewers && (
                  <span className="text-[var(--text-secondary)] font-normal">
                    {formattedViewers}
                  </span>
                )}
              </a>
            )}

            {/* CTA button */}
            <a
              href={siteConfig.kick.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-3 h-8 text-sm font-medium transition-all duration-200",
                isLive
                  ? "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] hover:shadow-[0_0_24px_var(--accent-glow)]"
                  : "border border-[var(--border-default)] bg-transparent text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-overlay)]"
              )}
            >
              {isLive ? "Watch Live" : "Kick"}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)] hover:text-[var(--text-primary)] transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "fixed inset-x-0 top-[var(--header-height)] z-30 lg:hidden",
              "bg-[rgba(10,10,10,0.97)] backdrop-blur-2xl border-b border-[var(--border-subtle)]",
              "pb-6"
            )}
          >
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col px-6 pt-4 gap-1"
            >
              {siteConfig.nav.map((item, i) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center py-3 text-base font-medium border-b border-[var(--border-subtle)] transition-colors",
                        isActive
                          ? "text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      )}
                    >
                      {item.label}
                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="px-6 mt-4 flex gap-3">
              <a
                href={siteConfig.kick.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex-1 inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] h-8 text-sm font-medium transition-all",
                  isLive
                    ? "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]"
                    : "border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]"
                )}
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                {isLive ? "Watch Live" : "Kick Channel"}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
