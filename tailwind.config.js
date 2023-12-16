/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: ['./hugo_stats.json'],
  theme: {
    fontFamily: {
      'postmeta': ['post-meta'],
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#374151',
          },
        },
      },
      content: {
      },
      height: {
        '120': '30rem',
        '128': '32rem',
      },
      margin: {
        // '18': '4.5rem',
        '22': '5.5rem',
        '38': '9.5rem',
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
  plugins: [require('flowbite-typography')],
}
