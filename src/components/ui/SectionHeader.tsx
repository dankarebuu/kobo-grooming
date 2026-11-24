import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  align?: "left" | "center";
  tone?: "light" | "iron";
}

/**
 * Editorial section header pairing Shippori Mincho H2 with optional quiet context.
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  className,
  align = "left",
  tone = "light",
}: SectionHeaderProps) {
  const isIron = tone === "iron";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center text-center",
        className
      )}
    >
      <div
        className={cn(
          "space-y-3",
          align === "center" && "flex flex-col items-center"
        )}
      >
        {eyebrow && (
          <p
            className={cn(
              "font-mono text-xs tracking-[0.08em]",
              isIron ? "text-brass" : "text-cypress"
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "font-serif font-medium tracking-[-0.02em] leading-[1.08] text-section-display",
            isIron ? "text-iron-ink" : "text-ink"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "max-w-[60ch] text-[0.9375rem] sm:text-base leading-[1.65] text-pretty",
              isIron ? "text-iron-secondary" : "text-ink-secondary"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
