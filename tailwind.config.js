module.exports = {
  corePlugins: {
    container: false
  },
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    dropShadow: {
      button: '0 4px 0px #8134b5'
    },
    fontFamily: {
      nunito: 'Nunito Sans'
    },
    extend: {
      colors: {
        gray: {
          DEFAULT: 'var(--gray)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          '300-75': 'var(--gray-300-75)',
          400: 'var(--gray-400)'
        }
      },
      backgroundColor: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)'
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)'
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          xl: '0rem'
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
