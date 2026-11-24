# SPEC.md — KŌBŌ Grooming (Demo 1)

## 1. Product Positioning & Technical Architecture

- **Target Buyer**: Luxury barbershops, grooming studios, salons, tattoo studios, and hospitality venues looking for a Standard-tier ($165) dark-mode website with a frictionless custom booking experience.
- **Stack**: Vite, React 19/18, TypeScript (strict), Tailwind CSS v4 (`@tailwindcss/vite`), `lucide-react`, `clsx`, `tailwind-merge`.
- **Persistence Layer**: Pure client-side React state persisted to `localStorage` (`kobo_demo_bookings_v1`) so Demo 1 deploys with zero external keys required and clearly differentiates the Standard tier (client-side booking flow + `.ics` calendar export) from Demo 2/3's live Supabase database backend. Structure `src/services/bookings.ts` cleanly so records match the shared `demo_bookings` field shape if upgraded later.
- **Browser Metadata (`index.html`)**:
  - Title: `KŌBŌ Grooming — Precision Barbershop & Studio, SoHo NYC`
  - Description: `Architectural grooming studio in SoHo. Reserve tailored scissor cuts, skin fades, and hot towel shaves online in under 30 seconds.`

---

## 2. Studio Facts & Real Domain Data (`src/data/`)

Do not invent placeholder names or Lorem Ipsum. Use these exact studio details across all components:

- **Studio Name**: `KŌBŌ Grooming`
- **Address**: `418 Mercer St, Suite 2B, SoHo, New York, NY 10012`
- **Phone**: `(212) 555-0194`
- **Email**: `desk@kobogrooming.studio`
- **Instagram Handle**: `@kobogrooming.nyc`
- **Operating Hours**:
  - Tuesday – Friday: `10:00 AM – 8:00 PM`
  - Saturday – Sunday: `9:00 AM – 6:00 PM`
  - Monday: `Closed`
- **Transit Cues (for Map Card)**:
  - `Spring St (6) — 3 min walk`
  - `Prince St (R/W) — 4 min walk`
  - `Broadway-Lafayette (B/D/F/M) — 5 min walk`

### Services Catalog (`src/data/services.ts`)

| ID                   | Category   | Name                            | Duration | Price | Craft Description                                                                                     | Preview Tag        |
| -------------------- | ---------- | ------------------------------- | -------- | ----- | ----------------------------------------------------------------------------------------------------- | ------------------ |
| `signature-cut`      | `cuts`     | The KŌBŌ Signature Cut          | 45 min   | $65   | Consultation, precision scissor & clipper work, hot lather neck shave, rinse, and matte finish.       | `Most Requested`   |
| `skin-fade`          | `cuts`     | Architectural Skin Fade         | 45 min   | $70   | Seamless zero-to-crown taper sculpted to head structure with crisp razor detailing.                   | `Precision Taper`  |
| `scissor-long`       | `cuts`     | Scissor-Only Medium & Long      | 60 min   | $80   | Dry and wet point-cutting tailored for natural movement and clean grow-out.                           | `Zero Clippers`    |
| `buzz-lineup`        | `cuts`     | Single-Guard Buzz & Detail      | 25 min   | $40   | Uniform guard pass paired with tapered temples, straight-razor hairline, and hot towel finish.        | `Express`          |
| `beard-sculpt`       | `beard`    | Beard Architecture & Razor Line | 30 min   | $45   | Geometric cheek and neckline shaping, clipper graduation, steam towel, and cedar beard oil.           | `Razor Finish`     |
| `hot-towel-shave`    | `beard`    | Traditional Hot Towel Shave     | 40 min   | $60   | Three eucalyptus hot towels, badger-brush lather, two-pass straight razor shave, and cold stone seal. | `Ritual`           |
| `beard-trim-express` | `beard`    | Express Beard Maintenance       | 20 min   | $30   | Crisp outline tidy and stray-hair cleanup between full appointments.                                  | `Between Visits`   |
| `full-ritual`        | `packages` | The Full KŌBŌ Ritual            | 75 min   | $105  | Signature Cut, Beard Architecture, eucalyptus steam towel sequence, and scalp tension massage.        | `Best Value`       |
| `executive-reset`    | `packages` | The Executive Reset             | 90 min   | $130  | Scissor or Fade Cut, Traditional Hot Towel Shave, charcoal detox mask, and express styling.           | `Complete Session` |
| `father-son`         | `packages` | Weekend Duo (2 Chairs)          | 90 min   | $120  | Two back-to-back or side-by-side Signature Cuts reserved under one single booking.                    | `Two Guests`       |

