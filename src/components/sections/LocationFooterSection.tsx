import { ArrowUpRight, Check, Copy, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { STUDIO_HOURS, STUDIO_INFO, TRANSIT_CUES } from "../../data/studio";
import { cn } from "../../lib/utils";
import { Button, Container, SectionHeader } from "../ui";

export interface LocationFooterSectionProps {
  onBookClick: () => void;
}

interface StationCoord {
  id: string;
  label: string;
  cx: number;
  cy: number;
  path: string;
}

const STATION_COORDS: Record<string, StationCoord> = {
  "Spring St (6)": {
    id: "spring",
    label: "Spring St (6)",
    cx: 500,
    cy: 252,
    path: "M 500 252 L 340 252 L 340 178",
  },
  "Prince St (R/W)": {
    id: "prince",
    label: "Prince St (R/W)",
    cx: 500,
    cy: 122,
    path: "M 500 122 L 340 122 L 340 178",
  },
  "Broadway-Lafayette (B/D/F/M)": {
    id: "blafayette",
    label: "B'way-Lafayette",
    cx: 560,
    cy: 56,
    path: "M 560 56 L 500 56 L 500 122 L 340 122 L 340 178",
  },
};

function getStudioStatusLabel(now: Date = new Date()): {
  label: string;
  isOpenNow: boolean;
} {
  const day = now.getDay();
  const row = STUDIO_HOURS.find((item) => item.dayIndex === day);

  if (!row || row.isClosed || !row.openTime || !row.closeTime) {
    return { label: "Closed Today • Opens Tue 10:00 AM", isOpenNow: false };
  }

  const [openH, openM] = row.openTime.split(":").map(Number);
  const [closeH, closeM] = row.closeTime.split(":").map(Number);
  const minsNow = now.getHours() * 60 + now.getMinutes();
  const openMins = openH * 60 + openM;
  const closeMins = closeH * 60 + closeM;

  if (minsNow >= openMins && minsNow < closeMins) {
    return { label: "Open Now", isOpenNow: true };
  }
  if (minsNow < openMins) {
    return {
      label: `Opens Today at ${openH > 12 ? openH - 12 : openH}:00 AM`,
      isOpenNow: false,
    };
  }

  const nextDayIndex = (day + 1) % 7;
  const tomorrowRow = STUDIO_HOURS.find((item) => item.dayIndex === nextDayIndex);
  if (tomorrowRow?.isClosed) {
    return { label: "Closed for Evening • Opens Tue", isOpenNow: false };
  }
  return { label: "Opens Tomorrow", isOpenNow: false };
}

export function LocationFooterSection({
  onBookClick,
}: LocationFooterSectionProps) {
  const [copied, setCopied] = useState(false);
  const [activeStation, setActiveStation] = useState<string | null>(null);
  const now = new Date();
  const currentDayIndex = now.getDay();
  const studioStatus = getStudioStatusLabel(now);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(STUDIO_INFO.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = STUDIO_INFO.address;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeRoute = activeStation ? STATION_COORDS[activeStation] : null;

  return (
    <footer
      id="location"
      data-surface="iron"
      className="scroll-mt-24 bg-iron pt-20 pb-28 text-iron-ink md:pt-28 md:pb-12"
    >
      <Container className="space-y-12">
        <SectionHeader
          tone="iron"
          title="418 Mercer St, SoHo."
          subtitle="Second-floor loft studio between Prince and Spring Street. Ring buzzer 2B on arrival."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Interactive Cast-Iron Architectural Map Card */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-sm border border-iron-border bg-iron-elevated overflow-hidden">
            <div className="relative aspect-[16/10] w-full border-b border-iron-border bg-iron">
              <svg
                viewBox="0 0 640 380"
                className="h-full w-full"
                role="img"
                aria-label="Interactive architectural street map showing KŌBŌ Grooming at 418 Mercer St in SoHo and nearby subway stations"
              >
                <rect width="640" height="380" fill="var(--color-iron)" />

                {/* Architectural city blocks */}
                <g
                  fill="var(--color-iron-elevated)"
                  stroke="var(--color-iron-border)"
                  strokeWidth="1"
                >
                  <rect x="30" y="25" width="120" height="80" />
                  <rect x="190" y="25" width="130" height="80" />
                  <rect x="360" y="25" width="120" height="80" />
                  <rect x="520" y="25" width="95" height="80" />

                  <rect x="30" y="140" width="120" height="95" />
                  <rect x="190" y="140" width="130" height="95" />
                  <rect x="360" y="140" width="120" height="95" />
                  <rect x="520" y="140" width="95" height="95" />

                  <rect x="30" y="270" width="120" height="85" />
                  <rect x="190" y="270" width="130" height="85" />
                  <rect x="360" y="270" width="120" height="85" />
                  <rect x="520" y="270" width="95" height="85" />
                </g>

                {/* Horizontal Cross Streets */}
                <g stroke="var(--color-iron-border)" strokeWidth="1.5">
                  <line x1="0" y1="122" x2="640" y2="122" />
                  <line x1="0" y1="252" x2="640" y2="252" />
                </g>

                {/* Vertical Avenues / Streets */}
                <g stroke="var(--color-iron-border)" strokeWidth="1.5">
                  <line x1="170" y1="0" x2="170" y2="380" />
                  <line x1="340" y1="0" x2="340" y2="380" />
                  <line x1="500" y1="0" x2="500" y2="380" />
                </g>

                {/* Highlight Mercer St corridor */}
                <line
                  x1="340"
                  y1="0"
                  x2="340"
                  y2="380"
                  stroke="var(--color-iron-secondary)"
                  strokeOpacity="0.45"
                  strokeWidth="2.5"
                />

                {/* Active walking route */}
                {activeRoute && (
                  <path
                    d={activeRoute.path}
                    fill="none"
                    stroke="var(--color-brass)"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    strokeLinecap="round"
                  />
                )}

                {/* Street Labels */}
                <g
                  fill="var(--color-iron-muted)"
                  fontFamily="Fragment Mono, monospace"
                  fontSize="11"
                  letterSpacing="1.6"
                >
                  <text x="48" y="116">
                    PRINCE ST
                  </text>
                  <text x="48" y="246">
                    SPRING ST
                  </text>
                  <text x="48" y="366">
                    BROOME ST
                  </text>
                  <text
                    x="158"
                    y="215"
                    transform="rotate(-90 158 215)"
                    textAnchor="middle"
                  >
                    GREENE ST
                  </text>
                  <text
                    x="326"
                    y="215"
                    fill="var(--color-brass)"
                    transform="rotate(-90 326 215)"
                    textAnchor="middle"
                  >
                    MERCER ST
                  </text>
                  <text
                    x="486"
                    y="215"
                    transform="rotate(-90 486 215)"
                    textAnchor="middle"
                  >
                    BROADWAY
                  </text>
                </g>

                {/* Subway Station Nodes */}
                {Object.entries(STATION_COORDS).map(([stationKey, coord]) => {
                  const isHighlighted = activeStation === stationKey;
                  return (
                    <g
                      key={coord.id}
                      transform={`translate(${coord.cx}, ${coord.cy})`}
                    >
                      <circle
                        r={isHighlighted ? 8 : 5.5}
                        fill={
                          isHighlighted
                            ? "var(--color-brass)"
                            : "var(--color-iron-elevated)"
                        }
                        stroke={
                          isHighlighted
                            ? "var(--color-iron-ink)"
                            : "var(--color-iron-muted)"
                        }
                        strokeWidth="1.5"
                      />
                      <text
                        x={coord.cx > 520 ? -8 : 12}
                        y={coord.cy < 80 ? 18 : -10}
                        textAnchor={coord.cx > 520 ? "end" : "start"}
                        fill={
                          isHighlighted
                            ? "var(--color-brass)"
                            : "var(--color-iron-secondary)"
                        }
                        fontFamily="Fragment Mono, monospace"
                        fontSize="10"
                        letterSpacing="0.8"
                      >
                        {coord.label}
                      </text>
                    </g>
                  );
                })}

                {/* Studio Pin at 418 Mercer St */}
                <g transform="translate(340, 178)">
                  <circle
                    r="26"
                    fill="var(--color-brass-soft)"
                    className="animate-kobo-pulse"
                  />
                  <circle
                    r="11"
                    fill="var(--color-iron-elevated)"
                    stroke="var(--color-brass)"
                    strokeWidth="2"
                  />
                  <circle r="4" fill="var(--color-brass)" />
                </g>

                {/* Callout Badge */}
                <g transform="translate(362, 154)">
                  <rect
                    width="128"
                    height="44"
                    rx="2"
                    fill="var(--color-iron-elevated)"
                    stroke="var(--color-iron-border)"
                  />
                  <text
                    x="10"
                    y="18"
                    fill="var(--color-brass)"
                    fontFamily="Fragment Mono, monospace"
                    fontSize="10"
                    letterSpacing="1.1"
                  >
                    KŌBŌ STUDIO
                  </text>
                  <text
                    x="10"
                    y="34"
                    fill="var(--color-iron-ink)"
                    fontFamily="Hanken Grotesk, sans-serif"
                    fontSize="11"
                  >
                    418 Mercer St, 2B
                  </text>
                </g>
              </svg>
            </div>

            <div className="flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-end">
              <div className="space-y-2.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brass">
                  Subway Access (Select to Trace Route)
                </p>
                <ul className="space-y-1 font-mono text-xs text-iron-secondary tabular-data">
                  {TRANSIT_CUES.map((cue) => {
                    const isSelected = activeStation === cue.station;
                    return (
                      <li key={cue.station}>
                        <button
                          type="button"
                          aria-pressed={isSelected}
                          onMouseEnter={() => setActiveStation(cue.station)}
                          onMouseLeave={() => setActiveStation(null)}
                          onClick={() =>
                            setActiveStation((prev) =>
                              prev === cue.station ? null : cue.station
                            )
                          }
                          className={cn(
                            "flex w-full items-center gap-2 rounded-sm px-2 py-1 text-left transition-colors duration-150 cursor-pointer",
                            isSelected
                              ? "bg-brass-soft text-iron-ink"
                              : "hover:bg-iron/60"
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full transition-colors",
                              isSelected ? "bg-brass" : "bg-iron-border"
                            )}
                          />
                          <span
                            className={
                              isSelected ? "text-brass" : "text-iron-ink"
                            }
                          >
                            {cue.station}
                          </span>
                          <span className="text-iron-muted">— {cue.walkTime}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <Button
                variant="iron-outline"
                size="sm"
                onClick={handleCopyAddress}
                className="shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-status-live-dark" />
                    <span>Copied ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-brass" />
                    <span>Copy Address</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right: Hairline Hours & Quick Book */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-sm border border-iron-border bg-iron-elevated p-6 sm:p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-brass">
                  Studio Hours
                </p>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                    studioStatus.isOpenNow
                      ? "border-status-live-dark/40 bg-status-live-dark/10 text-status-live-dark"
                      : "border-iron-border bg-iron text-iron-secondary"
                  )}
                >
                  {studioStatus.isOpenNow && (
                    <span className="h-1.5 w-1.5 rounded-full bg-status-live-dark animate-kobo-pulse" />
                  )}
                  {studioStatus.label}
                </span>
              </div>

              <dl className="divide-y divide-iron-border border-y border-iron-border">
                {STUDIO_HOURS.map((row) => {
                  const isToday = row.dayIndex === currentDayIndex;
                  return (
                    <div
                      key={row.dayName}
                      className={cn(
                        "flex items-center justify-between py-2.5 text-xs tabular-data",
                        isToday && "text-iron-ink font-semibold"
                      )}
                    >
                      <dt className="flex items-center gap-2">
                        {isToday && (
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-brass"
                          />
                        )}
                        <span
                          className={
                            isToday ? "text-brass" : "text-iron-secondary"
                          }
                        >
                          {row.dayName}
                        </span>
                      </dt>
                      <dd
                        className={cn(
                          "font-mono",
                          row.isClosed
                            ? "text-iron-muted"
                            : isToday
                            ? "text-iron-ink"
                            : "text-iron-secondary"
                        )}
                      >
                        {row.hoursLabel}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>

            <div className="space-y-4">
              <div className="space-y-2.5 text-xs text-iron-secondary">
                <p className="flex items-center gap-2.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-brass" />
                  <span>{STUDIO_INFO.address}</span>
                </p>
                <a
                  href={STUDIO_INFO.phoneHref}
                  className="flex items-center gap-2.5 font-mono tabular-data transition-colors hover:text-iron-ink"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0 text-brass" />
                  <span>{STUDIO_INFO.phone}</span>
                </a>
                <a
                  href={STUDIO_INFO.emailHref}
                  className="flex items-center gap-2.5 font-mono transition-colors hover:text-iron-ink"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-brass" />
                  <span>{STUDIO_INFO.email}</span>
                </a>
              </div>

              <Button variant="iron-primary" fullWidth onClick={onBookClick}>
                Book a Chair
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Architectural Closing Bar */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-iron-border pt-6 font-mono text-[11px] text-iron-muted sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-iron-ink">
              {STUDIO_INFO.shortName}
            </span>
            <span aria-hidden="true">•</span>
            <span className="text-iron-secondary">© 2026 KŌBŌ Grooming NYC</span>
            <span aria-hidden="true">•</span>
            <span>Interactive Standard-Tier Booking Demo</span>
            <span aria-hidden="true">•</span>
            <span>{STUDIO_INFO.instagram}</span>
          </div>

          <a
            href="#top"
            className="inline-flex items-center gap-1 uppercase tracking-[0.14em] text-iron-secondary transition-colors hover:text-brass"
          >
            <span>Back to top</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
