export function formatPrice(agorot: number) {
  const shekels = agorot / 100;
  const formatted = new Intl.NumberFormat("he-IL", {
    maximumFractionDigits: shekels % 1 === 0 ? 0 : 2,
  }).format(shekels);
  return `${formatted} ₪`;
}

export function shekelsToAgorot(value: string | number) {
  const n = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

export function agorotToShekelsInput(agorot: number) {
  return (agorot / 100).toString();
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function whatsappLink(text?: string) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP ?? "972509054860";
  const url = `https://wa.me/${phone}`;
  return text ? `${url}?text=${encodeURIComponent(text)}` : url;
}
