import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file') as File | null

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Images only' }, { status: 400 })

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
