/** @type {import('tailwindcss').Config} */
module.exports = {

  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary: {
          DEFAULT: "#181928",
          dark: "#171827",
          light: "#D2B5FF"
        },
        secondary:{
          DEFAULT: "#414158",
          dark: "#797979",
          light: "#DADADA",
        },
        gradient:{
          blue: "#4568DC",
          pink: "#B06AB3"
        }
      },
      fontFamily: {
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
      },
    },
  },
  plugins: [],
}

