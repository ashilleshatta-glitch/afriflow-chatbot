import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import AfriflowID, { generatePublicId } from '@/models/AfriflowID'
import User from '@/models/User'
import { getUserFromRequest } from '@/lib/auth'

// GET /api/id/me — returns (or auto-creates) the authenticated user's AfriflowID
export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    let record = await AfriflowID.findOne({ userId: payload.userId })
      .populate('certificates', 'courseTitle courseSchool grade issuedAt certificateId skills isRevoked')
      .lean()

    // Auto-create if this user has no AfriflowID yet
    if (!record) {
      const user = await User.findById(payload.userId).select('name country xp streak').lean() as {
        name?: string; country?: string; xp?: number; streak?: number
      } | null

      let uniqueId = generatePublicId()
      // Retry if collision (astronomically unlikely, but safe)
      while (await AfriflowID.exists({ publicId: uniqueId })) {
        uniqueId = generatePublicId()
      }

      const created = await AfriflowID.create({
        userId: payload.userId,
        publicId: uniqueId,
        displayName: user?.name ?? 'AfriFlow Learner',
        country: user?.country ?? 'Africa',
        headline: '',
        totalXP: user?.xp ?? 0,
        streakRecord: user?.streak ?? 0,
      })

      record = await AfriflowID.findById(created._id)
        .populate('certificates', 'courseTitle courseSchool grade issuedAt certificateId skills isRevoked')
        .lean()
    }

    return NextResponse.json({ data: record })
  } catch (err) {
    console.error('GET /api/id/me error:', err)
    return NextResponse.json({ error: 'Failed to load ID' }, { status: 500 })
  }
}

// PATCH /api/id/me — update any editable field
export async function PATCH(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const body = await req.json()

    // Whitelist of patchable top-level fields
    const ALLOWED = [
      'displayName', 'headline', 'country',
      'isPublic', 'isHireable', 'preferredWorkType', 'expectedSalaryRange',
      'automationsBuilt', 'automationTypes',
    ] as const

    const update: Record<string, unknown> = {}
    for (const key of ALLOWED) {
      if (key in body) update[key] = body[key]
    }

    const record = await AfriflowID.findOneAndUpdate(
      { userId: payload.userId },
      { $set: update },
      { new: true, runValidators: true }
    ).populate('certificates', 'courseTitle courseSchool grade issuedAt certificateId skills isRevoked')
      .lean()

    if (!record) {
      return NextResponse.json({ error: 'AfriflowID not found — call GET /api/id/me first' }, { status: 404 })
    }

    return NextResponse.json({ data: record })
  } catch (err) {
    console.error('PATCH /api/id/me error:', err)
    return NextResponse.json({ error: 'Failed to update ID' }, { status: 500 })
  }
}
