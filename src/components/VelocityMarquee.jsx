import React, { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { reducedMotion } from "../lib/env";
import { scrollVelocity } from "../lib/scroll";

/**
 * A marquee that drifts on its own and speeds up with the scroll, in the
 * direction you are scrolling. Content is rendered twice and the track wraps
 * at the halfway point, so the loop is seamless at any width.
 */
export default function VelocityMarquee({ items, direction = 1, outline = false, className = "" }) {
  const root = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const el = track.current;
    const setX = gsap.quickSetter(el, "x", "px");
    let half = el.scrollWidth / 2;
    let x = direction > 0 ? -half : 0;
    let visible = false;

    const measure = () => {
      half = el.scrollWidth / 2;
    };
    const resize = new ResizeObserver(measure);
    resize.observe(el);

    const tick = (_time, delta) => {
      if (!visible || !half) return;
      const boost = scrollVelocity() * 0.55;
      x += direction * (0.045 * delta + boost);
      // Keep x inside [-half, 0).
      x = ((x % half) - half) % half;
      setX(x);
    };

    const inView = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    inView.observe(root.current);

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      resize.disconnect();
      inView.disconnect();
    };
  }, [direction]);

  const row = items.map((item) => (
    <span key={item} className="marquee__item">
      {item}
    </span>
  ));

  return (
    <div
      ref={root}
      className={`marquee ${outline ? "marquee--outline" : ""} ${className}`}
      aria-hidden="true"
    >
      <div ref={track} className="marquee__track">
        <div className="inline-flex">{row}</div>
        <div className="inline-flex">{row}</div>
      </div>
    </div>
  );
}
