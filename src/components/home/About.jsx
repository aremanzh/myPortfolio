import React, { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { reducedMotion } from "../../lib/env";
import { about, site } from "../../data/site";
import { FadeUp, ScrubWords } from "../Reveal";
import portraitSm from "../../assets/portrait-640.webp";
import portraitLg from "../../assets/portrait-1100.webp";

export default function About() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion) return;

      // Portrait: unmask on entry, then drift inside its frame while scrolling.
      gsap.from(".about__frame", {
        clipPath: "inset(100% 0 0 0)",
        duration: 1.4,
        ease: "power4.inOut",
        scrollTrigger: { trigger: ".about__frame", start: "top 85%", once: true },
      });
      gsap.fromTo(
        ".about__img",
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: ".about__frame", start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} id="about" className="section theme-paper lip relative z-10 -mt-[clamp(1.25rem,3vw,2.5rem)]">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <h2 className="t-mono eyebrow">About</h2>
          <div className="about__frame frame mt-8 aspect-[4/5] max-w-md" style={{ clipPath: "inset(0)" }}>
            <div className="frame__in">
              <img
                className="about__img h-full w-full object-cover"
                src={portraitSm}
                srcSet={`${portraitSm} 640w, ${portraitLg} 1100w`}
                sizes="(min-width: 1024px) 30vw, 90vw"
                width="1100"
                height="1650"
                alt={`Portrait of ${site.name}, lit in red and blue against a dark background`}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 lg:pt-14">
          <ScrubWords className="t-lead max-w-[26ch]">{about.statement}</ScrubWords>

          <FadeUp as="dl" className="mt-[clamp(3rem,6vw,6rem)] grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {about.facts.map((fact) => (
              <div key={fact.label} className="border-t border-[color:var(--line)] pt-4">
                <dt className="t-mono text-[color:var(--muted)]">{fact.label}</dt>
                <dd className="mt-2 text-lg font-medium leading-snug tracking-tight">{fact.value}</dd>
              </div>
            ))}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
