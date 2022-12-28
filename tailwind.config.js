/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "m-md": { max: "767px" },
      },
      fontFamily: {
        Rubik: ["Rubik Vinyl", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
