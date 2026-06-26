"use client";

import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
  /** Shows a character counter when maxLength is set. */
  showCount?: boolean;
}

/**
 * Styled multi-line textarea with label, description, error, and optional character counter.
 *
 * @example
 * <Textarea label="Message" maxLength={500} showCount placeholder="Write your message..." />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, description, error, showCount, maxLength, id: providedId, value, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={id} className="text-sm font-medium text-[var(--text-primary)]">
              {label}
            </label>
          )}
          {showCount && maxLength && (
            <span
              className={cn(
                "text-xs tabular-nums",
                currentLength >= maxLength
                  ? "text-[var(--error)]"
                  : "text-[var(--text-tertiary)]"
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={id}
          maxLength={maxLength}
          value={value}
          aria-describedby={error ? errorId : description ? descriptionId : undefined}
          aria-invalid={!!error}
          className={cn(
            "w-full min-h-[100px] resize-y rounded-[var(--radius-md)]",
            "border border-[var(--border-default)] bg-[var(--bg-surface)]",
            "px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]",
            "transition-colors duration-150",
            "focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]",
            "hover:border-[var(--border-strong)]",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]",
            className
          )}
          {...props}
        />

        {description && !error && (
          <p id={descriptionId} className="text-xs text-[var(--text-tertiary)]">
            {description}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-[var(--error)]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
