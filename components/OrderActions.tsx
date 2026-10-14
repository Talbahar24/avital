"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";

export function OrderActions({
  id,
  fulfillmentStatus,
  trackingNumber,
  statuses,
}: {
  id: string;
  fulfillmentStatus: string;
  trackingNumber: string;
  statuses: readonly { value: string; label: string }[];
}) {
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fulfillmentStatus: data.get("fulfillmentStatus"),
        trackingNumber: data.get("trackingNumber"),
      }),
    });
    router.refresh();
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <label>
        סטטוס משלוח
        <select className="field" name="fulfillmentStatus" defaultValue={fulfillmentStatus}>
          {statuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        מספר מעקב
        <input className="field" name="trackingNumber" defaultValue={trackingNumber} />
      </label>
      <button className="btn" type="submit">
        עדכון
      </button>
    </form>
  );
}
