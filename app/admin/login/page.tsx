"use client";

import { FormEvent, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const params = useSearchParams();
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password") || "");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("סיסמה שגויה");
      return;
    }
    const from = params.get("from") || "/admin";
    const next = from.startsWith("/admin") && !from.startsWith("//") ? from : "/admin";
    window.location.assign(next);
  }

  return (
    <form className="form-grid" onSubmit={onSubmit} style={{ maxWidth: 360, margin: "20vh auto", background: "#fff", padding: 24, borderRadius: 16 }}>
      <h1>פאנל הסטודיו</h1>
      <input className="field" type="password" name="password" required placeholder="סיסמה" />
      {error ? <p className="error">{error}</p> : null}
      <button className="btn" type="submit">
        כניסה
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="sheet" style={{ minHeight: "100vh", margin: 0, paddingTop: 24 }}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
