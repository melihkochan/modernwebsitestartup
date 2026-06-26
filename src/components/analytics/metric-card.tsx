import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
    label?: string;
  };
  /** Accent color for the icon background and value. */
  accent?: "accent" | "live" | "success" | "warning";
  className?: string;
}

const accentMap = {
  accent: {
    icon: "bg-[var(--accent-glow)] text-[var(--accent-primary)]",
    value: "text-[var(--accent-primary)]",
  },
  live: {
    icon: "bg-[var(--live-red-glow)] text-[var(--live-red)]",
    value: "text-[var(--live-red)]",
  },
  success: {
    icon: "bg-[rgba(52,199,89,0.12)] text-[var(--success)]",
    value: "text-[var(--success)]",
  },
  warning: {
    icon: "bg-[rgba(255,149,0,0.12)] text-[var(--warning)]",
    value: "text-[var(--warning)]",
  },
};

const trendColorMap = {
  up: "text-[var(--success)]",
  down: "text-[var(--error)]",
  neutral: "text-[var(--text-tertiary)]",
};

/**
 * Compact metric card for inline stats panels.
 * Shows icon, value, title, and trend in a horizontal layout.
 *
 * @example
 * <MetricCard title="Avg. Viewers" value="4,820" trend={{ direction: "up", value: "+8%" }} icon={Users} />
 */
export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accent = "accent",
  className,
}: MetricCardProps) {
  const colors = accentMap[accent];

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-[var(--radius-lg)]",
        "border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4",
        "transition-colors duration-200 hover:border-[var(--border-default)]",
        className
      )}
    >
      {/* Icon */}
      {Icon && (
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)]", colors.icon)}>
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <span className="text-xs text-[var(--text-tertiary)] truncate">{title}</span>
        <span
          className={cn(
            "text-2xl font-bold tabular-nums tracking-tight",
            colors.value,
            "style={{ fontFamily: 'var(--font-outfit)' }}"
          )}
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-[var(--text-tertiary)] truncate">{subtitle}</span>
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div className={cn("flex flex-col items-end shrink-0 gap-0.5", trendColorMap[trend.direction])}>
          {trend.direction === "up" && <TrendingUp className="h-3.5 w-3.5" aria-hidden />}
          {trend.direction === "down" && <TrendingDown className="h-3.5 w-3.5" aria-hidden />}
          <span className="text-xs font-medium">{trend.value}</span>
          {trend.label && <span className="text-[10px] text-[var(--text-tertiary)]">{trend.label}</span>}
        </div>
      )}
    </div>
  );
}
