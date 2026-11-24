import { ArrowDownRight } from "lucide-react";
import { motion } from "motion/react";
import { HERO_MEDIA, STUDIO_INFO } from "../../data/studio";
import { ARCHITECTURAL_EASE } from "../../lib/motion";
import type { AvailableSlot } from "../../types/booking";
import { Badge, Button, Container, EditorialImage } from "../ui";

export interface HeroSectionProps {
  nextSlot: AvailableSlot | null;
  onBookClick: () => void;
  onQuickSlotClick: (slot: AvailableSlot) => void;
}

const MICRO_STRIP = [
  `${STUDIO_INFO.neighborhood.split(",")[0]}, NYC — ${STUDIO_INFO.streetAddress}`,
  "Complimentary Espresso & Matcha",
  "Instant .ics Calendar Ticket",
] as const;

const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: ARCHITECTURAL_EASE },
  },
};

export function HeroSection({
  nextSlot,
  onBookClick,
  onQuickSlotClick,
}: HeroSectionProps) {
  return (
    <section
      id="top"
      className="border-b border-hairline bg-plaster pt-10 pb-12 md:pt-14 md:pb-20"
    >
      <Container>
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch"
        >
          {/* Left Column: Editorial Lead & Booking Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-10 py-2">
            <div className="space-y-6">
              {/* Dynamic Live Availability Pill */}
              <motion.div variants={heroItemVariants}>
                {nextSlot ? (
                  <button
                    type="button"
                    onClick={() => onQuickSlotClick(nextSlot)}
                    className="group inline-flex min-h-[38px] items-center gap-2.5 rounded-full border border-hairline-strong bg-paper px-4 py-1.5 transition-colors duration-150 hover:border-cypress cursor-pointer"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-status-live animate-kobo-pulse"
                    />
                    <span className="font-mono text-[11px] tracking-wide text-ink tabular-data">
                      Next available slot:{" "}
                      <span className="font-medium text-cypress group-hover:underline">
                        {nextSlot.label}
                      </span>
                    </span>
                  </button>
                ) : (
                  <Badge variant="live" pulseDot>
                    Live studio schedule open
                  </Badge>
                )}
              </motion.div>

              <motion.h1
                variants={heroItemVariants}
                className="font-serif font-medium tracking-[-0.025em] leading-[1.02] text-ink text-hero-display"
              >
                Precision Grooming. Zero Wasted Time.
              </motion.h1>

              <motion.p
                variants={heroItemVariants}
                className="max-w-[50ch] text-[0.9375rem] sm:text-base leading-[1.65] text-ink-secondary text-pretty"
              >
                Tailored scissor work, clean fades, and unhurried hot-towel rituals in
                SoHo—reserved online in under 30 seconds.
              </motion.p>

              <motion.div
                variants={heroItemVariants}
                className="flex flex-wrap items-center gap-4 pt-1"
              >
                <Button size="lg" onClick={onBookClick}>
                  Book a Chair
                </Button>

                <a
                  href="#services"
                  className="inline-flex min-h-[48px] items-center gap-2 px-3 font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink-secondary transition-colors duration-150 hover:text-cypress"
                >
                  <span>Explore Menu</span>
                  <ArrowDownRight className="h-4 w-4" />
                </a>
              </motion.div>
            </div>

            {/* Bottom Architectural Fact Rail */}
            <motion.div
              variants={heroItemVariants}
              className="border-t border-hairline pt-5"
            >
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-4">
                {MICRO_STRIP.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 font-mono text-[11px] leading-snug text-ink-secondary"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cypress"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Full-Color Architectural Studio Photograph + Cast-Iron Ledger */}
          <motion.div
            variants={heroItemVariants}
            className="lg:col-span-6 relative flex flex-col"
          >
            <div className="group relative aspect-[4/3] lg:aspect-auto lg:min-h-[560px] w-full flex-1 overflow-hidden rounded-sm border border-hairline bg-stone">
              <EditorialImage
                src={HERO_MEDIA.imageUrl}
                alt={HERO_MEDIA.alt}
                loading="eager"
                fetchPriority="high"
                className="h-full w-full"
                imgClassName="group-hover:scale-[1.02]"
              />

              {/* Subtle bottom edge contrast scrim behind floating ledger */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-iron/75 via-iron/25 to-transparent"
              />

              {/* Anchored Cast-Iron Studio Ledger */}
              <aside
                data-surface="iron"
                aria-label="Studio status summary"
                className="relative sm:absolute sm:bottom-4 sm:left-4 sm:right-4 lg:right-auto lg:w-[340px] rounded-b-sm sm:rounded-sm border-t sm:border border-iron-border bg-iron/95 p-4 text-iron-ink backdrop-blur-md space-y-3"
              >
                <div className="flex items-center justify-between border-b border-iron-border pb-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brass">
                    SoHo Studio — 2B
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-iron-muted tabular-data">
                    03 Senior Chairs
                  </span>
                </div>

                <dl className="space-y-1.5 text-xs font-mono tabular-data">
                  {STUDIO_INFO.hoursSummary.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-4"
                    >
                      <dt className="text-iron-secondary">{row.label}</dt>
                      <dd
                        className={
                          row.hours === "Closed"
                            ? "text-iron-muted"
                            : "text-iron-ink"
                        }
                      >
                        {row.hours}
                      </dd>
                    </div>
                  ))}
                </dl>

                {nextSlot && (
                  <button
                    type="button"
                    onClick={() => onQuickSlotClick(nextSlot)}
                    className="flex w-full items-center justify-between border-t border-iron-border pt-2.5 text-left font-mono text-[11px] transition-colors duration-150 hover:text-brass cursor-pointer"
                  >
                    <span className="text-iron-secondary">Earliest opening</span>
                    <span className="text-brass tabular-data">
                      {nextSlot.label} →
                    </span>
                  </button>
                )}
              </aside>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
