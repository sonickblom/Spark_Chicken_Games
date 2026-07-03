/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          neon: '#00FF41',
          'neon-glow': '#00FF41',
          'neon-dim': '#00CC33',
          dark: '#0A0F0D',
          'dark-surface': '#111815',
          'dark-border': '#1A231D',
          'dark-card': '#141D19',
          gray: '#2A3A33',
          'gray-light': '#3A4D44',
          text: '#E8F5ED',
          'text-muted': '#8A9E93',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 10px #00FF41, 0 0 20px #00FF41, 0 0 40px #00FF41',
        'neon-sm': '0 0 5px #00FF41, 0 0 10px #00FF41',
        'neon-lg': '0 0 20px #00FF41, 0 0 40px #00FF41, 0 0 80px #00FF41',
        'card': '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 255, 65, 0.1)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'glitch': 'glitch 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 10px #00FF41, 0 0 20px #00FF41, 0 0 40px #00FF41' },
          '50%': { boxShadow: '0 0 20px #00FF41, 0 0 40px #00FF41, 0 0 80px #00FF41' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
