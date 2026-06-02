export function buildWelcomeEmailHtml(firstName?: string): string {
  const name = firstName ? firstName.trim() : null
  const greeting = name ? `Hey ${name},` : 'Hey,'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to the Mission</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <img src="https://onelegb4theother.com/logo.png" alt="One Leg B4 the Other" width="80" style="display:block;" />
            </td>
          </tr>

          <!-- Flag stripe top -->
          <tr>
            <td style="padding-bottom:0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height:4px;background:#b22234;border-radius:2px 2px 0 0;"></td>
                </tr>
                <tr>
                  <td style="height:4px;background:#ffffff;"></td>
                </tr>
                <tr>
                  <td style="height:4px;background:#1a3055;"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#111111;border-radius:0 0 20px 20px;padding:40px 40px 48px;">

              <!-- Greeting -->
              <p style="color:#9ca3af;font-size:13px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 24px;">Welcome to the Mission</p>

              <h1 style="color:#ffffff;font-size:32px;font-weight:900;line-height:1.15;margin:0 0 20px;">
                ${greeting}<br />
                <span style="color:#b22234;">You're in.</span>
              </h1>

              <p style="color:#d1d5db;font-size:16px;line-height:1.7;margin:0 0 16px;">
                You just joined a community that believes veterans deserve more than gratitude — they deserve action.
              </p>

              <p style="color:#d1d5db;font-size:16px;line-height:1.7;margin:0 0 16px;">
                Every month, we'll send you real updates from the field — veterans we've served, events in your area, and honest numbers on where every dollar goes.
              </p>

              <p style="color:#d1d5db;font-size:16px;line-height:1.7;margin:0 0 32px;">
                No fluff. No corporate speak. Just the mission.
              </p>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="height:1px;background:#ffffff10;"></td>
                </tr>
              </table>

              <!-- What to expect -->
              <p style="color:#9ca3af;font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 20px;">What to expect</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                ${[
                  ['🎖️', 'Veteran stories', 'Real people. Real impact. No theater.'],
                  ['📦', 'Delivery updates', 'See where the pants are going and who they reach.'],
                  ['📣', 'Events near you', 'Booths, drives, and ways to show up in your community.'],
                  ['💰', 'Transparent numbers', 'How funds are used — every time, no exceptions.'],
                ].map(([icon, title, desc]) => `
                <tr>
                  <td style="padding:10px 0;vertical-align:top;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="36" style="vertical-align:top;padding-top:2px;font-size:20px;">${icon}</td>
                        <td style="vertical-align:top;">
                          <p style="margin:0;color:#ffffff;font-size:15px;font-weight:700;">${title}</p>
                          <p style="margin:4px 0 0;color:#9ca3af;font-size:14px;line-height:1.5;">${desc}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`).join('')}
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="height:1px;background:#ffffff10;"></td>
                </tr>
              </table>

              <!-- CTA -->
              <p style="color:#d1d5db;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Right now, <strong style="color:#ffffff;">33 veterans</strong> are on our waitlist. $35 covers a pair of jeans — and it goes directly to them.
              </p>

              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#b22234;border-radius:12px;">
                    <a href="https://onelegb4theother.com/#donate" style="display:inline-block;padding:16px 36px;color:#ffffff;font-size:16px;font-weight:900;text-decoration:none;letter-spacing:0.02em;">
                      Help a Veteran Now →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Sign off -->
              <p style="color:#9ca3af;font-size:14px;line-height:1.7;margin:0 0 4px;">With gratitude,</p>
              <p style="color:#ffffff;font-size:15px;font-weight:700;margin:0;">Matthew Hummel</p>
              <p style="color:#6b7280;font-size:13px;margin:4px 0 0;">President · One Leg B4 the Other · U.S. Air Force Veteran, 20 Years</p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0 0;text-align:center;">
              <p style="color:#374151;font-size:12px;margin:0 0 8px;">
                One Leg B4 the Other · 230 S Phillips Ave Suite 203 · Sioux Falls, SD 57104
              </p>
              <p style="color:#374151;font-size:12px;margin:0 0 8px;">
                EIN: 99-3332965 · 501(c)(3) Nonprofit · Veteran-Led
              </p>
              <p style="color:#374151;font-size:12px;margin:0;">
                <a href="https://onelegb4theother.com" style="color:#6b7280;text-decoration:none;">Website</a>
                &nbsp;·&nbsp;
                <a href="https://onelegb4theother.com/#donate" style="color:#6b7280;text-decoration:none;">Donate</a>
                &nbsp;·&nbsp;
                <a href="https://onelegb4theother.com/shop" style="color:#6b7280;text-decoration:none;">Shop</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`
}
