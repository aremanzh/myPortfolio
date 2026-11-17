import { gsap } from "./gsap";
import { reducedMotion } from "./env";
import { play } from "./sound";

/*
 * The logo's one move: the two halves drift, then pull together like magnets
 * and land with a slight knock. The seam (if the mark has one) flashes in the
 * accent colour as they meet.
 *
 * Distances are in the mark's own units; the mark is 388 wide.
 */
export const SNAP_EASE = "power4.in";

/** Add a snap to `tl` at `position`, starting from halves `gap` apart. */
export function addSnap(tl, svg, { gap = 56, duration = 0.42, position, sound = true } = {}) {
  const [left, right] = svg.querySelectorAll(".mark__half");
  const seam = svg.querySelector(".mark__seam");

  tl.addLabel("snap", position)
    .fromTo(left, { x: -gap }, { x: 0, duration, ease: SNAP_EASE, immediateRender: false }, "snap")
    .fromTo(right, { x: gap }, { x: 0, duration, ease: SNAP_EASE, immediateRender: false }, "snap")
    .addLabel("land", `snap+=${duration}`)
    // The knock: a hair past centre and back.
    .to(left, { x: 1.5, duration: 0.05, ease: "power1.out", yoyo: true, repeat: 1 }, "land")
    .to(right, { x: -1.5, duration: 0.05, ease: "power1.out", yoyo: true, repeat: 1 }, "land");

  if (sound) tl.add(() => play("snap"), "land");
  if (seam) {
    tl.fromTo(seam, { opacity: 0 }, { opacity: 1, duration: 0.08, ease: "none" }, "land").to(
      seam,
      { opacity: 0, duration: 0.5, ease: "power2.out" },
      "land+=0.08"
    );
  }
  return tl;
}

/** Play a one-off snap on a mark, e.g. on hover. Returns the timeline. */
export function snapMark(svg, options = {}) {
  if (!svg || reducedMotion) return null;
  return addSnap(gsap.timeline(), svg, { position: 0, ...options });
}
