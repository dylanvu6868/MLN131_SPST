import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        atlas: {
          ink: "#070B16",
          panel: "#0F172A",
          panel2: "#111827",
          line: "rgba(148, 163, 184, 0.22)"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-crimson)", "Crimson Text", "Georgia", "ui-serif", "serif"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(14, 165, 233, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
