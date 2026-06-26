import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Semantic element to render. Defaults to "section". */
  as?: "section" | "div" | "article" | "main";
  /** Vertical padding variant. */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /** Applies a subtle top border separator. */
  divided?: boolean;
  /** Applies a radial accent gradient overlay at the top. */
  accentGlow?: boolean;
}

const paddingMap = {
  none: "",
  sm: "py-12",
  md: "py-16 lg:py-20",
  lg: "py-20 lg:py-28",
  xl: "py-28 lg:py-36",
} as const;

/**
 * Page section wrapper.
 * Handles vertical rhythm and optional decorative overlays.
 */
export function Section({
  as: Tag = "section",
  padding = "lg",
  divided = false,
  accentGlow = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(
        "relative w-full",
        paddingMap[padding],
        divided && "border-t border-[var(--border-subtle)]",
        className
      )}
      {...props}
    >
      {accentGlow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64 gradient-radial-accent"
        />
      )}
      {children}
    </Tag>
  );
}