### Booking Add-Ons (`src/data/services.ts`)

Selectable inside Step 1 of the Booking Drawer (multi-select; dynamically adds price and minutes):

1. `eucalyptus-steam` — **Hot Towel & Eucalyptus Steam** (`+10 min`, `+$15`)
2. `scalp-massage` — **Tension-Release Scalp Massage** (`+10 min`, `+$20`)
3. `charcoal-mask` — **Matte Charcoal Detox Mask** (`+15 min`, `+$25`)
4. `grey-blending` — **Natural Grey Blending Tone** (`+15 min`, `+$30`)

### The Barbers (`src/data/barbers.ts`)

1. **Kenji Sato** (`kenji`) — _Founder & Master Barber_
   - Experience: `11 yrs`
   - Specialties: `["Scissor Craft", "Textured Crops", "Asian Hair"]`
   - Working Days: `Tue – Sat` (JS days `[2, 3, 4, 5, 6]`)
   - Bio: `Trained in Shibuya and Manhattan. Known for dry-cut balance that holds its silhouette six weeks later.`
2. **Devon Brooks** (`devon`) — _Senior Barber_
   - Experience: `8 yrs`
   - Specialties: `["Skin Fades", "Drop Tapers", "Razor Work"]`
   - Working Days: `Wed – Sun` (JS days `[0, 3, 4, 5, 6]`)
   - Bio: `Specializes in ultra-clean gradient fades and razor-sharp geometry with zero irritation.`
3. **Mateo Silva** (`mateo`) — _Grooming Specialist_
   - Experience: `7 yrs`
   - Specialties: `["Beard Architecture", "Hot Towel Shaves", "Classic Cuts"]`
   - Working Days: `Tue – Sat` (JS days `[2, 3, 4, 5, 6]`)
   - Bio: `Masters traditional straight-razor rituals and structured beard proportions for every face shape.`

### Client Reviews (`src/data/reviews.ts`)

Render as clean typographic cards with zero star graphics:

1. _"Walked in with a vague reference photo and walked out with the sharpest cut I've had in New York. Booking took twenty seconds on my phone and my chair was ready the minute I stepped off Mercer."_ — **Daniel Cho**, Product Director, Tribeca (`The KŌBŌ Signature Cut`)
2. _"Most barbershops make you wait forty minutes even with an appointment. KŌBŌ runs like an architectural studio—quiet playlist, hot eucalyptus towel, zero rush, and an exact finish."_ — **Julian Mercer**, Architect, SoHo (`The Full KŌBŌ Ritual`)
3. _"Devon's skin fade grows out cleaner than anywhere else in the city. Being able to pick my barber, add a hot towel, and drop it straight into Apple Calendar sealed it for me."_ — **Aaron Patel**, Founder, West Village (`Architectural Skin Fade`)

---

## 3. Lean 6-Section Page Architecture

Build each section as its own modular component in `src/components/sections/` in this exact order:

### Sticky Navigation (`src/components/layout/Navbar.tsx`)

- Left: `KŌBŌ` wordmark (scrolls smoothly to top).
- Center (Desktop): 4 clean anchor links (`Services`, `Barbers`, `Studio`, `Location`) with matching `scroll-mt-24` targets.
- Right: Compact bronze `"Book a Chair"` CTA button (opens Booking Drawer at Step 1).
- Mobile: Crisp menu toggle opening a clean full-width dark dropdown with anchor links, studio hours, and `"Book a Chair"`.

