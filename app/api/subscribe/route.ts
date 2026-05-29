import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const audienceId = process.env.RESEND_AUDIENCE_ID!
  try {
    const { email, firstName } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    await resend.contacts.create({
      email,
      firstName: firstName || undefined,
      unsubscribed: false,
      audienceId,
    })

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[subscribe]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
