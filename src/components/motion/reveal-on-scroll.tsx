"use client";

import { motion, useInView, type HTMLMotionProps, type Variants } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type RevealAnimation = "fade" | "slide-up" | "slide-left" | "scale";

interface RevealOnScrollProps extends Omit<HTMLMotionProps<"div">, "ref" | "initial" | "animate" | "transition" | "variants"> {
  animation?: RevealAnimation;
  /** Fraction of element visible before triggering (0–1). */
  threshold?: number;
  delay?: number;
  duration?: number;
}

const animationVariants: Record<RevealAnimation, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.93 },
    visible: { opacity: 1, scale: 1 },
  },
};

/**
 * Intersection-observer-based scroll reveal wrapper.
 * Animates children in when the element enters the viewport.
 * Only triggers once — does NOT re-animate on scroll out.
 *
 * @example
 * <RevealOnScroll animation="slide-up" delay={0.1}>
 *   <StatCard ... />
 * </RevealOnScroll>
 */
export function RevealOnScroll({
  animation = "slide-up",
  threshold = 0.15,
  delay = 0,
  duration = 0.55,
  className,
  children,
  ...props
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <motion.div
      ref={ref}
      variants={animationVariants[animation]}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration, delay, ease }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
