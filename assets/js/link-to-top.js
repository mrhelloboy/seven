let linksMatches = document.querySelectorAll('a[data-title-of-head]');

for (let i = 0; i < linksMatches.length; i++) {
  linksMatches[i].addEventListener('click', (e) => {
    e.preventDefault();
    let target = linksMatches[i]; // document.querySelector(this.getAttribute("href"));
    let targetTop = target.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    });
  });
}
