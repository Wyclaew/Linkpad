/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0e0d0b',
          light: '#f5f2ed',
        },
        surface: {
          DEFAULT: '#1a1816',
          light: '#ffffff',
        },
        surface2: {
          DEFAULT: '#221f1b',
          light: '#f0ece6',
        },
        border: {
          DEFAULT: '#2d2921',
          light: '#e5dfd6',
        },
        accent: {
          DEFAULT: '#e8834a',
          hover: '#f09060',
          dim: '#6b3a1f',
          subtle: '#1f1209',
        },
        tx: {
          primary: '#f0ece3',
          secondary: '#8a7d6e',
          muted: '#4a4238',
          'primary-light': '#1a1410',
          'secondary-light': '#6b5f52',
          'muted-light': '#b0a898',
        },
        danger: '#e05555',
        success: '#5bbd72',
        warning: '#d4a843',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInLeft: { from: { opacity: 0, transform: 'translateX(-16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
        modal: '0 20px 60px rgba(0,0,0,0.6), 0 4px 20px rgba(0,0,0,0.4)',
        glow: '0 0 0 2px rgba(232,131,74,0.4)',
      },
    },
  },
  plugins: [],
};
