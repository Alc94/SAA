/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      /*
       * Tokens de color de Zoo-Logic IA
       *  - forest / earth / ochre : biodiversidad (bosque, tierra, ocres suaves)
       *  - electric / deepblue / ink : tecnología (cian eléctrico, azul profundo, fondos oscuros)
       */
      colors: {
        forest: {
          50: '#eef6f0', 100: '#d6eadb', 200: '#b0d5ba', 300: '#82b995', 400: '#559a6f',
          500: '#3a7f55', 600: '#2b6644', 700: '#235138', 800: '#1d412e', 900: '#143022', 950: '#0a1c14'
        },
        earth: {
          50: '#f8f3ec', 100: '#eee3d3', 200: '#dcc6a6', 300: '#c6a47a', 400: '#af8657',
          500: '#98703f', 600: '#7e5935', 700: '#654530', 800: '#4f3628', 900: '#3a2820'
        },
        ochre: {
          50: '#fcf8e8', 100: '#f6edc3', 200: '#edda8a', 300: '#e1c35a', 400: '#d2a934',
          500: '#b78a24', 600: '#966c1d', 700: '#74521a'
        },
        electric: {
          200: '#aaf6ff', 300: '#74efff', 400: '#2fe3ff', 500: '#00cfee', 600: '#00a2bd', 700: '#007a90'
        },
        deepblue: {
          500: '#1d4f9c', 600: '#163e7d', 700: '#112f61', 800: '#0c2249', 900: '#08173a', 950: '#050e25'
        },
        ink: {
          700: '#1c2b2a', 800: '#12201f', 900: '#0b1517', 950: '#060d0f'
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 36px -6px rgba(0, 207, 238, 0.45)'
      },
      keyframes: {
        scan: {
          '0%':   { transform: 'translateY(-10%)', opacity: '0' },
          '15%':  { opacity: '1' },
          '85%':  { opacity: '1' },
          '100%': { transform: 'translateY(110%)', opacity: '0' }
        },
        pulseline: {
          '0%':   { strokeDashoffset: '400' },
          '100%': { strokeDashoffset: '0' }
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%':      { transform: 'translate3d(0, -14px, 0)' }
        }
      },
      animation: {
        scan: 'scan 5s ease-in-out infinite',
        pulseline: 'pulseline 2.4s linear infinite',
        drift: 'drift 9s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
