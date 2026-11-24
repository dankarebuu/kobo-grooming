import type { ClientReview } from "../types/booking";

export const CLIENT_REVIEWS: ClientReview[] = [
  {
    id: "review-daniel",
    quote:
      "Walked in with a vague reference photo and walked out with the sharpest cut I've had in New York. Booking took twenty seconds on my phone and my chair was ready the minute I stepped off Mercer.",
    author: "Daniel Cho",
    role: "Product Director",
    neighborhood: "Tribeca",
    serviceName: "The KŌBŌ Signature Cut",
  },
  {
    id: "review-julian",
    quote:
      "Most barbershops make you wait forty minutes even with an appointment. KŌBŌ runs like an architectural studio—quiet playlist, hot eucalyptus towel, zero rush, and an exact finish.",
    author: "Julian Mercer",
    role: "Architect",
    neighborhood: "SoHo",
    serviceName: "The Full KŌBŌ Ritual",
  },
  {
    id: "review-aaron",
    quote:
      "Devon's skin fade grows out cleaner than anywhere else in the city. Being able to pick my barber, add a hot towel, and drop it straight into Apple Calendar sealed it for me.",
    author: "Aaron Patel",
    role: "Founder",
    neighborhood: "West Village",
    serviceName: "Architectural Skin Fade",
  },
];
