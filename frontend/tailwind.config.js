/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: "#00FF41",
          "green-dim": "#00CC33",
          "green-dark": "#009926",
        },
        cyber: {
          dark: "#0A0A0F",
          darker: "#030305",
          "dark-surface": "#11111A",
          "dark-border": "#1E1E2E",
          text: "#E0E0E0",
          "text-muted": "#888899",
          glow: "#00FF41",
          "glow-dim": "rgba(0, 255, 65, 0.15)",
          "glow-mid": "rgba(0, 255, 65, 0.30)",
          "glow-strong": "rgba(0, 255, 65, 0.50)",
          surface: "#0d0d1a",
          "surface-light": "#1a1a2e",
          border: "#1a1a2e",
          "border-dim": "#0d0d1a",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Orbitron", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wave: "wave 1.5s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        scanline: "scanline 6s linear infinite",
        "grid-move": "gridMove 20s linear infinite",
        glitch: "glitch 0.3s ease-in-out infinite",
        "fade-in-up": "animateIn 0.6s cubic-bezier(0.32, 0.72, 0, 1) forwards",
        "slide-in-left": "slideInLeft 0.5s cubic-bezier(0.32, 0.72, 0, 1) forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow: "0 0 15px rgba(0, 255, 65, 0.3), 0 0 30px rgba(0, 255, 65, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 25px rgba(0, 255, 65, 0.5), 0 0 50px rgba(0, 255, 65, 0.2)",
          },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        gridMove: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "32px 32px" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        animateIn: {
          from: {
            opacity: "0",
            transform: "translateY(24px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideInLeft: {
          from: {
            opacity: "0",
            transform: "translateX(-24px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%2300FF41' stroke-opacity='0.1'%3e%3cpath d='M0 32V0M32 0H0'/%3e%3c/svg%3e\")",
        "scanline-pattern":
          "repeating-linear-gradient(0deg, rgba(0, 255, 65, 0.03) 0px, rgba(0, 255, 65, 0.03) 1px, transparent 1px, transparent 3px)",
      },
    },
  },
  plugins: [],
};
