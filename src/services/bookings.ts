import { BARBERS, FIRST_AVAILABLE_ID, getBarberById } from "../data/barbers";
import { getAddonById, getServiceById } from "../data/services";
import {
  addDays,
  formatDateISO,
  formatTime12h,
  getRelativeDayLabel,
  parseDateISO,
} from "../lib/utils";
import type {
  AvailableSlot,
  Barber,
  BookingRecord,
  CreateBookingInput,
  UpcomingDay,
} from "../types/booking";

export const STORAGE_KEY = "kobo_demo_bookings_v1";

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

function buildTimeSlots(startHour: number, endHour: number): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour += 1) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
    if (hour < endHour) {
      slots.push(`${String(hour).padStart(2, "0")}:30`);
    }
  }
  return slots;
}

const WEEKDAY_SLOTS = buildTimeSlots(10, 19); // 10:00 AM – 7:00 PM
const WEEKEND_SLOTS = buildTimeSlots(9, 17); // 9:00 AM – 5:00 PM

/**
 * Returns valid appointment start times for a given YYYY-MM-DD studio date.
 * Mondays are closed (`[]`).
 */
export function getStudioSlotsForDate(dateStr: string): string[] {
  const day = parseDateISO(dateStr).getDay();
  if (day === 1) return [];
  if (day === 0 || day === 6) return WEEKEND_SLOTS;
  return WEEKDAY_SLOTS;
}

/**
 * Checks whether a barber is scheduled to work on the given YYYY-MM-DD date.
 */
export function isBarberWorkingOnDate(barber: Barber, dateStr: string): boolean {
  const day = parseDateISO(dateStr).getDay();
  return barber.workingDays.includes(day);
}

/**
 * Finds the next open studio date (skipping Mondays) starting at `startDate`.
 */
function findNextOpenDate(startDate: Date): Date {
  let cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  for (let i = 0; i < 7; i += 1) {
    if (cursor.getDay() !== 1) return cursor;
    cursor = addDays(cursor, 1);
  }
  return cursor;
}

/**
 * Builds 5 realistic seeded busy slots anchored dynamically to today and tomorrow
 * (or the next two open studio days when today/tomorrow falls on a Monday).
 */
export function createSeedBookings(now: Date = new Date()): BookingRecord[] {
  const firstOpenDay = findNextOpenDate(now);
  const secondOpenDay = findNextOpenDate(addDays(firstOpenDay, 1));

  const dayOneStr = formatDateISO(firstOpenDay);
  const dayTwoStr = formatDateISO(secondOpenDay);

  const dayOneBarbers = BARBERS.filter((b) => isBarberWorkingOnDate(b, dayOneStr));
  const dayTwoBarbers = BARBERS.filter((b) => isBarberWorkingOnDate(b, dayTwoStr));

  const pickBarber = (pool: Barber[], index: number): Barber =>
    pool[index % pool.length] ?? BARBERS[0];

  const seedTemplates: Array<{
    id: string;
    ref: string;
    date: string;
    time: string;
    barber: Barber;
    serviceId: string;
    clientName: string;
  }> = [
    {
      id: "seed-kobo-1",
      ref: "KOBO-4102",
      date: dayOneStr,
      time: dayOneBarbers.some((b) => b.id === "kenji") ? "11:00" : "10:30",
      barber: pickBarber(dayOneBarbers, 0),
      serviceId: "signature-cut",
      clientName: "Liam Vance",
    },
    {
      id: "seed-kobo-2",
      ref: "KOBO-4108",
      date: dayOneStr,
      time: "13:00",
      barber: pickBarber(dayOneBarbers, 1),
      serviceId: "skin-fade",
      clientName: "Noah Chen",
    },
    {
      id: "seed-kobo-3",
      ref: "KOBO-4115",
      date: dayOneStr,
      time: "15:30",
      barber: pickBarber(dayOneBarbers, 2),
      serviceId: "beard-sculpt",
      clientName: "Ethan Park",
    },
    {
      id: "seed-kobo-4",
      ref: "KOBO-4121",
      date: dayTwoStr,
      time: "10:30",
      barber: pickBarber(dayTwoBarbers, 0),
      serviceId: "full-ritual",
      clientName: "Miles Mercer",
    },
    {
      id: "seed-kobo-5",
      ref: "KOBO-4129",
      date: dayTwoStr,
      time: "14:00",
      barber: pickBarber(dayTwoBarbers, 1),
      serviceId: "scissor-long",
      clientName: "Julian Ross",
    },
  ];

  const createdAt = now.toISOString();

  return seedTemplates.map((seed) => {
    const service = getServiceById(seed.serviceId);
    return {
      id: seed.id,
      referenceCode: seed.ref,
      demo_slug: "kobo",
      serviceId: service?.id ?? "signature-cut",
      serviceName: service?.name ?? "The KŌBŌ Signature Cut",
      addonIds: [],
      addonNames: [],
      barberId: seed.barber.id,
      barberName: seed.barber.name,
      bookingDate: seed.date,
      bookingTime: seed.time,
      durationMins: service?.durationMins ?? 45,
      totalPrice: service?.price ?? 65,
      clientName: seed.clientName,
      clientPhone: "(212) 555-0100",
      clientEmail: "guest@kobogrooming.studio",
      isSeed: true,
      createdAt,
    };
  });
}