### Section 1: Hero (`HeroSection.tsx`)

- Full-bleed dark monochrome grooming backdrop with calibrated dark scrim and crisp architectural framing (`min-h-[88svh]` desktop, balanced height on mobile).
- **Live Availability Pill**: Pulses with `--color-status-live` dot and displays the _actual_ next open slot computed dynamically from `bookings.ts` (e.g., `Next available slot: Today, 2:30 PM` — or `Tomorrow, 10:00 AM` if today is closed/full). Clicking this pill opens the drawer pre-populated with that exact date and time!
- **Headline (5 words)**: `Precision Grooming. Zero Wasted Time.`
- **Subcopy**: `Tailored scissor work, clean fades, and unhurried hot-towel rituals in SoHo—reserved online in under 30 seconds.`
- **Actions**: Primary `"Book a Chair"` button + subtle `"Explore Menu ↓"` anchor link.
- **Bottom Micro-Strip**: Three hairline metadata facts (`SoHo, NYC • 418 Mercer St`, `Complimentary Espresso & Matcha`, `Instant .ics Calendar Ticket`).

### Section 2: Interactive Service Menu (`ServiceMenuSection.tsx`)

- Eyebrow `01 / SERVICE MENU` + Section H2 `Tailored to Your Structure.`
- **Filterable Tabs**: `Cuts`, `Beard`, `Packages` (smooth active bronze indicator + count badge per tab).
- **2-Column Desktop Layout (`lg:grid-cols-12`)**:
  - Left (`lg:col-span-8`): Stacked editorial service rows. Hovering/focusing any row updates the sticky right preview panel. Clicking `"Select & Book"` opens the Booking Drawer pre-selected with that service and advances cleanly to Step 1 (with that service highlighted) or lets them add add-ons immediately.
  - Right (`lg:col-span-4`, hidden on mobile to keep scanning fast): Sticky `"Selected Craft Preview"` card displaying the hovered service's monochrome preview frame, preview tag, what's included bullets, duration/price readout, and quick `"Reserve This Service"` button.

### Section 3: The Barbers (`BarbersSection.tsx`)

- Eyebrow `02 / THE CRAFTSMEN` + Section H2 `Three Chairs. Zero Junior Cuts.`
- Responsive 3-column grid (`grid-cols-1 md:grid-cols-3 gap-6`).
- Each barber card displays:
  - `aspect-[4/5]` monochrome portrait with crisp 1px border.
  - Name, role, years of experience (`tabular-nums`), concise 2-line bio.
  - Specialty tags (sharp dark pills) and working days (`Tue – Sat`).
  - Dynamic `"Next open: ..."` monospace readout calculated for that specific barber.
  - Full-width outline CTA `"Book with [First Name]"` — opens Booking Drawer with that barber pre-selected.

### Section 4: Atmosphere Gallery (`AtmosphereSection.tsx`)

- Eyebrow `03 / THE STUDIO` + Section H2 `Designed for Calm Precision.`
- Asymmetric 4-frame minimalist monochrome bento strip (`grid-cols-1 md:grid-cols-12 gap-4`):
  - Frame 1 (`md:col-span-7 aspect-[16/10]`): `01 / MAIN FLOOR — Three Takara Belmont chairs in matte slate.`
  - Frame 2 (`md:col-span-5 aspect-[16/10]`): `02 / MIZUTANI STEEL — Hand-forged Japanese shears.`
  - Frame 3 (`md:col-span-5 aspect-[4/3]`): `03 / STEAM & TOWEL — Eucalyptus hot-towel ritual.`
  - Frame 4 (`md:col-span-7 aspect-[4/3]`): `04 / APOTHECARY — Small-batch matte clays & cedar oils.`
- Subtle scroll-reveal fade/lift per frame using `IntersectionObserver` (honors `prefers-reduced-motion`).

