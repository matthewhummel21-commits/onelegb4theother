import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { isAdminSession } from "@/lib/admin-session";
import { getRequestById } from "@/lib/db";

export const dynamic = "force-dynamic";

function isPublicBlobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

function safeFilename(id: number, stored: string): string {
  const ext = stored.split("?")[0].split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  return `veteran-id-${id}.${ext}`;
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminSession(req.cookies.get("admin_session")?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const request = await getRequestById(id);
  const stored = request?.id_file_path?.trim();
  if (!stored) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const access = isPublicBlobUrl(stored) ? "public" : "private";
  const result = await get(stored, { access, useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return NextResponse.json({ error: "File not available" }, { status: 404 });
  }

  const filename = safeFilename(id, result.blob.pathname || stored);
  return new NextResponse(result.stream, {
    status: 200,
    headers: {
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "Content-Length": String(result.blob.size),
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}
