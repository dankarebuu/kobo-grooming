import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "iron-primary"
  | "iron-outline"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-cypress text-paper border border-cypress hover:bg-cypress-hover hover:border-cypress-hover",
  outline:
    "bg-transparent text-ink border border-hairline-strong hover:border-cypress hover:text-cypress",
  "iron-primary":
    "bg-paper text-iron border border-paper hover:bg-plaster hover:border-plaster",
  "iron-outline":
    "bg-transparent text-iron-ink border border-iron-border hover:border-brass hover:text-brass",
  ghost:
    "bg-transparent text-ink-secondary border border-transparent hover:bg-stone hover:text-ink",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-h-[44px] sm:min-h-[40px] px-4 text-xs tracking-wide",
  md: "min-h-[44px] px-6 text-sm tracking-wide",
  lg: "min-h-[48px] px-7 text-sm tracking-wide",
};

/**
 * Architectural button primitive enforcing 44px+ touch targets and sharp rounded-sm geometry.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      type = "button",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-sm font-semibold",
          "transition-[color,background-color,border-color,transform] duration-150 ease-out",
          "active:scale-[0.985] cursor-pointer select-none whitespace-nowrap",
          "disabled:pointer-events-none disabled:opacity-45",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
