import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import EnterpriseClient from '@/models/EnterpriseClient'
import { getUserFromRequest } from '@/lib/auth'

// POST: create an enterprise client (admin only or via sales flow)
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { organizationName, slug, contactName, contactEmail, country, plan } = body

    if (!organizationName || !slug || !contactEmail) {
      return NextResponse.json({ error: 'organizationName, slug, and contactEmail are required' }, { status: 400 })
    }

    const existing = await EnterpriseClient.findOne({ slug })
    if (existing) return NextResponse.json({ error: 'Slug already taken' }, { status: 409 })

    const planSeats = { starter: 50, growth: 500, enterprise: 10000 }
    const planFees  = { starter: 3000, growth: 12000, enterprise: 50000 }
    const p = (plan || 'starter') as 'starter' | 'growth' | 'enterprise'

    const client = await EnterpriseClient.create({
      organizationName: organizationName.trim(),
      slug: slug.toLowerCase().trim(),
      contactName: contactName || '',
      contactEmail: contactEmail.toLowerCase(),
      country: country || '',
      plan: p,
      seatLimit: planSeats[p],
      annualFeeUSD: planFees[p],
      adminUsers: [user.userId],
    })

    return NextResponse.json({ data: client }, { status: 201 })
  } catch (err) {
    console.error('[enterprise POST]', err)
    return NextResponse.json({ error: 'Failed to create enterprise client' }, { status: 500 })
  }
}

// GET: list all enterprise clients (admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const clients = await EnterpriseClient.find({ adminUsers: user.userId })
      .select('-learners -customCurriculum')
      .lean()

    return NextResponse.json({ data: clients })
  } catch (err) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
