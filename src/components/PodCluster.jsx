import React, { useEffect, useRef } from "react";
import { reducedMotion } from "../lib/env";

/*
 * The hero illustration: a cluster of pods laid out on nodes.
 *
 * Point at it and the pods under the cursor are killed; a moment later the
 * "controller" schedules replacements, which come up as Pending and settle
 * back to Running. Every so often a rolling restart sweeps the whole cluster.
 * The counters in the HUD are the real numbers from this simulation.
 *
 * Drawn on a 2D canvas: a few thousand rects per frame, paused whenever the
 * hero is off screen or the tab is hidden.
 */

const CELL = 11; // pod size, px
const GAP = 5; // gap between pods
const NODE_COLS = 6;
const NODE_ROWS = 5;
const NODE_GAP = 26; // gap between nodes
const KILL_RADIUS = 54;

const RUNNING = 0;
const TERMINATING = 1;
const GONE = 2;
const PENDING = 3;

const TERMINATE_MS = 240;
const PENDING_MS = 520;
const WAVE_EVERY_MS = 9000;
const WAVE_SPEED = 0.9; // px per ms

const PAPER = "237, 233, 224";
const SIGNAL = "255, 74, 28";

const pad = (n, width) => String(n).padStart(width, "0");
const ramp = (value, from, to) => Math.min(1, Math.max(0, (value - from) / (to - from)));

/**
 * How visible the cluster is at a point, 0..1. It fades in below the nav and
 * out before the headline, so text always sits on a clean background. Pods in
 * the faded-out area are never created: nothing invisible can be "killed",
 * and the HUD counts only what is on screen.
 */
function visibilityAt(x, y, width, height) {
  const u = x / width;
  const v = y / height;
  if (width >= 1024) {
    return ramp(u + (v - 0.5) * 0.1, 0.3, 0.68) * ramp(v, 0, 0.15) * (1 - ramp(v, 0.46, 0.84));
  }
  return ramp(v, 0, 0.13) * (1 - ramp(v, 0.34, 0.6));
}

