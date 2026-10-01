/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        harshu: {
          50: '#f2f9f5',
          100: '#e1f2e9',
          200: '#c5e5d4',
          300: '#99d1b6',
          400: '#64b591',
          500: '#3d9972',
          600: '#2d7c5b',
          700: '#25634a',
          800: '#1f4f3c',
          900: '#1b4133',
          950: '#0e241c',
        },
        earth: {
          50: '#faf8f5',
          100: '#f3efe8',
          200: '#e7dfd3',
          300: '#d7c9b8',
          400: '#bfab97',
          500: '#aa907a',
          600: '#9c7e68',
          700: '#826756',
          800: '#6b5448',
          900: '#58463c',
          950: '#2f241f',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'Latha', 'system-ui', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'Mangal', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-gentle': 'pulse-gentle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        'pulse-gentle': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.85, transform: 'scale(1.02)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
