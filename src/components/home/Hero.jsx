import React, { useCallback, useEffect, useRef } from "react";
import { useIntro } from "../../lib/hooks";
import { scrollToTarget } from "../../lib/scroll";
import { finePointer, reducedMotion } from "../../lib/env";
import { site } from "../../data/site";
import PodCluster from "../PodCluster";
import Magnetic from "../Magnetic";
import { TLink } from "../Transition";
import { ArrowDown, ArrowUpRight } from "../Icons";
import { RUN_CHAOS } from "../CommandPalette";

const pad = (n) => String(n).padStart(4, "0");

export default function Hero() {
  const root = useRef(null);
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
      ? ["Healthy", "var(--ok)"]
      : stats.killed > stats.healed
      ? ["Self-healing", "var(--signal)"]
      : ["Rolling update", "var(--fg)"];
    status.current.textContent = text;
    status.current.style.color = color;
  }, []);

  // The command palette can trigger the chaos test too.
  useEffect(() => {
    const onChaos = () => cluster.current && cluster.current.chaos(0.4);
    window.addEventListener(RUN_CHAOS, onChaos);
    return () => window.removeEventListener(RUN_CHAOS, onChaos);
  }, []);

  useIntro(root, (tl) => {
    tl.from(".hero__cluster", { opacity: 0, duration: 2.2, ease: "power2.out" }, 0)
      .from(".line__in", { yPercent: 112, duration: 1.3, ease: "expo.out", stagger: 0.1 }, 0.1)
      .from(".hero__fade", { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.7);
  });

  return (
    <section ref={root} className="hero theme-ink">
      <PodCluster ref={cluster} onStats={onStats} />

      <div className="wrap relative flex flex-1 flex-col justify-between gap-10 pb-[calc(clamp(1.25rem,3vw,2.5rem)+1.25rem)] pt-24 md:pt-28">
        <div className="hero__fade flex justify-end">
          <div className="hud t-mono">
            <dl className="hud__stats">
              <dt>Cluster</dt>
              <dd ref={status} style={{ color: "var(--ok)" }}>
                Healthy
              </dd>
              <dt>Pods ready</dt>
              <dd ref={ready}>0000/0000</dd>
              <dt>Killed by you</dt>
              <dd ref={killed}>0000</dd>
              <dt>Self-healed</dt>
              <dd ref={healed}>0000</dd>
            </dl>
            {!reducedMotion && (
              <button
                type="button"
                className="hud__chaos"
                onClick={() => cluster.current.chaos(0.4)}
                data-cursor="Break it"
              >
                Run chaos test
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end lg:gap-12">
            <h1 className="t-mega">
              <span className="line">
                <span className="line__in">Build it.</span>
              </span>
              <span className="line">
                <span className="line__in">Ship it.</span>
              </span>
              <span className="line">
                <span className="line__in">
                  Keep it <span className="serif accent">up.</span>
                </span>
              </span>
            </h1>

            <div className="grid gap-6 lg:pb-3">
              <p className="hero__fade text-[clamp(1rem,1.25vw,1.2rem)] leading-snug">
                {site.name}. {site.role}, based in {site.location}. I write the product, wire the
                pipeline, and run the cluster it lives on.
              </p>
              <div className="hero__fade flex flex-wrap items-center gap-x-6 gap-y-4">
                <Magnetic>
                  <TLink to="/works" name="Work" className="btn btn--solid t-mono">
                    See the work <ArrowUpRight />
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
              <ArrowDown className="h-3 w-3" /> Scroll
            </button>
            <p className="text-right">
              {finePointer ? "Hover the cluster" : "Tap the cluster"} to kill a pod. It comes back.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
