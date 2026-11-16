import React, { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { reducedMotion } from "../../lib/env";
import { scrollToTarget } from "../../lib/scroll";
import { pipeline } from "../../data/site";
import { SplitReveal } from "../Reveal";

const THEMES = ["theme-ink-2 stage--bordered", "theme-paper", "theme-signal"];

const QUEUED = "queued";
const RUNNING = "running";
const PASSED = "passed";

const LINE_MS = 420; // one log line roughly every 0.4 s
const TICK_MS = 100;
// The last stage passes once the summary line has risen this far up the screen.
const FINISH_AT = 0.6;

// The log pane is as tall as the longest log, so the stacked cards line up.
const LOG_ROWS = Math.max(1, ...pipeline.map((stage) => stage.log.length)) + 1;

const pad2 = (n) => String(n).padStart(2, "0");
const clock = (ms) => {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(seconds / 60)}:${pad2(seconds % 60)}`;
};
const freshRuns = () => pipeline.map(() => ({ status: QUEUED, startedAt: 0, endedAt: 0 }));

/**
 * Everything the visitor can see, derived from the run records at time `t`.
 * Kept as plain data so the tick can tell cheaply whether a render is needed.
 */
function snapshot(runs, t) {
  const stages = runs.map((run, i) => {
    const lines = pipeline[i].log.length;
    if (run.status === QUEUED) return { status: QUEUED, printed: 0, time: "" };
    if (run.status === RUNNING) {
      return {
        status: RUNNING,
        printed: Math.min(lines, Math.floor((t - run.startedAt) / LINE_MS) + 1),
        time: clock(t - run.startedAt),
      };
    }
    return { status: PASSED, printed: lines, time: clock(run.endedAt - run.startedAt) };
  });

  const first = runs[0];
  const last = runs[runs.length - 1];
  if (last.status === PASSED) {
    return { stages, overall: PASSED, total: clock(last.endedAt - first.startedAt), note: "" };
  }
  if (first.status === QUEUED) return { stages, overall: QUEUED, total: "", note: "" };

  const running = runs.findIndex((run) => run.status === RUNNING);
  const note =
    running >= 0
      ? `${pipeline[running].name} in progress`
      : `Waiting for you at ${pipeline[runs.findIndex((run) => run.status === QUEUED)].name}`;
  return { stages, overall: RUNNING, total: clock(t - first.startedAt), note };
}

function Status({ status, time }) {
  const label = status === QUEUED ? "Queued" : status === RUNNING ? "Running" : "Passed";
  return (
    <span className={`chip chip--${status}`}>
      <span className="chip__dot" aria-hidden="true" />
      {label}
      {time && <span className="chip__time">{time}</span>}
    </span>
  );
}

/**
 * "What I do" as a CI pipeline that runs while you scroll through it.
 *
 * Each card sticks under the nav and the next one slides over it, so the
 * covered cards leave their header strips stacked at the top like a pipeline
 * view. A stage starts when its card reaches the top, prints its job log, and
 * passes once you move on to the next card. Stages run in order, and every
 * duration shown is the real time the visitor spent, the same rule as the
 * hero's pod counters.
 *
 * Stacking is plain `position: sticky`, so the layout works without the
 * script; the script adds the run and the slight scale-back of covered cards.
 */
export default function Pipeline() {
  const root = useRef(null);
  const deck = useRef(null);
  const cards = useRef([]);
  const summary = useRef(null);
  const runs = useRef(freshRuns());
  // After "Run again" nothing starts until the visitor is back above the
  // first card; otherwise the scroll back up would set it off on the way.
  const armed = useRef(true);
  const last = useRef("");
  const [view, setView] = useState(() => snapshot(runs.current, 0));

  const publish = useCallback((t) => {
    const next = snapshot(runs.current, t);
    const key = JSON.stringify(next);
    if (key !== last.current) {
      last.current = key;
      setView(next);
    }
  }, []);

  useEffect(() => {
    const reachedTop = (el) => el.getBoundingClientRect().top <= parseFloat(getComputedStyle(el).top) + 4;

    const tick = () => {
      const t = performance.now();
      const els = cards.current.filter(Boolean);
      if (els.length !== pipeline.length || !summary.current) return;
      const reached = els.map(reachedTop);

      if (!armed.current) {
        if (reached[0]) return;
        armed.current = true;
      }

      const list = runs.current;
      for (let i = 0; i < list.length; i += 1) {
        const run = list[i];
        if (run.status === PASSED) continue;

        if (run.status === QUEUED) {
          const previousDone = i === 0 || list[i - 1].status === PASSED;
          if (previousDone && reached[i]) {
            run.status = RUNNING;
            run.startedAt = t;
          }
          break;
        }

        // Running: pass once the whole log is out and the visitor has moved on.
        const logDone = t - run.startedAt >= Math.max(1, pipeline[i].log.length) * LINE_MS;
        const movedOn =
          i < list.length - 1
            ? reached[i + 1]
            : summary.current.getBoundingClientRect().top <= window.innerHeight * FINISH_AT;
        if (!(logDone && movedOn)) break;
        run.status = PASSED;
        run.endedAt = t;
      }

      publish(t);
    };

    tick();
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [publish]);

  useGSAP(
    () => {
      if (reducedMotion) return;

      // The deeper a card sits in the stack, the further it steps back.
      const els = gsap.utils.toArray(".stage");
      const lastCard = els[els.length - 1];
      els.slice(0, -1).forEach((card, i) => {
        gsap.to(card, {
          scale: 1 - 0.035 * (els.length - 1 - i),
          ease: "none",
          scrollTrigger: {
            trigger: els[i + 1],
            start: "top bottom",
            endTrigger: lastCard,
            end: "top 30%",
            scrub: true,
          },
        });
      });
    },
    { scope: root }
  );

  const runAgain = () => {
    runs.current = freshRuns();
    armed.current = false;
    publish(performance.now());
    deck.current.focus({ preventScroll: true });
    scrollToTarget(root.current);
  };

  return (
    <section ref={root} className="section theme-ink">
      <div className="wrap">
        <p className="t-mono eyebrow">What I do</p>
        <SplitReveal as="h2" className="t-display mt-8 max-w-[11ch]">
          One person. The <span className="serif accent">whole</span> pipeline.
        </SplitReveal>

        <ol
          ref={deck}
          tabIndex={-1}
          aria-label="Pipeline stages"
          className="mt-[clamp(3rem,7vw,7rem)] grid gap-6 outline-none"
        >
          {pipeline.map((stage, i) => {
            const state = view.stages[i];
            return (
              <li
                key={stage.id}
                ref={(el) => {
                  cards.current[i] = el;
                }}
                className={`stage stage--${state.status} ${THEMES[i % THEMES.length]}`}
                style={{ "--i": i }}
              >
                <div className="stage__head t-mono">
                  <span>
                    Stage {pad2(i + 1)} / {pad2(pipeline.length)}
                    <span className="mx-3 opacity-50">/</span>
                    {stage.name}
                  </span>
                  <Status status={state.status} time={state.time} />
                </div>

                <div className="stage__body grid items-end gap-8 lg:grid-cols-12">
                  <h3 className="stage__name t-display lg:col-span-6">{stage.name}</h3>
                  <div className="grid gap-7 lg:col-span-6">
                    <ol className="log" style={{ "--rows": LOG_ROWS }} aria-label={`${stage.name} job log`}>
                      {stage.log.map((line, n) => (
                        <li
                          key={`${n}:${line}`}
                          className={[
                            "log__line",
                            line.startsWith("$") ? "log__cmd" : "log__out",
                            n < state.printed ? "is-on" : "",
                            state.status === RUNNING && n === state.printed - 1 ? "is-current" : "",
                          ].join(" ")}
                        >
                          {line}
                        </li>
                      ))}
                      <li
                        className={`log__line log__done ${state.status === PASSED ? "is-on" : ""}`}
                        aria-hidden={state.status !== PASSED}
                      >
                        {state.status === PASSED ? "Job succeeded" : " "}
                      </li>
                    </ol>
                    <p className="max-w-[36ch] text-[clamp(1.1rem,1.7vw,1.6rem)] font-medium leading-snug tracking-tight">
                      {stage.summary}
                    </p>
                    <ul className="t-mono flex flex-wrap gap-2">
                      {stage.tools.map((tool) => (
                        <li key={tool} className="tag">
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div ref={summary} className="pipeline-summary t-mono">
          <span className="flex items-center gap-3">
            Pipeline <Status status={view.overall} time={view.total} />
          </span>
          <p className="text-[color:var(--muted)]">
            {view.overall === QUEUED && "It runs as you scroll through it."}
            {view.overall === RUNNING && view.note}
            {view.overall === PASSED && "Every duration is the time you spent on that card."}
          </p>
          {view.overall === PASSED && (
            <button type="button" className="link uppercase tracking-[inherit]" onClick={runAgain}>
              Run it again
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
