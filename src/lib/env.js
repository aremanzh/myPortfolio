import { useSyncExternalStore } from "react";

const query = (q) =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(q).matches
    : false;

/*
 * Motion is on by default, whatever the device's prefers-reduced-motion says:
 * plenty of Windows machines have "Animation effects" off without their owner
 * knowing, and the site is mostly still without it. A visitor who wants less
 * movement turns it off from the footer or the command palette; the choice is
 * kept in localStorage and applied from the next page load (setReducedMotion
 * reloads), which keeps every effect predictable.
 *
 * The same choice puts `motion-reduced` on <html> before the first paint
 * (root.jsx), which is what the reduced-motion CSS keys on.
 */
export const MOTION_KEY = "motion";
export const MOTION_CLASS = "motion-reduced";

function storedMotion() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(MOTION_KEY);
  } catch {
    return null;
  }
}

export const reducedMotion = storedMotion() === "reduced";

export function setReducedMotion(reduce) {
  try {
    window.localStorage.setItem(MOTION_KEY, reduce ? "reduced" : "full");
  } catch {
    // Storage blocked: nothing to remember the choice in, so nothing changes.
    return;
  }
  window.location.reload();
}

export const finePointer = query("(hover: hover) and (pointer: fine)");

// Preview build (vite.preview.config.js): a self-contained copy of the site for
// reviewing it somewhere that is not a real host, such as a sandboxed frame.
// It routes in memory instead of through the URL and never sends the contact
// form. Production builds leave this false.
export const preview = import.meta.env.VITE_PREVIEW === "1";

/*
 * Pages are prerendered to HTML at build time, where there is no window, so
 * the flags above are all false on the server. Anything they change in the
 * rendered markup must wait until after hydration or React will find markup
 * that does not match. Effects can read the flags directly.
 *
 * false while the server render (and the hydration pass) runs, true after.
 */
const noSubscribe = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false
  );
}

/** "/contact/" and "/contact" are the same page (prerendered pages are folders). */
export const normalizePath = (pathname) => pathname.replace(/\/+$/, "") || "/";
