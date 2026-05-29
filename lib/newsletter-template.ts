export interface NewsletterArticle {
  title: string
  source: string
  url: string
  summary: string
}

export interface NewsletterData {
  month: string            // e.g. "June 2026"
  subscribers: number
  totalShipped: number
  requestsThisMonth: number
  fromMateo: string        // 2-3 sentence personal note
  storyAngle: string       // dignity-first story, no names
  articles: NewsletterArticle[]
  ctaUrl?: string
}

export function buildNewsletterHtml(d: NewsletterData): string {
  const logoUrl = 'https://onelegb4theother.com/brand-final-transparent.png'
  const siteUrl = d.ctaUrl ?? 'https://onelegb4theother.com'
  const shopUrl = 'https://onelegb4theother.com/shop'
  const donateUrl = 'https://onelegb4theother.com/#donate'
  const unsubUrl = 'https://onelegb4theother.com/unsubscribe'

  const articlesHtml = d.articles.map((a, i) => `
    <tr>
      <td style="padding: 0 0 24px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="border-left: 3px solid #dc2626; padding-left: 14px;">
              <p style="margin: 0 0 4px 0; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif;">${escHtml(a.source)}</p>
              <p style="margin: 0 0 6px 0; font-size: 16px; font-weight: bold; color: #f9fafb; font-family: Arial, sans-serif; line-height: 1.4;">
                <a href="${escHtml(a.url)}" style="color: #f9fafb; text-decoration: none;">${escHtml(a.title)}</a>
              </p>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #d1d5db; font-family: Arial, sans-serif; line-height: 1.6;">${escHtml(a.summary)}</p>
              <a href="${escHtml(a.url)}" style="font-size: 12px; color: #dc2626; text-decoration: none; font-family: Arial, sans-serif; font-weight: bold;">Read more →</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>One Leg B4 the Other — ${escHtml(d.month)}</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:Arial,sans-serif;">

  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;color:#0d0d0d;font-size:1px;">
    Mission update for ${escHtml(d.month)} — ${d.requestsThisMonth} veterans reached this month.
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d0d0d;">
    <tr>
      <td align="center" style="padding: 40px 20px 0 20px;">

        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <img src="${logoUrl}" alt="One Leg B4 the Other" width="120" height="auto"
                   style="display:block;margin:0 auto 16px auto;" />
              <p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;">
                Mission Update
              </p>
              <h1 style="margin:8px 0 0 0;font-size:28px;font-weight:900;color:#f9fafb;font-family:Arial,sans-serif;letter-spacing:-0.5px;">
                ${escHtml(d.month)}
              </h1>
              <div style="width:48px;height:3px;background:#dc2626;margin:16px auto 0 auto;"></div>
            </td>
          </tr>

          <!-- Stats bar -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;">
                <tr>
                  <td align="center" style="padding: 24px 16px; border-right: 1px solid #2a2a2a; width:33%;">
                    <p style="margin:0;font-size:32px;font-weight:900;color:#dc2626;font-family:Arial,sans-serif;">${d.requestsThisMonth}</p>
                    <p style="margin:4px 0 0 0;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;font-family:Arial,sans-serif;">This Month</p>
                  </td>
                  <td align="center" style="padding: 24px 16px; border-right: 1px solid #2a2a2a; width:33%;">
                    <p style="margin:0;font-size:32px;font-weight:900;color:#f9fafb;font-family:Arial,sans-serif;">${d.totalShipped}</p>
                    <p style="margin:4px 0 0 0;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;font-family:Arial,sans-serif;">Total Shipped</p>
                  </td>
                  <td align="center" style="padding: 24px 16px; width:33%;">
                    <p style="margin:0;font-size:32px;font-weight:900;color:#f9fafb;font-family:Arial,sans-serif;">${d.subscribers}</p>
                    <p style="margin:4px 0 0 0;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;font-family:Arial,sans-serif;">Subscribers</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- From Mateo -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;">
                <tr>
                  <td style="padding: 28px 28px 24px 28px;">
                    <p style="margin:0 0 14px 0;font-size:11px;color:#dc2626;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;font-weight:bold;">
                      From Mateo
                    </p>
                    <p style="margin:0;font-size:16px;color:#d1d5db;font-family:Georgia,serif;line-height:1.8;font-style:italic;">
                      &ldquo;${escHtml(d.fromMateo)}&rdquo;
                    </p>
                    <p style="margin:16px 0 0 0;font-size:13px;color:#6b7280;font-family:Arial,sans-serif;">
                      — Matthew Hummel, President
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Story angle -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;">
                <tr>
                  <td style="padding: 28px;">
                    <p style="margin:0 0 14px 0;font-size:11px;color:#dc2626;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;font-weight:bold;">
                      In the Field
                    </p>
                    <p style="margin:0;font-size:15px;color:#d1d5db;font-family:Arial,sans-serif;line-height:1.8;">
                      ${escHtml(d.storyAngle)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Articles section -->
          <tr>
            <td style="padding-bottom: 8px;">
              <p style="margin:0 0 20px 0;font-size:11px;color:#dc2626;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;font-weight:bold;">
                What We&apos;re Reading
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${articlesHtml}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-bottom: 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:linear-gradient(135deg,#1a0505,#2a0a0a);border-radius:12px;border:1px solid #7f1d1d;">
                <tr>
                  <td align="center" style="padding: 36px 28px;">
                    <p style="margin:0 0 8px 0;font-size:22px;font-weight:900;color:#f9fafb;font-family:Arial,sans-serif;">
                      Every dollar moves a veteran forward.
                    </p>
                    <p style="margin:0 0 24px 0;font-size:14px;color:#9ca3af;font-family:Arial,sans-serif;">
                      Donate, share, or grab a shirt — it all counts.
                    </p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-right: 12px;">
                          <a href="${donateUrl}"
                             style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:14px 28px;border-radius:8px;font-family:Arial,sans-serif;">
                            Donate Now
                          </a>
                        </td>
                        <td>
                          <a href="${shopUrl}"
                             style="display:inline-block;background:transparent;color:#f9fafb;text-decoration:none;font-size:14px;font-weight:bold;padding:13px 28px;border-radius:8px;border:1px solid #4b5563;font-family:Arial,sans-serif;">
                            Shop
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-bottom: 40px; border-top: 1px solid #1f1f1f; padding-top: 24px;">
              <p style="margin:0 0 8px 0;font-size:12px;color:#4b5563;font-family:Arial,sans-serif;">
                One Leg B4 the Other &bull; 230 S Phillips Ave Suite 203, Sioux Falls SD 57104
              </p>
              <p style="margin:0 0 8px 0;font-size:12px;color:#4b5563;font-family:Arial,sans-serif;">
                EIN: 99-3332965 &bull; 501(c)(3) Veteran-Led Nonprofit
              </p>
              <p style="margin:0;font-size:12px;font-family:Arial,sans-serif;">
                <a href="${siteUrl}" style="color:#6b7280;text-decoration:none;">Website</a>
                &nbsp;&bull;&nbsp;
                <a href="${unsubUrl}" style="color:#6b7280;text-decoration:none;">Unsubscribe</a>
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

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
