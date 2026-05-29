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
    'veterans support nonprofit',
    'military veterans homeless clothing',
    'veteran benefits legislation',
  ]

  const articles: Article[] = []

  for (const q of queries) {
    if (articles.length >= 3) break

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`
    const res = await fetch(url)
    const data = await res.json()

    for (const a of data.articles ?? []) {
      if (!a.url || a.title === '[Removed]' || articles.find(x => x.url === a.url)) continue

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
