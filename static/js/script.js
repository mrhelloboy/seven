const btn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
const logoToggle = document.getElementById("logo-toggle");
const logo = document.getElementById("logo");

// Hamburger button listener
btn.addEventListener("click", navToggle);

function navToggle() {
  btn.classList.toggle("open");
  menu.classList.toggle("flex");
  menu.classList.toggle("hidden");

  if (menu.classList.contains("flex") && logoToggle) {
    logo.classList.add("hidden");
    logoToggle.classList.remove("hidden");
  } else {
    logo.classList.remove("hidden");
    logoToggle.classList.add("hidden");
  }
}
