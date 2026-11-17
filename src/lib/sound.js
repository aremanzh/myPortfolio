import { useSyncExternalStore } from "react";

/*
 * Optional interface sounds. Off until the visitor turns them on; the choice
 * is remembered in localStorage.
 *
 *   snap  the two halves of the logo landing together
 *   tick  pointer entering a link or button
 *   blip  a job log line printing, or the chaos test firing
 *
 * Each sound is a file in src/assets/audio (snap.mp3, tick.mp3, blip.mp3,
 * made with ElevenLabs); the build fingerprints whatever is there. A missing
 * file falls back to a tiny synthesised version, so the toggle always does
 * something even before the files are added, and nothing is requested that
 * does not exist.
 */
const URLS = Object.fromEntries(
  Object.entries(
    import.meta.glob("../assets/audio/*.{mp3,ogg,webm,wav}", { eager: true, query: "?url", import: "default" })
  ).map(([path, url]) => [path.split("/").pop().replace(/\.\w+$/, ""), url])
);

const KEY = "sound";
const FILES = ["snap", "tick", "blip"];
const VOLUME = { snap: 0.6, tick: 0.16, blip: 0.22 };
const TICK_GAP_MS = 70;

let enabled = false;
let read = false;
const listeners = new Set();

function readPreference() {
  if (read || typeof window === "undefined") return;
  read = true;
  try {
    enabled = window.localStorage.getItem(KEY) === "on";
  } catch {
    enabled = false;
  }
}

export function isSoundOn() {
  readPreference();
  return enabled;
}

export function setSound(on) {
  readPreference();
  enabled = on;
  try {
    window.localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    // Storage blocked: the choice lasts for this visit only.
  }
  listeners.forEach((fn) => fn());
  if (on) {
    preloadSounds();
    // The click that turned sound on is the user gesture that unlocks audio.
    play("snap");
  }
}

export const toggleSound = () => setSound(!isSoundOn());

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/** Whether sound is on. Always off in the prerendered HTML. */
export function useSound() {
  return useSyncExternalStore(subscribe, isSoundOn, () => false);
}

/* ------------------------------------------------------------- playback */

let context = null;
const files = {}; // raw bytes, fetched without needing audio
const buffers = {}; // decoded, once audio is running
const loading = {};
let lastTick = 0;

// Browsers only let a page start audio after the visitor has clicked or typed.
// Until then nothing plays, even for a returning visitor who left sound on,
// and no AudioContext is created (which would only log a warning).
let unlocked = false;
if (typeof window !== "undefined") {
  const unlock = () => {
    unlocked = true;
    window.removeEventListener("pointerdown", unlock, true);
    window.removeEventListener("keydown", unlock, true);
  };
  window.addEventListener("pointerdown", unlock, true);
  window.addEventListener("keydown", unlock, true);
}

function audio() {
  if (typeof window === "undefined" || !unlocked) return null;
  if (!context) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    context = new AudioContext();
  }
  if (context.state === "suspended") context.resume().catch(() => {});
  return context;
}

function load(name) {
  if (loading[name] || typeof fetch === "undefined") return;
  if (!URLS[name]) {
    loading[name] = true;
    files[name] = null; // no file yet: the synthesised fallback plays
    return;
  }
  loading[name] = fetch(URLS[name])
    .then((response) => {
      if (!response.ok) throw new Error(`${name}: ${response.status}`);
      return response.arrayBuffer();
    })
    .then((data) => {
      files[name] = data;
    })
    .catch(() => {
      files[name] = null; // use the synthesised fallback
    });
}

function decode(name, ctx) {
  const data = files[name];
  if (!data || name in buffers) return;
  buffers[name] = null; // decoding; the fallback covers this one play
  // decodeAudioData detaches the bytes it is given, so hand it a copy.
  ctx
    .decodeAudioData(data.slice(0))
    .then((buffer) => {
      buffers[name] = buffer;
    })
    .catch(() => {});
}

export function preloadSounds() {
  FILES.forEach(load);
}

export function play(name) {
  if (!isSoundOn()) return;
  if (name === "tick") {
    const now = performance.now();
    if (now - lastTick < TICK_GAP_MS) return;
    lastTick = now;
  }
  load(name);
  const ctx = audio();
  if (!ctx) return;
  decode(name, ctx);

  const out = ctx.createGain();
  out.gain.value = VOLUME[name] ?? 0.3;
  out.connect(ctx.destination);

  const buffer = buffers[name];
  if (buffer) {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(out);
    source.start();
  } else {
    synth(name, ctx, out);
  }
}

function envelope(ctx, out, start, attack, length) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(1, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  gain.connect(out);
  return gain;
}

function synth(name, ctx, out) {
  const t = ctx.currentTime + 0.005;

  if (name === "snap") {
    // Low thump with a short bright click on top.
    const body = ctx.createOscillator();
    body.type = "sine";
    body.frequency.setValueAtTime(170, t);
    body.frequency.exponentialRampToValueAtTime(55, t + 0.14);
    body.connect(envelope(ctx, out, t, 0.004, 0.18));
    body.start(t);
    body.stop(t + 0.2);

    const length = Math.floor(ctx.sampleRate * 0.03);
    const noise = ctx.createBuffer(1, length, ctx.sampleRate);
    const samples = noise.getChannelData(0);
    for (let i = 0; i < length; i += 1) samples[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 5;
    const click = ctx.createBufferSource();
    click.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1800;
    const level = ctx.createGain();
    level.gain.value = 0.5;
    click.connect(filter).connect(level).connect(out);
    click.start(t);
    return;
  }

  const tone = ctx.createOscillator();
  if (name === "tick") {
    tone.type = "triangle";
    tone.frequency.setValueAtTime(2400, t);
    tone.frequency.exponentialRampToValueAtTime(1600, t + 0.03);
    tone.connect(envelope(ctx, out, t, 0.002, 0.04));
    tone.start(t);
    tone.stop(t + 0.05);
    return;
  }

  // blip
  tone.type = "square";
  tone.frequency.setValueAtTime(880, t);
  tone.frequency.setValueAtTime(660, t + 0.035);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1800;
  tone.connect(filter).connect(envelope(ctx, out, t, 0.003, 0.08));
  tone.start(t);
  tone.stop(t + 0.09);
}
