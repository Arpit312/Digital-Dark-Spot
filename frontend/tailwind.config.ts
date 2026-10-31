import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        surface: "#0A0A0A",
        card: "#111111",
        line: "#1F1F1F",
        "line-strong": "#2E2E2E",
        fg: "#FFFFFF",
        muted: "#8A8A8A",
        subtle: "#5C5C5C"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        hindi: ["var(--font-hindi)", "sans-serif"]
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" }
        }
      },
      animation: {
        marquee: "marquee 65s linear infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
