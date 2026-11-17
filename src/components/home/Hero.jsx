import React, { useCallback, useEffect, useRef } from "react";
import { useIntro } from "../../lib/hooks";
import { scrollToTarget } from "../../lib/scroll";
import { finePointer, reducedMotion, useHydrated } from "../../lib/env";
import { useContent } from "../../data/site";
import { useT } from "../../i18n";
import { play } from "../../lib/sound";
import PodCluster from "../PodCluster";
import Magnetic from "../Magnetic";
import { TLink } from "../Transition";
import { ArrowDown, ArrowUpRight } from "../Icons";
import { RUN_CHAOS } from "../CommandPalette";

const pad = (n) => String(n).padStart(4, "0");

export default function Hero() {
  const t = useT();
  const { site } = useContent();
  const root = useRef(null);
  const hydrated = useHydrated();
  const cluster = useRef(null);
  const status = useRef(null);
  const ready = useRef(null);
  const killed = useRef(null);
  const healed = useRef(null);

  // The simulation reports at frame rate, so its counters are written
  // straight into the DOM and never go through React state.
  const onStats = useCallback((stats) => {
    if (!status.current) return;
    ready.current.textContent = `${pad(stats.running)}/${pad(stats.total)}`;
    killed.current.textContent = pad(stats.killed);
    healed.current.textContent = pad(stats.healed);

    const healthy = stats.running >= stats.total * 0.985;
    const [text, color] = healthy
      ? [t("hero.status.healthy"), "var(--ok)"]
      : stats.killed > stats.healed
      ? [t("hero.status.healing"), "var(--signal)"]
      : [t("hero.status.rolling"), "var(--fg)"];
    status.current.textContent = text;
    status.current.style.color = color;
  }, [t]);

  // The command palette can trigger the chaos test too.
  useEffect(() => {
    const onChaos = () => {
      play("blip");
      if (cluster.current) cluster.current.chaos(0.4);
    };
    window.addEventListener(RUN_CHAOS, onChaos);
    return () => window.removeEventListener(RUN_CHAOS, onChaos);
  }, []);

  useIntro(root, (tl) => {
    tl.from(".hero__cluster", { opacity: 0, duration: 2.2, ease: "power2.out" }, 0)
      .from(".line__in", { yPercent: 112, duration: 1.3, ease: "expo.out", stagger: 0.07 }, 0.1)
      .from(".hero__fade", { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.7);
  });

  return (
    <section ref={root} className="hero theme-ink">
      <PodCluster ref={cluster} onStats={onStats} />

      <div className="wrap relative flex flex-1 flex-col justify-between gap-10 pb-[calc(clamp(1.25rem,3vw,2.5rem)+1.25rem)] pt-24 md:pt-28">
        <div className="hero__fade flex justify-end">
          <div className="hud t-mono">
            <dl className="hud__stats">
              <dt>{t("hero.status.cluster")}</dt>
              <dd ref={status} style={{ color: "var(--ok)" }}>
                {t("hero.status.healthy")}
              </dd>
              <dt>{t("hero.status.ready")}</dt>
              <dd ref={ready}>0000/0000</dd>
              <dt>{t("hero.status.killed")}</dt>
              <dd ref={killed}>0000</dd>
              <dt>{t("hero.status.healed")}</dt>
              <dd ref={healed}>0000</dd>
            </dl>
            {!(hydrated && reducedMotion) && (
              <button
                type="button"
                className="hud__chaos"
                onClick={() => {
                  play("blip");
                  cluster.current.chaos(0.4);
                }}
                data-cursor={t("hero.chaosCursor")}
              >
                {t("hero.chaos")}
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end lg:gap-12">
            <h1 className="t-mega">
              <span className="line">
                <span className="line__in">{t("hero.line1")}</span>
              </span>
              <span className="line">
                <span className="line__in">{t("hero.line2")}</span>
              </span>
              <span className="line">
                <span className="line__in">
                  {t("hero.line3Pre")}
                  <span className="serif accent">{t("hero.line3Accent")}</span>
                </span>
              </span>
            </h1>

            <div className="grid gap-6 lg:pb-3">
              <p className="hero__fade text-[clamp(1rem,1.25vw,1.2rem)] leading-snug">
                {t("hero.intro", { name: site.name, role: site.role, location: site.location })}
              </p>
              <div className="hero__fade flex flex-wrap items-center gap-x-6 gap-y-4">
                <Magnetic>
                  <TLink to="/works" name={t("nav.work")} className="btn btn--solid t-mono">
                    {t("hero.cta")} <ArrowUpRight />
                  </TLink>
                </Magnetic>
                <span className={`badge t-mono ${site.available ? "badge--on" : ""}`}>
                  <span className="badge__dot" />
                  {site.available ? site.availabilityLabel : site.unavailableLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="hero__fade t-mono mt-8 flex items-center justify-between gap-6 border-t border-[color:var(--line)] pt-5 text-[color:var(--muted)]">
            <button
              type="button"
              className="flex items-center gap-3 uppercase"
              onClick={() => scrollToTarget("#about")}
            >
              <ArrowDown className="h-3 w-3" /> {t("hero.scroll")}
            </button>
            <p className="text-right">
              {hydrated && !finePointer ? t("hero.hintTap") : t("hero.hintHover")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
