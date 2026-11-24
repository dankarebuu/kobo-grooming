import { UserCheck } from "lucide-react";
import { BARBERS, FIRST_AVAILABLE_ID, getBarberById } from "../../../data/barbers";
import {
  cn,
  formatTime12h,
  getRelativeDayLabel,
} from "../../../lib/utils";
import {
  isBarberWorkingOnDate,
  isSlotBooked,
  isSlotInPast,
} from "../../../services/bookings";
import type { BookingRecord, UpcomingDay } from "../../../types/booking";
import type { SlotGroup } from "./useBookingFlow";

export interface StepBarberDateTimeProps {
  selectedBarberId: string;
  onSelectBarber: (barberId: string) => void;
  upcomingDays: UpcomingDay[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  openCountByDate: Map<string, number>;
  daySlots: string[];
  groupedSlots: SlotGroup[];
  selectedTime: string;
  onSelectTime: (time24: string) => void;
  bookings: BookingRecord[];
}

export function StepBarberDateTime({
  selectedBarberId,
  onSelectBarber,
  upcomingDays,
  selectedDate,
  onSelectDate,
  openCountByDate,
  daySlots,
  groupedSlots,
  selectedTime,
  onSelectTime,
  bookings,
}: StepBarberDateTimeProps) {
  const selectedBarberObj =
    selectedBarberId === FIRST_AVAILABLE_ID
      ? null
      : getBarberById(selectedBarberId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-medium tracking-[-0.015em] text-ink">
          Choose Craftsman &amp; Time
        </h2>
        <p className="mt-1 text-xs text-ink-secondary">
          Live chair availability anchored to SoHo studio hours (Closed Mondays).
        </p>
      </div>

      {/* Barber Picker */}
      <div className="space-y-2.5">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-secondary">
          1. Craftsman
        </p>
        <div
          role="radiogroup"
          aria-label="Choose barber"
          className="grid grid-cols-2 gap-2"
        >
          <button
            type="button"
            role="radio"
            aria-checked={selectedBarberId === FIRST_AVAILABLE_ID}
            onClick={() => onSelectBarber(FIRST_AVAILABLE_ID)}
            className={cn(
              "flex min-h-[54px] flex-col justify-center rounded-sm border px-3 py-2.5 text-left transition-colors duration-150 cursor-pointer",
              selectedBarberId === FIRST_AVAILABLE_ID
                ? "border-cypress bg-cypress-soft"
                : "border-hairline bg-plaster/50 hover:border-hairline-strong"
            )}
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-ink">
              <UserCheck className="h-3.5 w-3.5 text-cypress" />
              First Available
            </span>
            <span className="mt-0.5 font-mono text-[10px] text-ink-muted">
              Earliest open chair
            </span>
          </button>

          {BARBERS.map((barber) => {
            const isSelected = selectedBarberId === barber.id;
            return (
              <button
                key={barber.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectBarber(barber.id)}
                className={cn(
                  "flex min-h-[54px] flex-col justify-center rounded-sm border px-3 py-2.5 text-left transition-colors duration-150 cursor-pointer",
                  isSelected
                    ? "border-cypress bg-cypress-soft"
                    : "border-hairline bg-plaster/50 hover:border-hairline-strong"
                )}
              >
                <span className="text-xs font-semibold text-ink">
                  {barber.name}
                </span>
                <span className="mt-0.5 font-mono text-[10px] text-ink-muted tabular-data">
                  {barber.scheduleLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7-Day Rolling Date Strip */}
      <div className="space-y-2.5">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-secondary">
          2. Date
        </p>
        <div
          role="radiogroup"
          aria-label="Choose appointment date"
          className="grid grid-cols-7 gap-1.5"
        >
          {upcomingDays.map((day) => {
            const isBarberOff =
              !day.isStudioClosed &&
              selectedBarberObj !== null &&
              !isBarberWorkingOnDate(selectedBarberObj, day.date);

            const isDisabled = day.isStudioClosed || isBarberOff;
            const isSelected = selectedDate === day.date && !isDisabled;
            const openCount = openCountByDate.get(day.date) ?? 0;

            return (
              <button
                key={day.date}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isDisabled}
                onClick={() => onSelectDate(day.date)}
                className={cn(
                  "relative flex min-h-[66px] flex-col items-center justify-center rounded-sm border px-1 py-2 transition-colors duration-150 tabular-data",
                  isDisabled
                    ? "cursor-not-allowed border-hairline/60 bg-stone/50 text-ink-muted opacity-60"
                    : isSelected
                    ? "border-cypress bg-cypress text-paper cursor-pointer"
                    : "border-hairline bg-plaster/60 text-ink-secondary hover:border-hairline-strong hover:text-ink cursor-pointer"
                )}
              >
                <span className="font-mono text-[10px] uppercase">
                  {day.weekdayShort}
                </span>
                <span
                  className={cn(
                    "mt-0.5 font-mono text-sm font-medium",
                    isSelected ? "text-paper" : "text-ink"
                  )}
                >
                  {day.dayNumber}
                </span>
                <span
                  className={cn(
                    "mt-0.5 font-mono text-[9px] uppercase tracking-wider",
                    isSelected ? "text-paper/80" : "text-ink-muted"
                  )}
                >
                  {day.isStudioClosed
                    ? "Closed"
                    : isBarberOff
                    ? "Off"
                    : day.isToday
                    ? "Today"
                    : day.monthShort}
                </span>
                {!isDisabled && openCount > 0 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1 h-1 w-1 rounded-full",
                      isSelected ? "bg-paper" : "bg-cypress/65"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time-Slot Groups */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-secondary">
            3. Chair Time
          </p>
          {selectedDate && (
            <span className="font-mono text-[11px] text-ink-muted">
              {getRelativeDayLabel(selectedDate)}
            </span>
          )}
        </div>

        {daySlots.length === 0 ? (
          <div className="rounded-sm border border-hairline bg-plaster/50 p-4 text-center text-xs text-ink-secondary">
            The studio is closed on Mondays. Please select another day above.
          </div>
        ) : (
          <div className="space-y-4">
            {groupedSlots.map((group) => {
              const openInGroup = group.slots.filter(
                (t) =>
                  !isSlotInPast(selectedDate, t) &&
                  !isSlotBooked(selectedDate, t, selectedBarberId, bookings)
              ).length;

              return (
                <div key={group.id} className="space-y-2">
                  <div className="flex items-center justify-between border-b border-hairline pb-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                      {group.label}
                    </span>
                    <span className="font-mono text-[10px] text-ink-muted tabular-data">
                      {openInGroup} open
                    </span>
                  </div>

                  <div
                    role="radiogroup"
                    aria-label={`${group.label} chair times`}
                    className="grid grid-cols-3 gap-2"
                  >
                    {group.slots.map((time24) => {
                      const past = isSlotInPast(selectedDate, time24);
                      const booked = isSlotBooked(
                        selectedDate,
                        time24,
                        selectedBarberId,
                        bookings
                      );
                      const isDisabled = past || booked;
                      const isSelected = selectedTime === time24 && !isDisabled;

                      return (
                        <button
                          key={time24}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          disabled={isDisabled}
                          onClick={() => onSelectTime(time24)}
                          className={cn(
                            "flex min-h-[46px] flex-col items-center justify-center rounded-sm border px-2 py-1.5 font-mono text-xs transition-colors duration-150 tabular-data",
                            isDisabled
                              ? "cursor-not-allowed border-hairline/60 bg-stone/50 text-ink-muted"
                              : isSelected
                              ? "border-cypress bg-cypress text-paper cursor-pointer"
                              : "border-hairline bg-plaster/60 text-ink hover:border-hairline-strong hover:bg-plaster cursor-pointer"
                          )}
                        >
                          <span className={cn(isDisabled && "line-through")}>
                            {formatTime12h(time24)}
                          </span>
                          {booked && (
                            <span className="text-[9px] uppercase tracking-wider text-ink-muted">
                              Booked
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
