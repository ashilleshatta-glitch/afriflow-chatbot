// GET  /api/automate/[ref] — get single request
// PATCH /api/automate/[ref] — update status (admin) or add client note (owner)
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import AutomationRequest, { AutomationStatus } from '@/models/AutomationRequest'

export async function GET(
  req: NextRequest,
  { params }: { params: { ref: string } }
) {
  try {
    const authHeader = req.headers.get('authorization')
    const payload = authHeader?.startsWith('Bearer ')
      ? verifyToken(authHeader.slice(7))
      : null

    await connectDB()

    const request = await AutomationRequest.findOne({ requestRef: params.ref }).lean()
    if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 })

    const isAdmin = payload?.role === 'admin'
    const isOwner =
      payload?.userId &&
      (request as unknown as { user?: { toString(): string } }).user?.toString() === payload.userId

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ request })
  } catch (err) {
    console.error('GET /api/automate/[ref]:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { ref: string } }
) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const payload = verifyToken(authHeader.slice(7))
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    await connectDB()

    const request = await AutomationRequest.findOne({ requestRef: params.ref })
    if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 })

    const isAdmin = payload.role === 'admin'
    const isOwner = request.user?.toString() === payload.userId

    const body = await req.json()

    if (isAdmin) {
      // Admin can update status, notes, quote, priority
      const adminFields = ['status', 'adminNotes', 'proposedSolution', 'quotedPrice', 'quotedHours',
                           'deliveryUrl', 'priority', 'isPublic', 'assignedTo']
      for (const key of adminFields) {
        if (body[key] !== undefined) (request as unknown as Record<string, unknown>)[key] = body[key]
      }

      // Track status changes
      if (body.status && body.status !== request.status) {
        const validStatuses: AutomationStatus[] = [
          'submitted', 'reviewing', 'scoping', 'in_progress', 'review', 'delivered', 'cancelled',
        ]
        if (!validStatuses.includes(body.status)) {
          return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }
        request.statusHistory.push({
          status: body.status as AutomationStatus,
          note: body.statusNote || '',
          changedAt: new Date(),
          changedBy: `admin:${payload.userId}`,
        })
      }
    } else if (isOwner) {
      // Owner can add a client note or rate after delivery
      if (body.clientNotes !== undefined) request.clientNotes = body.clientNotes
      if (request.status === 'delivered') {
        if (body.rating !== undefined) {
          const r = parseInt(body.rating)
          if (r >= 1 && r <= 5) request.rating = r
        }
        if (body.ratingComment !== undefined) request.ratingComment = body.ratingComment
      }
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await request.save()
    return NextResponse.json({ request })
  } catch (err) {
    console.error('PATCH /api/automate/[ref]:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
