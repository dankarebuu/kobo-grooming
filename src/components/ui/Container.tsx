import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
}

/**
 * Standard editorial page container (`max-w-6xl` with responsive horizontal padding).
 */
export function Container({
  as: Component = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
