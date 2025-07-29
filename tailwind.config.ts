import { mijnui } from "@mijn-ui/react"
import animationPlugin from "tailwindcss-animate"
import tailwindTypography from "@tailwindcss/typography"

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "./node_modules/@mijn-ui/react-theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [animationPlugin, mijnui({}), tailwindTypography],
}
