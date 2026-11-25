import { NextRequest, NextResponse } from "next/server";
import { ID_FILE_EXPIRED_NOTE, clearIdFileAfterReview, listUnreviewedIdFiles } from "@/lib/db";
import { deleteStoredIdFile } from "@/lib/id-file-storage";

export const dynamic = "force-dynamic";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.get("authorization") || "";
  const expected = secret ? `Bearer ${secret}` : "";
  if (!secret || header.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < header.length; i++) diff |= header.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = await listUnreviewedIdFiles();
  let expired = 0;
  let failed = 0;

  for (const row of due) {
    try {
      await deleteStoredIdFile(row.id_file_path);
      await clearIdFileAfterReview({
        id: row.id,
        status: "expired",
        reviewedBy: "system",
        documentType: null,
        note: ID_FILE_EXPIRED_NOTE,
      });
      expired += 1;
      console.log(`id-file expired request=${row.id} deleted=true`);
    } catch {
      failed += 1;
      console.error(`id-file expire failed request=${row.id}`);
    }
  }

  return NextResponse.json({ checked: due.length, expired, failed });
}
