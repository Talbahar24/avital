"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { shekelsToAgorot } from "@/lib/format";

export function SettingsForm({
  announcements,
  popular,
  shipping,
}: {
  announcements: string[];
  popular: string[];
  shipping: { courier: number; pickup: number; studio: number; free: number };
}) {
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        announcements: String(data.get("announcements") || "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        settings: {
          popular_searches: JSON.stringify(
            String(data.get("popular") || "")
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          ),
          shipping_courier_agorot: String(shekelsToAgorot(String(data.get("courier") || 0))),
          shipping_pickup_point_agorot: String(shekelsToAgorot(String(data.get("pickup") || 0))),
          shipping_studio_agorot: String(shekelsToAgorot(String(data.get("studio") || 0))),
          free_shipping_threshold_agorot: String(shekelsToAgorot(String(data.get("free") || 0))),
        },
      }),
    });
    router.refresh();
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <label>
        פס הודעות (שורה לכל הודעה)
        <textarea className="area" name="announcements" defaultValue={announcements.join("\n")} />
      </label>
      <label>
        חיפושים פופולריים (מופרדים בפסיק)
        <input className="field" name="popular" defaultValue={popular.join(", ")} />
      </label>
      <label>
        שליח עד הבית (₪)
        <input className="field" name="courier" type="number" defaultValue={shipping.courier} />
      </label>
      <label>
        נקודת איסוף (₪)
        <input className="field" name="pickup" type="number" defaultValue={shipping.pickup} />
      </label>
      <label>
        איסוף מהסטודיו (₪)
        <input className="field" name="studio" type="number" defaultValue={shipping.studio} />
      </label>
      <label>
        סף משלוח חינם (₪)
        <input className="field" name="free" type="number" defaultValue={shipping.free} />
      </label>
      <button className="btn" type="submit">
        שמירה
      </button>
    </form>
  );
}
