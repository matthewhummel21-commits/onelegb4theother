import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const TIER_LABELS: Record<string, string> = {
  // Current tier IDs (updated May 2026)
  "battle-buddy":      "Battle Buddy ($500/quarter)",
  "squad-leader":      "Squad Leader ($1,000/quarter)",
  "mission-commander": "Mission Commander ($2,000/quarter)",
  // Legacy IDs (kept for safety)
  patch:     "Patch",
  shield:    "Shield",
  standard:  "Standard",
  commander: "Commander",
  patriot:   "Patriot",
};

export async function POST(req: NextRequest) {
  try {
    const { name, business, email, message, tier } = await req.json();

    if (!name || !business || !email || !tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tierLabel = TIER_LABELS[tier] ?? tier;

    await resend.emails.send({
      from: "One Leg B4 the Other <newsletter@onelegb4theother.com>",
      to: ["matthew.hummel21@gmail.com"],
      replyTo: email,
      subject: `New Sponsor Inquiry — ${tierLabel} Tier — ${business}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111;">
          <h2 style="margin:0 0 4px;">New Sponsorship Inquiry</h2>
          <p style="color:#888;margin:0 0 24px;font-size:14px;">Submitted via onelegb4theother.com/advertise</p>

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;width:140px;">Tier</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;">${tierLabel}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;">Name</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;">Business</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;">${business}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            ${message ? `
            <tr>
              <td style="padding:10px 0;font-weight:600;vertical-align:top;">Message</td>
              <td style="padding:10px 0;">${message.replace(/\n/g, "<br>")}</td>
            </tr>
            ` : ""}
          </table>

          <div style="margin-top:28px;padding:16px;background:#fff8f0;border-left:4px solid #B22234;border-radius:4px;">
            <strong>Reply-to is set to ${email}</strong> — hit reply to respond directly to ${name}.
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Advertise inquiry error:", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
