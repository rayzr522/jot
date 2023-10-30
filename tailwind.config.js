const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/styles.ts",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.emerald,
        secondary: colors.rose,
        neutral: colors.slate,
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
module.exports = config
