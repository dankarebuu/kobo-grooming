import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallbackLabel?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}

/**
 * Natural-color editorial image frame with architectural hairline fallback on load error.
 */
export function EditorialImage({
  src,
  alt,
  className,
  imgClassName,
  fallbackLabel = "KŌBŌ",
  loading = "lazy",
  fetchPriority = "auto",
}: EditorialImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-architectural-fallback",
        className
      )}
    >
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            "h-full w-full object-cover img-editorial",
            isLoaded || loading === "eager" ? "opacity-100" : "opacity-0",
            imgClassName
          )}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full flex-col items-center justify-center gap-2 border border-hairline/60 p-4 text-center"
        >
          <span className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-ink">
            {fallbackLabel}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            SoHo Grooming Studio
          </span>
        </div>
      )}
    </div>
  );
}
