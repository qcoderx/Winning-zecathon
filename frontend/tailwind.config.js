/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'pulse-navy': 'var(--pulse-navy)',
        'pulse-teal': 'var(--pulse-teal)',
        'pulse-cyan': 'var(--pulse-cyan)',
        'pulse-pink': 'var(--pulse-pink)',
        'pulse-red': 'var(--pulse-red)',
        'pulse-dark': 'var(--pulse-dark)',
        'pulse-light': 'var(--pulse-light)',
        'primary': '#0A2540',
        'accent-green': '#00D09C',
        'neutral-light': '#F6F9FC',
        'neutral-dark': '#6B7C93',
        'background-light': '#FFFFFF',
        'background-dark': '#131a1f',
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif']
      },
    },
  },
  plugins: [],
}