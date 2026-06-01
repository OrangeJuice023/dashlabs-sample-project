import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      colors: {
        brand: "#1566FF",
        indigo: {
          100: "#D7DCEE",
          200: "#B8C2E3",
          300: "#7484AD",
          400: "#5D6690",
          500: "#475175",
        },
        gold: {
          100: "#F7F3DF",
          200: "#F4EBB0",
          300: "#E8D792",
          400: "#D1B868",
          500: "#C7AA50",
        },
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
