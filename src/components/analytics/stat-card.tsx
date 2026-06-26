"use client";

import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "../motion/animated-counter";

interface StatCardProps {
  label: string;
  value: number;
  /** Unit suffix displayed after the number (e.g. "K", "%"). */
  suffix?: string;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    /** Signed percentage. Positive = up, negative = down. */
    value: number;
    label?: string;
  };
  /** Animate the number counting up on mount. */
  animate?: boolean;
  format?: (n: number) => string;
  className?: string;
}

/**
 * Statistics card showing a large animated metric with optional trend indicator.
 * Used in the Analytics page header row.
 *
 * @example
 * <StatCard label="Peak Viewers" value={12340} suffix="K" trend={{ value: 12.5 }} animate />
 */
export function StatCard({
  label,
  value,
  suffix,
  description,
  icon: Icon,
  trend,
  animate = true,
  format,
  className,
}: StatCardProps) {
  const isPositive = (trend?.value ?? 0) >= 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border-subtle)]",
        "bg-[var(--bg-surface)] p-5 transition-colors duration-200",
        "hover:border-[var(--border-default)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="label-eyebrow">{label}</span>
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--bg-overlay)] text-[var(--text-tertiary)]">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end gap-2">
        <span
          className="text-4xl font-bold tracking-tight text-[var(--text-primary)] tabular-nums"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {animate ? (
            <AnimatedCounter value={value} format={format} />
          ) : (
            format ? format(value) : value.toLocaleString()
          )}
        </span>
        {suffix && (
          <span className="mb-1 text-xl font-semibold text-[var(--text-secondary)]">
            {suffix}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {description && (
          <p className="text-xs text-[var(--text-tertiary)]">{description}</p>
        )}
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              isPositive ? "text-[var(--success)]" : "text-[var(--error)]"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" aria-hidden />
            )}
            <span>
              {isPositive ? "+" : ""}
              {trend.value.toFixed(1)}%
            </span>
            {trend.label && (
              <span className="text-[var(--text-tertiary)] font-normal">{trend.label}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
