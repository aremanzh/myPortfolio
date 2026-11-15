import React, { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { finePointer, reducedMotion } from "../lib/env";

/** Pulls its child toward the cursor while hovered, then springs back. */
export default function Magnetic({ children, strength = 0.35, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!finePointer || reducedMotion) return undefined;

    const el = ref.current;
    const moveX = gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1, 0.45)" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1, 0.45)" });

    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      moveX((event.clientX - (rect.left + rect.width / 2)) * strength);
      moveY((event.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const onLeave = () => {
      moveX(0);
      moveY(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.set(el, { clearProps: "transform" });
    };
  }, [strength]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
