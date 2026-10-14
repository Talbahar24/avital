"use client";

import { FormEvent, useState } from "react";
import { whatsappLink } from "@/lib/format";

export function WorkshopForm() {
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      eventType: String(data.get("event") || ""),
      details: String(data.get("details") || ""),
    };
    if (!payload.name || !payload.phone) {
      setError("חסר שם או טלפון");
      return;
    }
    await fetch("/api/workshop-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = [
      "שלום אביטל, אשמח לתאם סדנה.",
      `שם: ${payload.name}`,
      `טלפון: ${payload.phone}`,
      `סוג האירוע: ${payload.eventType || "לא צוין"}`,
      `תאריך ומיקום: ${payload.details || "לא צוין"}`,
    ].join("\n");
    window.open(whatsappLink(text), "_blank", "noopener");
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <input className="field" name="name" required placeholder="שם מלא" autoComplete="name" />
      <input className="field" name="phone" required type="tel" placeholder="טלפון" autoComplete="tel" />
      <input className="field" name="event" placeholder="סוג האירוע" />
      <input className="field" name="details" placeholder="תאריך ומיקום משוערים" />
      {error ? <p className="error">{error}</p> : null}
      <button className="btn" type="submit">
        שליחת פרטים בוואטסאפ
      </button>
    </form>
  );
}
