import { useEffect } from "react";

/**
 * Architectural easing curve matching `--ease-architectural` in src/index.css.
 */
export const ARCHITECTURAL_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Standardized spring physics presets for tactile, weighted UI transitions.
 */
export const SPRINGS = {
  snappy: { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.8 },
  drawer: { type: "spring" as const, stiffness: 340, damping: 34, mass: 0.9 },
  gentle: { type: "spring" as const, stiffness: 220, damping: 28, mass: 1 },
} as const;

/**
 * Centralized duration tokens (in seconds) for non-spring transitions.
 */
export const MOTION_DURATIONS = {
  fast: 0.14,
  base: 0.2,
  slow: 0.28,
} as const;

/**
 * Syncs `document.documentElement.dataset.tabHidden` with `document.visibilityState`
 * so infinite CSS pulse animations pause automatically when the tab is backgrounded.
 */
export function useDocumentVisibility(): void {
  useEffect(() => {
    const syncVisibility = () => {
      document.documentElement.dataset.tabHidden =
        document.visibilityState === "hidden" ? "true" : "false";
    };

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      document.removeEventListener("visibilitychange", syncVisibility);
      delete document.documentElement.dataset.tabHidden;
    };
  }, []);
}
