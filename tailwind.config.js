/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E04E2F',
        accent: '#0B9FE5',
        peach: '#FFEEE6',
        lightBlue: '#E6F7FF',
        darkGray: '#1A1A1A',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Lato', 'Open Sans', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #FFEEE6 0%, #E6F7FF 100%)',
      },
    },
  },
  plugins: [],
}