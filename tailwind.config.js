/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          red: '#FF073A',
          darkRed: '#CC0029',
          lightRed: '#FF3366',
        },
        dark: {
          900: '#000000',
          800: '#0A0A0A',
          700: '#111111',
          600: '#1A1A1A',
          500: '#222222',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 5px #FF073A, 0 0 20px #FF073A, 0 0 40px #FF073A',
        'neon-sm': '0 0 3px #FF073A, 0 0 10px #FF073A',
        'neon-lg': '0 0 10px #FF073A, 0 0 40px #FF073A, 0 0 80px #FF073A',
        'neon-white': '0 0 5px #FFFFFF, 0 0 20px #FFFFFF',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'neon-flicker': 'neon-flicker 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { boxShadow: '0 0 5px #FF073A, 0 0 20px #FF073A' },
          '100%': { boxShadow: '0 0 10px #FF073A, 0 0 40px #FF073A, 0 0 80px #FF073A' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'neon-flicker': {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
            textShadow: '0 0 4px #FF073A, 0 0 11px #FF073A, 0 0 19px #FF073A, 0 0 40px #FF073A',
          },
          '20%, 24%, 55%': {
            textShadow: 'none',
          },
        },
      },
    },
  },
  plugins: [],
};
