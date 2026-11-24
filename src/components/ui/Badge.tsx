import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

export type BadgeVariant = "default" | "cypress" | "brass" | "live" | "muted";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  pulseDot?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-stone text-ink-secondary border border-hairline",
  cypress: "bg-cypress-soft text-cypress border border-cypress/30",
  brass: "bg-brass-soft text-brass border border-brass/40",
  live: "bg-paper/95 text-ink border border-hairline-strong backdrop-blur-sm rounded-full",
  muted: "bg-stone/70 text-ink-muted border border-hairline",
};

/**
 * Compact metadata pill / badge with optional live-status pulsing indicator.
 */
export function Badge({
  className,
  variant = "default",
  pulseDot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-sm px-2.5 py-1 font-mono text-[11px] font-medium tracking-wider uppercase",
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    >
      {pulseDot && (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-status-live animate-kobo-pulse"
        />
      )}
      {children}
    </span>
  );
}
