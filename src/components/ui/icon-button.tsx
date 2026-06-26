"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center shrink-0 select-none",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
    "active:scale-95",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]",
          "hover:border-[var(--border-default)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]",
        ],
        ghost: [
          "bg-transparent text-[var(--text-secondary)]",
          "hover:bg-[var(--bg-overlay)] hover:text-[var(--text-primary)]",
        ],
        accent: [
          "bg-[var(--accent-primary)] text-white",
          "hover:bg-[var(--accent-primary-hover)] hover:shadow-[0_0_20px_var(--accent-glow)]",
        ],
      },
      size: {
        xs: "h-7 w-7 rounded-[var(--radius-sm)] [&>svg]:h-3.5 [&>svg]:w-3.5",
        sm: "h-8 w-8 rounded-[var(--radius-sm)] [&>svg]:h-4 [&>svg]:w-4",
        md: "h-10 w-10 rounded-[var(--radius-md)] [&>svg]:h-5 [&>svg]:w-5",
        lg: "h-12 w-12 rounded-[var(--radius-md)] [&>svg]:h-5 [&>svg]:w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Accessible label — required for icon-only buttons. */
  "aria-label": string;
  icon: ReactNode;
}

/**
 * Icon-only button with accessible label.
 * Always requires `aria-label` for screen readers.
 *
 * @example
 * <IconButton aria-label="Close" icon={<X />} onClick={onClose} />
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(iconButtonVariants({ variant, size }), className)}
        {...props}
      >
        <span aria-hidden>{icon}</span>
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
