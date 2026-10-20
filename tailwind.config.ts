import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#3c2416",
        ink: "#5a3a28",
        paper: "#fbf6ee",
        cream: "#fbf6ee",
        sand: "#f3e6d4",
        line: "#e3d2bd",
        amber: "#c4622d",
        clay: "#8d4318",
        claydark: "#6f3314",
        leaf: "#1f6b45",
        lime: "#1f6b45",
        mist: "#8a7364",
        gold: "#a87322",
        off: "#f7f1e8",
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        arabic: ["var(--font-arabic)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: { luxe: "0.28em" },
    },
  },
  plugins: [],
} satisfies Config;
