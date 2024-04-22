/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0E0D15",
        secondary: "#E3E2E9",
        "primary-light": "#B1ADD0",
        "secondary-dark": "#fcffff",
        "button-light": "#403873",
        "button-dark": "#fcffff",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        float: {
          "0%, 100%": { transform: "translatey(0px)" },
          "50%": { transform: "translatey(-10px)" },
        },
        flipUpside: {
          "0%": { transform: "translatey(0px)" },
          "15%": { opacity: "100" },
          "20%": { transform: "translatey(-20px)", opacity: "0" },
          "80%": { transform: "translatey(20px)", opacity: "0" },
          "85%": { opacity: "100" },
          "100%": { transform: "translatey(0px)" },
        },
        flipDownside: {
          "0%": { transform: "translatey(0px)", opacity: "100" },
          "20%": { transform: "translatey(-20px)", opacity: "0" },
          "80%": { transform: "translatey(20px)", opacity: "0" },
          "100%": { transform: "translatey(0px)", opacity: "100" },
        },
      },
      animation: {
        wiggle: "wiggle 1s linear infinite",
        float: "float 1s ease-in-out infinite",
        flipUpside: "flipUpside 0.6s",
        flipDownside: "flipDownside 0.3s reverse",
      },
      dropShadow: {
        glow: [
          "0 0px 20px rgba(255,255, 255, 0.35)",
          "0 0px 65px rgba(255, 255,255, 0.2)",
        ],
      },
    },
  },
};
