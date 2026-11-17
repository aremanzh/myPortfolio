/** @type {import('tailwindcss').Config} */
module.exports = {
  // hover: utilities only apply on devices that can hover, so a tap on a
  // phone does not leave an element stuck in its hover state.
  future: { hoverOnlyWhenSupported: true },
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0C0B0A",
        "ink-2": "#161513",
        paper: "#EDE9E0",
        signal: "#FF4A1C",
        ok: "#7BE08A",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
};
