const WHATSAPP_NUMBER = "972509054860";

const nav = document.getElementById("site-nav");
const toggle = document.querySelector(".menu-toggle");
const form = document.getElementById("contact-form");
const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox ? lightbox.querySelector("img") : null;

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (lightbox && lightboxImage) {
  document.querySelectorAll(".gallery-item").forEach((button) => {
    button.addEventListener("click", () => {
      lightboxImage.src = button.dataset.src;
      lightboxImage.alt = button.querySelector("img").alt;
      lightbox.showModal();
    });
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", () => {
    lightbox.close();
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });
}

document.querySelectorAll('a[href="#top"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const text = [
      "שלום אביטל, אשמח לתאם סדנה.",
      `שם: ${data.get("name")}`,
      `טלפון: ${data.get("phone")}`,
      `סוג האירוע: ${data.get("event")}`,
      `תאריך ומיקום: ${data.get("details") || "לא צוין"}`,
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  });
}
