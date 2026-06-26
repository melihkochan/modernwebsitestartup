import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Text alignment. */
  align?: "left" | "center";
  /** Optional action element (e.g., a filter button or link). */
  action?: ReactNode;
  className?: string;
}

/**
 * Section heading with optional eyebrow label, description, and action slot.
 * Used to introduce every major content section on a page.
 *
 * @example
 * <SectionTitle
 *   eyebrow="This Month"
 *   title="Stream Analytics"
 *   description="Peak viewers, hours streamed, and follower growth."
 *   align="left"
 *   action={<TimeframeToggle />}
 * />
 */
export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div
        className={cn(
          "flex items-start justify-between gap-4 w-full",
          align === "center" && "flex-col items-center"
        )}
      >
        <div className={cn("flex flex-col gap-2", align === "center" && "items-center")}>
          {eyebrow && (
            <span
              className="label-eyebrow"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {eyebrow}
            </span>
          )}

          <h2
            className="text-2xl font-bold tracking-tight text-[var(--text-primary)] md:text-3xl"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {title}
          </h2>

          {description && (
            <p
              className={cn(
                "text-sm text-[var(--text-secondary)] leading-relaxed",
                align === "left" ? "max-w-xl" : "max-w-lg"
              )}
            >
              {description}
            </p>
          )}
        </div>

        {action && align === "left" && (
          <div className="shrink-0 mt-1">{action}</div>
        )}
      </div>

      {action && align === "center" && <div>{action}</div>}
    </div>
  );
}
