import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { clusterLayout, createPodSim } from "../lib/podSim";

/**
 * The hero cluster. `onStats` receives the simulation's live counters; the
 * ref exposes `chaos()` for the HUD button.
 */
const PodCluster = forwardRef(function PodCluster({ onStats }, ref) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const sim = useRef(null);

  useImperativeHandle(ref, () => ({
    chaos: (fraction) => sim.current && sim.current.chaos(fraction),
  }));

  useEffect(() => {
    sim.current = createPodSim(canvas.current, wrap.current, {
      layout: clusterLayout,
      // Text sits on top of the canvas, so listen on the whole section.
      pointerTarget: wrap.current.parentElement,
      onStats,
    });
    return () => sim.current.destroy();
  }, [onStats]);

  return (
    <div ref={wrap} className="hero__cluster" aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
});

export default PodCluster;
