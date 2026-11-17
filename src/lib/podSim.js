import { reducedMotion } from "./env";

/*
 * Pod simulation, the site's one recurring illustration.
 *
 * A layout decides where pods sit (the hero's node grid, or lettering for
 * covers and the 404 page). The simulation then runs the same rules on them:
 *
 *   Running -> (killed) Terminating -> Gone -> Pending -> Running
 *
 * Pods under the pointer are killed. A "controller" reschedules every missing
 * pod after a short delay. Every few seconds a rolling restart sweeps across.
 *
 * Drawn on a 2D canvas; the loop stops whenever the canvas is off screen or
 * the tab is hidden.
 *
 * Under prefers-reduced-motion the ambient motion goes (no shimmer, no rolling
 * restart sweeping across), but the pods still answer the visitor: pointing at
 * them or running the chaos test kills pods and the controller brings them
 * back. The loop then runs only while something is changing and stops once
 * every pod is running again, so nothing moves on its own.
 */

const RUNNING = 0;
const TERMINATING = 1;
const GONE = 2;
const PENDING = 3;

const TERMINATE_MS = 240;
const PENDING_MS = 520;
const WAVE_EVERY_MS = 9000;
const WAVE_SPEED = 0.9; // px per ms

export const PAPER = "237, 233, 224";
export const INK = "12, 11, 10";
export const SIGNAL = "255, 74, 28";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLElement} host            Element the canvas fills.
 * @param {object} options
 * @param {(w:number, h:number, backdrop:CanvasRenderingContext2D) => {pods:object[], cell:number}} options.layout
 *        Returns pods as {x, y, alpha, base} and may paint static artwork
 *        (node outlines, empty slots) onto `backdrop`.
 * @param {string} [options.color]      "r, g, b" of a running pod.
 * @param {string} [options.hot]        "r, g, b" of a dying / pending pod.
 * @param {boolean} [options.live]      false draws a single frame and stops.
 * @param {HTMLElement} [options.pointerTarget] Element whose pointer events kill pods.
 * @param {(stats:object) => void} [options.onStats]
 * @param {string} [options.font]       CSS font to wait for before the first build.
 */
