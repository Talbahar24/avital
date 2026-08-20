const nav = document.getElementById("nav");
const menu = document.querySelector(".menu");
const form = document.getElementById("form");

if (menu && nav) {
  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
    });
  });
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const text = [
      "שלום אביטל, אשמח לתאם סדנה.",
      `שם: ${data.get("name")}`,
      `טלפון: ${data.get("phone")}`,
      `סוג האירוע: ${data.get("event") || "לא צוין"}`,
      `תאריך ומיקום: ${data.get("details") || "לא צוין"}`,
    ].join("\n");
    window.open(`https://wa.me/972509054860?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });
}
