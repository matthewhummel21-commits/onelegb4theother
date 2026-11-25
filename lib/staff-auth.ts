import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-session";

function sameText(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Logged-in admin, or a caller that presents the configured shared secret. */
export async function staffUnauthorized(req: NextRequest, secretEnvName: string): Promise<NextResponse | null> {
  if (await isAdminSession(req.cookies.get("admin_session")?.value)) return null;
  const expected = process.env[secretEnvName];
  const presented = req.headers.get("x-secret");
  if (expected && presented && sameText(presented, expected)) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
