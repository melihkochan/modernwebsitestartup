"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { IconButton } from "./icon-button";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  /** Side the drawer slides in from. */
  side?: "left" | "right";
  /** Width of the drawer panel. */
  width?: "sm" | "md" | "lg" | "full";
  dismissible?: boolean;
  className?: string;
}

const widthMap = {
  sm: "w-72",
  md: "w-80",
  lg: "w-96",
  full: "w-full",
} as const;

const slideVariants = {
  left: { hidden: { x: "-100%" }, visible: { x: 0 } },
  right: { hidden: { x: "100%" }, visible: { x: 0 } },
};

/**
 * Side-sliding Drawer panel with backdrop blur and Framer Motion animations.
 * Used for mobile navigation, filter panels, and detail views.
 *
 * @example
 * <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} side="left" title="Menu">
 *   <nav>...</nav>
 * </Drawer>
 */
export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  side = "right",
  width = "md",
  dismissible = true,
  className,
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) onClose();
    },
    [onClose, dismissible]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={dismissible ? onClose : undefined}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-hidden
          />

          <motion.div
            key="panel"
            initial={slideVariants[side].hidden}
            animate={slideVariants[side].visible}
            exit={slideVariants[side].hidden}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "drawer-title" : undefined}
            className={cn(
              "fixed top-0 z-50 h-full flex flex-col",
              "bg-[var(--bg-elevated)] border-[var(--border-default)]",
              "shadow-[var(--shadow-lg)]",
              side === "left" ? "left-0 border-r" : "right-0 border-l",
              widthMap[width],
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 p-5 border-b border-[var(--border-subtle)] shrink-0">
              <div>
                {title && (
                  <h2
                    id="drawer-title"
                    className="text-base font-semibold text-[var(--text-primary)]"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{description}</p>
                )}
              </div>
              {dismissible && (
                <IconButton
                  aria-label="Close drawer"
                  icon={<X />}
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="shrink-0"
                />
              )}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
