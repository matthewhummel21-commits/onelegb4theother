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

export interface NewsletterSponsor {
  name: string
  logoUrl?: string
  tagline: string
  url: string
  tier?: 'presenting' | 'supporting' | 'community'
}

export interface NewsletterData {
  month: string
  subscribers: number
  totalShipped: number
  requestsThisMonth: number
  fromMateo: string
  storyAngle: string
  articles: NewsletterArticle[]
  events?: NewsletterEvent[]
  veteranSpotlight?: string
  didYouKnow?: string
  behindScenes?: string
  howToHelp?: string[]
  sponsors?: NewsletterSponsor[]
  tweetImageUrl?: string
  tweetLink?: string
  ctaUrl?: string
}

function esc(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')
}

const flagStripe = `
<tr>
  <td style="padding: 4px 0 20px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="height:4px;background:#dc2626;border-radius:2px 2px 0 0;"></td></tr>
      <tr><td style="height:4px;background:#f9fafb;"></td></tr>
      <tr><td style="height:4px;background:#1e3a5f;border-radius:0 0 2px 2px;"></td></tr>
    </table>
  </td>
</tr>`

function badge(label: string, bg: string): string {
  return `<div style="display:inline-block;background:${bg};border-radius:20px;padding:5px 16px;margin-bottom:16px;">
    <span style="font-size:10px;color:#fff;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;font-weight:bold;">${label}</span>
  </div>`
}

