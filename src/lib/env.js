const query = (q) =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(q).matches
    : false;

// Evaluated once at load. Someone toggling the OS setting mid-visit gets the
// new behaviour on the next page load, which keeps every effect predictable.
export const reducedMotion = query("(prefers-reduced-motion: reduce)");

export const finePointer = query("(hover: hover) and (pointer: fine)");
