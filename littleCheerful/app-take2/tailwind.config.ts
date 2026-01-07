import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Roman Library color palette
        parchment: {
          light: "#F4ECD8",
          dark: "#1A1410",
        },
        crimson: {
          light: "#8B0000",
          dark: "#6B2020",
        },
        marble: {
          light: "#F8F8FF",
          dark: "#252030",
        },
        gold: {
          light: "#DAA520",
          dark: "#B8860B",
        },
        ink: {
          light: "#2C1810",
          dark: "#E8DFC8",
        },
        laurel: {
          light: "#2E6F2E",
          dark: "#4A8F4A",
        },
        waxSeal: {
          light: "#B8710D",
          dark: "#D4932F",
        },
        blood: {
          light: "#9B1C1C",
          dark: "#C23B3B",
        },
        lapis: {
          light: "#1E4D8B",
          dark: "#3B6FAF",
        },
        border: {
          light: "#D4C4A8",
          medium: "#B8A888",
          dark: "#3A3025",
        },
      },
      fontFamily: {
        body: ["var(--font-crimson-text)", "Georgia", "Times New Roman", "serif"],
        display: ["var(--font-eb-garamond)", "Garamond", "Georgia", "serif"],
        mono: ["var(--font-jetbrains-mono)", "Fira Code", "Consolas", "monospace"],
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
      },
    },
  },
  plugins: [],
};

export default config;
