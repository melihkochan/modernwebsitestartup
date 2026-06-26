import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/** Single skeleton shimmer bar. */
function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("skeleton", className)} aria-hidden="true" {...props} />;
}

interface LoadingSkeletonProps {
  variant?: "text" | "card" | "stat" | "chart" | "avatar" | "metric" | "table-row";
  /** Number of skeleton items to render (for list/table variants). */
  count?: number;
  className?: string;
}

/**
 * Context-aware loading skeleton that matches the shape of real components.
 *
 * @example
 * <LoadingSkeleton variant="stat" count={4} />
 * <LoadingSkeleton variant="chart" />
 */
export function LoadingSkeleton({ variant = "card", count = 1, className }: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  if (variant === "text") {
    return (
      <div className={cn("flex flex-col gap-2", className)} aria-busy="true" aria-label="Loading">
        {items.map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-4",
              i === items.length - 1 && count > 1 ? "w-3/4" : "w-full"
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === "avatar") {
    return (
      <div className={cn("flex items-center gap-3", className)} aria-busy="true">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-3.5 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    );
  }

  if (variant === "stat") {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)} aria-busy="true" aria-label="Loading statistics">
        {items.map((_, i) => (
          <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 flex flex-col gap-4">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-8 rounded-[var(--radius-md)]" />
            </div>
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div
        className={cn(
          "rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5",
          className
        )}
        aria-busy="true"
        aria-label="Loading chart"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-24 rounded-[var(--radius-full)]" />
        </div>
        {/* Fake bars */}
        <div className="flex items-end gap-2 h-40">
          {[60, 80, 45, 90, 70, 55, 75, 65, 85, 50, 78, 92].map((h, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-t-sm"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "metric") {
    return (
      <div className={cn("flex flex-col gap-3", className)} aria-busy="true">
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <Skeleton className="h-10 w-10 rounded-[var(--radius-md)] shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table-row") {
    return (
      <div className={cn("flex flex-col gap-0", className)} aria-busy="true">
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-[var(--border-subtle)]">
            <Skeleton className="h-8 w-8 rounded-[var(--radius-md)] shrink-0" />
            <Skeleton className="h-3.5 flex-1" />
            <Skeleton className="h-3.5 w-16 shrink-0" />
            <Skeleton className="h-3.5 w-12 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  // Default: card
  return (
    <div className={cn("grid grid-cols-1 gap-4", count > 1 && "sm:grid-cols-2", className)} aria-busy="true">
      {items.map((_, i) => (
        <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 flex flex-col gap-3">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3.5 w-1/2 mt-2" />
        </div>
      ))}
    </div>
  );
}
