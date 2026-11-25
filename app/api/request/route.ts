import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { put } from "@vercel/blob";
import { initDb, insertRequest } from "@/lib/db";
import { withinRateLimit } from "@/lib/rate-limit";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

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

function buildEmailHtml(fields: Record<string, string>) {
  const {
    fullName, fullAddress, type, size,
    email, phone, branch, yearsServed,
    householdSize, annualIncome, referredBy, notes,
    idUploaded,
  } = fields;

  return `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">

  <div style="background: #b22234; padding: 20px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 20px;">🎖️ New Pants Request — One Leg B4 the Other</h1>
  </div>

  <div style="border: 2px solid #b22234; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">

    ${idUploaded === "true"
      ? `<div style="background: #e8f5e9; border: 1px solid #4caf50; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-size: 13px;">
          ✅ <strong>ID/DD-214 uploaded</strong> — ready for review
         </div>`
      : `<div style="background: #fff3e0; border: 1px solid #ff9800; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-size: 13px;">
          📞 <strong>Needs call verification</strong> — no ID uploaded
         </div>`
    }

    <h2 style="color: #b22234; font-size: 16px; margin-top: 0;">📦 Amazon Order Summary</h2>
    <table style="width: 100%; border-collapse: collapse; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
      <tr style="background: #111; color: white;">
        <th style="padding: 10px 14px; text-align: left;">Field</th>
        <th style="padding: 10px 14px; text-align: left;">Value</th>
      </tr>
      <tr>
        <td style="padding: 10px 14px; font-weight: bold; border-bottom: 1px solid #eee;">Ship To</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #eee;">${fullName}</td>
      </tr>
      <tr style="background: white;">
        <td style="padding: 10px 14px; font-weight: bold; border-bottom: 1px solid #eee;">Address</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #eee;">${fullAddress}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; font-weight: bold; border-bottom: 1px solid #eee;">Item Type</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #eee;"><strong>${type}</strong></td>
      </tr>
      <tr style="background: white;">
        <td style="padding: 10px 14px; font-weight: bold; border-bottom: 1px solid #eee;">Size</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #eee;"><strong>${size}</strong></td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; font-weight: bold;">Qty</td>
        <td style="padding: 10px 14px;">1</td>
      </tr>
    </table>

    <br/>

    <h2 style="color: #b22234; font-size: 16px;">👤 Veteran Info</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 6px 0; width: 140px; font-weight: bold; color: #555;">Name</td><td>${fullName}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Email</td><td>${email}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Phone</td><td>${phone}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Branch</td><td>${branch}${yearsServed ? ` · ${yearsServed}` : ""}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Household</td><td>${householdSize} people · ${annualIncome}/yr</td></tr>
      ${referredBy ? `<tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Referred By</td><td>${referredBy}</td></tr>` : ""}
      ${notes ? `<tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Notes</td><td>${notes}</td></tr>` : ""}
    </table>

    <br/>
    <div style="background: #fff8e1; border: 1px solid #ffd54f; border-radius: 8px; padding: 14px; font-size: 13px;">
      <strong>⚡ Quick Action:</strong> Go to Amazon Business → search "<strong>${type === "Sweatpants" ? "mens sweatpants" : "Lee jeans mens"} ${size}</strong>" → ship to <strong>${fullAddress}</strong>
    </div>

  </div>

  <p style="color: #999; font-size: 11px; text-align: center; margin-top: 16px;">
    One Leg B4 the Other · 230 S Phillips Ave · Sioux Falls, SD 57104
  </p>
</body>
</html>
  `;
}

const MAX_ID_BYTES = 8 * 1024 * 1024;
const ID_EXTENSIONS = new Set(["pdf", "jpg", "jpeg", "png"]);

function clip(value: string | undefined, max: number): string {
  return (value || "").slice(0, max);
}

