let themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
let themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// logo icon
let logoToggleDarkIcon = document.getElementById('logo-dark-icon');
let logoToggleLightIcon = document.getElementById('logo-light-icon');

// footer theme logo icon
let footerToggleDarkIcon = document.getElementById('footer-theme-dark-logo');
let footerToggleLightIcon = document.getElementById('footer-theme-light-logo');

// Change the icons inside the button based on previous settings
if (
  localStorage.getItem('color-theme') === 'dark' ||
  (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  themeToggleLightIcon.classList.remove('hidden');
  if (!logoToggleLightIcon.classList.contains('hidden')) {
    logoToggleLightIcon.classList.add('hidden');
  }
  logoToggleDarkIcon.classList.remove('hidden');
  if (!footerToggleLightIcon.classList.contains('hidden')) {
    footerToggleLightIcon.classList.add('hidden');
  }
  footerToggleDarkIcon.classList.remove('hidden');
} else {
  themeToggleDarkIcon.classList.remove('hidden');
  logoToggleLightIcon.classList.remove('hidden');
  footerToggleLightIcon.classList.remove('hidden');
}

var themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', function () {
  // toggle icons inside button
  themeToggleDarkIcon.classList.toggle('hidden');
  themeToggleLightIcon.classList.toggle('hidden');

  logoToggleDarkIcon.classList.toggle('hidden');
  logoToggleLightIcon.classList.toggle('hidden');

  footerToggleDarkIcon.classList.toggle('hidden');
  footerToggleLightIcon.classList.toggle('hidden');

  // if set via local storage previously
  if (localStorage.getItem('color-theme')) {
    if (localStorage.getItem('color-theme') === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    }

    // if NOT set via local storage previously
  } else {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    }
  }
});
