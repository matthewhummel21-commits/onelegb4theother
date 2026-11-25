import { NextRequest, NextResponse } from 'next/server'
import { staffUnauthorized } from '@/lib/staff-auth'
import { withinRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const denied = await staffUnauthorized(req, 'NEWSLETTER_SECRET')
  if (denied) return denied
  if (!withinRateLimit(req, 'fetch-article', 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  const { url } = await req.json()
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ error: 'URL required' }, { status: 400 })
  }
  if (parsed.protocol !== 'https:') {
    return NextResponse.json({ error: 'Only https links can be fetched' }, { status: 400 })
  }

  try {
    const res = await fetch(parsed.href, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000),
    })
    const html = await res.text()

    const get = (pattern: RegExp) => pattern.exec(html)?.[1]?.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim() ?? ''

    const title =
      get(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/) ||
      get(/<meta[^>]+content="([^"]+)"[^>]+property="og:title"/) ||
      get(/<title[^>]*>([^<]+)<\/title>/)

    const summary =
      get(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/) ||
      get(/<meta[^>]+content="([^"]+)"[^>]+property="og:description"/) ||
      get(/<meta[^>]+name="description"[^>]+content="([^"]+)"/) ||
      get(/<meta[^>]+content="([^"]+)"[^>]+name="description"/)

    const domain = parsed.hostname.replace('www.', '')

    return NextResponse.json({ title, summary: summary.slice(0, 300), source: domain })
  } catch {
    return NextResponse.json({ error: 'Could not fetch article' }, { status: 500 })
  }
}
