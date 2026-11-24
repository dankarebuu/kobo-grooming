import { useMemo } from "react";
import { BARBERS } from "../../data/barbers";
import { getNextAvailableSlot } from "../../services/bookings";
import type { AvailableSlot, BookingRecord } from "../../types/booking";
import { Button, Container, EditorialImage, SectionHeader } from "../ui";

export interface BarbersSectionProps {
  bookings: BookingRecord[];
  onBookWithBarber: (barberId: string) => void;
  onQuickSlotClick: (slot: AvailableSlot) => void;
}

export function BarbersSection({
  bookings,
  onBookWithBarber,
  onQuickSlotClick,
}: BarbersSectionProps) {
  const nextSlotsByBarber = useMemo(() => {
    const map = new Map<string, AvailableSlot | null>();
    for (const barber of BARBERS) {
      map.set(barber.id, getNextAvailableSlot(barber.id, bookings));
    }
    return map;
  }, [bookings]);

  return (
    <section
      id="barbers"
      className="scroll-mt-24 border-b border-hairline bg-stone py-20 md:py-28"
    >
      <Container className="space-y-10 md:space-y-12">
        <SectionHeader
          title="Three Chairs. Zero Junior Cuts."
          subtitle="Every seat at KŌBŌ is held by a senior specialist. Choose your craftsman directly or book the earliest open chair."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {BARBERS.map((barber, index) => {
            const nextOpen = nextSlotsByBarber.get(barber.id) ?? null;
            const chairLabel = `Chair ${String(index + 1).padStart(2, "0")}`;

            return (
              <article
                key={barber.id}
                className="group flex flex-col justify-between rounded-sm border border-hairline bg-paper transition-[border-color,transform] duration-200 hover:border-hairline-strong hover:-translate-y-0.5"
              >
                <div>
                  <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-hairline">
                    <EditorialImage
                      src={barber.imageUrl}
                      alt={`${barber.name} — ${barber.role}`}
                      fallbackLabel={barber.firstName}
                      className="h-full w-full"
                      imgClassName="group-hover:scale-[1.03]"
                    />
                    <span className="absolute top-3 left-3 rounded-sm border border-hairline bg-paper/95 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-ink backdrop-blur-sm tabular-data">
                      {chairLabel}
                    </span>
                  </div>

                  <div className="space-y-4 p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-xl font-medium tracking-[-0.015em] text-ink">
                          {barber.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-ink-secondary">
                          {barber.role}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-sm border border-hairline bg-plaster px-2 py-1 font-mono text-[11px] text-ink-secondary tabular-data">
                        {barber.experienceYears} yrs
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-ink-secondary">
                      {barber.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {barber.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="rounded-sm border border-hairline bg-plaster px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] text-ink-secondary"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t border-hairline px-6 py-5">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono tabular-data">
                    <span className="text-ink-muted">{barber.scheduleLabel}</span>
                    {nextOpen ? (
                      <button
                        type="button"
                        onClick={() => onQuickSlotClick(nextOpen)}
                        className="text-right font-medium text-cypress transition-colors duration-150 hover:text-cypress-hover hover:underline cursor-pointer"
                      >
                        Next open: {nextOpen.label}
                      </button>
                    ) : (
                      <span className="text-ink-muted">Schedule full</span>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => onBookWithBarber(barber.id)}
                  >
                    Book with {barber.firstName}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
