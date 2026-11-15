import React, { useRef, useState } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { reducedMotion } from "../lib/env";
import { markReady } from "../lib/ready";
import { lockScroll } from "../lib/scroll";
import { site } from "../data/site";

const STAGES = ["Build", "Test", "Ship", "Live"];

// Don't let a slow font hold the page hostage.
const fontsLoaded = () =>
  Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((resolve) => setTimeout(resolve, 2500)),
  ]);

/**
 * First-load screen, played as a deploy: four pipeline stages tick over while
 * the counter runs, then the panel lifts. It doubles as cover for the web
 * fonts, so headline line-splitting measures the real typeface.
 */
export default function Preloader() {
  const root = useRef(null);
  const count = useRef(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      if (reducedMotion) {
        fontsLoaded().then(() => {
          markReady();
          setDone(true);
        });
        return;
      }

      lockScroll(true);
      const stages = gsap.utils.toArray(".preloader__stage");
      const progress = { value: 0 };

      const tl = gsap.timeline({ paused: true });
      tl.to(progress, {
        value: 100,
        duration: 1.7,
        ease: "power2.inOut",
        onUpdate: () => {
          const value = Math.round(progress.value);
          count.current.textContent = String(value).padStart(3, "0");
          stages.forEach((el, i) => {
            el.classList.toggle("is-done", value >= ((i + 1) / stages.length) * 100);
          });
        },
      })
        .to(".preloader__panel", { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "+=0.25")
        .to(".preloader__wipe", { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "<0.12")
        .add(() => {
          lockScroll(false);
          markReady();
        }, "<0.3")
        .add(() => setDone(true));

      let cancelled = false;
      fontsLoaded().then(() => {
        if (!cancelled) tl.play();
      });

      return () => {
        cancelled = true;
        lockScroll(false);
      };
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div ref={root} className="preloader" aria-hidden="true">
      <div className="preloader__wipe" />
      <div className="preloader__panel">
        <div className="t-mono flex justify-between">
          <span>{site.name}</span>
          <span>Deploying portfolio</span>
        </div>
        <div className="flex items-end justify-between gap-6">
          <ul className="t-mono grid gap-2">
            {STAGES.map((stage) => (
              <li key={stage} className="preloader__stage">
                {stage}
              </li>
            ))}
          </ul>
          <span ref={count} className="preloader__count t-mega">
            000
          </span>
        </div>
      </div>
    </div>
  );
}
