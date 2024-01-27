/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: ['./hugo_stats.json'],
  theme: {
    fontFamily: {
      Oswald: ['Oswald'],
      Montserrat: ['Montserrat'],
    },
    extend: {
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
    },
  },
  plugins: [require('flowbite-typography')],
};
