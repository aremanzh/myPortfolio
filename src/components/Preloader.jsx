import React, { useRef, useState } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { reducedMotion } from "../lib/env";
import { markReady } from "../lib/ready";
import { lockScroll } from "../lib/scroll";
import { addSnap } from "../lib/snap";
import { useContent } from "../data/site";
import { useT } from "../i18n";
import Mark from "./Mark";

// Don't let a slow font hold the page hostage.
const fontsLoaded = () =>
  Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((resolve) => setTimeout(resolve, 2500)),
  ]);

// Where the halves of the mark start, and how far they have drifted when the
// counter hits 100 (the mark's own units; it is 388 wide).
const START_GAP = 96;
const DRIFT_GAP = 60;

/**
 * First-load screen, played as a deploy: four pipeline stages tick over while
 * the counter runs and the two halves of the mark drift towards each other.
 * At 100 they snap together, then the panel lifts. It doubles as cover for
 * the web fonts, so headline line-splitting measures the real typeface.
 */
export default function Preloader() {
  const t = useT();
  const { site } = useContent();
  const root = useRef(null);
  const count = useRef(null);
  const mark = useRef(null);
  const [done, setDone] = useState(false);
  const stages = t("preloader.stages").split("|");

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
      const stageEls = gsap.utils.toArray(".preloader__stage");
      const [left, right] = mark.current.querySelectorAll(".mark__half");
      const progress = { value: 0 };

      // Set before the first paint, so the halves never flash closed.
      gsap.set(left, { x: -START_GAP });
      gsap.set(right, { x: START_GAP });

      const tl = gsap.timeline({ paused: true });
      tl.to(progress, {
        value: 100,
        duration: 1.7,
        ease: "power2.inOut",
        onUpdate: () => {
          const value = Math.round(progress.value);
          count.current.textContent = String(value).padStart(3, "0");
          stageEls.forEach((el, i) => {
            el.classList.toggle("is-done", value >= ((i + 1) / stageEls.length) * 100);
          });
        },
      })
        .to(left, { x: -DRIFT_GAP, duration: 1.7, ease: "power1.inOut" }, 0)
        .to(right, { x: DRIFT_GAP, duration: 1.7, ease: "power1.inOut" }, 0);

      // Live: the halves meet. Sound only plays if the visitor turned it on.
      addSnap(tl, mark.current, { gap: DRIFT_GAP, duration: 0.34, position: 1.7 });

      tl.to(".preloader__panel", { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "land+=0.3")
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
          <span>{t("preloader.deploying")}</span>
        </div>
        <Mark ref={mark} seam className="preloader__mark" />
        <div className="flex items-end justify-between gap-6">
          <ul className="t-mono grid gap-2">
            {stages.map((stage) => (
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