export async function POST(req: NextRequest) {
  try {
    if (!withinRateLimit(req, "pants-request", 5, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    // Ensure DB table exists
    await initDb();

    const contentType = req.headers.get("content-type") || "";
    const isMultipart = contentType.includes("multipart/form-data");

    // ── Parse form data (supports both multipart and JSON) ───────────────────
    let fields: Record<string, string> = {};
    let idFile: File | null = null;

    if (isMultipart) {
      const formData = await req.formData();
      for (const [key, value] of formData.entries()) {
        if (key === "idFile" && value instanceof File && value.size > 0) {
          idFile = value;
        } else if (typeof value === "string") {
          fields[key] = value;
        }
      }
    } else {
      fields = await req.json();
    }

    const {
      firstName, lastName, email, phone,
      address, city, state, zip,
      branch, yearsServed,
      householdSize, annualIncome,
      waist, inseam, pantSize, pantType, pantFit, pantColor, pantBrand, wantsFollowUpCall,
      referredBy, notes,
    } = fields;

    const fullName = `${firstName || ""} ${lastName || ""}`.trim();
    const fullAddress = `${address || ""}, ${city || ""}, ${state || ""} ${zip || ""}`.trim();
    const size = pantSize || (waist && inseam ? `${waist}x${inseam}` : "?");
    const type = pantType === "sweatpants" ? "Sweatpants" : "Lee Jeans";
    const resolvedBrand = pantType === "sweatpants" ? "Hanes" : (pantBrand || "Lee");

    // ── Upload ID to Vercel Blob (if provided) ───────────────────────────────
    let idFilePath: string | null = null;
    let idUploaded = false;

    if (idFile) {
      const ext = idFile.name.split(".").pop()?.toLowerCase() || "";
      if (!ID_EXTENSIONS.has(ext) || idFile.size > MAX_ID_BYTES) {
        return NextResponse.json(
          { error: "ID file must be a PDF, JPG, or PNG under 8 MB." },
          { status: 400 }
        );
      }
      try {
        const blobName = `vet-ids/${Date.now()}-${firstName || "unknown"}-${lastName || "unknown"}.${ext}`;
        const blob = await put(blobName, idFile, { access: "public" });
        idFilePath = blob.url;
        idUploaded = true;
        console.log(`Uploaded ID to Vercel Blob: ${idFilePath}`);
      } catch (blobErr) {
        console.error("Vercel Blob upload error:", blobErr);
        // Continue without file — degrade gracefully
      }
    }

    // Referral bypass — if Matt referred them personally, skip verification
    const mattReferral = /\bmatt(hew)?\b/i.test(referredBy || "");
    const status = (idUploaded || mattReferral) ? "pending" : "needs_call";
    const verifiedBy = mattReferral ? "referral" : idUploaded ? undefined : undefined;

    // ── Save to Neon Postgres ────────────────────────────────────────────────
    const requestId = await insertRequest({
      status,
      firstName: clip(firstName, 80) || null,
      lastName: clip(lastName, 80) || null,
      email: clip(email, 160) || null,
      phone: clip(phone, 40) || null,
      address: clip(address, 200) || null,
      city: clip(city, 80) || null,
      state: clip(state, 40) || null,
      zip: clip(zip, 12) || null,
      branch: clip(branch, 40) || null,
      yearsServed: clip(yearsServed, 40) || null,
      householdSize: clip(householdSize, 20) || null,
      annualIncome: clip(annualIncome, 40) || null,
      pantType: pantType || null,
      pantFit: pantFit || null,
      pantColor: pantColor || null,
      pantBrand: pantBrand || null,
      wantsFollowUpCall: wantsFollowUpCall === 'true' || wantsFollowUpCall === 'on' || wantsFollowUpCall === '1',
      pantSize: pantSize || null,
      waist: waist || null,
      inseam: inseam || null,
      referredBy: referredBy || null,
      notes: clip(notes, 2000) || null,
      idUploaded,
      idFilePath,
      verifiedBy: verifiedBy || null,
    });

    // ── Send email notification ──────────────────────────────────────────────
    const recipients = (process.env.NOTIFY_EMAILS || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    const html = buildEmailHtml({
      fullName, fullAddress, type, size,
      email: email || "",
      phone: phone || "",
      branch: branch || "",
      yearsServed: yearsServed || "",
      householdSize: householdSize || "",
      annualIncome: annualIncome || "",
      referredBy: referredBy || "",
      notes: notes || "",
      idUploaded: String(idUploaded),
    });

    if (recipients.length > 0) {
      await transporter.sendMail({
        from: `"One Leg B4 the Other" <${process.env.GMAIL_USER}>`,
        to: recipients.join(", "),
        subject: `🎖️ New Pants Request — ${fullName} (${type}, ${size})${mattReferral ? " 🤝 Matt Referral" : idUploaded ? " ✅ ID Uploaded" : " 📞 Needs Call"}`,
        html,
      });
    }

    // ── Send Telegram notification ───────────────────────────────────────────
    const telegramMsg = mattReferral
      ? `🎖️ <b>New Pants Request</b> [#${requestId}]\n` +
        `👤 ${fullName} · ${branch || "?"}\n` +
        `📍 ${fullAddress}\n` +
        `👖 ${type} · ${size}\n` +
        `🤝 Referred by Matt — pre-verified, ready to approve\n` +
        `🔗 <a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/admin/dashboard">Open Admin</a>`
      : idUploaded
      ? `🎖️ <b>New Pants Request</b> [#${requestId}]\n` +
        `👤 ${fullName} · ${branch || "?"}\n` +
        `📍 ${fullAddress}\n` +
        `👖 ${type} · ${size}\n` +
        `✅ ID uploaded — ready to review\n` +
        `🔗 <a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/admin/dashboard">Open Admin</a>`
      : `🎖️ <b>New Pants Request</b> [#${requestId}]\n` +
        `👤 ${fullName} · ${branch || "?"}\n` +
        `📍 ${fullAddress}\n` +
        `👖 ${type} · ${size}\n` +
        `📞 Needs call: ${phone || "no phone"}\n` +
        `🔗 <a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/admin/dashboard">Open Admin</a>`;

    await sendTelegram(telegramMsg);

    return NextResponse.json({ success: true, requestId });
  } catch (err) {
    console.error("Request API error:", err);
    const message = err instanceof Error ? err.message : "Failed to send";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
