import type { BookingAddon, GroomingService, ServiceCategory } from "../types/booking";

export const SERVICE_CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: "cuts", label: "Cuts" },
  { id: "beard", label: "Beard" },
  { id: "packages", label: "Packages" },
];

export const GROOMING_SERVICES: GroomingService[] = [
  {
    id: "signature-cut",
    category: "cuts",
    name: "The KŌBŌ Signature Cut",
    durationMins: 45,
    price: 65,
    description:
      "Consultation, precision scissor & clipper work, hot lather neck shave, rinse, and matte finish.",
    previewTag: "Most Requested",
    includes: [
      "Structural head-shape consultation",
      "Scissor & clipper calibration",
      "Hot lather straight-razor neck finish",
      "Wash, dry, and matte clay styling",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1593702288056-7927b442d0fa?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "skin-fade",
    category: "cuts",
    name: "Architectural Skin Fade",
    durationMins: 45,
    price: 70,
    description:
      "Seamless zero-to-crown taper sculpted to head structure with crisp razor detailing.",
    previewTag: "Precision Taper",
    includes: [
      "Foil-shaved zero transition",
      "Crown & parietal balance work",
      "Straight-razor hairline detailing",
      "Soothing cedar aftershave mist",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "scissor-long",
    category: "cuts",
    name: "Scissor-Only Medium & Long",
    durationMins: 60,
    price: 80,
    description:
      "Dry and wet point-cutting tailored for natural movement and clean grow-out.",
    previewTag: "Zero Clippers",
    includes: [
      "Wet & dry Mizutani shear detailing",
      "Weight-removal layering for natural flow",
      "Wash & blow-dry silhouette shaping",
      "Six-week grow-out architecture",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "buzz-lineup",
    category: "cuts",
    name: "Single-Guard Buzz & Detail",
    durationMins: 25,
    price: 40,
    description:
      "Uniform guard pass paired with tapered temples, straight-razor hairline, and hot towel finish.",
    previewTag: "Express",
    includes: [
      "Uniform guard calibration",
      "Subtle temple & nape taper",
      "Straight-razor perimeter clean-up",
      "Eucalyptus hot towel finish",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1532710093739-9470acff878f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "beard-sculpt",
    category: "beard",
    name: "Beard Architecture & Razor Line",
    durationMins: 30,
    price: 45,
    description:
      "Geometric cheek and neckline shaping, clipper graduation, steam towel, and cedar beard oil.",
    previewTag: "Razor Finish",
    includes: [
      "Jawline & cheek angle mapping",
      "Graduated beard density sculpting",
      "Steam towel & straight-razor cheek line",
      "Small-batch Kyoto cedar beard oil",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1587909209111-5097ee578ec3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "hot-towel-shave",
    category: "beard",
    name: "Traditional Hot Towel Shave",
    durationMins: 40,
    price: 60,
    description:
      "Three eucalyptus hot towels, badger-brush lather, two-pass straight razor shave, and cold stone seal.",
    previewTag: "Ritual",
    includes: [
      "Three eucalyptus-infused steam towels",
      "Warm sandalwood badger-brush lather",
      "Two-pass Japanese straight-razor shave",
      "Chilled basalt stone pore seal",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1761148438883-e34e0289a214?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "beard-trim-express",
    category: "beard",
    name: "Express Beard Maintenance",
    durationMins: 20,
    price: 30,
    description:
      "Crisp outline tidy and stray-hair cleanup between full appointments.",
    previewTag: "Between Visits",
    includes: [
      "Freehand silhouette cleanup",
      "Neckline & mustache trim",
      "Warm towel wipe-down",
      "Light botanical conditioning balm",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1637613345105-e6e721ffa9d4?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "full-ritual",
    category: "packages",
    name: "The Full KŌBŌ Ritual",
    durationMins: 75,
    price: 105,
    description:
      "Signature Cut, Beard Architecture, eucalyptus steam towel sequence, and scalp tension massage.",
    previewTag: "Best Value",
    includes: [
      "Full Signature Cut & consultation",
      "Beard Architecture & razor detailing",
      "Eucalyptus steam towel sequence",
      "Tension-release scalp massage",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1668596029671-69efaaae388e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "executive-reset",
    category: "packages",
    name: "The Executive Reset",
    durationMins: 90,
    price: 130,
    description:
      "Scissor or Fade Cut, Traditional Hot Towel Shave, charcoal detox mask, and express styling.",
    previewTag: "Complete Session",
    includes: [
      "Tailored Scissor or Skin Fade Cut",
      "Two-pass Traditional Hot Towel Shave",
      "Matte charcoal clay detox mask",
      "Complimentary espresso or ceremonial matcha",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "father-son",
    category: "packages",
    name: "Weekend Duo (2 Chairs)",
    durationMins: 90,
    price: 120,
    description:
      "Two back-to-back or side-by-side Signature Cuts reserved under one single booking.",
    previewTag: "Two Guests",
    includes: [
      "Two full KŌBŌ Signature Cuts",
      "Side-by-side or consecutive chairs",
      "Hot lather neck shave for both guests",
      "Single unified calendar reservation",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1776850476481-2bccba2e35c7?auto=format&fit=crop&w=900&q=80",
  },
];

export const BOOKING_ADDONS: BookingAddon[] = [
  {
    id: "eucalyptus-steam",
    name: "Hot Towel & Eucalyptus Steam",
    durationMins: 10,
    price: 15,
  },
  {
    id: "scalp-massage",
    name: "Tension-Release Scalp Massage",
    durationMins: 10,
    price: 20,
  },
  {
    id: "charcoal-mask",
    name: "Matte Charcoal Detox Mask",
    durationMins: 15,
    price: 25,
  },
  {
    id: "grey-blending",
    name: "Natural Grey Blending Tone",
    durationMins: 15,
    price: 30,
  },
];

export function getServiceById(serviceId: string): GroomingService | undefined {
  return GROOMING_SERVICES.find((service) => service.id === serviceId);
}

export function getAddonById(addonId: string): BookingAddon | undefined {
  return BOOKING_ADDONS.find((addon) => addon.id === addonId);
}
