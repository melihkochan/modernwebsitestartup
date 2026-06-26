import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium select-none shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[var(--bg-overlay)] text-[var(--text-secondary)] border border-[var(--border-subtle)]",
        accent: "bg-[var(--accent-glow)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/20",
        live: "bg-[var(--live-red-glow)] text-[var(--live-red)] border border-[var(--live-red)]/20",
        success: "bg-[rgba(52,199,89,0.12)] text-[var(--success)] border border-[var(--success)]/20",
        warning: "bg-[rgba(255,149,0,0.12)] text-[var(--warning)] border border-[var(--warning)]/20",
        error: "bg-[rgba(255,69,58,0.12)] text-[var(--error)] border border-[var(--error)]/20",
        outline: "bg-transparent text-[var(--text-secondary)] border border-[var(--border-default)]",
      },
      size: {
        sm: "h-5 px-2 text-[10px] rounded-[var(--radius-sm)] tracking-wide uppercase",
        md: "h-6 px-2.5 text-xs rounded-[var(--radius-sm)]",
        lg: "h-7 px-3 text-sm rounded-[var(--radius-md)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Renders a small colored dot before the label. */
  dot?: boolean;
}

const dotColorMap: Record<string, string> = {
  default: "bg-[var(--text-tertiary)]",
  accent: "bg-[var(--accent-primary)]",
  live: "bg-[var(--live-red)]",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  error: "bg-[var(--error)]",
  outline: "bg-[var(--text-tertiary)]",
};

/**
 * Status badge / label chip.
 *
 * @example
 * <Badge variant="live" dot>LIVE</Badge>
 * <Badge variant="success">Online</Badge>
 */
export function Badge({ variant = "default", size, dot, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          aria-hidden
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full shrink-0",
            dotColorMap[variant ?? "default"]
          )}
        />
      )}
      {children}
    </span>
  );
}
