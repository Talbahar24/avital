const WHATSAPP_NUMBER = "+972509054860";

const nav = document.getElementById("site-nav");
const toggle = document.querySelector(".menu-toggle");
const form = document.getElementById("contact-form");
const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox.querySelector("img");

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

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const text = [
    "שלום אביטל, אשמח לתאם סדנה.",
    `שם: ${data.get("name")}`,
    `טלפון: ${data.get("phone")}`,
    `סוג האירוע: ${data.get("event")}`,
    `פרטים: ${data.get("message") || "לא צוין"}`,
  ].join("\n");

  if (WHATSAPP_NUMBER) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    alert("ההודעה הועתקה. הדביקו אותה בוואטסאפ, או עדכנו מספר ב-script.js כדי לפתוח ישירות.");
  } catch {
    alert("עדכנו את מספר הוואטסאפ בקובץ script.js כדי שהטופס ייפתח ישירות.");
  }
});
