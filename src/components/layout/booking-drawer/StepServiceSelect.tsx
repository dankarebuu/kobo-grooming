import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { BOOKING_ADDONS, SERVICE_CATEGORIES } from "../../../data/services";
import { SPRINGS } from "../../../lib/motion";
import { cn, formatCurrency, formatDuration } from "../../../lib/utils";
import type { GroomingService, ServiceCategory } from "../../../types/booking";

export interface StepServiceSelectProps {
  activeCategory: ServiceCategory;
  onCategoryChange: (category: ServiceCategory) => void;
  filteredServices: GroomingService[];
  selectedServiceId: string;
  onSelectService: (serviceId: string) => void;
  selectedAddonIds: string[];
  onToggleAddon: (addonId: string) => void;
}

export function StepServiceSelect({
  activeCategory,
  onCategoryChange,
  filteredServices,
  selectedServiceId,
  onSelectService,
  selectedAddonIds,
  onToggleAddon,
}: StepServiceSelectProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

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
    onCategoryChange(SERVICE_CATEGORIES[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-medium tracking-[-0.015em] text-ink">
          Select Service &amp; Enhancements
        </h2>
        <p className="mt-1 text-xs text-ink-secondary">
          Every session includes a tailored consultation and hot-lather finish.
        </p>
      </div>

      {/* Compact Category Tabs */}
      <div
        role="tablist"
        aria-label="Service categories"
        className="grid grid-cols-3 gap-1 rounded-sm border border-hairline-strong bg-plaster p-1"
      >
        {SERVICE_CATEGORIES.map((category, index) => {
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
              onClick={() => onCategoryChange(category.id)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              className={cn(
                "relative min-h-[40px] rounded-sm px-3 text-xs font-semibold tracking-wide transition-colors duration-150 cursor-pointer",
                isActive
                  ? "text-paper"
                  : "text-ink-secondary hover:text-ink"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="drawer-cat-tab"
                  transition={SPRINGS.snappy}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-sm bg-cypress"
                />
              )}
              <span className="relative z-10">{category.label}</span>
            </button>
          );
        })}
      </div>

      {/* Service Radio Cards */}
      <div
        className="space-y-2.5"
        role="radiogroup"
        aria-label="Grooming services"
      >
        {filteredServices.map((service) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <button
              key={service.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectService(service.id)}
              className={cn(
                "w-full rounded-sm border p-3.5 text-left transition-colors duration-150 cursor-pointer",
                isSelected
                  ? "border-cypress bg-cypress-soft"
                  : "border-hairline bg-plaster/50 hover:border-hairline-strong hover:bg-plaster"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-ink">
                      {service.name}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.06em] text-cypress">
                      {service.previewTag}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-ink-secondary">
                    {service.description}
                  </p>
                </div>

                <div className="shrink-0 text-right font-mono tabular-data">
                  <p className="text-sm font-medium text-ink">
                    {formatCurrency(service.price)}
                  </p>
                  <p className="text-[11px] text-ink-muted">
                    {formatDuration(service.durationMins)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Optional Add-ons */}
      <div className="space-y-3 border-t border-hairline pt-5">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-secondary">
            Enhance Your Session (Optional)
          </p>
          {selectedAddonIds.length > 0 && (
            <span className="font-mono text-[11px] text-cypress tabular-data">
              {selectedAddonIds.length} selected
            </span>
          )}
        </div>

        <div className="space-y-2">
          {BOOKING_ADDONS.map((addon) => {
            const isChecked = selectedAddonIds.includes(addon.id);
            return (
              <button
                key={addon.id}
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => onToggleAddon(addon.id)}
                className={cn(
                  "flex min-h-[44px] w-full items-center justify-between gap-3 rounded-sm border px-3.5 py-2.5 text-left transition-colors duration-150 cursor-pointer",
                  isChecked
                    ? "border-cypress bg-cypress-soft"
                    : "border-hairline bg-plaster/40 hover:border-hairline-strong"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                      isChecked
                        ? "border-cypress bg-cypress text-paper"
                        : "border-hairline-strong bg-paper"
                    )}
                  >
                    {isChecked && <Check className="h-3 w-3 stroke-[2.5]" />}
                  </span>
                  <span className="text-xs font-medium text-ink">
                    {addon.name}
                  </span>
                </div>

                <span className="shrink-0 font-mono text-xs text-ink-secondary tabular-data">
                  +{formatCurrency(addon.price)} / +{addon.durationMins}m
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
