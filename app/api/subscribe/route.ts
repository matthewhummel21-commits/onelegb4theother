import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildWelcomeEmailHtml } from '@/lib/welcome-email'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const audienceId = process.env.RESEND_AUDIENCE_ID!

  try {
    const { email, firstName } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    // Add to audience
    await resend.contacts.create({
      email,
      firstName: firstName || undefined,
      unsubscribed: false,
      audienceId,
    })

    // Send welcome email (best-effort — don't fail signup if this errors)
    try {
      await resend.emails.send({
        from: 'One Leg B4 the Other <newsletter@onelegb4theother.com>',
        to: email,
        subject: "You're in the mission 🎖️",
        html: buildWelcomeEmailHtml(firstName),
      })
    } catch (emailErr) {
      console.error('[subscribe] welcome email failed:', emailErr)
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[subscribe]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
