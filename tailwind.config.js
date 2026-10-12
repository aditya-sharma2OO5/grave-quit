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
        },
        // Graveyard theme tokens
        candle: '#E8C87A',
        moss: '#5A7A5E',
        ghost: 'rgba(245, 245, 240, 0.15)',
        fog: 'rgba(168, 197, 176, 0.05)',
      },
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
      },
      borderRadius: {
        'card': '14px',
        'button': '16px',
      },
      maxWidth: {
        'column': '800px',
      },
      // Graveyard theme animation utilities
      animation: {
        'gravestone-float': 'gravestone-float 6s ease-in-out infinite',
        'ghost-drift': 'ghost-drift 8s ease-in-out infinite',
        'fog-scroll': 'fog-scroll 20s ease-in-out infinite',
        'candle-flicker': 'candle-flicker 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 1.2s ease-out forwards',
      },
      keyframes: {
        'gravestone-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'ghost-drift': {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)', opacity: '0.15' },
          '25%': { transform: 'translateX(6px) translateY(-4px)', opacity: '0.3' },
          '50%': { transform: 'translateX(-4px) translateY(-8px)', opacity: '0.4' },
          '75%': { transform: 'translateX(3px) translateY(-3px)', opacity: '0.25' },
        },
        'fog-scroll': {
          '0%': { transform: 'translateX(-30%)', opacity: '0.6' },
          '50%': { transform: 'translateX(30%)', opacity: '0.9' },
          '100%': { transform: 'translateX(-30%)', opacity: '0.6' },
        },
        'candle-flicker': {
          '0%, 100%': { opacity: '0.6' },
          '20%': { opacity: '1' },
          '40%': { opacity: '0.7' },
          '60%': { opacity: '1' },
          '80%': { opacity: '0.5' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
