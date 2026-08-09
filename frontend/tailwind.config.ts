import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        headings: ["var(--font-headings)", "sans-serif"],
      },
      colors: {
        brand: {
          green: "#0A5C3A",
          "green-hover": "#0D7449",
          "green-active": "#07452C",
        },
      },
    },
  },
  plugins: [],
};

export default config;
