import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartWrapperProps {
  title?: string;
  description?: string;
  /** Optional right-side control — e.g. a timeframe toggle or export button. */
  action?: ReactNode;
  /** Optional footer — e.g. a legend or data source note. */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Minimum height for the chart area. */
  chartHeight?: number | string;
}

/**
 * Container for Recharts chart components.
 * Provides consistent header (title + action), chart area, and footer.
 * The chart area has a `ResponsiveContainer`-friendly relative height.
 *
 * @example
 * <ChartWrapper
 *   title="Viewer History"
 *   description="Last 30 days"
 *   action={<TimeframeSelector />}
 *   chartHeight={280}
 * >
 *   <AreaChart data={data}>...</AreaChart>
 * </ChartWrapper>
 */
export function ChartWrapper({
  title,
  description,
  action,
  footer,
  children,
  className,
  chartHeight = 240,
}: ChartWrapperProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-[var(--radius-lg)] border border-[var(--border-subtle)]",
        "bg-[var(--bg-surface)] overflow-hidden",
        className
      )}
    >
      {/* Header */}
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-0">
          <div>
            {title && (
              <h3
                className="text-sm font-semibold text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {/* Chart Area */}
      <div
        className="w-full px-1 pt-4"
        style={{ height: typeof chartHeight === "number" ? `${chartHeight}px` : chartHeight }}
      >
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-5 pb-4 pt-2 border-t border-[var(--border-subtle)] mt-2">
          {footer}
        </div>
      )}
    </div>
  );
}
