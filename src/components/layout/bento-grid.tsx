import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of base columns (default 3). */
  cols?: 3 | 4;
  gap?: "sm" | "md" | "lg";
}

interface BentoCellProps extends HTMLAttributes<HTMLDivElement> {
  /** Column span (at lg breakpoint). */
  span?: 1 | 2 | 3 | 4;
  /** Row span. */
  rowSpan?: 1 | 2;
}

const spanMap = { 1: "lg:col-span-1", 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4" } as const;
const rowSpanMap = { 1: "lg:row-span-1", 2: "lg:row-span-2" } as const;
const colsMap = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" } as const;
const gapMap = { sm: "gap-3", md: "gap-4", lg: "gap-6" } as const;

/**
 * Bento Grid container — asymmetric grid layout.
 * Cells default to 1 column on mobile, use `span` prop for desktop layout.
 *
 * @example
 * <BentoGrid cols={3} gap="md">
 *   <BentoCell span={2} rowSpan={2}>Large hero cell</BentoCell>
 *   <BentoCell span={1}>Stat</BentoCell>
 *   <BentoCell span={1}>Card</BentoCell>
 * </BentoGrid>
 */
export function BentoGrid({
  cols = 3,
  gap = "md",
  className,
  children,
  ...props
}: BentoGridProps) {
  return (
    <div
      className={cn("grid grid-cols-1", colsMap[cols], gapMap[gap], className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Individual Bento Grid cell.
 */
export function BentoCell({
  span = 1,
  rowSpan = 1,
  className,
  children,
  ...props
}: BentoCellProps) {
  return (
    <div
      className={cn(
        "col-span-1",
        spanMap[span],
        rowSpanMap[rowSpan],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
