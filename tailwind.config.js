/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: ['./hugo_stats.json'],
  theme: {
    extend: {
      fontFamily: {
        Oswald: ['Oswald'],
        Montserrat: ['Montserrat'],
        IndexNumb: ['Antonio'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#374151',
          },
        },
      },
      content: {},
      height: {
        38: '9.5rem',
        120: '30rem',
        128: '32rem',
      },
      margin: {
        // '18': '4.5rem',
        22: '5.5rem',
        38: '9.5rem',
      },
      keyframes: {
        slideTop: {
          '0%': { transform: 'translateY(70px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        slideTop: 'slideTop 0.5s linear both',
      },
    },
  },
  plugins: [require('flowbite-typography')],
};
