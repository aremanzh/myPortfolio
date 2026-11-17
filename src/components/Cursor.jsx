import React, { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { finePointer, reducedMotion, useHydrated } from "../lib/env";

const INTERACTIVE = "a, button, [role='button'], input, textarea, label";

/**
 * Follower dot. It grows over anything clickable and turns into a labelled
 * disc over elements carrying `data-cursor="Label"`. The system cursor stays
 * visible, so this is decoration and never the only pointer.
 */
export default function Cursor() {
  const root = useRef(null);
  const label = useRef(null);
  // Rendered after hydration only: the server cannot know about the pointer.
  const on = useHydrated() && finePointer && !reducedMotion;

  useEffect(() => {
    if (!on) return undefined;

    const el = root.current;
    const moveX = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (event) => {
      el.classList.add("is-on");
      moveX(event.clientX);
      moveY(event.clientY);
    };

    const onOver = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const labelled = target && target.closest("[data-cursor]");
      const link = target && target.closest(INTERACTIVE);

      if (labelled) label.current.textContent = labelled.dataset.cursor;
      el.classList.toggle("is-label", Boolean(labelled));
      el.classList.toggle("is-link", !labelled && Boolean(link));
    };

    const onDown = () => el.classList.add("is-down");
    const onUp = () => el.classList.remove("is-down");
    const onLeave = () => el.classList.remove("is-on");

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [on]);

  if (!on) return null;

  return (
    <div ref={root} className="cursor" aria-hidden="true">
      <span className="cursor__dot" />
      <span ref={label} className="cursor__label t-mono" />
    </div>
  );
}
