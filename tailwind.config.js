/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
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
      },
      animation: {
        wiggle: "wiggle 1s linear infinite",
        float: "float 3s ease-in-out infinite",
      },
      dropShadow: {
        glow: [
          "0 0px 20px rgba(255,255, 255, 0.35)",
          "0 0px 65px rgba(255, 255,255, 0.2)",
        ],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
