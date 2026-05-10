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
          50:  '#f0faf0',
          100: '#dcf5dc',
          200: '#bce8bc',
          300: '#8fd48f',
          400: '#6FBF73',
          500: '#4CAF50', /* Leaf green primary */
          600: '#3F8F50',
          700: '#2e6e38',
          800: '#255a2e',
          900: '#1e4a26',
        },
        'leaf': {
          light: '#E8F5E9',
          soft:  '#DFF3E3',
          mid:   '#CFE8D6',
          muted: '#BFE3C0',
          accent:'#4CAF50',
          deep:  '#3F8F50',
        },
        'surface': {
          DEFAULT: '#ffffff',
          50:  '#FAFAF7',
          100: '#F8FAF5',
          200: '#F5F7F2',
          300: '#e8f0e5',
          400: '#c8d8c5',
        },
        'accent': {
          amber:   '#f59e0b',
          cyan:    '#06b6d4',
          rose:    '#f43f5e',
          emerald: '#10b981',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient':   'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(76,175,80,0.12), transparent)',
        'leaf-gradient':   'linear-gradient(135deg, #E8F5E9 0%, #F8FAF5 100%)',
      },
      animation: {
        'float':          'float 6s ease-in-out infinite',
        'pulse-slow':     'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'glow':           'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        glow: {
          from: { boxShadow: '0 0 10px rgba(76,175,80,0.1), 0 0 20px rgba(76,175,80,0.05)' },
          to:   { boxShadow: '0 0 20px rgba(76,175,80,0.2), 0 0 40px rgba(76,175,80,0.1)' },
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'glow-sm':    '0 0 10px rgba(76,175,80,0.1)',
        'glow':       '0 0 20px rgba(76,175,80,0.15)',
        'glow-lg':    '0 0 40px rgba(76,175,80,0.2)',
        'glow-amber': '0 0 20px rgba(245,158,11,0.2)',
        'glow-cyan':  '0 0 20px rgba(6,182,212,0.2)',
        'card':       '0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(76,175,80,0.08)',
        'card-hover': '0 8px 24px rgba(76,175,80,0.12), 0 0 0 1px rgba(76,175,80,0.15)',
        'leaf':       '0 4px 16px rgba(76,175,80,0.15)',
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