### Section 5: Client Reviews (`ReviewsSection.tsx`)

- Eyebrow `04 / CLIENT NOTES` + Section H2 `Built on Repeat Visits.`
- 3-column typographic quote layout separated by clean borders—no star icons, no avatars.
- Oversized bronze serif quote mark, sharp review text, client name/neighborhood, and monospace service label.

### Section 6: Location & Hours Footer (`LocationFooterSection.tsx`)

- Eyebrow `05 / VISIT THE STUDIO` + Section H2 `418 Mercer St, SoHo.`
- 2-column architectural layout:
  - **Left (Dark Styled Map Card)**: Custom dark-mode SVG architectural street map of SoHo (`Mercer St`, `Broadway`, `Greene St`, `Broome St`, `Spring St`) with a subtle pulsing bronze studio pin at `418 Mercer St`, transit walking times, and a functional `"Copy Address"` button that copies the address to clipboard with a `"Copied ✓"` confirmation state.
  - **Right (Hours & Quick Book)**: Clean hairline hours table (`tabular-nums`, highlights current day of week and shows `Open Now` or `Opens Tomorrow` indicator), phone/email links, and primary `"Book a Chair"` CTA.
- Bottom bar: `© 2026 KŌBŌ Grooming NYC` • `Interactive Standard-Tier Booking Demo` • back-to-top link.

---

## 4. Live 3-Step Slide-Over Booking Drawer (`BookingDrawer.tsx`)

### Drawer Behavior & Pre-Population

- Triggered from Hero CTA, Hero Live Slot Pill, Service Menu `"Select & Book"`, Barber `"Book with [Name]"`, Footer CTA, Mobile Sticky Bar, or `DemoUtilityBar`.
- Locks page scroll while open, closes cleanly on backdrop click, `X` button, or `Escape` key.
- Header shows `KŌBŌ RESERVATION`, step indicator (`Step 1 of 3` / `Step 2 of 3` / `Step 3 of 3`), and 3-segment bronze progress bar.

### Step 1: Service & Add-Ons

- Compact category tabs (`Cuts` / `Beard` / `Packages`) with single-select service radio cards (displays name, duration, price).
- Below services: `"Enhance Your Session (Optional)"` multi-select Add-on checkboxes (`+$15 / +10m`, etc.).
- **Sticky Drawer Footer**: Live calculated total price and total duration (`$80 • 55 min` in tabular mono) + `"Continue to Barber & Time →"` button (disabled until a service is selected).

### Step 2: Barber & Available Time Grid

- **Barber Picker**: Horizontal selectable cards for `First Available` plus `Kenji`, `Devon`, `Mateo`.
- **7-Day Date Strip**: Dynamically generated starting from `today` (7 upcoming calendar days). Displays weekday + date number (`Tue 25`). Mondays are visibly marked `Closed` and disabled. Days where the chosen barber does not work are subtly disabled with `"Off"` (while `First Available` stays open Tue–Sun).
- **Available Time-Slot Grid**: 3-column responsive grid of `44px+` tap buttons (`10:00 AM` to `7:00 PM` Tue–Fri; `9:00 AM` to `5:00 PM` Sat–Sun).
  - Pre-seeded realistic busy slots + any slots booked during the visitor's session appear disabled (`line-through` muted text with subtle `Booked` micro-label) and cannot be double-booked.
  - Selecting a slot highlights it in `--color-bronze-soft` with a `1px solid var(--color-bronze)` border.
- **Sticky Drawer Footer**: `"← Back"` + `"Continue to Details →"` (disabled until date and time slot are picked).

### Step 3: Guest Details → Instant Confirmation Ticket

