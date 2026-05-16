import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const form = await req.json();

    const {
      firstName, lastName, email, phone,
      address, city, state, zip,
      branch, yearsServed,
      householdSize, annualIncome,
      waist, inseam, pantSize, pantType,
      referredBy, notes,
    } = form;

    const fullName = `${firstName} ${lastName}`;
    const fullAddress = `${address}, ${city}, ${state} ${zip}`;
    const size = pantSize || `${waist}x${inseam}`;
    const type = pantType === "sweatpants" ? "Sweatpants" : "Lee Jeans";

    const recipients = (process.env.NOTIFY_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);

    const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">

  <div style="background: #b22234; padding: 20px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 20px;">🎖️ New Pants Request — One Leg B4 the Other</h1>
  </div>

  <div style="border: 2px solid #b22234; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">

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

    await transporter.sendMail({
      from: `"One Leg B4 the Other" <${process.env.GMAIL_USER}>`,
      to: recipients.join(", "),
      subject: `🎖️ New Pants Request — ${fullName} (${type}, ${size})`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Request API error:", err);
    const message = err instanceof Error ? err.message : "Failed to send";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
