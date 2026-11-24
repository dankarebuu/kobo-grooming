import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { GROOMING_SERVICES, SERVICE_CATEGORIES } from "../../data/services";
import { ARCHITECTURAL_EASE, MOTION_DURATIONS, SPRINGS } from "../../lib/motion";
import { cn, formatCurrency, formatDuration } from "../../lib/utils";
import type { GroomingService, ServiceCategory } from "../../types/booking";
import { Button, Container, EditorialImage, SectionHeader } from "../ui";

export interface ServiceMenuSectionProps {
  onSelectService: (serviceId: string) => void;
}

export function ServiceMenuSection({ onSelectService }: ServiceMenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("cuts");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const filteredServices = useMemo(
    () => GROOMING_SERVICES.filter((s) => s.category === activeCategory),
    [activeCategory]
  );

  const [hoveredServiceId, setHoveredServiceId] = useState<string>(
    GROOMING_SERVICES[0].id
  );

  const activePreviewService: GroomingService = useMemo(() => {
    const matchInCategory = filteredServices.find((s) => s.id === hoveredServiceId);
    return matchInCategory ?? filteredServices[0] ?? GROOMING_SERVICES[0];
  }, [filteredServices, hoveredServiceId]);

  const handleCategoryChange = (category: ServiceCategory) => {
    setActiveCategory(category);
    const firstInCategory = GROOMING_SERVICES.find((s) => s.category === category);
    if (firstInCategory) {
      setHoveredServiceId(firstInCategory.id);
    }
  };

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const total = SERVICE_CATEGORIES.length;
    let nextIndex = index;

    if (event.key === "ArrowRight") nextIndex = (index + 1) % total;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + total) % total;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = total - 1;
    else return;

    event.preventDefault();
    const targetCategory = SERVICE_CATEGORIES[nextIndex];
    handleCategoryChange(targetCategory.id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section
      id="services"
      className="scroll-mt-24 border-b border-hairline bg-plaster py-20 md:py-28"
    >
      <Container className="space-y-10 md:space-y-12">
        <SectionHeader
          title="Tailored to Your Structure."
          subtitle="Every appointment is paced so your barber never rushes the finish. Select any discipline to lock your chair."
          action={
            <div
              role="tablist"
              aria-label="Service categories"
              className="inline-flex rounded-sm border border-hairline-strong bg-paper p-1"
            >
              {SERVICE_CATEGORIES.map((category, index) => {
                const count = GROOMING_SERVICES.filter(
                  (s) => s.category === category.id
                ).length;
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    type="button"
                    role="tab"
                    tabIndex={isActive ? 0 : -1}
                    aria-selected={isActive}
                    onClick={() => handleCategoryChange(category.id)}
                    onKeyDown={(e) => handleTabKeyDown(e, index)}
                    className={cn(
                      "relative inline-flex min-h-[40px] items-center gap-2 rounded-sm px-4 text-xs font-semibold tracking-wide transition-colors duration-150 cursor-pointer",
                      isActive
                        ? "text-paper"
                        : "text-ink-secondary hover:text-ink"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="service-tab-indicator"
                        transition={SPRINGS.snappy}
                        aria-hidden="true"
                        className="absolute inset-0 rounded-sm bg-cypress"
                      />
                    )}
                    <span className="relative z-10">{category.label}</span>
                    <span
                      className={cn(
                        "relative z-10 font-mono text-[10px] tabular-data",
                        isActive ? "text-paper/80" : "text-ink-muted"
                      )}
                    >
                      {String(count).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: Stacked Editorial Service Rows */}
          <div className="lg:col-span-8 divide-y divide-hairline border-y border-hairline">
            {filteredServices.map((service) => {
              const isHighlighted = activePreviewService.id === service.id;

              return (
                <article
                  key={service.id}
                  onMouseEnter={() => setHoveredServiceId(service.id)}
                  onFocus={() => setHoveredServiceId(service.id)}
                  className={cn(
                    "group relative flex flex-col justify-between gap-5 px-4 py-6 transition-colors duration-200 sm:flex-row sm:items-center sm:px-6",
                    isHighlighted ? "bg-paper" : "bg-transparent hover:bg-paper/75"
                  )}
                >
                  {/* 2px Cypress Accent Bar */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-y-0 left-0 w-[3px] bg-cypress transition-opacity duration-200",
                      isHighlighted
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    )}
                  />

                  <div className="space-y-2 sm:pr-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-[1.0625rem] sm:text-lg font-semibold tracking-[-0.015em] text-ink">
                        {service.name}
                      </h3>
                      <span className="rounded-sm border border-hairline bg-plaster px-2 py-0.5 font-mono text-[10px] tracking-[0.06em] text-cypress">
                        {service.previewTag}
                      </span>
                    </div>
                    <p className="max-w-[54ch] text-sm leading-relaxed text-ink-secondary">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-5 sm:justify-end">
                    <div className="text-left sm:text-right font-mono tabular-data">
                      <p className="text-base font-medium text-ink">
                        {formatCurrency(service.price)}
                      </p>
                      <p className="text-xs text-ink-muted">
                        {formatDuration(service.durationMins)}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectService(service.id)}
                    >
                      Select &amp; Book
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Right: Sticky Selected Craft Preview (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-28">
            <div className="rounded-sm border border-hairline bg-paper overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePreviewService.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{
                    duration: MOTION_DURATIONS.base,
                    ease: ARCHITECTURAL_EASE,
                  }}
                >
                  <div className="group relative aspect-[16/10] w-full border-b border-hairline overflow-hidden">
                    <EditorialImage
                      src={activePreviewService.imageUrl}
                      alt={activePreviewService.name}
                      className="h-full w-full"
                      imgClassName="group-hover:scale-[1.03]"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-sm border border-hairline bg-paper/95 px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-cypress backdrop-blur-sm">
                        {activePreviewService.previewTag}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5 p-6">
                    <div className="space-y-1.5">
                      <p className="font-mono text-[11px] text-ink-muted">
                        Included in session
                      </p>
                      <h3 className="font-serif text-2xl font-medium tracking-[-0.015em] text-ink">
                        {activePreviewService.name}
                      </h3>
                    </div>

                    <ul className="space-y-2 border-t border-hairline pt-4">
                      {activePreviewService.includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-secondary"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cypress" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between border-t border-hairline pt-4 font-mono tabular-data">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                          Duration
                        </p>
                        <p className="text-sm font-medium text-ink">
                          {formatDuration(activePreviewService.durationMins)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                          Rate
                        </p>
                        <p className="text-base font-semibold text-cypress">
                          {formatCurrency(activePreviewService.price)}
                        </p>
                      </div>
                    </div>

                    <Button
                      fullWidth
                      onClick={() => onSelectService(activePreviewService.id)}
                    >
                      Reserve This Service
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
