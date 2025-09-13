/** @type {import('tailwindcss').Config} */
module.exports = {
   // Optional but helpful preset
  presets: [require('nativewind/preset')],
  
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
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

