import { NextResponse } from "next/server";
import { isAdmin } from "./auth";

export async function requireAdmin() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }
  return null;
}
