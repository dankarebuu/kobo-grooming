import type { RefObject } from "react";
import {
  formatCurrency,
  formatDuration,
  formatTime12h,
  getRelativeDayLabel,
} from "../../../lib/utils";
import type { BookingAddon, GroomingService } from "../../../types/booking";
import { Input, Textarea } from "../../ui";
import type { FormErrors, GuestFormValues } from "./useBookingFlow";

export interface StepGuestFormProps {
  selectedService: GroomingService;
  selectedAddons: BookingAddon[];
  selectedBarberLabel: string;
  selectedDate: string;
  selectedTime: string;
  totalPrice: number;
  totalDuration: number;
  onEditStep: (step: 1 | 2) => void;
  guest: GuestFormValues;
  onGuestChange: (field: keyof GuestFormValues, value: string) => void;
  onGuestBlur: (field: keyof FormErrors) => void;
  formErrors: FormErrors;
  errorAnnouncement: string;
  submitError: string | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  nameInputRef: RefObject<HTMLInputElement | null>;
  phoneInputRef: RefObject<HTMLInputElement | null>;
  emailInputRef: RefObject<HTMLInputElement | null>;
}

export function StepGuestForm({
  selectedService,
  selectedAddons,
  selectedBarberLabel,
  selectedDate,
  selectedTime,
  totalPrice,
  totalDuration,
  onEditStep,
  guest,
  onGuestChange,
  onGuestBlur,
  formErrors,
  errorAnnouncement,
  submitError,
  onSubmit,
  nameInputRef,
  phoneInputRef,
  emailInputRef,
}: StepGuestFormProps) {
  return (
    <form
      id="kobo-guest-form"
      onSubmit={onSubmit}
      noValidate
      className="space-y-5"
    >
      <div>
        <h2 className="font-serif text-2xl font-medium tracking-[-0.015em] text-ink">
          Guest Details
        </h2>
        <p className="mt-1 text-xs text-ink-secondary">
          Instant chair reservation with calendar ticket and SMS/email confirmation.
        </p>
      </div>

      {/* Single polite live region for blur validation announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {errorAnnouncement}
      </div>

      {/* Compact Editable Recap Pill */}
      <div className="rounded-sm border border-hairline-strong bg-plaster p-3.5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cypress">
            Appointment Summary
          </span>
          <span className="font-mono text-xs font-medium text-ink tabular-data">
            {formatCurrency(totalPrice)} • {formatDuration(totalDuration)}
          </span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-ink">
              {selectedService.name}
              {selectedAddons.length > 0 &&
                ` + ${selectedAddons.map((a) => a.name).join(", ")}`}
            </p>
            <p className="font-mono text-[11px] text-ink-secondary tabular-data">
              {selectedBarberLabel} •{" "}
              {selectedDate ? getRelativeDayLabel(selectedDate) : "Date"}
              {selectedTime ? `, ${formatTime12h(selectedTime)}` : ""}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em]">
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-ink-secondary transition-colors hover:text-cypress cursor-pointer"
            >
              Service
            </button>
            <span aria-hidden="true" className="text-hairline-strong">
              /
            </span>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-ink-secondary transition-colors hover:text-cypress cursor-pointer"
            >
              Time
            </button>
          </div>
        </div>
      </div>

      {submitError && (
        <div
          role="alert"
          className="rounded-sm border border-status-error/40 bg-status-error/10 px-3.5 py-2.5 text-xs text-status-error"
        >
          {submitError}
        </div>
      )}

      <Input
        ref={nameInputRef}
        label="Full Name"
        name="name"
        autoComplete="name"
        placeholder="Marcus Vance"
        required
        value={guest.clientName}
        onChange={(e) => onGuestChange("clientName", e.target.value)}
        onBlur={() => onGuestBlur("clientName")}
        error={formErrors.clientName}
      />

      <Input
        ref={phoneInputRef}
        label="Mobile Number"
        name="tel"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="(917) 555-0148"
        required
        value={guest.clientPhone}
        onChange={(e) => onGuestChange("clientPhone", e.target.value)}
        onBlur={() => onGuestBlur("clientPhone")}
        error={formErrors.clientPhone}
      />

      <Input
        ref={emailInputRef}
        label="Email Address"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="marcus.vance@example.com"
        required
        value={guest.clientEmail}
        onChange={(e) => onGuestChange("clientEmail", e.target.value)}
        onBlur={() => onGuestBlur("clientEmail")}
        error={formErrors.clientEmail}
      />

      <Textarea
        label="Styling Notes (Optional)"
        placeholder="Guard size, neckline preference, or reference notes..."
        rows={3}
        value={guest.notes}
        onChange={(e) => onGuestChange("notes", e.target.value)}
      />
    </form>
  );
}
