import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "./gsap";
import { reducedMotion } from "./env";
import { useReady } from "./ready";
import { introDelay } from "../components/Transition";
import { site } from "../data/site";

/**
 * Entrance timeline for the top of a page.
 *
 * `build(tl)` adds tweens to a paused timeline (use `from` tweens so the
 * resting state stays the CSS state). It plays once the preloader is done, or
 * as the page-transition curtain lifts. Skipped under reduced motion.
 */
export function useIntro(scope, build) {
  const ready = useReady();
  const timeline = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const tl = gsap.timeline({ paused: true });
      build(tl);
      timeline.current = tl;
    },
    { scope }
  );

  useGSAP(
    () => {
      if (!ready || !timeline.current) return;
      gsap.delayedCall(introDelay(), () => timeline.current.play());
    },
    { dependencies: [ready], scope }
  );
}

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${site.name}` : `${site.name} · ${site.role}`;
  }, [title]);
}

const clock = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: site.timeZone,
});

/** Wall-clock time where Mumtaz is, ticking once a second. */
export function useLocalTime() {
  const [time, setTime] = useState(() => clock.format(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(clock.format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
