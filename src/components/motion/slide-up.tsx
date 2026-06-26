"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface SlideUpProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition"> {
  delay?: number;
  duration?: number;
  /** Distance to slide from in pixels. */
  distance?: number;
}

/**
 * Wrapper that slides children up and fades them in on mount.
 * Primary entrance animation for content sections.
 *
 * @example
 * <SlideUp delay={0.1} distance={24}>
 *   <Card>...</Card>
 * </SlideUp>
 */
export function SlideUp({
  delay = 0,
  duration = 0.5,
  distance = 20,
  className,
  children,
  ...props
}: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
