import { NextRequest, NextResponse } from 'next/server'

const SECRET = proces…CRET

interface Article {
  title: string
  source: string
  url: string
  summary: string
}

const SKIP_DOMAINS = [
  'blogger.com', 'globenewswire.com', 'yardbarker.com', 'prnewswire.com',
  'naturalnews.com', 'freerepublic.com', 'prweb.com', 'businesswire.com',
]
const SKIP_TITLE_KEYWORDS = [
  'world cup', 'nfl', 'nba', 'nhl', 'mlb', 'soccer', 'spelling bee',
  'wi-fi', 'airline', 'quarterback', 'ufc', 'wrestling',
]
const REQUIRE_TITLE_KEYWORDS = [
  'veteran', 'veterans', 'military', 'va benefit', 'service member', 'armed forces',
]

function isRelevant(title: string, url: string, requireKeyword = true): boolean {
  const lower = title.toLowerCase()
  if (SKIP_DOMAINS.some(d => url.includes(d))) return false
  if (SKIP_TITLE_KEYWORDS.some(k => lower.includes(k))) return false
  if (requireKeyword && !REQUIRE_TITLE_KEYWORDS.some(k => lower.includes(k))) return false
  return true
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim()
}

// RSS feeds from veteran-focused publications
const RSS_FEEDS = [
  { url: 'https://www.militarytimes.com/arc/outboundfeeds/rss/', source: 'Military Times' },
  { url: 'https://www.stripes.com/arc/outboundfeeds/rss/', source: 'Stars & Stripes' },
  { url: 'https://www.military.com/rss-feeds/content?type=news', source: 'Military.com' },
  { url: 'https://taskandpurpose.com/feed/', source: 'Task & Purpose' },
]

async function fetchRssArticles(): Promise<Article[]> {
  const articles: Article[] = []

  for (const feed of RSS_FEEDS) {
    if (articles.length >= 4) break
    try {
      const res = await fetch(feed.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(5000) })
      if (!res.ok) continue
      const xml = await res.text()

      // Parse <item> blocks
      const items = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? []
      for (const item of items) {
        if (articles.length >= 4) break

        const title = stripHtml(item.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? '')
        const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim()
          ?? item.match(/<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/)?.[1]?.trim()
          ?? ''
        const desc = stripHtml(
          item.match(/<description[^>]*>([\s\S]*?)<\/description>/)?.[1] ?? ''
        ).slice(0, 280)

        if (!title || !link || desc.length < 30) continue
        if (!isRelevant(title, link, false)) continue // RSS feeds are already on-topic, skip keyword gate
        if (SKIP_TITLE_KEYWORDS.some(k => title.toLowerCase().includes(k))) continue
        if (articles.find(a => a.url === link)) continue

        articles.push({ title, source: feed.source, url: link, summary: desc })
      }
    } catch {
      // Feed failed — move on
    }
  }

  return articles
}

async function fetchNewsApi(apiKey: string, needed: number): Promise<Article[]> {
  const queries = [
    'veterans homelessness OR housing OR clothing OR benefits',
    'military veterans VA benefits OR healthcare OR legislation',
  ]
  const articles: Article[] = []

  for (const q of queries) {
    if (articles.length >= needed) break
    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=***
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
      const data = await res.json()

      for (const a of data.articles ?? []) {
        if (!a.url || a.title === '[Removed]') continue
        if (!a.description || a.description.length < 50) continue
        if (!isRelevant(a.title, a.url, true)) continue
        if (articles.find(x => x.url === a.url)) continue

        articles.push({
          title: a.title,
          source: a.source?.name ?? 'Unknown',
          url: a.url,
          summary: a.description,
        })
        if (articles.length >= needed) break
      }
    } catch {
      // API failed — move on
    }
  }

  return articles
}

async function fetchGNews(apiKey: string, needed: number): Promise<Article[]> {
  const queries = [
    '"military veteran" homeless OR clothing OR benefits OR nonprofit',
    '"veteran housing" OR "veteran assistance" OR "VA benefits"',
  ]
  const articles: Article[] = []

  for (const q of queries) {
    if (articles.length >= needed) break
    try {
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&max=5&apikey=***
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
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
        if (articles.length >= needed) break
      }
    } catch {
      // API failed — move on
    }
  }

  return articles
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-secret')
  if (SECRET && secret !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1. Try RSS first — best quality
  const rssArticles = await fetchRssArticles()

  // 2. If RSS didn't fill 3 slots, top up with APIs
  const needed = Math.max(0, 3 - rssArticles.length)
  const newsApiKey = process.env.NEWS_API_KEY
  const gNewsKey = process.env.GNEWS_API_KEY

  const [newsApiArticles, gNewsArticles] = needed > 0
    ? await Promise.all([
        newsApiKey ? fetchNewsApi(newsApiKey, needed) : Promise.resolve([]),
        gNewsKey ? fetchGNews(gNewsKey, needed) : Promise.resolve([]),
      ])
    : [[], []]

  // Merge: RSS first, then interleave API results
  const seen = new Set(rssArticles.map(a => a.url))
  const merged: Article[] = [...rssArticles]

  const maxApi = Math.max(newsApiArticles.length, gNewsArticles.length)
  for (let i = 0; i < maxApi && merged.length < 4; i++) {
    for (const a of [newsApiArticles[i], gNewsArticles[i]]) {
      if (!a || seen.has(a.url)) continue
      seen.add(a.url)
      merged.push(a)
      if (merged.length >= 4) break
    }
  }

  return NextResponse.json({ articles: merged.slice(0, 4) })
}
