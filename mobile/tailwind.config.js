/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        fthin: ["FThin"],
        fextralight: ["FExtraLight"],
        flight: ["FLight"],
        fregular: ["FRegular"],
        fmedium: ["FMedium"],
        fsemibold: ["FSemiBold"],
        fbold: ["FBold"],
        ffextrabold: ["FExtraBold"],
        fblack: ["FBlack"],
      },
      colors: {
        primary: "#0174D8",
        secondary: "#d7e8f7",
        white: "#ffffff",
      },
    },
  },
  plugins: [],
};
