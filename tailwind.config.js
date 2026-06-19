/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 古代/大地色调
        ancient: {
          50: '#faf6f0',
          100: '#f0e6d2',
          200: '#e0cca0',
          300: '#c9a86c',
          400: '#a8854a',
          500: '#8a6630',
          600: '#6b4d20',
          700: '#4d3815',
          800: '#2e220c',
          900: '#1a1306',
        },
        // 王权金色
        royal: {
          50: '#fffaeb',
          100: '#fff0c6',
          200: '#ffdf88',
          300: '#ffc94a',
          400: '#ffb020',
          500: '#f89008',
          600: '#dc6802',
          700: '#b04802',
          800: '#8a3503',
          900: '#732d06',
        },
        // 战争红色
        war: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // 知识蓝色
        knowledge: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        display: ['"Cinzel"', 'serif'],
        body: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(248, 144, 8, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(248, 144, 8, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
