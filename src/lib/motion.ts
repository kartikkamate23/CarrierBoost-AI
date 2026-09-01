/**
 * Shared Framer Motion variants.
 *
 * Purely presentational: these describe how elements enter and respond to
 * hover. They hold no application state and never affect behavior.
 *
 * Durations stay in the 150–400ms band so motion reads as responsive rather
 * than decorative. `prefers-reduced-motion` is honored globally in styles.css,
 * which collapses every transition to ~0ms; `useReducedMotion` below lets
 * individual components skip transforms entirely when that is cheaper.
 */
import type { Transition, Variants } from "framer-motion";

/** Matches --ease-entrance in styles.css. */
export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const;
/** Matches --ease-standard in styles.css. */
export const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;

export const DURATION = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
} as const;

export const transition: Transition = {
  duration: DURATION.base,
  ease: EASE_ENTRANCE,
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.slow, ease: EASE_STANDARD } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition },
};

export const slideUpSm: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_ENTRANCE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition },
};

/**
 * Parent variant that staggers children. Pair with `slideUp` on each child.
 */
export function stagger(staggerChildren = 0.06, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  };
}

/**
 * Standard scroll-reveal props. Reveals once, slightly before the element is
 * fully on screen, so content is never still animating when it is read.
 */
export const revealOnce = {
  // Keep SSR content visible. If the client bundle is delayed or unavailable,
  // a hidden-first animation would otherwise leave the entire section blank.
  initial: false,
  whileInView: "visible",
  viewport: { once: true, margin: "-80px" },
} as const;

export { useReducedMotion } from "framer-motion";
