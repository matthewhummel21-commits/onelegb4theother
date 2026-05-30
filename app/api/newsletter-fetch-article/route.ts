import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  try {
    const res = await fetch(url, {
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

    const domain = new URL(url).hostname.replace('www.', '')

    return NextResponse.json({ title, summary: summary.slice(0, 300), source: domain })
  } catch {
    return NextResponse.json({ error: 'Could not fetch article' }, { status: 500 })
  }
}
