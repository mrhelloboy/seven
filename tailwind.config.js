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
      animation: {
        zoomIn: 'zoomIn .8s ease-out 1',
        zoomOut: 'zoomOut 1s ease-in-out 1',
      },
      keyframes: {
        zoomIn: {
          from: { 
            transform: 'scale(0)',
            opacity: 0,
          },
          to: { 
            transform: 'scale(1)',
            opacity: 1, 
          },
        },
        zoomOut: {
          from: { 
            transform: 'scale(1)',
            opacity: 1,
          },
          to: { 
            transform: 'scale(0)',
            opacity: 0,
          },
        },
      },
    },
  },
  plugins: [typography],
}
