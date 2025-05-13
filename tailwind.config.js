/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6A0DAD', // Purple
          light: '#8A2BE2',
          dark: '#4B0082',
        },
        secondary: {
          DEFAULT: '#4CAF50', // Green
          light: '#66BB6A',
          dark: '#388E3C',
        },
        accent: {
          DEFAULT: '#FFFFFF', // White
        },
      },
    },
  },
  plugins: [],
} 