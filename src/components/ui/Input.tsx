import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

const CONTROL_BASE =
  "w-full rounded-sm bg-paper border px-3.5 text-sm text-ink placeholder:text-ink-muted transition-[border-color,background-color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cypress";

/**
 * Validated single-line input with daylight paper styling and visible keyboard focus.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, required, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="flex items-center justify-between text-xs font-medium tracking-wide text-ink-secondary"
        >
          <span>
            {label}
            {required && <span className="ml-1 text-cypress">*</span>}
          </span>
        </label>
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={cn(
            CONTROL_BASE,
            "min-h-[44px]",
            error
              ? "border-status-error focus:border-status-error"
              : "border-hairline-strong focus:border-cypress",
            className
          )}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-status-error">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-ink-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

/**
 * Validated multi-line textarea matching Input styling.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className, required, rows = 3, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={textareaId}
          className="flex items-center justify-between text-xs font-medium tracking-wide text-ink-secondary"
        >
          <span>
            {label}
            {required && <span className="ml-1 text-cypress">*</span>}
          </span>
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
          }
          className={cn(
            CONTROL_BASE,
            "py-3 resize-y",
            error
              ? "border-status-error focus:border-status-error"
              : "border-hairline-strong focus:border-cypress",
            className
          )}
          {...props}
        />
        {error ? (
          <p id={`${textareaId}-error`} className="text-xs text-status-error">
            {error}
          </p>
        ) : hint ? (
          <p id={`${textareaId}-hint`} className="text-xs text-ink-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
