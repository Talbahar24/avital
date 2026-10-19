import { SHIPPING_METHODS, SITE } from "./constants";
import { formatPrice } from "./format";

type OrderNotice = {
  id: string;
  publicNumber: string;
  fullName: string;
  phone: string;
  email: string;
  shippingMethod: string;
  city: string;
  street: string;
  streetNumber: string;
  apartment: string;
  note: string;
  subtotalAgorot: number;
  shippingAgorot: number;
  totalAgorot: number;
  items: { nameSnapshot: string; unitPriceAgorot: number }[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function shippingLabel(method: string) {
  return SHIPPING_METHODS.find((item) => item.value === method)?.label ?? method;
}

function addressLine(order: OrderNotice) {
  if (order.shippingMethod === "studio_pickup") return "איסוף מהסטודיו";
  const apartment = order.apartment ? `, דירה ${order.apartment}` : "";
  return `${order.street} ${order.streetNumber}${apartment}, ${order.city}`;
}

export async function notifyNewOrder(order: OrderNotice) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFY_EMAIL || SITE.orderEmail;
  if (!apiKey) {
    console.error(`RESEND_API_KEY is missing; order email was not sent for ${order.publicNumber}`);
    return;
  }

  const from = process.env.RESEND_FROM || `${SITE.brand} <onboarding@resend.dev>`;
  const method = shippingLabel(order.shippingMethod);
  const address = addressLine(order);
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const adminUrl = site ? `${site}/admin/orders/${order.id}` : "";
  const items = order.items
    .map((item) => `${item.nameSnapshot} · ${formatPrice(item.unitPriceAgorot)}`)
    .join("\n");
  const text = [
    `הזמנה חדשה ${order.publicNumber}`,
    "",
    `שם: ${order.fullName}`,
    `טלפון: ${order.phone}`,
    `אימייל: ${order.email}`,
    `משלוח: ${method}`,
    `כתובת: ${address}`,
    order.note ? `הערה: ${order.note}` : "",
    "",
    "פריטים:",
    items,
    "",
    `סכום פריטים: ${formatPrice(order.subtotalAgorot)}`,
    `משלוח: ${formatPrice(order.shippingAgorot)}`,
    `סה״כ כולל מע״מ: ${formatPrice(order.totalAgorot)}`,
    "",
    "עדיין לא בוצע חיוב בכרטיס.",
    adminUrl ? `ההזמנה בפאנל: ${adminUrl}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");

  const itemHtml = order.items
    .map(
      (item) =>
        `<li>${escapeHtml(item.nameSnapshot)} · ${escapeHtml(formatPrice(item.unitPriceAgorot))}</li>`,
    )
    .join("");
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif">
<p><strong>הזמנה חדשה ${escapeHtml(order.publicNumber)}</strong></p>
<p>שם: ${escapeHtml(order.fullName)}<br>טלפון: ${escapeHtml(order.phone)}<br>אימייל: ${escapeHtml(order.email)}</p>
<p>משלוח: ${escapeHtml(method)}<br>כתובת: ${escapeHtml(address)}</p>
${order.note ? `<p>הערה: ${escapeHtml(order.note)}</p>` : ""}
<ul>${itemHtml}</ul>
<p>סכום פריטים: ${escapeHtml(formatPrice(order.subtotalAgorot))}<br>משלוח: ${escapeHtml(formatPrice(order.shippingAgorot))}<br><strong>סה״כ כולל מע״מ: ${escapeHtml(formatPrice(order.totalAgorot))}</strong></p>
<p>עדיין לא בוצע חיוב בכרטיס.</p>
${adminUrl ? `<p><a href="${escapeHtml(adminUrl)}">ההזמנה בפאנל</a></p>` : ""}
</div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: order.email,
        subject: `הזמנה חדשה ${order.publicNumber}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error(`order email failed for ${order.publicNumber}`, response.status, await response.text());
    }
  } catch (error) {
    console.error(`order email failed for ${order.publicNumber}`, error);
  }
}
