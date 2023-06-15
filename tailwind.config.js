/** @type {import('tailwindcss').Config} */

const typography = require('@tailwindcss/typography');

module.exports = {
  content: ['./hugo_stats.json'],
  theme: {
    // screens: {
    //   sm: '480px',
    //   md: '768px',
    //   lg: '1020px',
    //   xl: '1440px',
    // },
    extend: {
      content: {
      },
      height: {
        '120': '30rem',
        '128': '32rem',
      },
    },
  },
  plugins: [typography],
}