function writeBookingsToStorage(bookings: BookingRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch {
    // Ignore quota/storage access restrictions cleanly
  }
}

/**
 * Reads persisted bookings from localStorage, automatically seeding 5 realistic
 * busy slots on first visit or when existing seed data has rolled into the past.
 */
export function getBookings(now: Date = new Date()): BookingRecord[] {
  if (typeof window === "undefined") {
    return createSeedBookings(now);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = createSeedBookings(now);
      writeBookingsToStorage(seeded);
      return seeded;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seeded = createSeedBookings(now);
      writeBookingsToStorage(seeded);
      return seeded;
    }

    const records = parsed as BookingRecord[];
    const todayStr = formatDateISO(now);
    const hasCurrentOrFutureRecord = records.some((item) => item.bookingDate >= todayStr);

    if (!hasCurrentOrFutureRecord) {
      const seeded = createSeedBookings(now);
      writeBookingsToStorage(seeded);
      return seeded;
    }

    return records;
  } catch {
    const seeded = createSeedBookings(now);
    writeBookingsToStorage(seeded);
    return seeded;
  }
}

/**
 * Returns true if the slot date/time is in the past or less than 15 minutes from `now`.
 */
export function isSlotInPast(
  dateStr: string,
  time24: string,
  now: Date = new Date()
): boolean {
  const todayStr = formatDateISO(now);
  if (dateStr < todayStr) return true;
  if (dateStr > todayStr) return false;

  const [hoursStr, minsStr] = time24.split(":");
  const slotDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    Number(hoursStr),
    Number(minsStr),
    0,
    0
  );

  return slotDate.getTime() - now.getTime() < 15 * 60_000;
}

/**
 * Returns true when the slot is unavailable for the selected barber (or all barbers
 * when `barberId` is `first-available`).
 */
export function isSlotBooked(
  dateStr: string,
  time24: string,
  barberId: string,
  bookings: BookingRecord[] = getBookings()
): boolean {
  if (barberId === FIRST_AVAILABLE_ID) {
    const workingBarbers = BARBERS.filter((b) => isBarberWorkingOnDate(b, dateStr));
    if (workingBarbers.length === 0) return true;

    return workingBarbers.every((barber) =>
      bookings.some(
        (b) =>
          b.bookingDate === dateStr &&
          b.bookingTime === time24 &&
          b.barberId === barber.id
      )
    );
  }

  return bookings.some(
    (b) =>
      b.bookingDate === dateStr &&
      b.bookingTime === time24 &&
      b.barberId === barberId
  );
}

/**
 * Resolves a concrete barber for a slot, handling `first-available` cleanly.
 */
export function resolveBarberForSlot(
  dateStr: string,
  time24: string,
  preferredBarberId: string,
  bookings: BookingRecord[] = getBookings()
): Barber | null {
  if (preferredBarberId !== FIRST_AVAILABLE_ID) {
    const barber = getBarberById(preferredBarberId);
    if (!barber || !isBarberWorkingOnDate(barber, dateStr)) return null;
    if (isSlotBooked(dateStr, time24, barber.id, bookings)) return null;
    return barber;
  }

  const workingBarbers = BARBERS.filter((b) => isBarberWorkingOnDate(b, dateStr));
  for (const barber of workingBarbers) {
    if (!isSlotBooked(dateStr, time24, barber.id, bookings)) {
      return barber;
    }
  }
  return null;
}

/**
 * Generates an array of upcoming calendar days (default 7 days starting today).
 */
