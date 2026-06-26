import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Overrides default max-width. Defaults to --max-width (1280px). */
  size?: "sm" | "md" | "lg" | "full";
  /** Removes horizontal padding — useful when nesting containers. */
  flush?: boolean;
}

const sizeMap = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  full: "max-w-full",
} as const;

/**
 * Site-wide container component.
 * Centers content with consistent horizontal padding.
 * Defaults to the architecture-defined max-width (1280px).
 */
export function Container({
  size,
  flush = false,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        size ? sizeMap[size] : "max-w-[var(--max-width)]",
        !flush && "px-8 md:px-12",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
