export interface NewsletterArticle {
  title: string
  source: string
  url: string
  summary: string
}

export interface NewsletterEvent {
  title: string
  date: string
  location: string
  url: string
  description: string
}

export interface NewsletterData {
  month: string            // e.g. "June 2026"
  subscribers: number
  totalShipped: number
  requestsThisMonth: number
  fromMateo: string        // 2-3 sentence personal note
  storyAngle: string       // dignity-first story, no names
  articles: NewsletterArticle[]
  events?: NewsletterEvent[]   // upcoming military/veteran events
  tweetImageUrl?: string   // screenshot of featured X post
  tweetLink?: string       // optional link to original tweet
  ctaUrl?: string
}

export function buildNewsletterHtml(d: NewsletterData): string {
  const logoUrl = 'https://onelegb4theother.com/logo.png'
  const siteUrl = d.ctaUrl ?? 'https://onelegb4theother.com'
  const shopUrl = 'https://onelegb4theother.com/shop'
  const donateUrl = 'https://onelegb4theother.com/#donate'
  const unsubUrl = 'https://onelegb4theother.com/unsubscribe'

  const articlesHtml = d.articles.map((a) => `
    <tr>
      <td style="padding: 0 0 16px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
               style="background:#161616;border-radius:10px;border:1px solid #2a2a2a;">
          <tr>
            <td style="padding: 20px 22px;">
              <p style="margin: 0 0 6px 0; font-size: 10px; color: #dc2626; text-transform: uppercase; letter-spacing: 1.5px; font-family: Arial, sans-serif; font-weight: bold;">${escHtml(a.source)}</p>
              <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: bold; color: #f9fafb; font-family: Arial, sans-serif; line-height: 1.4;">
                <a href="${escHtml(a.url)}" style="color: #f9fafb; text-decoration: none;">${escHtml(a.title)}</a>
              </p>
              <p style="margin: 0 0 12px 0; font-size: 13px; color: #9ca3af; font-family: Arial, sans-serif; line-height: 1.7;">${escHtml(a.summary)}</p>
              <a href="${escHtml(a.url)}" style="font-size: 12px; color: #dc2626; text-decoration: none; font-family: Arial, sans-serif; font-weight: bold; letter-spacing: 0.3px;">Read more &rarr;</a>
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
<body style="margin:0;padding:0;background-color:#111111;font-family:Arial,sans-serif;">

  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;color:#111111;font-size:1px;">
    ${d.requestsThisMonth} veterans reached in ${escHtml(d.month)} — mission update inside.
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#111111;">
    <tr>
      <td align="center" style="padding: 48px 20px 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- HERO HEADER -->
          <tr>
            <td style="padding-bottom: 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:linear-gradient(160deg,#1c0404 0%,#2d0808 50%,#1a1a1a 100%);border-radius:16px;border:1px solid #3d1010;overflow:hidden;">
                <tr>
                  <td align="center" style="padding: 44px 36px 40px 36px;">
                    <img src="${logoUrl}" alt="One Leg B4 the Other" width="80" height="auto"
                         style="display:block;margin:0 auto 20px auto;opacity:0.95;" />
                    <p style="margin:0 0 6px 0;font-size:11px;color:#dc2626;text-transform:uppercase;letter-spacing:3px;font-family:Arial,sans-serif;font-weight:bold;">Mission Update</p>
                    <h1 style="margin:0 0 6px 0;font-size:34px;font-weight:900;color:#ffffff;font-family:Arial,sans-serif;letter-spacing:-1px;line-height:1.1;">${escHtml(d.month)}</h1>
                    <p style="margin:16px 0 0 0;font-size:13px;color:#9ca3af;font-family:Arial,sans-serif;letter-spacing:0.3px;">One Leg B4 the Other &bull; Veteran-Led Nonprofit</p>
                  </td>
                </tr>
                <!-- Red accent bar -->
                <tr>
                  <td style="height:4px;background:linear-gradient(90deg,#dc2626,#ef4444,#dc2626);"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- STATS -->
          <tr>
            <td style="padding-bottom: 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="33%" style="padding-right: 8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"
                           style="background:#161616;border-radius:12px;border:1px solid #2a2a2a;">
                      <tr>
                        <td align="center" style="padding: 22px 12px;">
                          <p style="margin:0 0 2px 0;font-size:36px;font-weight:900;color:#dc2626;font-family:Arial,sans-serif;line-height:1;">${d.requestsThisMonth}</p>
                          <p style="margin:6px 0 0 0;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1.5px;font-family:Arial,sans-serif;">This Month</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="33%" style="padding-right: 8px; padding-left: 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"
                           style="background:#161616;border-radius:12px;border:1px solid #2a2a2a;">
                      <tr>
                        <td align="center" style="padding: 22px 12px;">
                          <p style="margin:0 0 2px 0;font-size:36px;font-weight:900;color:#f9fafb;font-family:Arial,sans-serif;line-height:1;">${d.totalShipped}</p>
                          <p style="margin:6px 0 0 0;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1.5px;font-family:Arial,sans-serif;">Total Shipped</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="33%">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"
                           style="background:#161616;border-radius:12px;border:1px solid #2a2a2a;">
                      <tr>
                        <td align="center" style="padding: 22px 12px;">
                          <p style="margin:0 0 2px 0;font-size:36px;font-weight:900;color:#f9fafb;font-family:Arial,sans-serif;line-height:1;">${d.subscribers}</p>
                          <p style="margin:6px 0 0 0;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1.5px;font-family:Arial,sans-serif;">Subscribers</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FROM MATEO -->
          <tr>
            <td style="padding-bottom: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#161616;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;">
                <tr>
                  <td style="height:3px;background:#dc2626;"></td>
                </tr>
                <tr>
                  <td style="padding: 28px 30px 26px 30px;">
                    <p style="margin:0 0 16px 0;font-size:10px;color:#dc2626;text-transform:uppercase;letter-spacing:2.5px;font-family:Arial,sans-serif;font-weight:bold;">From the President</p>
                    <p style="margin:0 0 18px 0;font-size:17px;color:#e5e7eb;font-family:Georgia,serif;line-height:1.85;font-style:italic;">
                      &ldquo;${escHtml(d.fromMateo)}&rdquo;
                    </p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-right: 12px; vertical-align: middle;">
                          <div style="width:36px;height:36px;border-radius:50%;background:#dc2626;text-align:center;line-height:36px;font-size:14px;font-weight:bold;color:#fff;font-family:Arial,sans-serif;">M</div>
                        </td>
                        <td style="vertical-align: middle;">
                          <p style="margin:0;font-size:13px;font-weight:bold;color:#f9fafb;font-family:Arial,sans-serif;">Matthew Hummel</p>
                          <p style="margin:2px 0 0 0;font-size:12px;color:#6b7280;font-family:Arial,sans-serif;">President, One Leg B4 the Other</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- IN THE FIELD -->
          <tr>
            <td style="padding-bottom: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#161616;border-radius:12px;border:1px solid #2a2a2a;">
                <tr>
                  <td style="padding: 28px 30px;">
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;">
                      <tr>
                        <td style="padding-right:10px;vertical-align:middle;">
                          <div style="width:3px;height:22px;background:#dc2626;border-radius:2px;"></div>
                        </td>
                        <td style="vertical-align:middle;">
                          <p style="margin:0;font-size:10px;color:#dc2626;text-transform:uppercase;letter-spacing:2.5px;font-family:Arial,sans-serif;font-weight:bold;">In the Field</p>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0;font-size:15px;color:#d1d5db;font-family:Arial,sans-serif;line-height:1.85;">
                      ${escHtml(d.storyAngle)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- WHAT WE'RE READING -->
          <tr>
            <td style="padding-bottom: 8px;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                <tr>
                  <td style="padding-right:10px;vertical-align:middle;">
                    <div style="width:3px;height:22px;background:#dc2626;border-radius:2px;"></div>
                  </td>
                  <td style="vertical-align:middle;">
                    <p style="margin:0;font-size:10px;color:#dc2626;text-transform:uppercase;letter-spacing:2.5px;font-family:Arial,sans-serif;font-weight:bold;">What We&apos;re Reading</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${articlesHtml}
              </table>
            </td>
          </tr>

          <!-- EVENTS -->
          ${d.events && d.events.length > 0 ? `
          <tr>
            <td style="padding-bottom: 28px;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                <tr>
                  <td style="padding-right:10px;vertical-align:middle;">
                    <div style="width:3px;height:22px;background:#dc2626;border-radius:2px;"></div>
                  </td>
                  <td style="vertical-align:middle;">
                    <p style="margin:0;font-size:10px;color:#dc2626;text-transform:uppercase;letter-spacing:2.5px;font-family:Arial,sans-serif;font-weight:bold;">Upcoming Events</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${d.events.map(ev => `
                <tr>
                  <td style="padding-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"
                           style="background:#161616;border-radius:10px;border:1px solid #2a2a2a;">
                      <tr>
                        <td style="padding:18px 20px;">
                          <p style="margin:0 0 4px 0;font-size:11px;color:#dc2626;font-family:Arial,sans-serif;font-weight:bold;">${escHtml(ev.date)} &bull; ${escHtml(ev.location)}</p>
                          <p style="margin:0 0 6px 0;font-size:15px;font-weight:bold;color:#f9fafb;font-family:Arial,sans-serif;line-height:1.3;">
                            <a href="${escHtml(ev.url)}" style="color:#f9fafb;text-decoration:none;">${escHtml(ev.title)}</a>
                          </p>
                          ${ev.description ? `<p style="margin:0 0 8px 0;font-size:13px;color:#9ca3af;font-family:Arial,sans-serif;line-height:1.6;">${escHtml(ev.description)}</p>` : ''}
                          <a href="${escHtml(ev.url)}" style="font-size:12px;color:#dc2626;text-decoration:none;font-family:Arial,sans-serif;font-weight:bold;">View event &rarr;</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`).join('')}
              </table>
            </td>
          </tr>` : ''}

          <!-- FEATURED X POST -->
          ${d.tweetImageUrl ? `
          <tr>
            <td style="padding-bottom: 28px;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                <tr>
                  <td style="padding-right:10px;vertical-align:middle;">
                    <div style="width:3px;height:22px;background:#dc2626;border-radius:2px;"></div>
                  </td>
                  <td style="vertical-align:middle;">
                    <p style="margin:0;font-size:10px;color:#dc2626;text-transform:uppercase;letter-spacing:2.5px;font-family:Arial,sans-serif;font-weight:bold;">Featured Post</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#161616;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;">
                <tr>
                  <td style="padding: 6px;">
                    ${d.tweetLink
                      ? `<a href="${escHtml(d.tweetLink)}" target="_blank" style="display:block;"><img src="${escHtml(d.tweetImageUrl)}" alt="Featured post from X" width="100%" style="display:block;border-radius:8px;max-width:100%;" /></a>`
                      : `<img src="${escHtml(d.tweetImageUrl)}" alt="Featured post from X" width="100%" style="display:block;border-radius:8px;max-width:100%;" />`
                    }
                  </td>
                </tr>
                ${d.tweetLink ? `
                <tr>
                  <td align="right" style="padding: 8px 14px 10px 14px;">
                    <a href="${escHtml(d.tweetLink)}" style="font-size:11px;color:#6b7280;text-decoration:none;font-family:Arial,sans-serif;">View on X →</a>
                  </td>
                </tr>` : ''}
              </table>
            </td>
          </tr>` : ''}

          <!-- CTA -->
          <tr>
            <td style="padding-bottom: 40px; padding-top: 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:linear-gradient(135deg,#1c0404,#2d0808);border-radius:14px;border:1px solid #7f1d1d;overflow:hidden;">
                <tr>
                  <td align="center" style="padding: 40px 32px;">
                    <p style="margin:0 0 10px 0;font-size:24px;font-weight:900;color:#ffffff;font-family:Arial,sans-serif;letter-spacing:-0.5px;line-height:1.2;">
                      Every dollar moves a veteran forward.
                    </p>
                    <p style="margin:0 0 28px 0;font-size:14px;color:#9ca3af;font-family:Arial,sans-serif;line-height:1.6;">
                      Donate, share, or grab a shirt from the shop — it all counts.
                    </p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-right: 12px;">
                          <a href="${donateUrl}"
                             style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:15px 32px;border-radius:8px;font-family:Arial,sans-serif;letter-spacing:0.3px;">
                            Donate Now
                          </a>
                        </td>
                        <td>
                          <a href="${shopUrl}"
                             style="display:inline-block;background:rgba(255,255,255,0.07);color:#f9fafb;text-decoration:none;font-size:14px;font-weight:bold;padding:14px 32px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);font-family:Arial,sans-serif;letter-spacing:0.3px;">
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

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding-top: 8px; padding-bottom: 48px; border-top: 1px solid #1f1f1f;">
              <p style="margin:16px 0 6px 0;font-size:13px;font-weight:bold;color:#4b5563;font-family:Arial,sans-serif;">One Leg B4 the Other</p>
              <p style="margin:0 0 6px 0;font-size:11px;color:#374151;font-family:Arial,sans-serif;">
                230 S Phillips Ave Suite 203 &bull; Sioux Falls, SD 57104
              </p>
              <p style="margin:0 0 14px 0;font-size:11px;color:#374151;font-family:Arial,sans-serif;">
                EIN: 99-3332965 &bull; 501(c)(3) Veteran-Led Nonprofit
              </p>
              <p style="margin:0;font-size:11px;font-family:Arial,sans-serif;">
                <a href="${siteUrl}" style="color:#4b5563;text-decoration:none;">Website</a>
                &nbsp;&nbsp;&bull;&nbsp;&nbsp;
                <a href="${unsubUrl}" style="color:#4b5563;text-decoration:none;">Unsubscribe</a>
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
