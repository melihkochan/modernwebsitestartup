"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  /**
   * Unique key for the current page/route.
   * Change this value to trigger the transition animation.
   * Typically: the current pathname from usePathname().
   */
  pageKey: string;
}

/**
 * Page transition wrapper using AnimatePresence.
 * Wrap the page content inside the root layout to animate between routes.
 *
 * @example
 * // In layout.tsx:
 * const pathname = usePathname();
 * <PageTransition pageKey={pathname}>
 *   {children}
 * </PageTransition>
 */
export function PageTransition({ children, pageKey }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        style={{ minHeight: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
