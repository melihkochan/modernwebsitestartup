"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverLiftProps extends Omit<HTMLMotionProps<"div">, "whileHover" | "whileTap"> {
  /** Pixels to lift on hover. */
  amount?: number;
  /** Scale on hover. */
  scale?: number;
}

/**
 * Hover animation wrapper that lifts children on hover.
 * Used on interactive cards and gallery items.
 *
 * @example
 * <HoverLift amount={4}>
 *   <ClipCard />
 * </HoverLift>
 */
export function HoverLift({
  amount = 4,
  scale = 1.01,
  className,
  children,
  ...props
}: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{ y: -amount, scale }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
