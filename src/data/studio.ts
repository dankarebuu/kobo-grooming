import type { AtmosphereFrame, StudioHoursRow, TransitCue } from "../types/booking";

export const STUDIO_INFO = {
  name: "KŌBŌ Grooming",
  shortName: "KŌBŌ",
  address: "418 Mercer St, Suite 2B, SoHo, New York, NY 10012",
  streetAddress: "418 Mercer St, Suite 2B",
  neighborhood: "SoHo, New York, NY 10012",
  phone: "(212) 555-0194",
  phoneHref: "tel:+12125550194",
  email: "desk@kobogrooming.studio",
  emailHref: "mailto:desk@kobogrooming.studio",
  instagram: "@kobogrooming.nyc",
  hoursSummary: [
    { label: "Tue – Fri", hours: "10:00 AM – 8:00 PM" },
    { label: "Sat – Sun", hours: "9:00 AM – 6:00 PM" },
    { label: "Monday", hours: "Closed" },
  ],
} as const;

export const STUDIO_HOURS: StudioHoursRow[] = [
  {
    dayIndex: 2,
    dayName: "Tuesday",
    shortLabel: "Tue",
    hoursLabel: "10:00 AM – 8:00 PM",
    openTime: "10:00",
    closeTime: "20:00",
    isClosed: false,
  },
  {
    dayIndex: 3,
    dayName: "Wednesday",
    shortLabel: "Wed",
    hoursLabel: "10:00 AM – 8:00 PM",
    openTime: "10:00",
    closeTime: "20:00",
    isClosed: false,
  },
  {
    dayIndex: 4,
    dayName: "Thursday",
    shortLabel: "Thu",
    hoursLabel: "10:00 AM – 8:00 PM",
    openTime: "10:00",
    closeTime: "20:00",
    isClosed: false,
  },
  {
    dayIndex: 5,
    dayName: "Friday",
    shortLabel: "Fri",
    hoursLabel: "10:00 AM – 8:00 PM",
    openTime: "10:00",
    closeTime: "20:00",
    isClosed: false,
  },
  {
    dayIndex: 6,
    dayName: "Saturday",
    shortLabel: "Sat",
    hoursLabel: "9:00 AM – 6:00 PM",
    openTime: "09:00",
    closeTime: "18:00",
    isClosed: false,
  },
  {
    dayIndex: 0,
    dayName: "Sunday",
    shortLabel: "Sun",
    hoursLabel: "9:00 AM – 6:00 PM",
    openTime: "09:00",
    closeTime: "18:00",
    isClosed: false,
  },
  {
    dayIndex: 1,
    dayName: "Monday",
    shortLabel: "Mon",
    hoursLabel: "Closed",
    isClosed: true,
  },
];

export const TRANSIT_CUES: TransitCue[] = [
  { line: "6", station: "Spring St (6)", walkTime: "3 min walk" },
  { line: "R/W", station: "Prince St (R/W)", walkTime: "4 min walk" },
  { line: "B/D/F/M", station: "Broadway-Lafayette (B/D/F/M)", walkTime: "5 min walk" },
];

export const HERO_MEDIA = {
  imageUrl:
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1800&q=85",
  alt: "Minimalist architectural grooming studio interior at KŌBŌ Grooming in SoHo",
};

export const ATMOSPHERE_FRAMES: AtmosphereFrame[] = [
  {
    id: "main-floor",
    indexLabel: "01 / MAIN FLOOR",
    title: "Three Takara Belmont chairs in matte slate.",
    caption: "Spaced for unhurried sessions and acoustic calm off Mercer Street.",
    imageUrl:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1400&q=80",
    alt: "Three architectural barber chairs inside KŌBŌ Grooming main studio floor",
    gridSpanClass: "md:col-span-7",
    aspectClass: "aspect-[16/10]",
  },
  {
    id: "mizutani-steel",
    indexLabel: "02 / MIZUTANI STEEL",
    title: "Hand-forged Japanese shears.",
    caption: "Cobalt-alloy blades calibrated for dry-cut balance and point-cutting.",
    imageUrl:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80",
    alt: "Precision Japanese barber shears and grooming combs laid out on dark slate",
    gridSpanClass: "md:col-span-5",
    aspectClass: "aspect-[16/10]",
  },
  {
    id: "steam-towel",
    indexLabel: "03 / STEAM & TOWEL",
    title: "Eucalyptus hot-towel ritual.",
    caption: "Layered steam prep and cold-stone finish before every straight-razor pass.",
    imageUrl:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80",
    alt: "Hot towel and straight razor shave preparation at KŌBŌ Grooming",
    gridSpanClass: "md:col-span-5",
    aspectClass: "aspect-[4/3]",
  },
  {
    id: "apothecary",
    indexLabel: "04 / APOTHECARY",
    title: "Small-batch matte clays & cedar oils.",
    caption: "Unscented botanicals and Kyoto cedarwood formulations mixed for daily wear.",
    imageUrl:
      "https://images.unsplash.com/photo-1775126251005-09f10848a43c?auto=format&fit=crop&w=1400&q=80",
    alt: "Minimalist grooming apothecary bottles and cedar oils on studio shelf",
    gridSpanClass: "md:col-span-7",
    aspectClass: "aspect-[4/3]",
  },
];
