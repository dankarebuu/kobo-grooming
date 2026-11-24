export type ServiceCategory = "cuts" | "beard" | "packages";

export interface GroomingService {
  id: string;
  category: ServiceCategory;
  name: string;
  durationMins: number;
  price: number;
  description: string;
  previewTag: string;
  includes: string[];
  imageUrl: string;
}

export interface BookingAddon {
  id: string;
  name: string;
  durationMins: number;
  price: number;
}

export interface Barber {
  id: string;
  name: string;
  firstName: string;
  role: string;
  experienceYears: number;
  specialties: string[];
  workingDays: number[]; // 0 = Sun, 1 = Mon ... 6 = Sat
  scheduleLabel: string;
  bio: string;
  imageUrl: string;
}

export interface BookingRecord {
  id: string;
  referenceCode: string;
  demo_slug: "kobo";
  serviceId: string;
  serviceName: string;
  addonIds: string[];
  addonNames: string[];
  barberId: string;
  barberName: string;
  bookingDate: string; // YYYY-MM-DD
  bookingTime: string; // e.g., "14:30"
  durationMins: number;
  totalPrice: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes?: string;
  isSeed?: boolean;
  createdAt: string;
}

export interface ClientReview {
  id: string;
  quote: string;
  author: string;
  role: string;
  neighborhood: string;
  serviceName: string;
}

export interface StudioHoursRow {
  dayIndex: number; // 0 = Sun, 1 = Mon ... 6 = Sat
  dayName: string;
  shortLabel: string;
  hoursLabel: string;
  openTime?: string; // HH:mm
  closeTime?: string; // HH:mm
  isClosed: boolean;
}

export interface TransitCue {
  line: string;
  station: string;
  walkTime: string;
}

export interface AtmosphereFrame {
  id: string;
  indexLabel: string;
  title: string;
  caption: string;
  imageUrl: string;
  alt: string;
  gridSpanClass: string;
  aspectClass: string;
}

export interface AvailableSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  label: string; // e.g. "Today, 2:30 PM"
  barberId: string;
  barberName: string;
}

export interface UpcomingDay {
  date: string; // YYYY-MM-DD
  weekdayShort: string; // "Tue"
  dayNumber: string; // "25"
  monthShort: string; // "Nov"
  dayOfWeek: number; // 0..6
  isToday: boolean;
  isTomorrow: boolean;
  isStudioClosed: boolean;
}

export interface CreateBookingInput {
  serviceId: string;
  addonIds: string[];
  barberId: string;
  bookingDate: string;
  bookingTime: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes?: string;
}
