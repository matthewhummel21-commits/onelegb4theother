import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { expectedAdminSession } from "@/lib/admin-session";
import { withinRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    if (!withinRateLimit(req, "admin-login", 8, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }

    const { password } = await req.json();
    const sessionValue = await expectedAdminSession();

    if (!password || !sessionValue || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_session", sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
