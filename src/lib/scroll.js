import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { reducedMotion } from "./env";

let lenis = null;

/**
 * Smooth scroll, driven by the GSAP ticker so Lenis and ScrollTrigger share a
 * single frame loop. Skipped entirely under prefers-reduced-motion, in which
 * case every helper below falls back to native scrolling.
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

export function scrollToTarget(target, { immediate = false, offset = 0 } = {}) {
  if (lenis) {
    // Lenis skips a scrollTo whose target equals the position it last knew
    // about. If something moved the page natively in the meantime, that
    // position is stale, so resync before asking for a jump.
    if (immediate) lenis.resize();
    if (immediate && typeof target === "number") window.scrollTo(0, target);
    lenis.scrollTo(target, { immediate, offset, force: true });
    return;
  }

  const behavior = immediate || reducedMotion ? "auto" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
    return;
  }

  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior });
}

export function lockScroll(locked) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle("is-locked", locked);
}
