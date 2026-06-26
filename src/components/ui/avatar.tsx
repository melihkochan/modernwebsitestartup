import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full select-none",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-[10px]",
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
        "2xl": "h-20 w-20 text-xl",
      },
      ring: {
        none: "",
        default: "ring-2 ring-[var(--border-default)]",
        accent: "ring-2 ring-[var(--accent-primary)]",
        live: "ring-2 ring-[var(--live-red)]",
      },
    },
    defaultVariants: {
      size: "md",
      ring: "none",
    },
  }
);

export interface AvatarProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  /** Fallback initials or character when no image is available. */
  fallback?: string;
}

/**
 * User avatar with image and text fallback.
 *
 * @example
 * <Avatar src={user.avatarUrl} fallback="ZG" ring="accent" size="lg" />
 */
export function Avatar({
  src,
  alt = "Avatar",
  fallback,
  size,
  ring,
  className,
  ...props
}: AvatarProps) {
  const initials = fallback?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <div
      className={cn(
        avatarVariants({ size, ring }),
        "bg-[var(--bg-elevated)] border border-[var(--border-subtle)]",
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="80px"
        />
      ) : (
        <span
          className="font-semibold text-[var(--text-secondary)]"
          style={{ fontFamily: "var(--font-inter)" }}
          aria-label={alt}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
