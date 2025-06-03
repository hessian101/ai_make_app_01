/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6edf5',
          100: '#ccdaeb',
          200: '#99b5d7',
          300: '#6691c3',
          400: '#336caf',
          500: '#1a5296',
          600: '#1a365d', // Primary
          700: '#142c4a',
          800: '#0f2136',
          900: '#071623',
        },
        secondary: {
          50: '#f5f7fa',
          100: '#ebeef3',
          200: '#d7dde7',
          300: '#bac4d3',
          400: '#92a0b8',
          500: '#718096', // Secondary
          600: '#576a86',
          700: '#455574',
          800: '#364058',
          900: '#252c3c',
        },
        accent: {
          50: '#fcf7e6',
          100: '#f9efc5',
          200: '#f3e09a',
          300: '#ebd06e',
          400: '#e3bd3d',
          500: '#d69e2e', // Accent
          600: '#b5801f',
          700: '#8c6118',
          800: '#624211',
          900: '#39280a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      transitionProperty: {
        'transform': 'transform',
        'height': 'height',
      },
      transitionDuration: {
        '250': '250ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
};