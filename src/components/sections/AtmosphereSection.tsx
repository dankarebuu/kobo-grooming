import { useEffect, useRef, useState } from "react";
import { ATMOSPHERE_FRAMES } from "../../data/studio";
import { cn } from "../../lib/utils";
import { Container, EditorialImage, SectionHeader } from "../ui";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AtmosphereSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(() => prefersReducedMotion());

  useEffect(() => {
    if (isVisible) return;
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section
      id="studio"
      ref={sectionRef}
      data-surface="iron"
      className="scroll-mt-24 border-b border-iron-border bg-iron py-20 text-iron-ink md:py-28"
    >
      <Container className="space-y-10 md:space-y-12">
        <SectionHeader
          tone="iron"
          title="Designed for Calm Precision."
          subtitle="Cast-iron framing, Japanese cobalt steel, and quiet acoustics two flights above Mercer Street."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {ATMOSPHERE_FRAMES.map((frame, index) => (
            <figure
              key={frame.id}
              style={{
                transitionDelay: isVisible ? `${index * 80}ms` : "0ms",
              }}
              className={cn(
                "group overflow-hidden rounded-sm border border-iron-border bg-iron-elevated transition-[transform,opacity] duration-500 ease-out",
                frame.gridSpanClass,
                isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              )}
            >
              <div className={cn("w-full overflow-hidden", frame.aspectClass)}>
                <EditorialImage
                  src={frame.imageUrl}
                  alt={frame.alt}
                  fallbackLabel={frame.indexLabel}
                  className="h-full w-full"
                  imgClassName="group-hover:scale-[1.03]"
                />
              </div>

              <figcaption className="border-t border-iron-border bg-iron-elevated px-5 py-4">
                <p className="font-mono text-[10px] tracking-[0.14em] text-brass">
                  {frame.indexLabel}
                </p>
                <p className="mt-1 font-serif text-lg font-medium text-iron-ink">
                  {frame.title}
                </p>
                <p className="mt-0.5 text-xs text-iron-secondary">
                  {frame.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
