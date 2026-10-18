
// ==================================================
// NAVBAR MOBILE
// ==================================================
const links = document.querySelectorAll("nav li");

icons.addEventListener("click", () => {
  nav.classList.toggle("active");
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
  });
});

const header = document.querySelector("header");
const headerHeight = header.getBoundingClientRect().height;

document.documentElement.style.setProperty(
    "--header-height",
    `${headerHeight}px`
);


// ==================================================
// LIGHTBOX
// ==================================================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxDesc = document.getElementById("lightbox-description");


document.addEventListener("click", event => {
    const img = event.target.closest("img.zoomable");

    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxDesc.textContent = img.alt;

    lightboxImg.classList.toggle(
        "transparent",
        new URL(img.src).pathname.toLowerCase().endsWith(".png")
    );
    
    lightbox.classList.add("active");
});


lightbox.addEventListener("click", () => {
    lightbox.classList.remove("active");
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        lightbox.classList.remove("active");
    }
});

// ==================================================
// MESSAGE POUR LES CURIEUX
// ==================================================
console.log(
    "%c🦔 Bienvenue dans les coulisses du Royaume des Hérissons !",
    "color: #4cb53c; font-size: 18px; font-weight: bold;"
);


// ==================================================
// LIEN VERS L'ACCUEIL
// ==================================================
const headerIconTitle = document.querySelectorAll("#nav-hedgehog, nav h1, #end-title");

const homeURL = window.location.hostname.endsWith(".github.io")
    ? "/hedgehog-kingdom/"
    : new URL(
        window.location.pathname.includes("/pages/")
            ? "../index.html"
            : "index.html",
        window.location.href
    ).href;

headerIconTitle.forEach(element => {
    element.addEventListener("click", () => {
        window.location.assign(homeURL);
    });
});


// ==================================================
// ANIMATION DU HÉRISSON
// ==================================================
const hedgehog = document.querySelector("#footer-hedgehog");
const message = document.querySelector("#footer-message");
const container = document.querySelector("#hedge-text");
const sonicSound = document.querySelector("#sonic-ring");
sonicSound.volume = 0.08;

const messages = [
    "Parce que l'on a tous besoin de piquant et de douceur dans la vie",
    "Un petit hérisson peut cacher de grandes surprises !",
    "La vie est plus douce avec quelques piquants",
    "Attention, hérisson en vadrouille !"
];

const STORAGE_KEY = "hedgehog-message-index";

// Récupération du message sauvegardé s'il existe et qu'il est valide, sinon attribution du premier message (index 0)
let messageIndex = Number(localStorage.getItem(STORAGE_KEY) ?? 0);

if (!Number.isInteger(messageIndex) || messageIndex < 0 || messageIndex >= messages.length) {
    messageIndex = 0;
}

message.textContent = messages[messageIndex];

let isAnimating = false;

async function animateHedgehog() {

    if (isAnimating) return;

    isAnimating = true;

    hedgehog.classList.add("animating");
    hedgehog.setAttribute("aria-disabled", "true");

    const duration = 2000;
    const turnDuration = 350;

    try {

        // Mesure de la taille du conteneur avant animation
        const oldWidth = message.getBoundingClientRect().width;
        const gap = 5;

        // Fixation de la largeur du conteneur
        container.style.width = `${oldWidth + hedgehog.offsetWidth + gap}px`;

        // Déplacement vers la gauche + effacement
        sonicSound.play();

        await Promise.all([

            hedgehog.animate(
                [
                    { transform: "translateX(0) scaleX(1)" },
                    { transform: `translateX(-${oldWidth + gap}px) scaleX(1)` }
                ],
                {
                    duration,
                    easing: "linear",
                    fill: "forwards"
                }
            ).finished,

            message.animate(
                [
                    { clipPath: "inset(0 0 0 0)" },
                    { clipPath: "inset(0 100% 0 0)" }
                ],
                {
                    duration,
                    easing: "linear",
                    fill: "forwards"
                }
            ).finished

        ]);

        // Changement du texte
        messageIndex = (messageIndex + 1) % messages.length;
        message.textContent = messages[messageIndex];

        const newWidth = message.getBoundingClientRect().width;

        // Adaptation de la largeur du conteneur
        container.style.width = `${newWidth + hedgehog.offsetWidth + gap}px`;

        // Demi-tour
        sonicSound.play();
        await hedgehog.animate(
            [
                { transform: `translateX(-${newWidth + gap}px) scaleX(1)` },
                { transform: `translateX(-${newWidth + gap}px) scaleX(-1)` }
            ],
            {
                duration: turnDuration,
                fill: "forwards"
            }
        ).finished;

        // Retour vers la droite + apparition du nouveau texte
        await Promise.all([

            hedgehog.animate(
                [
                    { transform: `translateX(-${newWidth + gap}px) scaleX(-1)` },
                    { transform: "translateX(0) scaleX(-1)" }
                ],
                {
                    duration,
                    easing: "linear",
                    fill: "forwards"
                }
            ).finished,

            message.animate(
                [
                    { clipPath: "inset(0 100% 0 0)" },
                    { clipPath: "inset(0 0 0 0)" }
                ],
                {
                    duration,
                    easing: "linear",
                    fill: "forwards"
                }
            ).finished

        ]);

        // Remise du hérisson dans son orientation initiale
        await hedgehog.animate(
            [
                { transform: "scaleX(-1)" },
                { transform: "scaleX(1)" }
            ],
            {
                duration: turnDuration,
                fill: "forwards"
            }
        ).finished;

        // Sauvegarde du nouveau message
        localStorage.setItem(STORAGE_KEY, messageIndex);

    } catch (error) {

        console.error("Erreur durant l'animation du hérisson :", error);

    } finally {

        hedgehog.getAnimations().forEach(animation => animation.cancel());
        message.getAnimations().forEach(animation => animation.cancel());

        hedgehog.style.transform = "";
        message.style.clipPath = "";
        container.style.width = "";

        hedgehog.classList.remove("animating");
        hedgehog.setAttribute("aria-disabled", "false");

        isAnimating = false;
    }
}


// ==================================================
// ANIMATION HÉRISSON - ÉVÉNEMENTS 
// ==================================================

hedgehog.addEventListener("click", animateHedgehog);

hedgehog.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        animateHedgehog();
    }
});