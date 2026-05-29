import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getAllRequests } from '@/lib/db'

const resend = new Resend(process.env.RESEND_API_KEY)
const audienceId = process.env.RESEND_AUDIENCE_ID!
const SECRET = process.env.NEWSLETTER_STATS_SECRET

export async function GET(req: NextRequest) {
  // Simple secret-header auth
  const secret = req.headers.get('x-secret')
  if (SECRET && secret !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [contactsRes, requests] = await Promise.all([
    resend.contacts.list({ audienceId }),
    getAllRequests(),
  ])

  const subscribers = (contactsRes.data?.data?.length) ?? 0

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const totalApproved = requests.filter(r => r.status === 'approved' || r.status === 'shipped').length
  const totalShipped  = requests.filter(r => r.status === 'shipped').length
  const thisMonth     = requests.filter(r => new Date(r.created_at) >= monthStart).length
  const pending       = requests.filter(r => r.status === 'pending').length

  // Branch breakdown
  const branches: Record<string, number> = {}
  for (const r of requests) {
    if (r.branch) branches[r.branch] = (branches[r.branch] ?? 0) + 1
  }

  return NextResponse.json({
    subscribers,
    totalApproved,
    totalShipped,
    requestsThisMonth: thisMonth,
    pending,
    branches,
  })
}
