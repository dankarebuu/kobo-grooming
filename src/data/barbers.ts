import type { Barber } from "../types/booking";

export const FIRST_AVAILABLE_ID = "first-available";

export const BARBERS: Barber[] = [
  {
    id: "kenji",
    name: "Kenji Sato",
    firstName: "Kenji",
    role: "Founder & Master Barber",
    experienceYears: 11,
    specialties: ["Scissor Craft", "Textured Crops", "Asian Hair"],
    workingDays: [2, 3, 4, 5, 6],
    scheduleLabel: "Tue – Sat",
    bio: "Trained in Shibuya and Manhattan. Known for dry-cut balance that holds its silhouette six weeks later.",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "devon",
    name: "Devon Brooks",
    firstName: "Devon",
    role: "Senior Barber",
    experienceYears: 8,
    specialties: ["Skin Fades", "Drop Tapers", "Razor Work"],
    workingDays: [0, 3, 4, 5, 6],
    scheduleLabel: "Wed – Sun",
    bio: "Specializes in ultra-clean gradient fades and razor-sharp geometry with zero irritation.",
    imageUrl:
      "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "mateo",
    name: "Mateo Silva",
    firstName: "Mateo",
    role: "Grooming Specialist",
    experienceYears: 7,
    specialties: ["Beard Architecture", "Hot Towel Shaves", "Classic Cuts"],
    workingDays: [2, 3, 4, 5, 6],
    scheduleLabel: "Tue – Sat",
    bio: "Masters traditional straight-razor rituals and structured beard proportions for every face shape.",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
  },
];

export function getBarberById(barberId: string): Barber | undefined {
  return BARBERS.find((barber) => barber.id === barberId);
}
