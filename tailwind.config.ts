import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        leaf: {
          primary: "#5e8557",
          dark: "#4c7a44",
          lime: "#d0ff93",
          yellow: "#ffeb93",
          "lime-light": "#e8ff93",
          peach: "#eecdbd",
          "icon-bg": "#e7ffc7",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        dm: ["var(--font-dm)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "25": "25px",
      },
      animation: {
        "spin-slow": "spin 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
