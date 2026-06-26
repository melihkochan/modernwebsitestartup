"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScaleInProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition"> {
  delay?: number;
  duration?: number;
  /** Starting scale value (0–1). */
  from?: number;
}

/**
 * Wrapper that scales children from a smaller size while fading in.
 * Ideal for cards, modals, and popover content entrances.
 *
 * @example
 * <ScaleIn from={0.9} delay={0.05}>
 *   <GlassCard>...</GlassCard>
 * </ScaleIn>
 */
export function ScaleIn({
  delay = 0,
  duration = 0.3,
  from = 0.95,
  className,
  children,
  ...props
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: from }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
