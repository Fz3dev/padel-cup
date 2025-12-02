import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stoneo: {
          900: "#002B24", // Deep Forest Green (Background)
          800: "#003832", // Card Background
          700: "#004D44", // Lighter Card
          500: "#3B82F6", // Primary Blue (Brand)
        },
        padel: {
          yellow: "#DFFF00", // Tennis Ball Yellow
          green: "#39FF14", // Neon Green
          orange: "#F97316",
          purple: "#A855F7",
          pink: "#F472B6",
          red: "#EF4444",
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
