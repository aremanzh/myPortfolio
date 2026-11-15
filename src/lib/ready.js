import { useSyncExternalStore } from "react";

/**
 * "The page is allowed to animate in now."
 *
 * Flipped once by the preloader. Page intros wait on it so nothing plays
 * underneath the loading screen.
 */
let ready = false;
const listeners = new Set();

export function markReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((fn) => fn());
}

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const getSnapshot = () => ready;

export function useReady() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