export function getUpcomingDays(
  count: number = 7,
  now: Date = new Date()
): UpcomingDay[] {
  const days: UpcomingDay[] = [];
  for (let i = 0; i < count; i += 1) {
    const dateObj = addDays(now, i);
    const dayOfWeek = dateObj.getDay();
    days.push({
      date: formatDateISO(dateObj),
      weekdayShort: WEEKDAY_SHORT[dayOfWeek],
      dayNumber: String(dateObj.getDate()),
      monthShort: MONTH_SHORT[dateObj.getMonth()],
      dayOfWeek,
      isToday: i === 0,
      isTomorrow: i === 1,
      isStudioClosed: dayOfWeek === 1,
    });
  }
  return days;
}

/**
 * Computes the earliest actually available slot across upcoming open days
 * for either the whole studio (`first-available`) or a specific barber.
 */
export function getNextAvailableSlot(
  barberId: string = FIRST_AVAILABLE_ID,
  bookings: BookingRecord[] = getBookings(),
  now: Date = new Date()
): AvailableSlot | null {
  const upcomingDays = getUpcomingDays(10, now);

  for (const day of upcomingDays) {
    if (day.isStudioClosed) continue;

    if (barberId !== FIRST_AVAILABLE_ID) {
      const barber = getBarberById(barberId);
      if (!barber || !isBarberWorkingOnDate(barber, day.date)) continue;
    }

    const slots = getStudioSlotsForDate(day.date);
    for (const time24 of slots) {
      if (isSlotInPast(day.date, time24, now)) continue;
      const assignedBarber = resolveBarberForSlot(day.date, time24, barberId, bookings);
      if (!assignedBarber) continue;

      const dayLabel = getRelativeDayLabel(day.date, now);
      return {
        date: day.date,
        time: time24,
        label: `${dayLabel}, ${formatTime12h(time24)}`,
        barberId: assignedBarber.id,
        barberName: assignedBarber.name,
      };
    }
  }

  return null;
}

function generateReferenceCode(existingBookings: BookingRecord[]): string {
  const existingCodes = new Set(existingBookings.map((b) => b.referenceCode));
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const num = Math.floor(1000 + Math.random() * 9000);
    const code = `KOBO-${num}`;
    if (!existingCodes.has(code)) return code;
  }
  return `KOBO-${String(Date.now()).slice(-4)}`;
}

/**
 * Validates and persists a new booking to localStorage under `kobo_demo_bookings_v1`.
 */
export function createBooking(
  input: CreateBookingInput,
  now: Date = new Date()
): BookingRecord {
  const service = getServiceById(input.serviceId);
  if (!service) {
    throw new Error("Selected grooming service was not found.");
  }

  if (isSlotInPast(input.bookingDate, input.bookingTime, now)) {
    throw new Error("Selected time slot is no longer available.");
  }

  const currentBookings = getBookings(now);
  const assignedBarber = resolveBarberForSlot(
    input.bookingDate,
    input.bookingTime,
    input.barberId,
    currentBookings
  );

  if (!assignedBarber) {
    throw new Error("That chair time was just reserved. Please pick another slot.");
  }

  const resolvedAddons = input.addonIds
    .map((id) => getAddonById(id))
    .filter((addon): addon is NonNullable<typeof addon> => Boolean(addon));

  const addonDuration = resolvedAddons.reduce((sum, a) => sum + a.durationMins, 0);
  const addonPrice = resolvedAddons.reduce((sum, a) => sum + a.price, 0);

  const record: BookingRecord = {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `kobo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    referenceCode: generateReferenceCode(currentBookings),
    demo_slug: "kobo",
    serviceId: service.id,
    serviceName: service.name,
    addonIds: resolvedAddons.map((a) => a.id),
    addonNames: resolvedAddons.map((a) => a.name),
    barberId: assignedBarber.id,
    barberName: assignedBarber.name,
    bookingDate: input.bookingDate,
    bookingTime: input.bookingTime,
    durationMins: service.durationMins + addonDuration,
    totalPrice: service.price + addonPrice,
    clientName: input.clientName.trim(),
    clientPhone: input.clientPhone.trim(),
    clientEmail: input.clientEmail.trim(),
    notes: input.notes?.trim() ? input.notes.trim() : undefined,
    isSeed: false,
    createdAt: now.toISOString(),
  };

  const nextBookings = [...currentBookings, record];
  writeBookingsToStorage(nextBookings);
  return record;
}

/**
 * Restores default availability by resetting localStorage to the 5 realistic seeded busy slots.
 */
export function resetDemoBookings(now: Date = new Date()): BookingRecord[] {
  const seeded = createSeedBookings(now);
  writeBookingsToStorage(seeded);
  return seeded;
}
