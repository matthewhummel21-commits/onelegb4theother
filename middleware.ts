import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin/* routes except /admin (login page) and /api/admin/login
  const isAdminProtected =
    pathname.startsWith("/admin/") ||
    (pathname.startsWith("/api/admin/") && !pathname.startsWith("/api/admin/login"));

  if (isAdminProtected) {
    const session = req.cookies.get("admin_session");
    if (!session || session.value !== "1") {
      // For API routes, return 401
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // For page routes, redirect to login
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
