"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Hides the visible label while keeping it accessible. */
  hideLabel?: boolean;
}

/**
 * Styled text input with label, description, error state, and icon slots.
 *
 * @example
 * <Input label="Username" placeholder="zehragn" error={errors.username?.message} />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      description,
      error,
      leftIcon,
      rightIcon,
      hideLabel = false,
      id: providedId,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "text-sm font-medium text-[var(--text-primary)]",
              hideLabel && "sr-only"
            )}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span
              aria-hidden
              className="absolute left-3 flex h-full items-center text-[var(--text-tertiary)]"
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-describedby={
              error ? errorId : description ? descriptionId : undefined
            }
            aria-invalid={!!error}
            className={cn(
              "w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)]",
              "px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]",
              "transition-colors duration-150",
              "focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]",
              "hover:border-[var(--border-strong)]",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span
              aria-hidden
              className="absolute right-3 flex h-full items-center text-[var(--text-tertiary)]"
            >
              {rightIcon}
            </span>
          )}
        </div>

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

Input.displayName = "Input";
