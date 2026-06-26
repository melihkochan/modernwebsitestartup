"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const glassCardVariants = cva(
  [
    "relative flex flex-col overflow-hidden",
    "rounded-[var(--radius-lg)]",
    "transition-all duration-300",
  ],
  {
    variants: {
      intensity: {
        subtle: [
          "bg-[rgba(17,17,17,0.5)] backdrop-blur-md",
          "border border-[rgba(255,255,255,0.04)]",
        ],
        medium: [
          "bg-[rgba(17,17,17,0.7)] backdrop-blur-xl",
          "border border-[rgba(255,255,255,0.06)]",
        ],
        strong: [
          "bg-[rgba(10,10,10,0.85)] backdrop-blur-2xl",
          "border border-[rgba(255,255,255,0.08)]",
        ],
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      hoverable: {
        true: "cursor-pointer",
        false: "",
      },
      glow: {
        none: "",
        accent: "hover:border-[var(--accent-primary)]/30 hover:shadow-[0_0_32px_var(--accent-glow)]",
        live: "hover:border-[var(--live-red)]/30 hover:shadow-[0_0_32px_var(--live-red-glow)]",
      },
    },
    defaultVariants: {
      intensity: "medium",
      padding: "md",
      hoverable: false,
      glow: "none",
    },
  }
);

export interface GlassCardProps
  extends Omit<HTMLMotionProps<"div">, "ref">,
    VariantProps<typeof glassCardVariants> {
  /** Adds a subtle noise texture overlay for depth. */
  noise?: boolean;
}

/**
 * Glassmorphism card using Framer Motion for hover animations.
 * Has a backdrop blur, semi-transparent background, and optional glow on hover.
 *
 * @example
 * <GlassCard intensity="strong" glow="accent" hoverable>
 *   <h3>Live Now</h3>
 * </GlassCard>
 */
export function GlassCard({
  intensity,
  padding,
  hoverable,
  glow,
  noise = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        glassCardVariants({ intensity, padding, hoverable, glow }),
        noise && "noise-overlay",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
