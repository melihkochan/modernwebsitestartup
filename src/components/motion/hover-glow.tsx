"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type MouseEvent, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface HoverGlowProps extends HTMLAttributes<HTMLDivElement> {
  /** Glow color (CSS color string). */
  color?: string;
  /** Glow radius in pixels. */
  size?: number;
  /** Glow opacity (0–1). */
  opacity?: number;
}

/**
 * Wrapper that renders a radial gradient glow that follows the cursor
 * while hovering over the element.
 * Used on GlassCards and bento cells for a premium interactive feel.
 *
 * @example
 * <HoverGlow color="var(--accent-primary)" size={300}>
 *   <GlassCard>...</GlassCard>
 * </HoverGlow>
 */
export function HoverGlow({
  color = "var(--accent-primary)",
  size = 280,
  opacity = 0.12,
  className,
  children,
  style,
  ...props
}: HoverGlowProps) {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(-size);
  const mouseY = useMotionValue(-size);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const background = useTransform(
    [springX, springY],
    ([x, y]) =>
      `radial-gradient(${size}px circle at ${x as number}px ${y as number}px, ${color}, transparent 70%)`
  );

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-size);
    mouseY.set(-size);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative overflow-hidden", className)}
      style={style}
      {...props}
    >
      {/* Glow overlay */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
        style={{ background, opacity }}
      />
      {children}
    </div>
  );
}
