import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lower = pathname.toLowerCase();
  if (lower.startsWith("/admin") && pathname !== lower) {
    const url = request.nextUrl.clone();
    url.pathname = lower;
    return NextResponse.redirect(url);
  }
  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }
  if (request.cookies.get("avital_admin")?.value) return NextResponse.next();
  const login = new URL("/admin/login", request.url);
  login.searchParams.set("from", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/ADMIN/:path*", "/Admin/:path*"],
};
