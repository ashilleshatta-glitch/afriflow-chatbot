import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import APIClient from '@/models/APIClient'
import APILog from '@/models/APILog'
import { getUserFromRequest } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

const ENDPOINT_MAP: Record<string, string[]> = {
  free: ['verify/certificate'],
  starter: ['verify/certificate', 'verify/id', 'search/graduates'],
  growth: ['verify/certificate', 'verify/id', 'search/graduates'],
  enterprise: ['verify/certificate', 'verify/id', 'search/graduates'],
}

function generateRawKey(): { raw: string; prefix: string } {
  const raw = 'afr_live_' + randomBytes(20).toString('hex')
  const prefix = raw.slice(0, 9) // "afr_live_"
  return { raw, prefix }
}

// GET: fetch current user's API key (metadata only — never return hashed key)
export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()

  const client = await APIClient.findOne({ contactEmail: user.email }).select('-apiKey').lean()
  if (!client) return NextResponse.json({ data: null })

  return NextResponse.json({ data: client })
}

// POST: create a new API key for this user
export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()

  const existing = await APIClient.findOne({ contactEmail: user.email })
  if (existing) {
    return NextResponse.json({ error: 'You already have an API key. Use PATCH to rotate it.' }, { status: 409 })
  }

  const { organizationName, plan = 'free' } = await req.json()
  if (!organizationName) return NextResponse.json({ error: 'organizationName required' }, { status: 400 })

  const validPlans = ['free', 'starter', 'growth', 'enterprise']
  const safePlan = validPlans.includes(plan) ? plan : 'free'

  const { raw, prefix } = generateRawKey()
  const hashed = await bcrypt.hash(raw, 10)

  const created = await APIClient.create({
    organizationName,
    contactEmail: user.email,
    apiKey: hashed,
    apiKeyPrefix: prefix,
    plan: safePlan,
    allowedEndpoints: ENDPOINT_MAP[safePlan],
  })

  // Return the plain key ONCE — never stored in plain form
  return NextResponse.json({
    data: {
      _id: created._id,
      apiKeyPlain: raw,
      apiKeyPrefix: prefix,
      plan: created.plan,
      monthlyCallLimit: created.monthlyCallLimit,
      callsThisMonth: 0,
      callsTotal: 0,
      resetDate: created.resetDate,
      allowedEndpoints: created.allowedEndpoints,
      isActive: true,
    },
  }, { status: 201 })
}

// PATCH: rotate API key (generate new key, keep same plan)
export async function PATCH(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()

  const client = await APIClient.findOne({ contactEmail: user.email })
  if (!client) return NextResponse.json({ error: 'No API key found' }, { status: 404 })

  const { raw, prefix } = generateRawKey()
  const hashed = await bcrypt.hash(raw, 10)

  client.apiKey = hashed
  client.apiKeyPrefix = prefix
  await client.save()

  return NextResponse.json({
    data: { apiKeyPlain: raw, apiKeyPrefix: prefix },
  })
}

// DELETE: revoke API key
export async function DELETE(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()

  const client = await APIClient.findOne({ contactEmail: user.email })
  if (!client) return NextResponse.json({ error: 'No API key found' }, { status: 404 })

  client.isActive = false
  await client.save()

  return NextResponse.json({ data: { message: 'API key revoked' } })
}
