import { NextRequest, NextResponse } from 'next/server'

const SECRET = process.env.NEWSLETTER_SECRET

interface Article {
  title: string
  source: string
  url: string
  summary: string
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-secret')
  if (SECRET && secret !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'NEWS_API_KEY not set' }, { status: 500 })
  }

  const queries = [
    'veteran homelessness OR "veteran housing" OR "veteran benefits"',
    'military veteran nonprofit OR "veteran support" OR "veteran assistance"',
    'veteran legislation OR "VA benefits" OR "veteran healthcare"',
  ]

  const articles: Article[] = []

  for (const q of queries) {
    if (articles.length >= 3) break

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`
    const res = await fetch(url)
    const data = await res.json()

    for (const a of data.articles ?? []) {
      const skipDomains = ['blogger.com', 'harvard.edu/gazette', 'globenewswire.com']
      if (!a.url || a.title === '[Removed]' || articles.find(x => x.url === a.url)) continue
      if (skipDomains.some(d => a.url.includes(d))) continue
      if (!a.description || a.description.length < 50) continue

      articles.push({
        title: a.title,
        source: a.source?.name ?? 'Unknown',
        url: a.url,
        summary: a.description ?? a.content?.slice(0, 200) ?? '',
      })

      if (articles.length >= 3) break
    }
  }

  return NextResponse.json({ articles })
}
