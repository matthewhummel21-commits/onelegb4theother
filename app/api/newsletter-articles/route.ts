import { NextRequest, NextResponse } from 'next/server'

const SECRET = process.env.NEWSLETTER_SECRET

interface Article {
  title: string
  source: string
  url: string
  summary: string
}

const SKIP_DOMAINS = [
  'blogger.com', 'globenewswire.com', 'yardbarker.com', 'theadvocate.com',
  'prnewswire.com', 'naturalnews.com', 'freerepublic.com', 'prweb.com',
  'businesswire.com', 'accesswire.com', 'einpresswire.com',
]
const SKIP_TITLE_KEYWORDS = [
  'world cup', 'nfl', 'nba', 'nhl', 'mlb', 'soccer', 'football team',
  'wi-fi', 'airline', 'hot spot', 'pfas', 'insurance must cover',
]
const REQUIRE_TITLE_KEYWORDS = [
  'veteran', 'veterans', 'military', 'va benefit', 'service member', 'armed forces',
]

function isRelevant(title: string, url: string, requireVeteranTitle = false): boolean {
  const lower = title.toLowerCase()
  if (SKIP_DOMAINS.some(d => url.includes(d))) return false
  if (SKIP_TITLE_KEYWORDS.some(k => lower.includes(k))) return false
  if (requireVeteranTitle && !REQUIRE_TITLE_KEYWORDS.some(k => lower.includes(k))) return false
  return true
}

const REPUTABLE_DOMAINS = [
  'militarytimes.com', 'stripes.com', 'military.com', 'navytimes.com',
  'airforcetimes.com', 'armytimes.com', 'marinecorpstimes.com', 'defensenews.com',
  'npr.org', 'apnews.com', 'reuters.com', 'usatoday.com',
  'propublica.org', 'govexec.com',
].join(',')

async function fetchNewsApi(apiKey: string): Promise<Article[]> {
  const queries = [
    'veteran homelessness OR housing OR clothing OR benefits',
    'veteran nonprofit OR assistance OR support',
  ]
  const articles: Article[] = []

  for (const q of queries) {
    if (articles.length >= 3) break
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&domains=${REPUTABLE_DOMAINS}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`
    const res = await fetch(url)
    const data = await res.json()

    for (const a of data.articles ?? []) {
      if (!a.url || a.title === '[Removed]') continue
      if (!a.description || a.description.length < 50) continue
      if (!isRelevant(a.title, a.url)) continue
      if (articles.find(x => x.url === a.url)) continue

      articles.push({
        title: a.title,
        source: a.source?.name ?? 'Unknown',
        url: a.url,
        summary: a.description,
      })
      if (articles.length >= 3) break
    }
  }

  return articles
}

async function fetchGNews(apiKey: string): Promise<Article[]> {
  const queries = [
    '"military veteran" homeless OR clothing OR benefits OR nonprofit',
    '"veteran housing" OR "veteran assistance" OR "VA benefits"',
  ]
  const articles: Article[] = []

  for (const q of queries) {
    if (articles.length >= 3) break
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&max=5&apikey=${apiKey}`
    const res = await fetch(url)
    const data = await res.json()

    for (const a of data.articles ?? []) {
      if (!a.url || !a.description || a.description.length < 50) continue
      if (!isRelevant(a.title, a.url, true)) continue
      if (articles.find(x => x.url === a.url)) continue

      articles.push({
        title: a.title,
        source: a.source?.name ?? 'Unknown',
        url: a.url,
        summary: a.description,
      })
      if (articles.length >= 3) break
    }
  }

  return articles
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-secret')
  if (SECRET && secret !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const newsApiKey = process.env.NEWS_API_KEY
  const gNewsKey = process.env.GNEWS_API_KEY

  if (!newsApiKey && !gNewsKey) {
    return NextResponse.json({ error: 'No news API keys configured' }, { status: 500 })
  }

  // Fetch from both in parallel
  const [newsApiArticles, gNewsArticles] = await Promise.all([
    newsApiKey ? fetchNewsApi(newsApiKey) : Promise.resolve([]),
    gNewsKey ? fetchGNews(gNewsKey) : Promise.resolve([]),
  ])

  // Interleave results for variety, dedupe by URL
  const seen = new Set<string>()
  const merged: Article[] = []

  const max = Math.max(newsApiArticles.length, gNewsArticles.length)
  for (let i = 0; i < max; i++) {
    for (const a of [newsApiArticles[i], gNewsArticles[i]]) {
      if (!a || seen.has(a.url)) continue
      seen.add(a.url)
      merged.push(a)
    }
  }

  return NextResponse.json({ articles: merged.slice(0, 4) })
}
