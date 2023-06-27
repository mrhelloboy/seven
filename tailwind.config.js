/** @type {import('tailwindcss').Config} */

const typography = require('@tailwindcss/typography');

module.exports = {
  content: ['./hugo_stats.json'],
  theme: {
    fontFamily: {
      'postmeta': ['post-meta'],
    },
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
