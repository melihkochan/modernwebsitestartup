"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { LiveBadge } from "@/components/analytics";
import { FadeIn, MagneticButton, SlideUp } from "@/components/motion";
import { siteConfig } from "@/config/site";
import { formatNumber } from "@/lib/utils";
import { useStreamInfo } from "@/features/live/hooks/use-live";

/**
 * Hero Section — Full viewport cinematic opener.
 *
 * Visual layers (bottom to top):
 * 1. Base dark background
 * 2. Animated gradient orbs (slow drift)
 * 3. Dot grid pattern
 * 4. Mouse-following spotlight
 * 5. Noise texture overlay
 * 6. Content
 */
export function HeroSection() {
  const { data: streamInfo } = useStreamInfo();

  const isLive = streamInfo?.isLive ?? false;
  const viewerCount = streamInfo?.viewerCount ?? 0;

  // Use fixed initial values so SSR and client first render are identical.
  // After hydration, useEffect sets the real centre position.
  const mouseX = useMotionValue(760);
  const mouseY = useMotionValue(400);

  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  // Suppress hydration mismatch: only read window AFTER mount
  useEffect(() => {
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);
  }, [mouseX, mouseY]);

  const spotlightBg = useTransform(
    [springX, springY],
    ([x, y]) =>
      `radial-gradient(700px circle at ${x as number}px ${y as number}px, rgba(139,92,246,0.07), transparent 65%)`
  );

  return (
    <section
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[var(--bg-base)]"
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }}
      aria-label="Hero — Welcome to Zehragn's official website"
    >
      {/* ── Layer 1: Animated gradient orbs ─────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-right orb — large purple */}
        <motion.div
          className="absolute -top-40 -right-40 h-[700px] w-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Bottom-left orb — violet */}
        <motion.div
          className="absolute -bottom-60 -left-20 h-[500px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{ x: [0, -30, 50, 0], y: [0, 40, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        {/* Center-left accent — deep purple */}
        <motion.div
          className="absolute top-1/2 -left-32 h-[300px] w-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(109,40,217,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ x: [0, 20, -10, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 7 }}
        />
      </div>

      {/* ── Layer 2: Dot grid pattern ─────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── Layer 3: Mouse spotlight ──────────────────────────────────── */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: spotlightBg }}
      />

      {/* ── Layer 4: Noise overlay ────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="relative z-20 flex flex-1 flex-col items-center justify-center px-6 text-center pt-[var(--header-height)]">

        {/* Live badge */}
        <FadeIn delay={0.3}>
          <LiveBadge
            isLive={isLive}
            viewerCount={viewerCount}
            variant="full"
          />
        </FadeIn>

        {/* Main wordmark */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Zehragn"
          style={{
            fontSize: "clamp(3.5rem, 16vw, 13rem)",
            fontFamily: "var(--font-outfit)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 0.88,
            background:
              "linear-gradient(135deg, #ffffff 0%, #c4b5fd 45%, #8b5cf6 75%, #7c3aed 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ZEHRAGN
        </motion.h1>

        {/* Subtitle */}
        <SlideUp delay={0.55} distance={16}>
          <p
            className="mt-6 text-xs sm:text-sm tracking-[0.28em] uppercase font-semibold"
            style={{ fontFamily: "var(--font-inter)", color: "var(--accent-primary)" }}
          >
            Official Streaming Universe
          </p>
        </SlideUp>
 
        {/* Tagline */}
        <SlideUp delay={0.65} distance={12}>
          <p
            className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed"
            style={{ fontFamily: "var(--font-inter)", color: "#e4e4e7" }}
          >
            Live stats, community, clips, and everything else — in one cinematic experience.
          </p>
        </SlideUp>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.78 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <MagneticButton strength={0.25}>
            <a
              href={siteConfig.kick.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-[var(--radius-full)] bg-[var(--accent-primary)] px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--accent-primary-hover)] hover:shadow-[0_0_48px_rgba(139,92,246,0.45)]"
            >
              Watch Live
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </MagneticButton>

          <MagneticButton strength={0.2}>
            <a
              href="#analytics"
              className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--border-default)] px-8 py-3.5 text-sm font-medium text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]"
            >
              Explore
            </a>
          </MagneticButton>
        </motion.div>

        {/* Viewers indicator */}
        <FadeIn delay={0.95}>
          <p className="mt-8 text-xs text-[var(--text-tertiary)]">
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--live-red)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--live-red)]" />
              </span>
              {viewerCount > 0 ? `${formatNumber(viewerCount)} watching right now` : "Stream offline"}
            </span>
          </p>
        </FadeIn>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="relative z-20 mb-10 flex flex-col items-center gap-2"
        aria-hidden
      >
        <span
          className="text-[9px] tracking-[0.3em] uppercase text-[var(--text-tertiary)]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4 text-[var(--text-tertiary)]" />
        </motion.div>
      </motion.div>

      {/* ── Bottom gradient fade ──────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 inset-x-0 h-40 z-20"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--bg-base))",
        }}
      />
    </section>
  );
}