export function buildNewsletterHtml(d: NewsletterData): string {
  const logo    = 'https://onelegb4theother.com/logo.png'
  const site    = d.ctaUrl ?? 'https://onelegb4theother.com'
  const shop    = 'https://onelegb4theother.com/shop'
  const donate  = 'https://onelegb4theother.com/#donate'
  const unsub   = 'https://onelegb4theother.com/unsubscribe'
  const heroImg = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=220&fit=crop&q=80'

  const articlesHtml = d.articles.map(a => `
  <tr><td style="padding-bottom:14px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1a1a1a;border-radius:10px;border:1px solid #2a2a2a;overflow:hidden;">
      <tr><td style="height:3px;background:#dc2626;"></td></tr>
      <tr><td style="padding:18px 22px;">
        <div style="display:inline-block;background:#dc262622;border-radius:12px;padding:3px 10px;margin-bottom:8px;">
          <span style="font-size:10px;color:#f87171;font-family:Arial,sans-serif;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">${esc(a.source)}</span>
        </div>
        <p style="margin:0 0 8px 0;font-size:15px;font-weight:bold;color:#f9fafb;font-family:Arial,sans-serif;line-height:1.4;">
          <a href="${esc(a.url)}" style="color:#f9fafb;text-decoration:none;">${esc(a.title)}</a>
        </p>
        <p style="margin:0 0 10px 0;font-size:13px;color:#9ca3af;font-family:Arial,sans-serif;line-height:1.7;">${esc(a.summary)}</p>
        <a href="${esc(a.url)}" style="font-size:12px;color:#ef4444;text-decoration:none;font-family:Arial,sans-serif;font-weight:bold;">Read more &rarr;</a>
      </td></tr>
    </table>
  </td></tr>`).join('')

  const eventsHtml = (d.events ?? []).map(ev => {
    const parts = ev.date.split(',')
    const day = parts[0]?.trim() ?? ''
    const rest = parts.slice(1).join(',').trim()
    return `
  <tr><td style="padding-bottom:12px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1a1a1a;border-radius:10px;border:1px solid #2a2a2a;overflow:hidden;">
      <tr>
        <td width="72" style="background:#1e3a5f;padding:16px 8px;text-align:center;vertical-align:top;">
          <p style="margin:0;font-size:11px;color:#93c5fd;font-family:Arial,sans-serif;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">${esc(day)}</p>
          <p style="margin:4px 0 0 0;font-size:10px;color:#60a5fa;font-family:Arial,sans-serif;">${esc(rest)}</p>
          <div style="width:24px;height:2px;background:#ef4444;margin:8px auto 0;border-radius:1px;"></div>
          <p style="margin:6px 0 0 0;font-size:10px;color:#93c5fd;font-family:Arial,sans-serif;">${esc(ev.location)}</p>
        </td>
        <td style="padding:16px 18px;vertical-align:top;">
          <p style="margin:0 0 6px 0;font-size:15px;font-weight:bold;color:#f9fafb;font-family:Arial,sans-serif;line-height:1.3;">
            <a href="${esc(ev.url)}" style="color:#f9fafb;text-decoration:none;">${esc(ev.title)}</a>
          </p>
          ${ev.description ? `<p style="margin:0 0 8px 0;font-size:12px;color:#9ca3af;font-family:Arial,sans-serif;line-height:1.6;">${esc(ev.description)}</p>` : ''}
          <a href="${esc(ev.url)}" style="font-size:12px;color:#60a5fa;text-decoration:none;font-family:Arial,sans-serif;font-weight:bold;">View event &rarr;</a>
        </td>
      </tr>
    </table>
  </td></tr>`}).join('')

  const sponsorsHtml = (d.sponsors ?? []).map(s => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#1a1500,#2a2000);border-radius:10px;border:1px solid #854d0e;margin-bottom:12px;overflow:hidden;">
    <tr><td style="height:3px;background:linear-gradient(90deg,#b45309,#f59e0b,#b45309);"></td></tr>
    <tr><td style="padding:18px 22px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          ${s.logoUrl ? `<td style="width:52px;vertical-align:middle;padding-right:14px;"><img src="${esc(s.logoUrl)}" alt="${esc(s.name)}" width="44" height="44" style="display:block;border-radius:8px;" /></td>` : ''}
          <td style="vertical-align:middle;">
            <p style="margin:0 0 2px 0;font-size:14px;font-weight:bold;color:#fef3c7;font-family:Arial,sans-serif;">${esc(s.name)}</p>
            <p style="margin:0;font-size:12px;color:#d97706;font-family:Arial,sans-serif;line-height:1.5;">${esc(s.tagline)}</p>
          </td>
          <td style="text-align:right;vertical-align:middle;white-space:nowrap;padding-left:12px;">
            <a href="${esc(s.url)}" style="display:inline-block;font-size:11px;font-weight:bold;color:#1a1000;background:#f59e0b;text-decoration:none;padding:8px 16px;border-radius:6px;font-family:Arial,sans-serif;">Visit &rarr;</a>
          </td>
        </tr>
      </table>
      <p style="margin:8px 0 0 0;font-size:9px;color:#92400e;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:1px;">&#9733; Paid Partner</p>
    </td></tr>
  </table>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>One Leg B4 the Other — ${esc(d.month)}</title>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:Arial,sans-serif;">

<div style="display:none;max-height:0;overflow:hidden;color:#0f0f0f;font-size:1px;">
  ${d.requestsThisMonth} veterans reached in ${esc(d.month)} — mission update inside.
  &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f0f0f;">
<tr><td align="center" style="padding:0 16px 48px 16px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

  <!-- HERO -->
  <tr><td style="padding-bottom:28px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:16px;overflow:hidden;border:1px solid #2a2a2a;">
      <tr><td style="height:6px;background:#dc2626;"></td></tr>
      <tr><td style="height:4px;background:#f9fafb;"></td></tr>
      <tr><td style="height:4px;background:#1e3a5f;"></td></tr>
      <tr><td style="padding:0;line-height:0;">
        <img src="${heroImg}" alt="Veterans" width="600" style="display:block;width:100%;max-width:600px;height:200px;object-fit:cover;" />
      </td></tr>
      <tr><td align="center" style="background:linear-gradient(180deg,#0f0f0f 0%,#1a0505 100%);padding:28px 32px 32px;">
        <img src="${logo}" alt="One Leg B4 the Other" width="64" style="display:block;margin:0 auto 14px;" />
        <p style="margin:0 0 8px;font-size:11px;color:#dc2626;text-transform:uppercase;letter-spacing:3px;font-family:Arial,sans-serif;font-weight:bold;">&#9733; Mission Update &#9733;</p>
        <h1 style="margin:0 0 4px;font-size:36px;font-weight:900;color:#fff;font-family:Arial,sans-serif;letter-spacing:-1px;">${esc(d.month)}</h1>
        <p style="margin:10px 0 0;font-size:11px;color:#6b7280;letter-spacing:1.5px;font-family:Arial,sans-serif;">ONE LEG B4 THE OTHER &bull; VETERAN-LED NONPROFIT</p>
      </td></tr>
      <tr><td style="height:4px;background:#1e3a5f;"></td></tr>
      <tr><td style="height:4px;background:#f9fafb;"></td></tr>
      <tr><td style="height:6px;background:#dc2626;"></td></tr>
    </table>
  </td></tr>

  <!-- STATS -->
  <tr><td style="padding-bottom:24px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="33%" style="padding-right:8px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#1c0404,#2d0808);border-radius:12px;border:1px solid #7f1d1d;">
            <tr><td align="center" style="padding:20px 8px;">
              <p style="margin:0 0 4px;font-size:20px;">&#128072;</p>
              <p style="margin:0;font-size:38px;font-weight:900;color:#ef4444;font-family:Arial,sans-serif;line-height:1;">${d.requestsThisMonth}</p>
              <p style="margin:6px 0 0;font-size:9px;color:#fca5a5;text-transform:uppercase;letter-spacing:1.5px;font-family:Arial,sans-serif;">Veterans<br>This Month</p>
            </td></tr>
          </table>
        </td>
        <td width="33%" style="padding-right:8px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#0c1a2e,#1e3a5f);border-radius:12px;border:1px solid #1e40af;">
            <tr><td align="center" style="padding:20px 8px;">
              <p style="margin:0 0 4px;font-size:20px;">&#128230;</p>
              <p style="margin:0;font-size:38px;font-weight:900;color:#93c5fd;font-family:Arial,sans-serif;line-height:1;">${d.totalShipped}</p>
              <p style="margin:6px 0 0;font-size:9px;color:#93c5fd;text-transform:uppercase;letter-spacing:1.5px;font-family:Arial,sans-serif;">Total<br>Shipped</p>
            </td></tr>
          </table>
        </td>
        <td width="33%">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#1c1400,#2d2000);border-radius:12px;border:1px solid #854d0e;">
            <tr><td align="center" style="padding:20px 8px;">
              <p style="margin:0 0 4px;font-size:20px;">&#9733;</p>
              <p style="margin:0;font-size:38px;font-weight:900;color:#fbbf24;font-family:Arial,sans-serif;line-height:1;">${d.subscribers}</p>
              <p style="margin:6px 0 0;font-size:9px;color:#fcd34d;text-transform:uppercase;letter-spacing:1.5px;font-family:Arial,sans-serif;">Newsletter<br>Subscribers</p>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </td></tr>

  ${flagStripe}

  <!-- FROM THE PRESIDENT -->
  <tr><td style="padding-bottom:20px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;">
      <tr><td style="height:4px;background:linear-gradient(90deg,#dc2626,#ef4444,#dc2626);"></td></tr>
      <tr><td style="padding:28px 30px;">
        ${badge('From the President', '#dc2626')}
        <p style="margin:0 0 20px;font-size:17px;color:#e5e7eb;font-family:Georgia,serif;line-height:1.85;font-style:italic;">&ldquo;${esc(d.fromMateo)}&rdquo;</p>
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-right:12px;vertical-align:middle;">
              <div style="width:38px;height:38px;border-radius:50%;background:#dc2626;text-align:center;line-height:38px;font-size:15px;font-weight:bold;color:#fff;font-family:Arial,sans-serif;">M</div>
            </td>
            <td style="vertical-align:middle;">
              <p style="margin:0;font-size:13px;font-weight:bold;color:#f9fafb;font-family:Arial,sans-serif;">Matthew Hummel</p>
              <p style="margin:2px 0 0;font-size:11px;color:#6b7280;font-family:Arial,sans-serif;">President, One Leg B4 the Other &bull; 20yr USAF Veteran</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </td></tr>

  <!-- IN THE FIELD -->
  <tr><td style="padding-bottom:20px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;">
      <tr><td style="height:4px;background:linear-gradient(90deg,#1e3a5f,#3b82f6,#1e3a5f);"></td></tr>
      <tr><td style="padding:28px 30px;">
        ${badge('&#128205; In the Field', '#1e3a5f')}
        <p style="margin:0;font-size:15px;color:#d1d5db;font-family:Arial,sans-serif;line-height:1.9;">${esc(d.storyAngle)}</p>
      </td></tr>
    </table>
  </td></tr>

  ${d.veteranSpotlight ? `
  ${flagStripe}
  <!-- VETERAN SPOTLIGHT -->
  <tr><td style="padding-bottom:20px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#1a1200,#2d1f00);border-radius:12px;border:1px solid #92400e;overflow:hidden;">
      <tr><td style="height:5px;background:linear-gradient(90deg,#b45309,#f59e0b,#b45309);"></td></tr>
      <tr><td style="padding:32px 36px;">
        ${badge('&#9733; Veteran Spotlight', '#b45309')}
        <p style="margin:0;font-size:64px;color:#f59e0b;font-family:Georgia,serif;line-height:0.5;opacity:0.5;">&ldquo;</p>
        <p style="margin:12px 0 12px;font-size:17px;color:#fef3c7;font-family:Georgia,serif;line-height:1.9;font-style:italic;padding:0 8px;">${esc(d.veteranSpotlight)}</p>
        <p style="margin:0;font-size:64px;color:#f59e0b;font-family:Georgia,serif;line-height:0;opacity:0.5;text-align:right;">&rdquo;</p>
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${d.didYouKnow ? `
  <!-- DID YOU KNOW -->
  <tr><td style="padding-bottom:20px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#0c1a2e,#1e3a5f);border-radius:12px;border:1px solid #2563eb;overflow:hidden;">
      <tr><td style="height:4px;background:linear-gradient(90deg,#1d4ed8,#60a5fa,#1d4ed8);"></td></tr>
      <tr><td style="padding:28px 30px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="width:52px;vertical-align:top;padding-right:16px;">
              <div style="width:48px;height:48px;border-radius:12px;background:#1d4ed8;text-align:center;line-height:48px;font-size:22px;">&#128161;</div>
            </td>
            <td style="vertical-align:middle;">
              ${badge('Did You Know?', '#1d4ed8')}
              <p style="margin:0;font-size:16px;color:#eff6ff;font-family:Arial,sans-serif;line-height:1.7;font-weight:bold;">${esc(d.didYouKnow)}</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${d.behindScenes ? `
  <!-- BEHIND THE SCENES -->
  <tr><td style="padding-bottom:20px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;">
      <tr><td style="padding:24px 28px;">
        ${badge('&#128295; Behind the Scenes', '#374151')}
        <p style="margin:0;font-size:14px;color:#d1d5db;font-family:Arial,sans-serif;line-height:1.8;">${esc(d.behindScenes)}</p>
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${d.howToHelp && d.howToHelp.length > 0 ? `
  <!-- HOW TO HELP -->
  <tr><td style="padding-bottom:20px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;">
      <tr><td style="height:4px;background:linear-gradient(90deg,#dc2626,#ef4444,#dc2626);"></td></tr>
      <tr><td style="padding:24px 28px;">
        ${badge('&#129309; Ways to Help', '#dc2626')}
        ${(d.howToHelp).map((h, i) => `
        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;width:100%;">
          <tr>
            <td style="width:28px;vertical-align:top;padding-right:12px;">
              <div style="width:28px;height:28px;border-radius:50%;background:#dc2626;text-align:center;line-height:28px;font-size:12px;font-weight:bold;color:#fff;font-family:Arial,sans-serif;">${i + 1}</div>
            </td>
            <td style="vertical-align:middle;">
              <p style="margin:0;font-size:14px;color:#d1d5db;font-family:Arial,sans-serif;line-height:1.6;">${esc(h)}</p>
            </td>
          </tr>
        </table>`).join('')}
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${(d.sponsors ?? []).length > 0 ? `
  ${flagStripe}
  <!-- SPONSORS -->
  <tr><td style="padding-bottom:20px;">
    ${badge('&#9733; Our Community Partners', '#854d0e')}
    ${sponsorsHtml}
  </td></tr>` : ''}

  ${flagStripe}

  <!-- WHAT WE'RE READING -->
  <tr><td style="padding-bottom:20px;">
    ${badge('&#128240; What We\'re Reading', '#dc2626')}
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${articlesHtml}
    </table>
  </td></tr>

  ${(d.events ?? []).length > 0 ? `
  <!-- EVENTS -->
  <tr><td style="padding-bottom:20px;">
    ${badge('&#128197; Upcoming Events', '#1e3a5f')}
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${eventsHtml}
    </table>
  </td></tr>` : ''}

  ${d.tweetImageUrl ? `
  <!-- FEATURED POST -->
  ${flagStripe}
  <tr><td style="padding-bottom:20px;">
    ${badge('&#128038; Featured Post', '#1a1a1a')}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;">
      <tr><td style="padding:6px;">
        ${d.tweetLink
          ? `<a href="${esc(d.tweetLink)}" target="_blank" style="display:block;"><img src="${esc(d.tweetImageUrl)}" alt="Featured post" width="100%" style="display:block;border-radius:8px;max-width:100%;" /></a>`
          : `<img src="${esc(d.tweetImageUrl)}" alt="Featured post" width="100%" style="display:block;border-radius:8px;max-width:100%;" />`
        }
      </td></tr>
      ${d.tweetLink ? `<tr><td align="right" style="padding:8px 14px 10px;"><a href="${esc(d.tweetLink)}" style="font-size:11px;color:#6b7280;text-decoration:none;font-family:Arial,sans-serif;">View on X &rarr;</a></td></tr>` : ''}
    </table>
  </td></tr>` : ''}

  <!-- CTA -->
  <tr><td style="padding-bottom:40px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#1c0404,#2d0808);border-radius:16px;border:1px solid #7f1d1d;overflow:hidden;">
      <tr><td style="height:4px;background:linear-gradient(90deg,#1e3a5f,#dc2626,#1e3a5f);"></td></tr>
      <tr><td align="center" style="padding:40px 32px;">
        <p style="margin:0 0 6px;font-size:11px;color:#dc2626;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;">&#9733; &#9733; &#9733;</p>
        <p style="margin:0 0 10px;font-size:26px;font-weight:900;color:#fff;font-family:Arial,sans-serif;letter-spacing:-0.5px;line-height:1.2;">Every dollar moves a veteran forward.</p>
        <p style="margin:0 0 28px;font-size:14px;color:#9ca3af;font-family:Arial,sans-serif;line-height:1.6;">Donate, share, or grab a shirt — it all counts.</p>
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-right:12px;">
              <a href="${donate}" style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;font-size:15px;font-weight:bold;padding:16px 34px;border-radius:8px;font-family:Arial,sans-serif;">Donate Now</a>
            </td>
            <td>
              <a href="${shop}" style="display:inline-block;background:rgba(255,255,255,0.08);color:#f9fafb;text-decoration:none;font-size:15px;font-weight:bold;padding:15px 34px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);font-family:Arial,sans-serif;">Shop</a>
            </td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="height:4px;background:linear-gradient(90deg,#dc2626,#1e3a5f,#dc2626);"></td></tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td align="center" style="padding-top:8px;padding-bottom:40px;border-top:1px solid #1f1f1f;">
    <p style="margin:16px 0 4px;font-size:13px;font-weight:bold;color:#4b5563;font-family:Arial,sans-serif;">One Leg B4 the Other</p>
    <p style="margin:0 0 4px;font-size:11px;color:#374151;font-family:Arial,sans-serif;">230 S Phillips Ave Suite 203 &bull; Sioux Falls, SD 57104</p>
    <p style="margin:0 0 14px;font-size:11px;color:#374151;font-family:Arial,sans-serif;">EIN: 99-3332965 &bull; 501(c)(3) Veteran-Led Nonprofit</p>
    <p style="margin:0;font-size:11px;font-family:Arial,sans-serif;">
      <a href="${site}" style="color:#4b5563;text-decoration:none;">Website</a>
      &nbsp;&bull;&nbsp;
      <a href="${unsub}" style="color:#4b5563;text-decoration:none;">Unsubscribe</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}
