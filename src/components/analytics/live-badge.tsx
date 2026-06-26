import { cn, formatNumber } from "@/lib/utils";

interface LiveBadgeProps {
  /** Whether the streamer is currently live. */
  isLive: boolean;
  viewerCount?: number;
  /** Display variant. */
  variant?: "full" | "compact" | "dot";
  className?: string;
}

/**
 * Live status indicator with animated pulsing dot.
 *
 * Variants:
 * - `full` — "● LIVE · 12,340 viewers" pill
 * - `compact` — "● LIVE" pill without count
 * - `dot` — just the animated red dot
 *
 * @example
 * <LiveBadge isLive={stream.isLive} viewerCount={stream.viewerCount} variant="full" />
 */
export function LiveBadge({ isLive, viewerCount, variant = "full", className }: LiveBadgeProps) {
  if (!isLive) {
    if (variant === "dot") {
      return (
        <span
          aria-label="Offline"
          className={cn("inline-block h-2.5 w-2.5 rounded-full bg-[var(--text-tertiary)]", className)}
        />
      );
    }
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-[var(--radius-full)]",
          "border border-[var(--border-default)] bg-[var(--bg-surface)]",
          "px-3 py-1 text-xs font-medium text-[var(--text-tertiary)]",
          className
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-tertiary)]" aria-hidden />
        OFFLINE
      </span>
    );
  }

  if (variant === "dot") {
    return (
      <span className={cn("relative flex h-2.5 w-2.5", className)} aria-label="Live">
        <span
          aria-hidden
          className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--live-red)] opacity-75"
        />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--live-red)]" />
      </span>
    );
  }

  return (
    <span
      aria-label={`Live${viewerCount ? `, ${formatNumber(viewerCount)} viewers` : ""}`}
      className={cn(
        "inline-flex items-center gap-2 rounded-[var(--radius-full)]",
        "border border-[var(--live-red)]/25 bg-[var(--live-red-glow)]",
        "px-3 py-1 text-xs font-semibold text-[var(--live-red)]",
        className
      )}
    >
      {/* Pulsing dot */}
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--live-red)] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--live-red)]" />
      </span>

      <span>LIVE</span>

      {variant === "full" && viewerCount !== undefined && viewerCount > 0 && (
        <>
          <span className="h-3 w-px bg-[var(--live-red)]/30" aria-hidden />
          <span className="font-normal text-[var(--text-secondary)]">
            {formatNumber(viewerCount)}
          </span>
        </>
      )}
    </span>
  );
}
