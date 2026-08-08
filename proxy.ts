import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (pathname.startsWith("/admin")) {
    const adminSession = request.cookies.get(
      "admin_session"
    )?.value;

    // Not authenticated → Admin Login
    if (adminSession !== "authenticated") {
      const loginUrl = new URL(
        "/admin-login",
        request.url
      );

      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};