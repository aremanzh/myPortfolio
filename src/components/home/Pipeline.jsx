import React, { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { reducedMotion } from "../../lib/env";
import { pipeline } from "../../data/site";
import { SplitReveal } from "../Reveal";

const THEMES = ["theme-ink-2 stage--bordered", "theme-paper", "theme-signal"];

/**
 * The three pipeline stages as a deck: each card sticks under the nav and the
 * next one slides over it. Stacking is plain `position: sticky`, so it works
 * without JS; the script only adds the slight scale-back of covered cards.
 */
export default function Pipeline() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion) return;

      // The deeper a card sits in the stack, the further it steps back.
      const cards = gsap.utils.toArray(".stage");
      const last = cards[cards.length - 1];
      cards.slice(0, -1).forEach((card, i) => {
        gsap.to(card, {
          scale: 1 - 0.035 * (cards.length - 1 - i),
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            endTrigger: last,
            end: "top 30%",
            scrub: true,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="section theme-ink">
      <div className="wrap">
        <p className="t-mono eyebrow">What I do</p>
        <SplitReveal as="h2" className="t-display mt-8 max-w-[11ch]">
          One person. The <span className="serif accent">whole</span> pipeline.
        </SplitReveal>

        <ol className="mt-[clamp(3rem,7vw,7rem)] grid gap-6">
          {pipeline.map((stage, i) => (
            <li key={stage.id} className={`stage ${THEMES[i % THEMES.length]}`} style={{ "--i": i }}>
              <div className="stage__head t-mono">
                <span>
                  Stage {String(i + 1).padStart(2, "0")} / {String(pipeline.length).padStart(2, "0")}
                  <span className="mx-3 opacity-50">/</span>
                  {stage.name}
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-[1px] bg-current" /> Passed
                </span>
              </div>

              <div className="stage__body grid items-end gap-8 lg:grid-cols-12">
                <h3 className="stage__name t-display lg:col-span-6">{stage.name}</h3>
                <div className="lg:col-span-6">
                  <p className="max-w-[36ch] text-[clamp(1.1rem,1.7vw,1.6rem)] font-medium leading-snug tracking-tight">
                    {stage.summary}
                  </p>
                  <ul className="t-mono mt-7 flex flex-wrap gap-2">
                    {stage.tools.map((tool) => (
                      <li key={tool} className="tag">
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
