/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand': {
          50: '#f0eeff',
          100: '#e4e0ff',
          200: '#cdc5ff',
          300: '#b0a3ff',
          400: '#9278ff',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#2e1065',
        },
        'accent': {
          amber: '#f59e0b',
          cyan: '#06b6d4',
          rose: '#f43f5e',
          emerald: '#10b981',
        },
        'surface': {
          DEFAULT: '#0d1424',
          50: '#0a0f1e',
          100: '#0d1424',
          200: '#111827',
          300: '#1f2937',
          400: '#374151',
        },
        'glass': 'rgba(255,255,255,0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.3), transparent)',
        'glow-purple': 'radial-gradient(circle at center, rgba(124,58,237,0.4), transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glow: {
          from: { boxShadow: '0 0 10px rgba(124,58,237,0.3), 0 0 20px rgba(124,58,237,0.1)' },
          to: { boxShadow: '0 0 20px rgba(124,58,237,0.6), 0 0 40px rgba(124,58,237,0.3)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(124,58,237,0.3)',
        'glow': '0 0 20px rgba(124,58,237,0.4)',
        'glow-lg': '0 0 40px rgba(124,58,237,0.5)',
        'glow-amber': '0 0 20px rgba(245,158,11,0.4)',
        'glow-cyan': '0 0 20px rgba(6,182,212,0.4)',
        'card': '0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.4)',
        'card-hover': '0 20px 40px -10px rgba(0,0,0,0.6), 0 0 20px rgba(124,58,237,0.2)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
