"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 font-medium select-none",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
    "active:scale-[0.97]",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--accent-primary)] text-white",
          "hover:bg-[var(--accent-primary-hover)] hover:shadow-[0_0_24px_var(--accent-glow)]",
        ],
        outline: [
          "border border-[var(--border-default)] bg-transparent text-[var(--text-primary)]",
          "hover:border-[var(--border-strong)] hover:bg-[var(--bg-overlay)]",
        ],
        ghost: [
          "bg-transparent text-[var(--text-secondary)]",
          "hover:bg-[var(--bg-overlay)] hover:text-[var(--text-primary)]",
        ],
        destructive: [
          "bg-[var(--error)] text-white",
          "hover:opacity-90 hover:shadow-[0_0_20px_rgba(255,69,58,0.3)]",
        ],
        surface: [
          "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)]",
          "hover:border-[var(--border-default)] hover:bg-[var(--bg-elevated)]",
        ],
        link: [
          "bg-transparent text-[var(--accent-primary)] underline-offset-4",
          "hover:underline h-auto! px-0! py-0!",
        ],
      },
      size: {
        xs: "h-7 px-2.5 text-xs rounded-[var(--radius-sm)]",
        sm: "h-8 px-3 text-sm rounded-[var(--radius-sm)]",
        md: "h-10 px-4 text-sm rounded-[var(--radius-md)]",
        lg: "h-12 px-6 text-base rounded-[var(--radius-md)]",
        xl: "h-14 px-8 text-base rounded-[var(--radius-lg)] font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * Primary interactive UI element.
 *
 * @example
 * <Button variant="default" size="lg" leftIcon={<Play />}>Watch Live</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled ?? isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          leftIcon && <span className="shrink-0" aria-hidden>{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="shrink-0" aria-hidden>{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { buttonVariants };
