import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns at each breakpoint. */
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  colsMd?: 1 | 2 | 3 | 4 | 6 | 12;
  colsLg?: 1 | 2 | 3 | 4 | 6 | 12;
  /** Gap between grid items. */
  gap?: "none" | "sm" | "md" | "lg";
}

const colsMap = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
  12: "grid-cols-12",
} as const;

const colsMdMap = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  6: "md:grid-cols-6",
  12: "md:grid-cols-12",
} as const;

const colsLgMap = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  6: "lg:grid-cols-6",
  12: "lg:grid-cols-12",
} as const;

const gapMap = {
  none: "gap-0",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
} as const;

/**
 * Responsive CSS Grid layout component.
 * Mobile-first: defaults to 1 column, overrides with md/lg props.
 */
export function Grid({
  cols = 1,
  colsMd,
  colsLg,
  gap = "md",
  className,
  children,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        "grid",
        colsMap[cols],
        colsMd && colsMdMap[colsMd],
        colsLg && colsLgMap[colsLg],
        gapMap[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
