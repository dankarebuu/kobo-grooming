import type { AvailableSlot } from "../../types/booking";
import { Button } from "../ui";

export interface MobileStickyBarProps {
  nextSlot: AvailableSlot | null;
  isDrawerOpen: boolean;
  onBookClick: () => void;
  onQuickSlotClick: (slot: AvailableSlot) => void;
}

export function MobileStickyBar({
  nextSlot,
  isDrawerOpen,
  onBookClick,
  onQuickSlotClick,
}: MobileStickyBarProps) {
  if (isDrawerOpen) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-paper/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
      role="region"
      aria-label="Quick booking bar"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        {nextSlot ? (
          <button
            type="button"
            onClick={() => onQuickSlotClick(nextSlot)}
            className="min-w-0 text-left cursor-pointer"
          >
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-cypress">
              NEXT OPEN
            </p>
            <p className="truncate font-mono text-xs font-medium text-ink tabular-data underline-offset-2 hover:underline">
              {nextSlot.label}
            </p>
          </button>
        ) : (
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-cypress">
              NEXT OPEN
            </p>
            <p className="truncate font-mono text-xs font-medium text-ink tabular-data">
              View schedule
            </p>
          </div>
        )}

        <Button
          size="md"
          onClick={onBookClick}
          className="shrink-0 px-5 text-xs uppercase tracking-[0.1em]"
        >
          Book a Chair
        </Button>
      </div>
    </div>
  );
}
