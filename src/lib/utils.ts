import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional Tailwind CSS class names cleanly without specificity collisions.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Date into local YYYY-MM-DD without UTC timezone drift.
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD string into a local Date set to midnight.
 */
export function parseDateISO(dateStr: string): Date {
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Returns a new Date shifted by the given number of local calendar days.
 */
export function addDays(date: Date, days: number): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + days);
  return copy;
}

/**
 * Converts 24-hour "HH:mm" time into "h:mm AM/PM" format.
 */
export function formatTime12h(time24: string): string {
  const [hoursStr, minsStr] = time24.split(":");
  const hours = Number(hoursStr);
  const mins = Number(minsStr);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${String(mins).padStart(2, "0")} ${period}`;
}

/**
 * Formats a dollar amount consistently as "$XX".
 */
export function formatCurrency(amount: number): string {
  return `$${amount}`;
}

/**
 * Formats duration in minutes as "XX min".
 */
export function formatDuration(mins: number): string {
  return `${mins} min`;
}

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * Returns "Today", "Tomorrow", or "Thu, Nov 27" for display in badges and tickets.
 */
export function getRelativeDayLabel(dateStr: string, now: Date = new Date()): string {
  const todayStr = formatDateISO(now);
  if (dateStr === todayStr) return "Today";

  const tomorrowStr = formatDateISO(addDays(now, 1));
  if (dateStr === tomorrowStr) return "Tomorrow";

  const parsed = parseDateISO(dateStr);
  const weekday = WEEKDAY_SHORT[parsed.getDay()];
  const month = MONTH_SHORT[parsed.getMonth()];
  return `${weekday}, ${month} ${parsed.getDate()}`;
}
