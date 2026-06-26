"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface FadeInProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition"> {
  /** Delay before animation starts (seconds). */
  delay?: number;
  /** Animation duration (seconds). */
  duration?: number;
}

/**
 * Wrapper that fades children in on mount.
 *
 * @example
 * <FadeIn delay={0.2}>
 *   <HeroContent />
 * </FadeIn>
 */
export function FadeIn({ delay = 0, duration = 0.5, className, children, ...props }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
