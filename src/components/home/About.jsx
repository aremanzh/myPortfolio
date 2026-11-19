import React, { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { reducedMotion } from "../../lib/env";
import { useContent } from "../../data/site";
import { useT } from "../../i18n";
import { FadeUp, ScrubWords } from "../Reveal";
import { ArrowUpRight } from "../Icons";

export default function About() {
  const t = useT();
  const { about } = useContent();
  const root = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion || !about.portrait) return;

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
          <h2 className="t-mono eyebrow">{t("about.eyebrow")}</h2>
          {about.portrait && (
            <div className="about__frame frame mt-8 aspect-[4/5] max-w-md" style={{ clipPath: "inset(0)" }}>
              <div className="frame__in">
                <img
                  className="about__img h-full w-full object-cover"
                  src={about.portrait.sm}
                  srcSet={about.portrait.srcSet}
                  sizes="(min-width: 1024px) 30vw, 90vw"
                  width={about.portrait.width}
                  height={about.portrait.height}
                  alt={about.portrait.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          )}
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

          {(about.experience.length > 0 || about.certifications.length > 0) && (
            <div className="mt-[clamp(3rem,6vw,6rem)] grid gap-12 xl:grid-cols-2 xl:gap-10">
              {about.experience.length > 0 && (
                <div>
                  <h3 className="t-mono text-[color:var(--muted)]">{t("about.experience")}</h3>
                  <FadeUp as="ol" className="mt-4" stagger={0.06}>
                    {about.experience.map((item) => (
                      <li
                        key={`${item.period}:${item.role}`}
                        className="grid gap-1 border-t border-[color:var(--line)] py-4 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-6"
                      >
                        <span className="t-mono pt-1 tabular-nums text-[color:var(--muted)]">{item.period}</span>
                        <span>
                          <span className="block text-lg font-medium leading-snug tracking-tight">{item.role}</span>
                          {item.org && <span className="t-body mt-1 block">{item.org}</span>}
                        </span>
                      </li>
                    ))}
                  </FadeUp>
                </div>
              )}

              {about.certifications.length > 0 && (
                <div>
                  <h3 className="t-mono text-[color:var(--muted)]">{t("about.certifications")}</h3>
                  <FadeUp as="ul" className="mt-4" stagger={0.06}>
                    {about.certifications.map((cert) => (
                      <li
                        key={cert.name}
                        className="grid gap-1 border-t border-[color:var(--line)] py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6"
                      >
                        <span>
                          <span className="block text-lg font-medium leading-snug tracking-tight">{cert.name}</span>
                          <span className="t-body mt-1 block">
                            {[cert.issuer, cert.date].filter(Boolean).join(" · ")}
                          </span>
                        </span>
                        {cert.verify && (
                          <a
                            href={cert.verify}
                            target="_blank"
                            rel="noreferrer"
                            className="link t-mono inline-flex items-center gap-2 self-start pt-1"
                            aria-label={t("about.verifyLabel", { name: cert.name, id: cert.id || "" })}
                          >
                            {t("about.verify")}
                            {/* IDs are case-sensitive: keep them as issued, not uppercased. */}
                            {cert.id && <span className="normal-case">· {cert.id}</span>}
                            <ArrowUpRight className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </li>
                    ))}
                  </FadeUp>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
