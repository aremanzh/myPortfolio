import { useSyncExternalStore } from "react";

const query = (q) =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(q).matches
    : false;

// Evaluated once at load. Someone toggling the OS setting mid-visit gets the
// new behaviour on the next page load, which keeps every effect predictable.
export const reducedMotion = query("(prefers-reduced-motion: reduce)");

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