export function createPodSim(canvas, host, options) {
  const {
    layout,
    color = PAPER,
    hot = SIGNAL,
    live = true,
    pointerTarget = host,
    onStats,
    font,
  } = options;

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  // `live` pods answer the pointer and the chaos test. Ambient motion (the
  // shimmer and the rolling restart) is extra, and off under reduced motion.
  const interactive = live;
  const ambient = live && !reducedMotion;

  let width = 0;
  let height = 0;
  let cell = 10;
  let pods = [];
  let backdrop = null;
  let killed = 0;
  let healed = 0;
  let lastStats = "";

  const pointer = { x: 0, y: 0, active: false };
  let wave = null;
  let nextWaveAt = 0;

  let raf = 0;
  let last = 0;
  let visible = true;
  let destroyed = false;

  function build() {
    const rect = host.getBoundingClientRect();
    width = Math.round(rect.width);
    height = Math.round(rect.height);
    if (!width || !height) return;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    backdrop = document.createElement("canvas");
    backdrop.width = canvas.width;
    backdrop.height = canvas.height;
    const b = backdrop.getContext("2d");
    b.scale(dpr, dpr);

    const result = layout(width, height, b);
    cell = result.cell;
    pods = result.pods.map((pod) => ({
      state: RUNNING,
      t: 0,
      wait: 0,
      flash: 0,
      counted: false,
      phase: Math.random() * Math.PI * 2,
      speed: 0.0006 + Math.random() * 0.0012,
      ...pod,
    }));
  }

  function kill(pod, byVisitor) {
    pod.state = TERMINATING;
    pod.t = 0;
    pod.counted = byVisitor;
    if (byVisitor) killed += 1;
  }

  function step(dt, now) {
    if (ambient && !wave && now > nextWaveAt) {
      wave = { x: -40 };
      nextWaveAt = now + WAVE_EVERY_MS;
    }
    const waveFrom = wave ? wave.x : 0;
    if (wave) {
      wave.x += WAVE_SPEED * dt;
      if (wave.x > width + height + 80) wave = null;
    }
    const waveTo = wave ? wave.x : 0;
    const radius = Math.max(cell * 4.2, 26);

    let running = 0;
    for (let i = 0; i < pods.length; i += 1) {
      const pod = pods[i];
      pod.t += dt;

      switch (pod.state) {
        case RUNNING: {
          running += 1;
          pod.flash *= Math.exp(-dt / 420);

          if (pointer.active) {
            const dx = pod.x + cell / 2 - pointer.x;
            const dy = pod.y + cell / 2 - pointer.y;
            if (dx * dx + dy * dy < radius * radius) {
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
            // The arrival flash is ambient sparkle; reduced motion skips it.
            pod.flash = ambient ? 0.75 : 0;
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (backdrop) ctx.drawImage(backdrop, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    for (let i = 0; i < pods.length; i += 1) {
      const pod = pods[i];
      const { x, y, alpha } = pod;

      if (pod.state === RUNNING) {
        const twinkle = ambient ? Math.sin(now * pod.speed + pod.phase) * 0.05 : 0;
        ctx.fillStyle = `rgba(${color}, ${Math.min(1, pod.base + twinkle + pod.flash) * alpha})`;
        ctx.fillRect(x, y, cell, cell);
      } else if (pod.state === TERMINATING) {
        const k = Math.min(1, 1 - pod.t / TERMINATE_MS);
        const size = cell * (0.3 + 0.7 * k);
        const o = (cell - size) / 2;
        ctx.fillStyle = `rgba(${hot}, ${(0.35 + 0.65 * k) * alpha})`;
        ctx.fillRect(x + o, y + o, size, size);
      } else if (pod.state === PENDING) {
        const k = Math.min(1, pod.t / PENDING_MS);
        ctx.strokeStyle = `rgba(${hot}, ${(0.45 + 0.55 * k) * alpha})`;
        ctx.lineWidth = Math.max(1, cell * 0.11);
        ctx.strokeRect(x + 0.6, y + 0.6, cell - 1.2, cell - 1.2);
        ctx.fillStyle = `rgba(${hot}, ${0.3 * k * alpha})`;
        ctx.fillRect(x, y, cell, cell);
      }
      // GONE draws nothing: an empty slot.
    }
  }

  function report(running) {
    if (!onStats) return;
    const key = `${running}|${killed}|${healed}`;
    if (key === lastStats) return;
    lastStats = key;
    onStats({ running, total: pods.length, killed, healed });
  }

  // Nothing left to animate: every pod running and the pointer away.
  const settled = () =>
    !pointer.active && pods.every((pod) => pod.state === RUNNING && pod.flash < 0.01);

  function frame(now) {
    const dt = Math.min(50, now - (last || now));
    last = now;
    const running = step(dt, now);
    draw(now);
    report(running);
    if (!ambient && settled()) {
      // Reduced motion: sleep until the visitor does something.
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (raf || !interactive || !visible || document.hidden || destroyed) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  function rebuild() {
    if (destroyed) return;
    build();
    nextWaveAt = performance.now() + 2600;
    wave = null;
    draw(performance.now());
    report(pods.length);
  }

  function onPointer(event) {
    const rect = host.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active =
      pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
    if (pointer.active) start(); // wakes a sleeping loop
  }

  function onPointerEnd() {
    pointer.active = false;
  }

  // A finger lifting ends the interaction; a mouse button releasing doesn't.
  function onPointerUp(event) {
    if (event.pointerType !== "mouse") onPointerEnd();
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
  const onVisibility = () => (document.hidden ? stop() : start());

  if (interactive) {
    inView.observe(host);
    document.addEventListener("visibilitychange", onVisibility);
    pointerTarget.addEventListener("pointermove", onPointer, { passive: true });
    pointerTarget.addEventListener("pointerdown", onPointer, { passive: true });
    pointerTarget.addEventListener("pointerleave", onPointerEnd);
    pointerTarget.addEventListener("pointerup", onPointerUp);
    pointerTarget.addEventListener("pointercancel", onPointerEnd);
  }

  // Layouts that draw text need the real typeface; rebuild once it is in.
  if (document.fonts) {
    (font ? document.fonts.load(font) : document.fonts.ready).then(rebuild, () => {});
  }

  return {
    /** Kill a random share of the running pods, as if the visitor did it. */
    chaos(fraction = 0.35) {
      if (!interactive) return;
      pods.forEach((pod) => {
        if (pod.state === RUNNING && Math.random() < fraction) {
          kill(pod, true);
          // Stagger the kills so it reads as a failure spreading, not a blink.
          pod.t = -Math.random() * 420;
        }
      });
      start();
    },
    destroy() {
      destroyed = true;
      stop();
      resize.disconnect();
      inView.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      pointerTarget.removeEventListener("pointermove", onPointer);
      pointerTarget.removeEventListener("pointerdown", onPointer);
      pointerTarget.removeEventListener("pointerleave", onPointerEnd);
      pointerTarget.removeEventListener("pointerup", onPointerUp);
      pointerTarget.removeEventListener("pointercancel", onPointerEnd);
    },
  };
}

/* -------------------------------------------------------------------------
   Layouts
   ---------------------------------------------------------------------- */

const pad = (n, size) => String(n).padStart(size, "0");
const ramp = (value, from, to) => Math.min(1, Math.max(0, (value - from) / (to - from)));

/**
 * Hero: pods grouped into labelled nodes, anchored to the top right. The
 * cluster fades in below the nav and out before the headline, so text always
 * sits on a clean background. Pods in the faded-out area are never created:
 * nothing invisible can be killed, and the HUD counts only what is on screen.
 */
export function clusterLayout(width, height, b) {
  const CELL = 11;
  const GAP = 5;
  const COLS = 6;
  const ROWS = 5;
  const NODE_GAP = 26;

  const visibility = (x, y) => {
    const u = x / width;
    const v = y / height;
    if (width >= 1024) {
      return ramp(u + (v - 0.5) * 0.1, 0.3, 0.68) * ramp(v, 0, 0.15) * (1 - ramp(v, 0.46, 0.84));
    }
    return ramp(v, 0, 0.13) * (1 - ramp(v, 0.34, 0.6));
  };

  const nodeW = COLS * CELL + (COLS - 1) * GAP;
  const nodeH = ROWS * CELL + (ROWS - 1) * GAP;
  const pitchX = nodeW + NODE_GAP;
  const pitchY = nodeH + NODE_GAP;
  const cols = Math.ceil(width / pitchX) + 1;
  const rows = Math.ceil(height / pitchY) + 1;
  const originX = width - cols * pitchX + NODE_GAP * 1.5;
  const originY = -nodeH * 0.35;

  b.font = '500 8px "JetBrains Mono Variable", ui-monospace, monospace';
  b.textBaseline = "bottom";

  const pods = [];
  let nodeIndex = 0;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const nx = originX + c * pitchX;
      const ny = originY + r * pitchY;
      const nodeAlpha = visibility(nx + nodeW / 2, ny + nodeH / 2);
      if (nodeAlpha < 0.05) continue;
      nodeIndex += 1;

      b.strokeStyle = `rgba(${PAPER}, ${0.1 * nodeAlpha})`;
      b.lineWidth = 1;
      b.beginPath();
      b.roundRect(nx - 7.5, ny - 7.5, nodeW + 15, nodeH + 15, 5);
      b.stroke();
      b.fillStyle = `rgba(${PAPER}, ${0.34 * nodeAlpha})`;
      b.fillText(`NODE-${pad(nodeIndex, 2)}`, nx - 7, ny - 10);

      for (let py = 0; py < ROWS; py += 1) {
        for (let px = 0; px < COLS; px += 1) {
          const x = nx + px * (CELL + GAP);
          const y = ny + py * (CELL + GAP);
          const alpha = visibility(x, y);
          if (alpha < 0.05) continue;
          pods.push({ x, y, alpha, base: 0.1 + Math.random() * 0.22 });
        }
      }
    }
  }
  return { pods, cell: CELL };
}

export const DISPLAY_FONT = '800 100px "Bricolage Grotesque Variable"';

/**
 * Lettering: the text is rasterised off screen in the display face, then
 * sampled on a grid. Cells inside a letter become pods; the rest are drawn
 * once as faint empty slots, so the word reads as lit cells on a board.
 *
 * @param {string} text
 * @param {object} [options]
 * @param {string} [options.slot]  "r, g, b" of the empty slots.
 * @param {number} [options.fill]  Share of the width the word should span.
 */
export function typeLayout(text, { slot = PAPER, fill = 0.86 } = {}) {
  return (width, height, b) => {
    const cell = Math.min(15, Math.max(4, Math.round(width / 96)));
    const gap = Math.max(2, Math.round(cell * 0.42));
    const pitch = cell + gap;
    const cols = Math.floor((width + gap) / pitch);
    const rows = Math.floor((height + gap) / pitch);
    const offsetX = (width - (cols * pitch - gap)) / 2;
    const offsetY = (height - (rows * pitch - gap)) / 2;

    // Rasterise the word at grid resolution: one pixel per cell, oversampled
    // 4x so thin strokes still register.
    const scale = 4;
    const raster = document.createElement("canvas");
    raster.width = cols * scale;
    raster.height = rows * scale;
    const r = raster.getContext("2d", { willReadFrequently: true });
    const setFont = (size) => {
      r.font = `800 ${size}px "Bricolage Grotesque Variable", system-ui, sans-serif`;
      if ("fontStretch" in r) r.fontStretch = "condensed";
    };

    let size = raster.height;
    setFont(size);
    let metrics = r.measureText(text);
    const inkHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    const fit = Math.min((raster.width * fill) / metrics.width, (raster.height * 0.7) / inkHeight);
    size *= fit;
    setFont(size);
    metrics = r.measureText(text);

    r.fillStyle = "#000";
    r.textBaseline = "alphabetic";
    const x = (raster.width - metrics.width) / 2;
    const inkTop = (raster.height - (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent)) / 2;
    r.fillText(text, x, inkTop + metrics.actualBoundingBoxAscent);

    const data = r.getImageData(0, 0, raster.width, raster.height).data;
    const coverage = (col, row) => {
      let sum = 0;
      for (let sy = 0; sy < scale; sy += 1) {
        for (let sx = 0; sx < scale; sx += 1) {
          sum += data[((row * scale + sy) * raster.width + col * scale + sx) * 4 + 3];
        }
      }
      return sum / (scale * scale * 255);
    };

    const pods = [];
    b.fillStyle = `rgba(${slot}, 0.1)`;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const px = offsetX + col * pitch;
        const py = offsetY + row * pitch;
        if (coverage(col, row) > 0.5) {
          pods.push({ x: px, y: py, alpha: 1, base: 0.82 + Math.random() * 0.18 });
        } else {
          b.fillRect(px, py, cell, cell);
        }
      }
    }
    return { pods, cell };
  };
}
