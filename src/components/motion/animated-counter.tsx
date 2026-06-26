"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** Custom formatter function. Defaults to toLocaleString(). */
  format?: (n: number) => string;
  className?: string;
}

/**
 * Animated number counter that counts up from 0 when the element enters
 * the viewport. Uses Framer Motion spring interpolation for smooth easing.
 *
 * @example
 * <AnimatedCounter value={12345} duration={1.5} />
 * <AnimatedCounter value={98.7} format={(n) => `${n.toFixed(1)}%`} />
 */
export function AnimatedCounter({
  value,
  duration = 1.5,
  format,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
    stiffness: 60,
    damping: 20,
  });

  const display = useTransform(spring, (v) => {
    const rounded = Math.round(v);
    return format ? format(rounded) : rounded.toLocaleString();
  });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return (
    <motion.span ref={ref} className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  );
}
