"use client";

import { useState } from "react";
import { meaningLabel } from "@/lib/meanings";
import { useCart } from "./CartProvider";

export function AddToCart({
  product,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    priceAgorot: number;
    meaning: string;
    status: string;
    stockQty: number;
    inventoryMode: string;
    image: string;
  };
}) {
  const { add } = useCart();
  const [message, setMessage] = useState("");
  const sold = product.status === "sold" || product.stockQty <= 0;
  const reserved = product.status === "reserved";

  if (sold) {
    return (
      <p className="one-piece">
        <button className="buy-btn" type="button" disabled>
          {product.inventoryMode === "one_piece" ? "הפריט מצא בית" : "אזל מהמלאי"}
        </button>
      </p>
    );
  }

  if (reserved) {
    return <p className="one-piece">הפריט שמור כרגע להזמנה בתשלום. נסו שוב בעוד כמה דקות.</p>;
  }

  return (
    <div>
      <button
        className="buy-btn"
        type="button"
        onClick={() => {
          const result = add({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            priceAgorot: product.priceAgorot,
            image: product.image,
            meaning: product.meaning,
            qty: 1,
          });
          setMessage(result.ok ? "" : result.reason ?? "");
        }}
      >
        הוספה לסל
      </button>
      <p className="one-piece">
        פריט יחיד. כשיימכר, הוא לא יחזור.
        {product.meaning ? ` נוצר ל${meaningLabel(product.meaning)}.` : ""}
      </p>
      {message ? <p className="error">{message}</p> : null}
    </div>
  );
}
