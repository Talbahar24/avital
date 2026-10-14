import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieOptions, adminToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  if (password !== (process.env.ADMIN_PASSWORD || "avital-studio")) {
    return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(), adminCookieOptions());
  return res;
}
