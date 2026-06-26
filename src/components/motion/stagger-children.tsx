"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface StaggerChildrenProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition" | "variants"> {
  /** Delay between each child animation (seconds). */
  staggerDelay?: number;
  /** Initial delay before the first child animates (seconds). */
  initialDelay?: number;
  /** Distance each child slides up from. */
  distance?: number;
  /** Duration of each individual child animation. */
  duration?: number;
}

/**
 * Stagger animation container. Direct children animate sequentially
 * with a slide-up + fade-in effect.
 *
 * @example
 * <StaggerChildren staggerDelay={0.08}>
 *   {clips.map(clip => <ClipCard key={clip.id} {...clip} />)}
 * </StaggerChildren>
 */
export function StaggerChildren({
  staggerDelay = 0.06,
  initialDelay = 0,
  distance = 16,
  duration = 0.4,
  className,
  children,
  ...props
}: StaggerChildrenProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: initialDelay,
        staggerChildren: staggerDelay,
      },
    },
  };

  // ease as const satisfies [number, number, number, number] for Framer Motion
  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, ease },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(className)}
      {...props}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants}>{children}</motion.div>}
    </motion.div>
  );
}
