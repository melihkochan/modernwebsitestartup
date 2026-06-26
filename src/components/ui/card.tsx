import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative flex flex-col overflow-hidden transition-all duration-200",
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--bg-surface)] border border-[var(--border-subtle)]",
          "rounded-[var(--radius-lg)]",
        ],
        elevated: [
          "bg-[var(--bg-elevated)] border border-[var(--border-default)]",
          "rounded-[var(--radius-lg)] shadow-[var(--shadow-md)]",
        ],
        ghost: [
          "bg-transparent border border-[var(--border-subtle)]",
          "rounded-[var(--radius-lg)]",
        ],
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      hoverable: {
        true: [
          "cursor-pointer",
          "hover:border-[var(--border-default)] hover:bg-[var(--bg-elevated)]",
        ],
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      hoverable: false,
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

/**
 * Base card container.
 *
 * @example
 * <Card variant="elevated" padding="lg" hoverable>
 *   <CardHeader />
 *   <CardBody />
 * </Card>
 */
export function Card({ variant, padding, hoverable, className, children, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding, hoverable }), className)} {...props}>
      {children}
    </div>
  );
}

/** Semantic card sub-components for structured content. */
export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
