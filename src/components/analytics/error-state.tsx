"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  /** Override with a custom action. Defaults to a retry button. */
  action?: ReactNode;
  /** Called when the default retry button is clicked. */
  onRetry?: () => void;
  className?: string;
}

/**
 * Error state for data-fetching failures.
 * Shows a warning icon, message, and optional retry action.
 *
 * @example
 * <ErrorState
 *   title="Failed to load analytics"
 *   description={error.message}
 *   onRetry={refetch}
 * />
 */
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  action,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-14 text-center",
        "rounded-[var(--radius-xl)] border border-[var(--error)]/15",
        "bg-[rgba(255,69,58,0.04)]",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-xl)] bg-[rgba(255,69,58,0.1)] border border-[var(--error)]/20">
        <AlertTriangle className="h-5 w-5 text-[var(--error)]" aria-hidden />
      </div>

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

      {action ?? (
        onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-1 inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            Try again
          </button>
        )
      )}
    </div>
  );
}
