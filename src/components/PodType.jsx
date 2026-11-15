import React, { useEffect, useRef } from "react";
import { createPodSim, DISPLAY_FONT, INK, PAPER, SIGNAL, typeLayout } from "../lib/podSim";

// Pod, empty-slot and "hot" colours for each background.
const TONES = {
  signal: { color: INK, slot: INK, hot: PAPER },
  paper: { color: INK, slot: INK, hot: SIGNAL },
  ink: { color: PAPER, slot: PAPER, hot: SIGNAL },
};

/**
 * A word set in pods. With `live` it is the same simulation as the hero:
 * point at the letters to knock pods out and watch them reschedule. Without
 * it, a single frame is drawn (list thumbnails, where a dozen running
 * simulations would be wasted work).
 */
export default function PodType({ text, tone = "ink", live = false, fill }) {
  const wrap = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    const { color, slot, hot } = TONES[tone] || TONES.ink;
    const sim = createPodSim(canvas.current, wrap.current, {
      layout: typeLayout(text, { slot, fill }),
      color,
      hot,
      live,
      font: DISPLAY_FONT,
    });
    return () => sim.destroy();
  }, [text, tone, live, fill]);

  return (
    <div ref={wrap} className="podtype" aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}
