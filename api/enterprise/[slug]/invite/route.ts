import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import EnterpriseClient from '@/models/EnterpriseClient'
import { getUserFromRequest } from '@/lib/auth'
import { randomBytes } from 'crypto'

interface Params { params: { slug: string } }

// POST: generate a new invite link (admin only)
export async function POST(req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const client = await EnterpriseClient.findOne({ slug: params.slug })
    if (!client) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

    const isAdmin = client.adminUsers.some((id: unknown) => String(id) === user.userId)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    if (client.usedSeats >= client.seatLimit) {
      return NextResponse.json({ error: 'Seat limit reached. Upgrade plan to invite more.' }, { status: 402 })
    }

    // generate a short invite token and store on the doc
    const inviteToken = randomBytes(16).toString('hex')
    const inviteExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    client.set('inviteToken', inviteToken)
    client.set('inviteExpiry', inviteExpiry)
    await client.save()

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://afriflowai.com'}/org/${params.slug}/join?token=${inviteToken}`

    return NextResponse.json({
      data: {
        inviteUrl,
        inviteToken,
        expiresAt: inviteExpiry,
        seatsRemaining: client.seatLimit - client.usedSeats,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Error generating invite' }, { status: 500 })
  }
}

// GET: validate an invite token (public — used by join page)
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })

    const client = await EnterpriseClient.findOne({ slug: params.slug })
      .select('organizationName plan seatLimit usedSeats inviteToken inviteExpiry branding isActive')
    if (!client) return NextResponse.json({ error: 'Org not found' }, { status: 404 })
    if (!client.get('inviteToken') || client.get('inviteToken') !== token) {
      return NextResponse.json({ error: 'Invalid invite link' }, { status: 400 })
    }
    const expiry: Date | undefined = client.get('inviteExpiry')
    if (expiry && expiry < new Date()) {
      return NextResponse.json({ error: 'Invite link has expired' }, { status: 410 })
    }
    if (!client.isActive) {
      return NextResponse.json({ error: 'This organisation is not currently active' }, { status: 403 })
    }

    return NextResponse.json({
      data: {
        organizationName: client.organizationName,
        plan: client.plan,
        seatsRemaining: client.seatLimit - client.usedSeats,
        logoUrl: client.branding?.logoUrl ?? null,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
