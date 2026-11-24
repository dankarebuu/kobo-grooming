# DESIGN.md — KŌBŌ Grooming (Cast-Iron & Mineral Daylight)

## 1. Visual Direction & Brand Essence

- **Brand**: KŌBŌ Grooming (Japanese for "craftsman's workshop") — an architectural, daylight-forward barbershop and grooming studio in SoHo, New York (`418 Mercer St, Suite 2B`).
- **Aesthetic**: **Cast-Iron & Mineral Daylight**. Cool SoHo limestone plaster (`#ECEBE7`) and warm paper (`#F5F4F0`) carry the editorial reading surfaces, punctuated by two committed **Cast-Iron Graphite (`#15171A`)** bands (*The Studio* and *Location & Hours*) and **Oxidized Cypress (`#1C3B2E`)** functional actions.
- **Strictly Forbidden**: Vintage barber clichés (script fonts, faux leather/wood, barber poles, 5-star review badges), neon SaaS glows, rounded bubbly cards, and blanket grayscale filters over photography.

---

## 2. Color System (Tailwind CSS v4 `@theme` & CSS Variables)

Defined in `src/index.css` via `@import "tailwindcss";` and `@theme`:

### Daylight Mineral Surfaces
| Token                     | Hex / Value                | Usage                                                    |
| ------------------------- | -------------------------- | -------------------------------------------------------- |
| `--color-plaster`         | `#ECEBE7`                  | Primary page canvas, sticky header                       |
| `--color-paper`           | `#F5F4F0`                  | Elevated light cards, sticky preview, Booking Drawer     |
| `--color-stone`           | `#E2E0DA`                  | Recessed daylight band (`BarbersSection`), subtle hover  |
| `--color-hairline`        | `#CFCBC2`                  | Default 1px structural rules on light surfaces           |
| `--color-hairline-strong` | `#ABA69B`                  | Hover borders, focused inputs, outline button edges      |
| `--color-ink`             | `#15171A`                  | Primary headlines, prices, primary copy (15.2:1 AAA)     |
| `--color-ink-secondary`   | `#474B52`                  | Descriptions, service notes, bios (7.5:1 AAA)            |
| `--color-ink-muted`       | `#5D626B`                  | Fine print, closed days, booked time slots (5.2:1 AA+)   |

### Committed Cast-Iron Bands & Accents
| Token                    | Hex / Value                | Usage                                                    |
| ------------------------ | -------------------------- | -------------------------------------------------------- |
| `--color-iron`           | `#15171A`                  | Cast-iron bands (*Studio*, *Footer*, *Confirmation Ticket*) |
| `--color-iron-elevated`  | `#1F2227`                  | Elevated cards inside cast-iron bands                    |
| `--color-iron-border`    | `#2C3038`                  | 1px structural rules inside cast-iron bands              |
| `--color-iron-ink`       | `#F5F4F0`                  | Primary text on cast-iron (16.3:1 AAA)                   |
| `--color-iron-secondary` | `#B6B9BF`                  | Secondary text on cast-iron (9.2:1 AAA)                  |
| `--color-iron-muted`     | `#8E939C`                  | Metadata inside cast-iron (5.7:1 AA+)                    |
| `--color-cypress`        | `#1C3B2E`                  | Primary CTA fill on light, active tabs, selected slots   |
| `--color-cypress-hover`  | `#142C22`                  | Primary CTA hover fill                                   |
| `--color-cypress-soft`   | `rgba(28, 59, 46, 0.08)`   | Selected service/slot subtle tint on light               |
| `--color-brass`          | `#B99768`                  | Brushed brass accent exclusively on dark cast-iron bands |
| `--color-brass-soft`     | `rgba(185, 151, 104, 0.14)`| Subtle brass highlight on cast-iron surfaces             |
| `--color-status-live`    | `#1E7A4C`                  | Live availability dot on daylight surfaces               |
| `--color-status-live-dark`| `#4ADE80`                 | Live indicator inside dark cast-iron surfaces            |
| `--color-status-error`   | `#B91C1C`                  | Inline form validation errors on paper/plaster           |

---

## 3. Typography System

Loaded in `index.html` with `display=swap` and full Latin Extended support for `KŌBŌ` macrons:

- **Display Serif**: `Shippori Mincho` (`500`, `600`, `700`) — Tokyo editorial Mincho serif with sharp architectural terminals.
- **UI & Body Sans**: `Hanken Grotesk` (`400`, `500`, `600`, `700`) — clean geometric-humanist sans-serif.
- **Technical / Data Mono**: `Fragment Mono` (`400`) — tabular prices, durations, hours, time slots, and `KOBO-XXXX` booking codes.

### Type Scale & Discipline
- **Hero H1**: `.text-hero-display` (`clamp(2.85rem, 6.5vw, 5.25rem)`), `Shippori Mincho`, `500`, tracking `-0.025em`, leading `1.02`, `text-wrap: balance`.
- **Section H2**: `.text-section-display` (`clamp(2rem, 3.8vw, 3.25rem)`), `Shippori Mincho`, `500`, tracking `-0.02em`, leading `1.08`, `text-wrap: balance`.
- **Tabular Numerals**: `.tabular-data` (`font-variant-numeric: tabular-nums`) applied to every price, duration, hour, and time slot.
- **Zero Template Eyebrows**: Avoid decorative ALL-CAPS numbered eyebrows (`01 / ...`) above every heading; lead directly with clear architectural headings and concise context.

---

## 4. Photography & Visual Treatment

- **Natural Architectural Color**: All studio, grooming, and barber photography renders in rich, natural editorial color (`contrast(1.03) saturate(0.94)` at rest; `contrast(1.06) saturate(1.0)` with subtle `scale-[1.03]` inside `overflow-hidden` on hover).
- **Zero Broken Images**: Every image container includes a hairline architectural grid fallback (`#E2E0DA` on daylight surfaces, `#1F2227` inside `[data-surface="iron"]`) and explicit aspect ratios.

---

## 5. Motion, Native Top-Layer & Accessibility

- **Native `<dialog>` Drawer**: `BookingDrawer` renders via `<dialog class="kobo-drawer">` + `showModal()`, `overscroll-behavior: contain` scroll containment, `pointerdown`/`pointerup` bounding-rect light-dismiss, and `motion/react` spring physics (`SPRINGS.drawer`) with mobile drag-to-dismiss (`useDragControls`).
- **Confirmation Keepsake Ticket**: Step 3 transitions into a contrasting Cast-Iron (`#15171A`) perforated ticket with brushed-brass (`#B99768`) booking code, animated SVG `pathLength` checkmark draw-on, working `.ics` export, and `SMS | Email` preview toggle.
- **Focus & Reduced Motion**: `2px solid var(--color-cypress)` `focus-visible` outline on daylight (`--color-brass` inside `[data-surface="iron"]`), `scroll-padding-top: 6rem; scroll-padding-bottom: 5.5rem`, visibility-aware pulse pausing, and `<MotionConfig reducedMotion="user">`.
