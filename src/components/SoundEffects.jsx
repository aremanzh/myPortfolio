import { useEffect } from "react";
import { finePointer } from "../lib/env";
import { isSoundOn, play, preloadSounds, useSound } from "../lib/sound";

const INTERACTIVE = "a, button, [role='button'], [role='option'], input, textarea, label";

/**
 * Renders nothing. While sound is on, a soft tick plays as the pointer moves
 * onto a link or button (once per element, not on every pixel inside it).
 * The other sounds are played where they happen: the logo snap, the pipeline
 * log and the chaos test.
 */
export default function SoundEffects() {
  const on = useSound();

  useEffect(() => {
    if (on) preloadSounds();
  }, [on]);

  useEffect(() => {
    if (!finePointer) return undefined;
    let current = null;
    const onOver = (event) => {
      const target = event.target instanceof Element ? event.target.closest(INTERACTIVE) : null;
      if (target === current) return;
      current = target;
      if (target && isSoundOn()) play("tick");
    };
    document.addEventListener("mouseover", onOver, { passive: true });
    return () => document.removeEventListener("mouseover", onOver);
  }, []);

  return null;
}
