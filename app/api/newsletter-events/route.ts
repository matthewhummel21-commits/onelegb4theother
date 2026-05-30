import { NextRequest, NextResponse } from 'next/server'

const SECRET = process.env.NEWSLETTER_SECRET

interface VeteranEvent {
  title: string
  date: string
  location: string
  url: string
  description: string
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-secret')
  if (SECRET && secret !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.EVENTBRITE_TOKEN
  if (!token) return NextResponse.json({ error: 'EVENTBRITE_TOKEN not set' }, { status: 500 })

  const events: VeteranEvent[] = []

  const searches = [
    // Midwest fun events
    { q: 'veteran run walk ride fundraiser', location: 'Sioux Falls, SD', within: '300mi' },
    { q: 'military appreciation festival concert', location: 'Sioux Falls, SD', within: '300mi' },
    // National fun events
    { q: 'veteran charity golf tournament 5k', location: 'United States', within: '2000mi' },
    { q: 'military appreciation festival expo', location: 'United States', within: '2000mi' },
  ]

  for (const s of searches) {
    if (events.length >= 6) break
    try {
      const params = new URLSearchParams({
        q: s.q,
        'location.address': s.location,
        'location.within': s.within,
        'start_date.range_start': new Date().toISOString().slice(0, 19) + 'Z',
        sort_by: 'date',
        expand: 'venue',
        page_size: '10',
        token,
      })

      const res = await fetch(`https://www.eventbriteapi.com/v3/events/search/?${params}`, {
        signal: AbortSignal.timeout(8000),
      })
      const data = await res.json()

      for (const e of data.events ?? []) {
        if (events.length >= 6) break
        if (events.find(x => x.url === e.url)) continue

        const venue = e.venue
        const city = venue?.address?.city ?? ''
        const state = venue?.address?.region ?? ''
        const location = e.online_event ? 'Online' : [city, state].filter(Boolean).join(', ') || 'TBD'

        const start = e.start?.local
        const date = start
          ? new Date(start).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
          : 'Date TBD'

        const description = (e.description?.text ?? e.summary ?? '').slice(0, 200)

        events.push({
          title: e.name?.text ?? 'Untitled Event',
          date,
          location,
          url: e.url,
          description,
        })
      }
    } catch (err) {
      console.error('[newsletter-events]', err)
    }
  }

  return NextResponse.json({ events })
}
