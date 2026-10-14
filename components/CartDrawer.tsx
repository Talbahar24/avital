"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { meaningLabel } from "@/lib/meanings";
import { useCart } from "./CartProvider";
import { CloseIcon } from "./Icons";

export function CartDrawer({
  freeThresholdAgorot,
  courierAgorot,
}: {
  freeThresholdAgorot: number;
  courierAgorot: number;
}) {
  const { items, subtotal, open, setOpen, remove } = useCart();
  const router = useRouter();
  if (!open) return null;

  const remaining = Math.max(0, freeThresholdAgorot - subtotal);
  const shipping = remaining === 0 ? 0 : courierAgorot;
  const progress = Math.min(100, (subtotal / freeThresholdAgorot) * 100);

  return (
    <div className="drawer-backdrop" onClick={() => setOpen(false)}>
      <aside className="cart-drawer" role="dialog" aria-label="סל קניות" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h2>הסל</h2>
          <button className="icon-btn" type="button" aria-label="סגירת הסל" onClick={() => setOpen(false)} style={{ color: "var(--ink)" }}>
            <CloseIcon />
          </button>
        </div>
        <div className="drawer-body">
          {items.length === 0 ? (
            <p>הסל ריק עדיין. בחרו פריט יחיד מהחנות.</p>
          ) : (
            items.map((item) => (
              <div className="cart-line" key={item.productId}>
                <img src={item.image} alt="" />
                <div>
                  <strong>{item.name}</strong>
                  <div className="meaning-line">{item.meaning ? `ל${meaningLabel(item.meaning)}` : "פריט יחיד"}</div>
                  <div>{formatPrice(item.priceAgorot)}</div>
                  <button type="button" onClick={() => remove(item.productId)} style={{ background: "none", border: 0, color: "var(--orange)", cursor: "pointer", padding: 0, minHeight: 44 }}>
                    הסרה
                  </button>
                </div>
              </div>
            ))
          )}
          {items.length > 0 ? (
            <div className="ship-note">
              {remaining > 0
                ? `עוד ${formatPrice(remaining)} למשלוח חינם`
                : "המשלוח עד הבית כלול בהזמנה הזו"}
              <div className="ship-bar" aria-hidden="true">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : null}
        </div>
        {items.length > 0 ? (
          <div className="drawer-foot">
            <div className="summary-line">
              <span>ביניים</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div className="summary-line">
              <span>משלוח משוער</span>
              <span>{shipping === 0 ? "חינם" : formatPrice(shipping)}</span>
            </div>
            <div className="summary-line">
              <span>סה״כ כולל מע״מ</span>
              <strong>{formatPrice(subtotal + shipping)}</strong>
            </div>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setOpen(false);
                router.push("/checkout");
              }}
            >
              לתשלום
            </button>
            <button className="btn-secondary" type="button" onClick={() => setOpen(false)}>
              להמשך קנייה
            </button>
          </div>
        ) : (
          <div className="drawer-foot">
            <Link className="btn" href="/shop" onClick={() => setOpen(false)}>
              לחנות
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