- **Before Submit (Guest Form)**:
  - Compact booking recap pill at top (`Signature Cut + Eucalyptus Steam • Kenji Sato • Today, 2:30 PM`).
  - Inputs with strict inline validation:
    - `Full Name` (required, min 2 chars)
    - `Mobile Number` (required, basic phone validation)
    - `Email Address` (required, valid email format)
    - `Styling Notes (Optional)` (textarea, e.g., guard size or preferences)
  - Primary CTA: `"Confirm Chair — $XX"` (shows brief 350ms tactile confirmation state, persists booking to `localStorage`, locks the slot, and refreshes the Hero `"Next available slot"` badge).
- **After Submit (Instant Confirmation Ticket)**:
  - Architectural perforated ticket showing:
    - Confirmation badge (`Chair Reserved`) + unique monospace code (`KOBO-XXXX`)
    - Service + selected add-ons, Barber, Date, Time, Duration, Total Price, and Studio Address.
  - **Working `.ics` Calendar Download (`src/lib/ics.ts`)**: Generates and triggers download of `kobo-appointment-KOBO-XXXX.ics` with valid `DTSTART`, `DTEND` (computed from `totalDurationMins`), `SUMMARY`, `LOCATION`, and `DESCRIPTION`.
  - **Simulated Notification Preview**: Clean segmented toggle (`SMS Preview` | `Email Preview`) showing the exact formatted SMS or Email confirmation message containing the guest's real name, barber, date, time, and reference code.
  - Footer actions: `"Book Another Chair"` (resets form cleanly) and `"Done"`.

---

## 5. Buyer Conversion Layer (`DemoUtilityBar.tsx` & Mobile Sticky CTA)

### Collapsible Demo Utility Bar

- Fixed bottom-left (`bottom-4 left-4` desktop; `bottom-20 left-4` mobile).
- Collapsed state: Compact pill showing bronze dot + `Demo Controls` + chevron.
- Expanded state:
  - Label: `INTERACTIVE PORTFOLIO DEMO`
  - **`Auto-Fill Test Booking`** button: Immediately opens the Booking Drawer pre-populated with:
    - Service: `The KŌBŌ Signature Cut` ($65, 45m)
    - Add-on: `Hot Towel & Eucalyptus Steam` (+$15, +10m)
    - Barber: `Kenji Sato` (or `First Available` if Kenji is off on the earliest open day)
    - Date & Time: Earliest actually available open slot
    - Guest Details: `Marcus Vance` / `(917) 555-0148` / `marcus.vance@example.com` / `"Mid skin taper, keep length on top."`
    - Lands directly on **Step 3** so a Fiverr buyer can inspect the summary and hit `"Confirm Chair"` in one single click.
  - **`Reset Demo`** button: Clears visitor-created bookings from `localStorage`, restores initial realistic seeded busy slots, updates the Hero `"Next available slot"` badge, and displays a subtle non-blocking toast (`"Demo reset to default availability."`).

### Mobile Sticky Bottom CTA (`< 768px`)

- Fixed full-width bottom bar (`md:hidden fixed inset-x-0 bottom-0 z-30`) shown whenever the Booking Drawer is closed.
- Left: Micro label `NEXT OPEN` + dynamic next available slot (`Today, 2:30 PM`).
- Right: Solid bronze `"Book a Chair"` button (`min-h-[44px]`).

---

## 6. TypeScript Domain Interfaces (`src/types/booking.ts`)

```ts
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
```

---

## 7. Seeded Availability & Photo Guidelines

- **Seeded Busy Slots (`src/services/bookings.ts`)**: Pre-seed 5 realistic busy slots dynamically anchored to `CURRENT_DATE` and `CURRENT_DATE + 1` across Kenji, Devon, and Mateo so the time-slot grid immediately shows a believable mix of open and `Booked` chairs on first load, while guaranteeing at least 4+ open slots remain available today/tomorrow.
- **Photography**: Use high-craft, moody, high-resolution Unsplash photography (barbershop interior, haircut precision, beard trim, barber tools, portraits) styled with the monochrome CSS treatment in `DESIGN.md`, and always attach an `onError` graceful architectural fallback so broken external URLs never degrade the layout.
