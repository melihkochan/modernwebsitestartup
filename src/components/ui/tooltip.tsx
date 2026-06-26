"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  /** Position of the tooltip relative to the trigger. */
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  /** Delay before tooltip shows (ms). */
  delay?: number;
}

const sideConfig = {
  top: {
    wrapper: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    initial: { y: 4 },
    arrow: "top-full left-1/2 -translate-x-1/2 border-t-[var(--bg-elevated)]",
  },
  bottom: {
    wrapper: "top-full left-1/2 -translate-x-1/2 mt-2",
    initial: { y: -4 },
    arrow: "bottom-full left-1/2 -translate-x-1/2 border-b-[var(--bg-elevated)]",
  },
  left: {
    wrapper: "right-full top-1/2 -translate-y-1/2 mr-2",
    initial: { x: 4 },
    arrow: "left-full top-1/2 -translate-y-1/2 border-l-[var(--bg-elevated)]",
  },
  right: {
    wrapper: "left-full top-1/2 -translate-y-1/2 ml-2",
    initial: { x: -4 },
    arrow: "right-full top-1/2 -translate-y-1/2 border-r-[var(--bg-elevated)]",
  },
} as const;

/**
 * Hover tooltip with directional positioning and Framer Motion fade animation.
 *
 * @example
 * <Tooltip content="Copy to clipboard" side="top">
 *   <IconButton aria-label="Copy" icon={<Copy />} />
 * </Tooltip>
 */
export function Tooltip({
  content,
  children,
  side = "top",
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const config = sideConfig[side];

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, ...config.initial }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...config.initial }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "pointer-events-none absolute z-50 whitespace-nowrap",
              "rounded-[var(--radius-md)] border border-[var(--border-default)]",
              "bg-[var(--bg-elevated)] px-3 py-1.5",
              "text-xs font-medium text-[var(--text-primary)]",
              "shadow-[var(--shadow-md)]",
              config.wrapper,
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
