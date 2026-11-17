import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { reducedMotion } from "./env";

let lenis = null;

/**
 * Smooth scroll, driven by the GSAP ticker so Lenis and ScrollTrigger share a
 * single frame loop. Skipped entirely when the visitor has turned motion
 * down (lib/env.js), in which case every helper below falls back to native
 * scrolling.
 */
export function initScroll() {
  if (lenis || reducedMotion) return () => {};

  lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
}

/** Pixels per frame, signed. Zero when smooth scroll is off. */
export function scrollVelocity() {
  return lenis ? lenis.velocity : 0;
}

/**
 * Elements and selectors are turned into a pixel position here, from the
 * browser's own scrollY. Lenis can resolve an element itself, but it measures
 * from its internal position, which lags behind after a native scroll (a
 * dragged scrollbar, Page Down) and sends the page to the wrong place.
 */
function resolveTop(target, offset) {
  if (typeof target === "number") return target + offset;
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return null;
  return el.getBoundingClientRect().top + window.scrollY + offset;
}

export function scrollToTarget(target, { immediate = false, offset = 0 } = {}) {
  const top = resolveTop(target, offset);
  if (top === null) return;

  if (lenis) {
    // Lenis also skips a scrollTo whose target equals the position it last
    // knew about, so resync it first for an instant jump.
    if (immediate) {
      lenis.resize();
      window.scrollTo(0, top);
    }
    lenis.scrollTo(top, { immediate, force: true });
    return;
  }

  window.scrollTo({ top, behavior: immediate || reducedMotion ? "auto" : "smooth" });
}

export function lockScroll(locked) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle("is-locked", locked);
}
