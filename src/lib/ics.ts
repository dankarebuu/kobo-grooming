import { STUDIO_INFO } from "../data/studio";
import type { BookingRecord } from "../types/booking";

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Formats local date and time components as an ICS floating timestamp (YYYYMMDDTHHMMSS).
 */
function formatIcsLocalTimestamp(date: Date): string {
  return [
    date.getFullYear(),
    pad2(date.getMonth() + 1),
    pad2(date.getDate()),
    "T",
    pad2(date.getHours()),
    pad2(date.getMinutes()),
    pad2(date.getSeconds()),
  ].join("");
}

/**
 * Formats a UTC Date as an ICS DTSTAMP (YYYYMMDDTHHMMSSZ).
 */
function formatIcsUtcTimestamp(date: Date): string {
  return [
    date.getUTCFullYear(),
    pad2(date.getUTCMonth() + 1),
    pad2(date.getUTCDate()),
    "T",
    pad2(date.getUTCHours()),
    pad2(date.getUTCMinutes()),
    pad2(date.getUTCSeconds()),
    "Z",
  ].join("");
}

/**
 * Escapes special characters per RFC 5545 text rules.
 */
function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Builds an RFC 5545 .ics calendar payload for a confirmed KŌBŌ appointment.
 */
export function generateIcsContent(booking: BookingRecord): string {
  const [yearStr, monthStr, dayStr] = booking.bookingDate.split("-");
  const [hourStr, minuteStr] = booking.bookingTime.split(":");

  const startDate = new Date(
    Number(yearStr),
    Number(monthStr) - 1,
    Number(dayStr),
    Number(hourStr),
    Number(minuteStr),
    0,
    0
  );
  const endDate = new Date(startDate.getTime() + booking.durationMins * 60_000);

  const addonsLine =
    booking.addonNames.length > 0
      ? `Add-ons: ${booking.addonNames.join(", ")}`
      : "Add-ons: None";

  const descriptionParts = [
    `Reference: ${booking.referenceCode}`,
    `Service: ${booking.serviceName}`,
    addonsLine,
    `Barber: ${booking.barberName}`,
    `Duration: ${booking.durationMins} min`,
    `Total: $${booking.totalPrice}`,
    booking.notes ? `Notes: ${booking.notes}` : null,
    `Studio Phone: ${STUDIO_INFO.phone}`,
  ].filter((part): part is string => Boolean(part));

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KOBO Grooming//SoHo Studio Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${booking.referenceCode}@kobogrooming.studio`,
    `DTSTAMP:${formatIcsUtcTimestamp(new Date())}`,
    `DTSTART:${formatIcsLocalTimestamp(startDate)}`,
    `DTEND:${formatIcsLocalTimestamp(endDate)}`,
    `SUMMARY:${escapeIcsText(`${STUDIO_INFO.name} — ${booking.serviceName}`)}`,
    `LOCATION:${escapeIcsText(STUDIO_INFO.address)}`,
    `DESCRIPTION:${escapeIcsText(descriptionParts.join("\n"))}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.join("\r\n")}\r\n`;
}

/**
 * Triggers a browser download for `kobo-appointment-KOBO-XXXX.ics`.
 */
export function downloadBookingIcs(booking: BookingRecord): void {
  const content = generateIcsContent(booking);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `kobo-appointment-${booking.referenceCode}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
