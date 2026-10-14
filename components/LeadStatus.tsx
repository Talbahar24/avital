"use client";

import { useRouter } from "next/navigation";

export function LeadStatus({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  return (
    <select
      className="field"
      defaultValue={status}
      onChange={async (event) => {
        await fetch(`/api/admin/leads/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: event.target.value }),
        });
        router.refresh();
      }}
    >
      <option value="new">חדש</option>
      <option value="handled">טופל</option>
    </select>
  );
}
