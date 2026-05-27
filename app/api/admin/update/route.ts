import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRequestById, updateRequestStatus } from "@/lib/db";

// ─── Telegram helper ─────────────────────────────────────────────────────────
async function sendTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (err) {
    console.error("Telegram send error:", err);
  }
}

export async function POST(req: NextRequest) {
  // Auth check
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, action, callNotes } = await req.json();

    if (!id || !action) {
      return NextResponse.json({ error: "Missing id or action" }, { status: 400 });
    }

    const row = await getRequestById(Number(id));

    if (!row) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const fullName = `${row.first_name || ""} ${row.last_name || ""}`.trim();
    const type = row.pant_type === "sweatpants" ? "Sweatpants" : "Lee Jeans";
    const size = row.pant_size || (row.waist && row.inseam ? `${row.waist}x${row.inseam}` : "?");
    const fullAddress = [row.address, row.city, row.state, row.zip].filter(Boolean).join(", ");

    let amazonLink: string | null = null;

    switch (action) {
      case "approve": {
        const color = row.pant_color || "";
        const searchQuery = row.pant_type === "sweatpants"
          ? `Hanes mens sweatpants ${size}${color ? " " + color : ""}`
          : `Lee jeans mens ${size}`;
        amazonLink = `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}&ref=olb4other`;

        await updateRequestStatus(Number(id), "approved", {
          amazonLink,
          verifiedBy: "manual",
        });

        await sendTelegram(
          `✅ <b>Request Approved</b> [#${id}]\n` +
          `👤 ${fullName}\n` +
          `👖 ${type} · ${size}\n` +
          `📍 Ship to: ${fullAddress}\n` +
          `🛒 <a href="${amazonLink}">Amazon Search</a>`
        );
        break;
      }

      case "flag_call": {
        await updateRequestStatus(Number(id), "needs_call");
        break;
      }

      case "verify_call": {
        await updateRequestStatus(Number(id), "pending", {
          callNotes: callNotes || null,
          verifiedBy: "call",
        });
        break;
      }

      case "deny": {
        await updateRequestStatus(Number(id), "denied");
        break;
      }

      case "mark_shipped": {
        await updateRequestStatus(Number(id), "shipped", { shippedAt: "now" });
        break;
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, amazonLink });
  } catch (err) {
    console.error("Admin update error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
