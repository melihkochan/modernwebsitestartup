"use client";

import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  /** Magnetic pull strength (0–1). Higher = stronger pull. */
  strength?: number;
}

/**
 * Magnetic wrapper that pulls its children toward the cursor when nearby.
 * Wrap around Button or IconButton for a premium CTA effect.
 *
 * @example
 * <MagneticButton strength={0.35}>
 *   <Button size="xl">Watch Live</Button>
 * </MagneticButton>
 */
export function MagneticButton({
  strength = 0.3,
  className,
  children,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("inline-flex", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
