import { CalendarPlus, Mail, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { STUDIO_INFO } from "../../../data/studio";
import { downloadBookingIcs } from "../../../lib/ics";
import { ARCHITECTURAL_EASE, MOTION_DURATIONS, SPRINGS } from "../../../lib/motion";
import {
  cn,
  formatCurrency,
  formatDuration,
  formatTime12h,
  getRelativeDayLabel,
} from "../../../lib/utils";
import type { BookingRecord } from "../../../types/booking";
import { Badge, Button } from "../../ui";

export interface ConfirmationTicketProps {
  booking: BookingRecord;
  previewChannel: "sms" | "email";
  onChannelChange: (channel: "sms" | "email") => void;
}

const CHANNELS = ["sms", "email"] as const;

export function ConfirmationTicket({
  booking,
  previewChannel,
  onChannelChange,
}: ConfirmationTicketProps) {
  const channelRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleChannelKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const nextIdx = (index + 1) % CHANNELS.length;
      onChannelChange(CHANNELS[nextIdx]);
      channelRefs.current[nextIdx]?.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION_DURATIONS.slow, ease: ARCHITECTURAL_EASE }}
      className="space-y-5"
    >
      {/* Contrasting Cast-Iron Perforated Keepsake Ticket */}
      <div
        data-surface="iron"
        className="rounded-sm border border-iron-border bg-iron text-iron-ink"
      >
        <div className="flex items-center justify-between gap-3 border-b border-dashed border-iron-border px-4 py-4">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-brass/50 bg-brass-soft"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5 text-brass"
                fill="none"
              >
                <motion.path
                  d="M3.5 8.5L6.5 11.5L12.5 4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 0.38,
                    delay: 0.12,
                    ease: ARCHITECTURAL_EASE,
                  }}
                />
              </svg>
            </span>
            <Badge variant="brass">Chair Reserved</Badge>
          </div>
          <span className="font-mono text-sm font-medium tracking-wider text-iron-ink tabular-data">
            {booking.referenceCode}
          </span>
        </div>

        <div className="space-y-3.5 px-4 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-iron-muted">
              Service
            </p>
            <p className="mt-0.5 text-sm font-semibold text-iron-ink">
              {booking.serviceName}
            </p>
            {booking.addonNames.length > 0 && (
              <p className="mt-0.5 text-xs text-iron-secondary">
                + {booking.addonNames.join(" • ")}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-iron-border pt-3 text-xs">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-iron-muted">
                Craftsman
              </p>
              <p className="mt-0.5 font-medium text-iron-ink">
                {booking.barberName}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-iron-muted">
                Date &amp; Time
              </p>
              <p className="mt-0.5 font-mono font-medium text-iron-ink tabular-data">
                {getRelativeDayLabel(booking.bookingDate)},{" "}
                {formatTime12h(booking.bookingTime)}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-iron-muted">
                Duration
              </p>
              <p className="mt-0.5 font-mono text-iron-ink tabular-data">
                {formatDuration(booking.durationMins)}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-iron-muted">
                Total Due In Studio
              </p>
              <p className="mt-0.5 font-mono font-semibold text-brass tabular-data">
                {formatCurrency(booking.totalPrice)}
              </p>
            </div>
          </div>

          <div className="border-t border-dashed border-iron-border pt-3 text-xs text-iron-secondary">
            <p className="font-medium text-iron-ink">{STUDIO_INFO.name}</p>
            <p className="mt-0.5">{STUDIO_INFO.address}</p>
          </div>
        </div>
      </div>

      {/* Calendar Export */}
      <Button
        variant="outline"
        fullWidth
        onClick={() => downloadBookingIcs(booking)}
        className="justify-center"
      >
        <CalendarPlus className="h-4 w-4 text-cypress" />
        <span>Add to Calendar (.ics)</span>
      </Button>

      {/* Simulated SMS / Email Confirmation Preview */}
      <div className="rounded-sm border border-hairline bg-plaster/70 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
            Confirmation Preview
          </span>
          <div
            role="tablist"
            aria-label="Notification preview channel"
            className="inline-flex rounded-sm border border-hairline bg-paper p-0.5"
          >
            <button
              ref={(el) => {
                channelRefs.current[0] = el;
              }}
              type="button"
              role="tab"
              tabIndex={previewChannel === "sms" ? 0 : -1}
              aria-selected={previewChannel === "sms"}
              onClick={() => onChannelChange("sms")}
              onKeyDown={(e) => handleChannelKeyDown(e, 0)}
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer",
                previewChannel === "sms"
                  ? "text-paper"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {previewChannel === "sms" && (
                <motion.span
                  layoutId="preview-channel-tab"
                  transition={SPRINGS.snappy}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-sm bg-cypress"
                />
              )}
              <MessageSquare className="relative z-10 h-3 w-3" />
              <span className="relative z-10">SMS Preview</span>
            </button>
            <button
              ref={(el) => {
                channelRefs.current[1] = el;
              }}
              type="button"
              role="tab"
              tabIndex={previewChannel === "email" ? 0 : -1}
              aria-selected={previewChannel === "email"}
              onClick={() => onChannelChange("email")}
              onKeyDown={(e) => handleChannelKeyDown(e, 1)}
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer",
                previewChannel === "email"
                  ? "text-paper"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {previewChannel === "email" && (
                <motion.span
                  layoutId="preview-channel-tab"
                  transition={SPRINGS.snappy}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-sm bg-cypress"
                />
              )}
              <Mail className="relative z-10 h-3 w-3" />
              <span className="relative z-10">Email Preview</span>
            </button>
          </div>
        </div>

        {previewChannel === "sms" ? (
          <div className="rounded-sm border border-hairline bg-paper p-3 font-mono text-[11px] leading-relaxed text-ink-secondary">
            KŌBŌ Grooming: {booking.clientName}, your chair with{" "}
            {booking.barberName} ({booking.serviceName}) is confirmed for{" "}
            {getRelativeDayLabel(booking.bookingDate)} at{" "}
            {formatTime12h(booking.bookingTime)}. Ref: {booking.referenceCode}.
            418 Mercer St, Suite 2B.
          </div>
        ) : (
          <div className="rounded-sm border border-hairline bg-paper p-3 text-xs leading-relaxed text-ink-secondary space-y-1.5">
            <p className="font-mono text-[11px] text-ink">
              Subject: Chair Confirmed — {booking.referenceCode} | KŌBŌ Grooming
            </p>
            <p>
              Hi {booking.clientName}, we&apos;ve reserved your{" "}
              {booking.serviceName} with {booking.barberName} on{" "}
              {getRelativeDayLabel(booking.bookingDate)} at{" "}
              {formatTime12h(booking.bookingTime)} (
              {formatDuration(booking.durationMins)} •{" "}
              {formatCurrency(booking.totalPrice)}). Complimentary espresso and
              matcha await at 418 Mercer St, Suite 2B.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
