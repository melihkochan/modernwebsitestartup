import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Primary action (usually a Button). */
  action?: ReactNode;
  className?: string;
}

/**
 * Empty state display for when a data section has no content.
 * Used in Clips, Gallery, Suggestions, and any paginated list.
 *
 * @example
 * <EmptyState
 *   icon={Film}
 *   title="No clips yet"
 *   description="Top clips will appear here once the streamer goes live."
 *   action={<Button variant="outline">Refresh</Button>}
 * />
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-16 text-center",
        "rounded-[var(--radius-xl)] border border-dashed border-[var(--border-default)]",
        "bg-[var(--bg-surface)]",
        className
      )}
      aria-live="polite"
    >
      {Icon && (
        <div
          className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-xl)]"
          style={{
            background: "linear-gradient(135deg, var(--bg-elevated), var(--bg-overlay))",
            border: "1px solid var(--border-default)",
          }}
        >
          <Icon className="h-6 w-6 text-[var(--text-tertiary)]" aria-hidden />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <h3
          className="text-base font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
