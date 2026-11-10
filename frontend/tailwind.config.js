/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#FF3B30',
          dark: '#111827',
          gray: '#F3F4F6',
          white: '#FFFFFF'
        },
        dark: {
          900: '#07080d',
          850: '#0a0c15',
          800: '#0c0f19',
          750: '#111522',
          700: '#131826',
          650: '#1b2133',
          600: '#232b42',
          500: '#2e3a59',
          400: '#3e4f7a',
          300: '#5e72a8'
        },
        neon: {
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b'
        }
      },
      boxShadow: {
        'glow-purple': '0 0 15px rgba(139, 92, 246, 0.15)',
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.15)',
        'glow-emerald': '0 0 15px rgba(16, 185, 129, 0.15)'
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
