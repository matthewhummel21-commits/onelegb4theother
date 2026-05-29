import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildNewsletterHtml, NewsletterData } from '@/lib/newsletter-template'

const SECRET = process.env.NEWSLETTER_STATS_SECRET

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const audienceId = process.env.RESEND_AUDIENCE_ID!

  const secret = req.headers.get('x-secret')
  if (SECRET && secret !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let data: NewsletterData
  try {
    data = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const html = buildNewsletterHtml(data)
  const subject = `🪖 ${data.month} — ${data.requestsThisMonth} veterans reached this month`

  try {
    // Create broadcast
    const broadcast = await resend.broadcasts.create({
      audienceId,
      from: 'One Leg B4 the Other <newsletter@onelegb4theother.com>',
      subject,
      html,
      name: `Newsletter ${data.month}`,
    })

    if (!broadcast.data?.id) {
      throw new Error('No broadcast ID returned')
    }

    // Send it
    await resend.broadcasts.send(broadcast.data.id, {
      scheduledAt: 'now',
    })

    return NextResponse.json({ ok: true, broadcastId: broadcast.data.id })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[newsletter-send]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
