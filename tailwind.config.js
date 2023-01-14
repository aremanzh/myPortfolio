/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {   
    extend: {
      colors: {
        primary: '#131413',
        secondary: '#fcffff',
        'primary-light': "#f19226",
        'secondary-dark': "#fcffff",
        'button-light': "#f19226",
        'button-dark': "#fcffff",
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translatey(0px)' },
          '50%': { transform: 'translatey(-10px)' },
        },
      },
      animation: {
        wiggle: "wiggle 1s linear infinite",
        float: "float 3s ease-in-out infinite",

      }
    },
  },
  plugins: [],
}
