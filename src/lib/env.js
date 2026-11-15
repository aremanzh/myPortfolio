const query = (q) =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(q).matches
    : false;

// Evaluated once at load. Someone toggling the OS setting mid-visit gets the
// new behaviour on the next page load, which keeps every effect predictable.
export const reducedMotion = query("(prefers-reduced-motion: reduce)");

export const finePointer = query("(hover: hover) and (pointer: fine)");

// Preview build (REACT_APP_PREVIEW=1): a self-contained copy of the site for
// reviewing it somewhere that is not a real host, such as a sandboxed frame.
// It routes in memory instead of through the URL and never sends the contact
// form. Production builds leave this false.
export const preview = process.env.REACT_APP_PREVIEW === "1";
