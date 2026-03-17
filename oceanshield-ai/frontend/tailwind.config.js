/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mission: {
          surface: 'rgba(15, 23, 42, 0.75)',
          glow: 'rgba(56, 189, 248, 0.15)',
          highlight: '#14b8a6',
          danger: '#fb7185',
          warning: '#fbbf24',
          success: '#34d399',
        },
      },
      boxShadow: {
        glass: '0 10px 30px rgba(0,0,0,0.45)',
        inset: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

