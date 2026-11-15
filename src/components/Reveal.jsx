import React, { useRef } from "react";
import { gsap, SplitText, useGSAP } from "../lib/gsap";
import { reducedMotion } from "../lib/env";

/**
 * Text that rises line by line out of a mask when it scrolls into view.
 *
 * SplitText re-splits on resize and once web fonts land (`autoSplit`), and
 * because the tween is returned from `onSplit` it carries its progress over,
 * so a resize mid-animation doesn't restart it.
 */
export function SplitReveal({ as: Tag = "p", className = "", delay = 0, children }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion) return;

      SplitText.create(ref.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.08,
            delay,
            scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
          }),
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Paragraph whose words light up as you scroll through it.
 */
export function ScrubWords({ as: Tag = "p", className = "", children }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion) return;

      SplitText.create(ref.current, {
        type: "words",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: {
                trigger: ref.current,
                start: "top 82%",
                end: "bottom 55%",
                scrub: 0.6,
              },
            }
          ),
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Fades and lifts its direct children in, staggered, on scroll.
 */
export function FadeUp({ as: Tag = "div", className = "", stagger = 0.08, children, ...rest }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.from(ref.current.children, {
        y: 36,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger,
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
