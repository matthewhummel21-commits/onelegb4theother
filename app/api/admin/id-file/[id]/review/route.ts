import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-session";
import { clearIdFileAfterReview, getRequestById } from "@/lib/db";
import { deleteStoredIdFile } from "@/lib/id-file-storage";

export const dynamic = "force-dynamic";

const DECISIONS = new Set(["verified", "rejected"]);
const DOCUMENT_TYPES = new Set(["dd214", "va_id", "other"]);

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminSession(req.cookies.get("admin_session")?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: { decision?: unknown; documentType?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const decision = body.decision;
  const documentType = body.documentType;
  if (typeof decision !== "string" || !DECISIONS.has(decision)) {
    return NextResponse.json({ error: "Choose verified or rejected" }, { status: 400 });
  }
  if (typeof documentType !== "string" || !DOCUMENT_TYPES.has(documentType)) {
    return NextResponse.json({ error: "Choose a document type" }, { status: 400 });
  }

  const request = await getRequestById(id);
  const stored = request?.id_file_path?.trim();
  if (!request || !stored) {
    return NextResponse.json({ error: "No ID file on this request" }, { status: 404 });
  }

  try {
    await deleteStoredIdFile(stored);
    await clearIdFileAfterReview({
      id,
      status: decision as "verified" | "rejected",
      reviewedBy: "admin",
      documentType,
      note: null,
    });
  } catch {
    console.error(`id-file review failed request=${id} decision=${decision} documentType=${documentType}`);
    return NextResponse.json({ error: "Could not delete the file. It was not cleared." }, { status: 500 });
  }

  const reviewedAt = new Date().toISOString();
  console.log(`id-file review request=${id} decision=${decision} documentType=${documentType} by=admin deleted=true`);
  return NextResponse.json({
    ok: true,
    idReviewStatus: decision,
    idReviewedAt: reviewedAt,
    idReviewedBy: "admin",
    idDocumentType: documentType,
  });
}
