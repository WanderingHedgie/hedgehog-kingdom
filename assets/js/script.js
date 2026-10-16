
// Navbar burger menu
const links = document.querySelectorAll("nav li");

icons.addEventListener("click", () => {
  nav.classList.toggle("active");
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
  });
});

// Header height
const header = document.querySelector("header");
const headerHeight = header.getBoundingClientRect().height;

document.documentElement.style.setProperty(
    "--header-height",
    `${headerHeight}px`
);

// Pictures zoom
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxDesc = document.getElementById("lightbox-description");


document.querySelectorAll(".zoomable").forEach(img => {
    img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxDesc.textContent = img.alt;

        lightboxImg.classList.toggle(
            "transparent",
            new URL(img.src).pathname.toLowerCase().endsWith(".png")
        );
        
        lightbox.classList.add("active");
    });
});


lightbox.addEventListener("click", () => {
    lightbox.classList.remove("active");
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        lightbox.classList.remove("active");
    }
});

// Message pour les curieux

console.log(
    "%c🦔 Bienvenue dans les coulisses du Royaume des Hérissons !",
    "color: #4cb53c; font-size: 18px; font-weight: bold;"
);