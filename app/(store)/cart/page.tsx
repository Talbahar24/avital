"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { meaningLabel } from "@/lib/meanings";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const { items, subtotal, remove, ready } = useCart();
  if (!ready) return <section className="section wrap"><h1>הסל</h1><p>טוען…</p></section>;
  return (
    <section className="section wrap">
      <h1>הסל</h1>
      {items.length === 0 ? (
        <div className="empty">
          <p>הסל ריק.</p>
          <Link className="btn" href="/shop">
            לחנות
          </Link>
        </div>
      ) : (
        <div className="checkout">
          <div>
            {items.map((item) => (
              <div className="cart-line" key={item.productId}>
                <img src={item.image} alt="" />
                <div>
                  <Link href={`/product/${item.slug}`}>
                    <strong>{item.name}</strong>
                  </Link>
                  <div className="meaning-line">{item.meaning ? `ל${meaningLabel(item.meaning)}` : ""}</div>
                  <div>{formatPrice(item.priceAgorot)}</div>
                  <button type="button" onClick={() => remove(item.productId)} style={{ background: "none", border: 0, color: "var(--orange)", cursor: "pointer" }}>
                    הסרה
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="summary-line">
              <span>סה״כ כולל מע״מ</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <Link className="btn" href="/checkout">
              לתשלום
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
