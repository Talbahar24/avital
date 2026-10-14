import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "avital_admin";

function secret() {
  return process.env.SESSION_SECRET || "dev-secret";
}

export function adminToken() {
  const password = process.env.ADMIN_PASSWORD || "avital-studio";
  return createHmac("sha256", secret()).update(password).digest("hex");
}

export function isValidAdminToken(token: string) {
  const expected = Buffer.from(adminToken());
  const got = Buffer.from(token);
  return expected.length === got.length && timingSafeEqual(expected, got);
}

export async function isAdmin() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  return Boolean(token && isValidAdminToken(token));
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 14,
  };
}

export { COOKIE as ADMIN_COOKIE };
