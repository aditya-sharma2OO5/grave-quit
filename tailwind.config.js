/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0A0A0A',
          alt: '#131313',
        },
        surface: {
          DEFAULT: '#1A1A1A',
          hover: '#222222',
          high: '#2A2A2A',
          highest: '#353535',
        },
        accent: {
          DEFAULT: '#A8C5B0',
          hover: '#B0CEB8',
          dark: '#354F3E',
          soft: 'rgba(168, 197, 176, 0.15)',
        },
        text: {
          primary: '#F5F5F0',
          secondary: '#8A8A8A',
          muted: '#C5C7C1',
        },
        border: {
          DEFAULT: '#2A2A2A',
          light: '#454843',
        },
        destructive: {
          DEFAULT: '#93000A',
          border: '#FFB4AB',
          text: '#FFB4AB',
        }
      },
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '14px',
        'button': '16px',
      },
      maxWidth: {
        'column': '800px',
      }
    },
  },
  plugins: [],
}
