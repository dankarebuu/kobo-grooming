import { ChevronDown, ChevronUp, RotateCcw, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ARCHITECTURAL_EASE, MOTION_DURATIONS } from "../../lib/motion";
import { cn } from "../../lib/utils";

export interface DemoUtilityBarProps {
  onAutoFillTestBooking: () => void;
  onResetDemo: () => void;
  toastMessage: string | null;
}

export function DemoUtilityBar({
  onAutoFillTestBooking,
  onResetDemo,
  toastMessage,
}: DemoUtilityBarProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 768;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsExpanded(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div
      data-surface="iron"
      className="fixed bottom-20 left-4 z-40 flex flex-col items-start gap-2 md:bottom-4 md:left-4"
    >
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key="demo-toast"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{
              duration: MOTION_DURATIONS.fast,
              ease: ARCHITECTURAL_EASE,
            }}
            className="rounded-sm border border-brass/50 bg-iron px-3.5 py-2 font-mono text-xs text-iron-ink shadow-xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {!isExpanded ? (
          <motion.button
            key="demo-collapsed"
            type="button"
            onClick={() => setIsExpanded(true)}
            aria-expanded={false}
            aria-label="Expand interactive portfolio demo controls"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{
              duration: MOTION_DURATIONS.fast,
              ease: ARCHITECTURAL_EASE,
            }}
            className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-iron-border bg-iron/95 px-4 py-2 text-iron-ink shadow-xl backdrop-blur-md transition-colors duration-150 hover:border-brass cursor-pointer"
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-brass"
            />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em]">
              Demo Controls
            </span>
            <ChevronUp className="h-3.5 w-3.5 text-iron-secondary" />
          </motion.button>
        ) : (
          <motion.div
            key="demo-expanded"
            role="region"
            aria-label="Interactive portfolio demo controls"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{
              duration: MOTION_DURATIONS.fast,
              ease: ARCHITECTURAL_EASE,
            }}
            className={cn(
              "w-[calc(100vw-2rem)] max-w-[330px] rounded-sm border border-iron-border bg-iron/95 p-3 text-iron-ink shadow-2xl backdrop-blur-md"
            )}
          >
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-iron-border">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-brass"
                />
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-iron-secondary">
                  INTERACTIVE PORTFOLIO DEMO
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                aria-expanded={true}
                aria-label="Collapse demo controls"
                className="inline-flex h-11 w-11 sm:h-8 sm:w-8 items-center justify-center rounded-sm text-iron-secondary transition-colors hover:bg-iron-elevated hover:text-iron-ink cursor-pointer"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={onAutoFillTestBooking}
                className="inline-flex min-h-[44px] sm:min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-sm border border-paper bg-paper px-3 py-2 text-xs font-semibold text-iron transition-colors duration-150 hover:bg-plaster cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span>Auto-Fill Test Booking</span>
              </button>

              <button
                type="button"
                onClick={onResetDemo}
                className="inline-flex min-h-[44px] sm:min-h-[40px] items-center justify-center gap-1.5 rounded-sm border border-iron-border bg-iron-elevated px-3 py-2 text-xs font-medium text-iron-ink transition-colors duration-150 hover:border-brass hover:text-brass cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                <span>Reset Demo</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
