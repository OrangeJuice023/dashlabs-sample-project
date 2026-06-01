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
        // ── Dashlabs Brand Colors ──────────────────────
        indigo: {
          100: "#D7DCEE",
          200: "#B8C2E3",
          300: "#7484AD",
          400: "#5D6690",
          500: "#475175",
        },
        brand: {
          100: "#ECF2FE",
          200: "#BFD0F0",
          300: "#90ADE0",
          400: "#6C8FD6",
          500: "#4273C0",
          legacy: "#1566FF",
        },
        grey: {
          100: "#E6E6E6",
          200: "#BFC0BD",
          300: "#94928F",
          400: "#626058",
          500: "#3F3C39",
        },
        gold: {
          100: "#F7F3DF",
          200: "#F4EBB0",
          300: "#E8D792",
          400: "#D1B868",
          500: "#C7AA50",
        },
        // ── Semantic / Status ──────────────────────────
        status: {
          normal: "#27AE60",
          warning: "#C7AA50",
          critical: "#C0392B",
        },
        // ── Page backgrounds ───────────────────────────
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#FAFBFE",
          dark: "#1A1F35",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      fontSize: {
        "display-xl": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "display-lg": ["2.75rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "800" }],
        "display-md": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "heading-lg": ["1.5rem", { lineHeight: "1.3", fontWeight: "700" }],
        "heading-md": ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        "body-md": ["1rem", { lineHeight: "1.7" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        "label": ["0.75rem", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }],
      },
      spacing: {
        "section": "6rem",
        "section-sm": "4rem",
      },
      maxWidth: {
        "content": "1200px",
        "prose": "680px",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(71,81,117,0.08)",
        "card-hover": "0 4px 8px rgba(0,0,0,0.08), 0 12px 32px rgba(71,81,117,0.12)",
        "kpi": "0 2px 8px rgba(71,81,117,0.12)",
      },
      borderRadius: {
        "card": "12px",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "counter": "counter 1.5s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
