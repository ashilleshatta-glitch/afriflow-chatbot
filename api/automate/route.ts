// GET  /api/automate — list requests (admin: all; user: own)
// POST /api/automate — submit new automation request
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import AutomationRequest from '@/models/AutomationRequest'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const payload = authHeader?.startsWith('Bearer ')
      ? verifyToken(authHeader.slice(7))
      : null

    await connectDB()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)

    const isAdmin = payload?.role === 'admin'

    const query: Record<string, unknown> = {}

    if (!isAdmin) {
      // Non-admin: only own requests OR public case studies
      if (payload?.userId) {
        query.user = payload.userId
      } else {
        query.isPublic = true
        query.status = 'delivered'
      }
    }

    if (status) query.status = status
    if (category) query.category = category

    const selectFields = isAdmin
      ? 'requestRef title category status budget timeline country createdAt clientName company clientEmail adminNotes quotedPrice priority'
      : 'requestRef title category status budget timeline country createdAt clientName company'

    const [requests, total] = await Promise.all([
      AutomationRequest.find(query)
        .select(selectFields)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AutomationRequest.countDocuments(query),
    ])

    return NextResponse.json({ requests, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    console.error('GET /api/automate:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const authHeader = req.headers.get('authorization')
    const payload = authHeader?.startsWith('Bearer ')
      ? verifyToken(authHeader.slice(7))
      : null

    const body = await req.json()
    const {
      clientName, clientEmail, clientPhone, company, country,
      title, description, category, currentProcess, desiredOutcome,
      toolsUsed, budget, timeline,
    } = body

    // Validate required fields
    const required = { clientName, clientEmail, country, title, description, category, currentProcess, desiredOutcome, budget, timeline }
    for (const [key, val] of Object.entries(required)) {
      if (!val) return NextResponse.json({ error: `${key} is required` }, { status: 400 })
    }

    const request = await AutomationRequest.create({
      user: payload?.userId,
      clientName,
      clientEmail,
      clientPhone,
      company,
      country,
      title,
      description,
      category,
      currentProcess,
      desiredOutcome,
      toolsUsed: toolsUsed || [],
      budget,
      timeline,
      statusHistory: [{ status: 'submitted', note: 'Request submitted', changedAt: new Date() }],
    })

    return NextResponse.json({ request }, { status: 201 })
  } catch (err) {
    console.error('POST /api/automate:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
