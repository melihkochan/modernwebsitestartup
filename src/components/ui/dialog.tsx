"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { IconButton } from "./icon-button";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  /** Max width of the dialog panel. */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Prevent closing by clicking backdrop. */
  dismissible?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-full mx-4",
} as const;

/**
 * Modal dialog with Framer Motion enter/exit animations, backdrop blur, and
 * keyboard escape support.
 *
 * @example
 * <Dialog open={isOpen} onClose={() => setIsOpen(false)} title="Confirm">
 *   <p>Are you sure?</p>
 * </Dialog>
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  dismissible = true,
  className,
}: DialogProps) {
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
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={dismissible ? onClose : undefined}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-hidden
          />

          {/* Panel */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "dialog-title" : undefined}
            aria-describedby={description ? "dialog-description" : undefined}
          >
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative w-full rounded-[var(--radius-xl)]",
                "bg-[var(--bg-elevated)] border border-[var(--border-default)]",
                "shadow-[var(--shadow-lg)] p-6",
                sizeMap[size],
                className
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  {title && (
                    <h2
                      id="dialog-title"
                      className="text-lg font-semibold text-[var(--text-primary)]"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id="dialog-description"
                      className="mt-1 text-sm text-[var(--text-secondary)]"
                    >
                      {description}
                    </p>
                  )}
                </div>
                {dismissible && (
                  <IconButton
                    aria-label="Close dialog"
                    icon={<X />}
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="-mt-1 -mr-1 shrink-0"
                  />
                )}
              </div>

              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
