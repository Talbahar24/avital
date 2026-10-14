"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { SHIPPING_METHODS } from "@/lib/constants";
import { useCart } from "./CartProvider";

export function CheckoutForm({
  shipping,
}: {
  shipping: {
    courierAgorot: number;
    pickupPointAgorot: number;
    studioAgorot: number;
    freeThresholdAgorot: number;
  };
}) {
  const { items, subtotal, clear, ready } = useCart();
  const router = useRouter();
  const [method, setMethod] = useState("courier");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const shippingCost =
    method === "studio_pickup"
      ? 0
      : subtotal >= shipping.freeThresholdAgorot
        ? 0
        : method === "pickup_point"
          ? shipping.pickupPointAgorot
          : shipping.courierAgorot;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!items.length) {
      setError("הסל ריק");
      return;
    }
    const data = new FormData(event.currentTarget);
    if (!data.get("cancellation")) {
      setError("יש לאשר את מדיניות הביטול");
      return;
    }
    setPending(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: data.get("fullName"),
        phone: data.get("phone"),
        email: data.get("email"),
        shippingMethod: method,
        city: data.get("city"),
        street: data.get("street"),
        streetNumber: data.get("streetNumber"),
        apartment: data.get("apartment"),
        note: data.get("note"),
        items: items.map((item) => ({ productId: item.productId, qty: 1 })),
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setPending(false);
      setError(json.error || "לא ניתן להשלים את ההזמנה");
      return;
    }
    const pay = await fetch("/api/checkout/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: json.orderId }),
    });
    const paid = await pay.json();
    setPending(false);
    if (!pay.ok) {
      setError(paid.error || "התשלום לא אושר");
      return;
    }
    clear();
    router.push(`/order/${json.publicNumber}`);
  }

  if (!ready) return <p>טוען את הסל…</p>;
  if (!items.length) {
    return <p>הסל ריק. חזרו לחנות לבחור פריט.</p>;
  }

  return (
    <form className="checkout" onSubmit={onSubmit}>
      <div className="card form-grid">
        <h2>פרטים</h2>
        <input className="field" name="fullName" required placeholder="שם מלא" autoComplete="name" />
        <input className="field" name="phone" required type="tel" placeholder="טלפון" autoComplete="tel" />
        <input className="field" name="email" required type="email" placeholder="אימייל" autoComplete="email" />
        <h2>משלוח</h2>
        <div className="radio-row">
          {SHIPPING_METHODS.map((item) => (
            <label key={item.value}>
              <input type="radio" name="shippingMethod" checked={method === item.value} onChange={() => setMethod(item.value)} />
              {item.label}
            </label>
          ))}
        </div>
        {method !== "studio_pickup" ? (
          <>
            <input className="field" name="city" required placeholder="עיר" autoComplete="address-level2" />
            <input className="field" name="street" required placeholder="רחוב" autoComplete="address-line1" />
            <input className="field" name="streetNumber" required placeholder="מספר" />
            <input className="field" name="apartment" placeholder="דירה" />
          </>
        ) : null}
        <textarea className="area" name="note" placeholder="הערות לשליח או לאיסוף" />
        <label>
          <input type="checkbox" name="cancellation" /> קראתי את{" "}
          <a href="/legal/cancellation" target="_blank" rel="noreferrer">
            מדיניות הביטול
          </a>
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "שומרת הזמנה…" : "אישור הזמנה (סביבת בדיקה)"}
        </button>
        <p>פרטי אשראי לא נשמרים באתר. סליקה חיה תתחבר אחרי בחירת ספק (PayPlus / קארדקום / טרנזילה).</p>
      </div>
      <aside className="card">
        <h2>סיכום</h2>
        {items.map((item) => (
          <div className="summary-line" key={item.productId}>
            <span>{item.name}</span>
            <span>{formatPrice(item.priceAgorot)}</span>
          </div>
        ))}
        <div className="summary-line">
          <span>משלוח</span>
          <span>{shippingCost === 0 ? "חינם" : formatPrice(shippingCost)}</span>
        </div>
        <div className="summary-line">
          <span>המחיר כולל מע״מ</span>
          <strong>{formatPrice(subtotal + shippingCost)}</strong>
        </div>
      </aside>
    </form>
  );
}
