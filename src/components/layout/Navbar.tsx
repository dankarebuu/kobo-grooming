import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { STUDIO_INFO } from "../../data/studio";
import { SPRINGS } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { Button, Container } from "../ui";

export interface NavbarProps {
  onBookClick: () => void;
}

const NAV_LINKS = [
  { id: "services", label: "Services", href: "#services" },
  { id: "barbers", label: "Barbers", href: "#barbers" },
  { id: "studio", label: "Studio", href: "#studio" },
  { id: "location", label: "Location", href: "#location" },
] as const;

type NavSectionId = (typeof NAV_LINKS)[number]["id"];

export function Navbar({ onBookClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSectionId | null>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Scroll-spy for active section indicator
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observedElements = NAV_LINKS.map((link) =>
      document.getElementById(link.id)
    ).filter((el): el is HTMLElement => el !== null);

    if (observedElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id as NavSectionId);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    observedElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleWordmarkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMobileOpen(false);
    setActiveSection(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookFromMobile = () => {
    setMobileOpen(false);
    onBookClick();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-plaster/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <a
          href="#top"
          onClick={handleWordmarkClick}
          className="font-sans text-[1.125rem] font-bold uppercase tracking-[0.24em] text-ink transition-colors duration-150 hover:text-cypress"
          aria-label="KŌBŌ Grooming — back to top"
        >
          {STUDIO_INFO.shortName}
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-2 text-sm font-medium tracking-wide transition-colors duration-150",
                  isActive
                    ? "text-ink"
                    : "text-ink-secondary hover:text-ink"
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    transition={SPRINGS.snappy}
                    className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-cypress"
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={onBookClick}
            className="hidden md:inline-flex min-h-[40px] px-5 text-xs uppercase tracking-[0.1em]"
          >
            Book a Chair
          </Button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="kobo-mobile-nav"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-hairline-strong bg-paper text-ink transition-colors duration-150 hover:border-cypress hover:text-cypress md:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile full-width dropdown with inert protection when collapsed */}
      <div
        id="kobo-mobile-nav"
        inert={!mobileOpen}
        aria-hidden={!mobileOpen}
        className={cn(
          "grid md:hidden transition-[grid-template-rows,opacity] duration-200 ease-out",
          mobileOpen
            ? "grid-rows-[1fr] opacity-100 border-t border-hairline bg-paper"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        )}
      >
        <div className="overflow-hidden">
          <Container className="py-5 space-y-5">
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col divide-y divide-hairline"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[44px] items-center justify-between text-sm font-medium text-ink transition-colors hover:text-cypress"
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-[11px] text-ink-muted">→</span>
                </a>
              ))}
            </nav>

            <div className="border-t border-hairline pt-4 space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-cypress">
                Studio Hours — SoHo
              </p>
              <div className="space-y-1 text-xs text-ink-secondary tabular-data">
                {STUDIO_INFO.hoursSummary.map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span>{row.label}</span>
                    <span
                      className={
                        row.hours === "Closed" ? "text-ink-muted" : "text-ink"
                      }
                    >
                      {row.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button fullWidth onClick={handleBookFromMobile}>
              Book a Chair
            </Button>
          </Container>
        </div>
      </div>
    </header>
  );
}
