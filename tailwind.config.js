/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
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
    colors: {},
  },
  plugins: [],
};
