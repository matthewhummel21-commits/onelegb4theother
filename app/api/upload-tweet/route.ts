import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { staffUnauthorized } from '@/lib/staff-auth'
import { withinRateLimit } from '@/lib/rate-limit'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export async function POST(req: NextRequest) {
  const denied = await staffUnauthorized(req, 'NEWSLETTER_STATS_SECRET')
  if (denied) return denied
  if (!withinRateLimit(req, 'upload-tweet', 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  const form = await req.formData()
  const file = form.get('file') as File | null

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (!file.type.startsWith('image/') || file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'Images only, under 5 MB' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const filename = `tweet-${Date.now()}.${ext}`

  try {
    const blob = await put(filename, file, { access: 'public', addRandomSuffix: false })
    return NextResponse.json({ url: blob.url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[upload-tweet]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
