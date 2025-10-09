/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        banking: {
          primary: '#0A4D3C',
          secondary: '#0F6B56',
          accent: '#14B886',
          light: '#E8F5F1',
          dark: '#052E23',
        }
      },
      animation: {
        'gradient-rotate': 'gradient-rotate 8s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'gradient-rotate': {
          from: { '--gradient-angle': '0deg' },
          to: { '--gradient-angle': '360deg' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'banking': '0 10px 40px rgba(10, 77, 60, 0.1)',
        'banking-lg': '0 20px 60px rgba(10, 77, 60, 0.15)',
      }
    },
  },
  plugins: [],
}