export default function PodCluster({ hudRefs }) {
  const wrap = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    const el = canvas.current;
    const host = wrap.current;
    const ctx = el.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let pods = [];
    let backdrop = null; // node outlines + labels, drawn once per resize
    let killed = 0;
    let healed = 0;
    let lastHud = "";

    const pointer = { x: -9999, y: -9999, active: false };
    let wave = null; // { x, at } sweeping left to right
    let nextWaveAt = 0;

    let raf = 0;
    let last = 0;
    let visible = true;

    function build() {
      const rect = host.getBoundingClientRect();
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      if (!width || !height) return;

      el.width = width * dpr;
      el.height = height * dpr;

      const nodeW = NODE_COLS * CELL + (NODE_COLS - 1) * GAP;
      const nodeH = NODE_ROWS * CELL + (NODE_ROWS - 1) * GAP;
      const pitchX = nodeW + NODE_GAP;
      const pitchY = nodeH + NODE_GAP;
      const cols = Math.ceil(width / pitchX) + 1;
      const rows = Math.ceil(height / pitchY) + 1;
      // Anchor the grid to the right edge so it bleeds off the top/right.
      const originX = width - cols * pitchX + NODE_GAP * 1.5;
      const originY = -nodeH * 0.35;

      backdrop = document.createElement("canvas");
      backdrop.width = el.width;
      backdrop.height = el.height;
      const b = backdrop.getContext("2d");
      b.scale(dpr, dpr);
      b.font = '500 8px "JetBrains Mono Variable", ui-monospace, monospace';
      b.textBaseline = "bottom";

      pods = [];
      let nodeIndex = 0;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const nx = originX + c * pitchX;
          const ny = originY + r * pitchY;
          const nodeAlpha = visibilityAt(nx + nodeW / 2, ny + nodeH / 2, width, height);
          if (nodeAlpha < 0.05) continue;
          nodeIndex += 1;

          b.strokeStyle = `rgba(${PAPER}, ${0.1 * nodeAlpha})`;
          b.lineWidth = 1;
          b.beginPath();
          b.roundRect(nx - 7.5, ny - 7.5, nodeW + 15, nodeH + 15, 5);
          b.stroke();
          b.fillStyle = `rgba(${PAPER}, ${0.34 * nodeAlpha})`;
          b.fillText(`NODE-${pad(nodeIndex, 2)}`, nx - 7, ny - 10);

          for (let py = 0; py < NODE_ROWS; py += 1) {
            for (let px = 0; px < NODE_COLS; px += 1) {
              const x = nx + px * (CELL + GAP);
              const y = ny + py * (CELL + GAP);
              const alpha = visibilityAt(x, y, width, height);
              if (alpha < 0.05) continue;
              pods.push({
                x,
                y,
                alpha,
                state: RUNNING,
                t: 0,
                wait: 0,
                base: 0.1 + Math.random() * 0.22,
                flash: 0,
                phase: Math.random() * Math.PI * 2,
                speed: 0.0006 + Math.random() * 0.0012,
                counted: false,
              });
            }
          }
        }
      }
    }

    function kill(pod, byVisitor) {
      pod.state = TERMINATING;
      pod.t = 0;
      pod.counted = byVisitor;
      if (byVisitor) killed += 1;
    }

    function step(dt, now) {
      // Rolling restart front.
      if (!wave && now > nextWaveAt) {
        wave = { x: -40 };
        nextWaveAt = now + WAVE_EVERY_MS;
      }
      const waveFrom = wave ? wave.x : 0;
      if (wave) {
        wave.x += WAVE_SPEED * dt;
        if (wave.x > width + height + 80) wave = null;
      }
      const waveTo = wave ? wave.x : 0;

      let running = 0;
      for (let i = 0; i < pods.length; i += 1) {
        const pod = pods[i];
        pod.t += dt;

        switch (pod.state) {
          case RUNNING: {
            running += 1;
            pod.flash *= Math.exp(-dt / 420);

            if (pointer.active) {
              const dx = pod.x + CELL / 2 - pointer.x;
              const dy = pod.y + CELL / 2 - pointer.y;
              if (dx * dx + dy * dy < KILL_RADIUS * KILL_RADIUS) {
                kill(pod, true);
                break;
              }
            }
            if (wave) {
              // Diagonal front: a pod restarts as the front crosses it.
              const along = pod.x + pod.y * 0.6;
              if (along >= waveFrom && along < waveTo) {
                pod.state = PENDING;
                pod.t = PENDING_MS * 0.45;
                pod.counted = false;
              }
            }
            break;
          }
          case TERMINATING:
            if (pod.t >= TERMINATE_MS) {
              pod.state = GONE;
              pod.t = 0;
              pod.wait = 450 + Math.random() * 1100;
            }
            break;
          case GONE:
            if (pod.t >= pod.wait) {
              pod.state = PENDING;
              pod.t = 0;
            }
            break;
          case PENDING:
            if (pod.t >= PENDING_MS) {
              pod.state = RUNNING;
              pod.t = 0;
              pod.flash = 0.75;
              if (pod.counted) {
                healed += 1;
                pod.counted = false;
              }
            }
            break;
          default:
        }
      }
      return running;
    }

    function draw(now) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, el.width, el.height);
      if (backdrop) ctx.drawImage(backdrop, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      for (let i = 0; i < pods.length; i += 1) {
        const pod = pods[i];
        const { x, y } = pod;

        if (pod.state === RUNNING) {
          const twinkle = Math.sin(now * pod.speed + pod.phase) * 0.05;
          ctx.fillStyle = `rgba(${PAPER}, ${Math.min(1, pod.base + twinkle + pod.flash) * pod.alpha})`;
          ctx.fillRect(x, y, CELL, CELL);
        } else if (pod.state === TERMINATING) {
          const k = 1 - pod.t / TERMINATE_MS;
          const size = CELL * (0.3 + 0.7 * k);
          const o = (CELL - size) / 2;
          ctx.fillStyle = `rgba(${SIGNAL}, ${(0.35 + 0.65 * k) * pod.alpha})`;
          ctx.fillRect(x + o, y + o, size, size);
        } else if (pod.state === PENDING) {
          const k = Math.min(1, pod.t / PENDING_MS);
          ctx.strokeStyle = `rgba(${SIGNAL}, ${(0.45 + 0.55 * k) * pod.alpha})`;
          ctx.lineWidth = 1.25;
          ctx.strokeRect(x + 0.6, y + 0.6, CELL - 1.2, CELL - 1.2);
          ctx.fillStyle = `rgba(${SIGNAL}, ${0.3 * k * pod.alpha})`;
          ctx.fillRect(x, y, CELL, CELL);
        }
        // GONE draws nothing: an empty slot.
      }
    }

    function writeHud(running) {
      if (!hudRefs) return;
      const text = `${running}|${killed}|${healed}`;
      if (text === lastHud) return;
      lastHud = text;

      const { ready, killedEl, healedEl, status } = hudRefs;
      if (ready.current) ready.current.textContent = `${pad(running, 4)}/${pad(pods.length, 4)}`;
      if (killedEl.current) killedEl.current.textContent = pad(killed, 4);
      if (healedEl.current) healedEl.current.textContent = pad(healed, 4);
      if (status.current) {
        const healthy = running >= pods.length * 0.985;
        const [text, color] = healthy
          ? ["Healthy", "var(--ok)"]
          : killed > healed
          ? ["Self-healing", "var(--signal)"]
          : ["Rolling update", "var(--fg)"];
        status.current.textContent = text;
        status.current.style.color = color;
      }
    }

    function frame(now) {
      const dt = Math.min(50, now - (last || now));
      last = now;
      const running = step(dt, now);
      draw(now);
      writeHud(running);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (raf || reducedMotion || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    function onPointer(event) {
      const rect = host.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active =
        pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
    }

    function onPointerEnd() {
      pointer.active = false;
    }

    // A finger lifting ends the interaction; a mouse button releasing doesn't.
    function onPointerUp(event) {
      if (event.pointerType !== "mouse") onPointerEnd();
    }

    function rebuild() {
      build();
      nextWaveAt = performance.now() + 2600;
      wave = null;
      draw(performance.now());
      writeHud(pods.length);
    }

    rebuild();
    start();

    const resize = new ResizeObserver(rebuild);
    resize.observe(host);

    const inView = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    inView.observe(host);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // Mouse hovers; touch gets a tap/drag. The canvas itself ignores pointer
    // events so text and links on top of it stay clickable.
    const section = host.parentElement;
    section.addEventListener("pointermove", onPointer, { passive: true });
    section.addEventListener("pointerdown", onPointer, { passive: true });
    section.addEventListener("pointerleave", onPointerEnd);
    section.addEventListener("pointerup", onPointerUp);
    section.addEventListener("pointercancel", onPointerEnd);

    // The label font may land after first paint; redraw the node labels once.
    let mounted = true;
    if (document.fonts) document.fonts.ready.then(() => mounted && rebuild());

    return () => {
      mounted = false;
      stop();
      resize.disconnect();
      inView.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      section.removeEventListener("pointermove", onPointer);
      section.removeEventListener("pointerdown", onPointer);
      section.removeEventListener("pointerleave", onPointerEnd);
      section.removeEventListener("pointerup", onPointerUp);
      section.removeEventListener("pointercancel", onPointerEnd);
    };
  }, [hudRefs]);

  return (
    <div ref={wrap} className="hero__cluster" aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}
