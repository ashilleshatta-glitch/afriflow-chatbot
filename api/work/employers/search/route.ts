import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import AfriflowID from '@/models/AfriflowID'
import { getUserFromRequest } from '@/lib/auth'

// GET /api/work/employers/search — search AfriFlow ID holders (talent search)
// Requires auth. Full candidate data requires a paid API plan (enforced later via APIClient model).
export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { searchParams } = new URL(req.url)

    const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'))
    const limit = Math.min(20, parseInt(searchParams.get('limit') || '10'))
    const skip  = (page - 1) * limit

    // Build filter on AfriflowID
    const filter: Record<string, unknown> = {
      isPublic: true,
      isHireable: true,
    }

    const skill = searchParams.get('skill')
    if (skill) {
      filter['skills.name'] = { $regex: skill, $options: 'i' }
    }

    const country = searchParams.get('country')
    if (country) {
      filter.country = { $regex: country, $options: 'i' }
    }

    const cert = searchParams.get('cert')
    if (cert) {
      // We'll match on populated certificate data — for now filter by skills
      filter['skills.verifiedBy'] = 'course'
    }

    const minScore = searchParams.get('minScore')
    if (minScore) {
      filter.verificationScore = { $gte: parseInt(minScore) }
    }

    const workType = searchParams.get('workType')
    if (workType) {
      filter.preferredWorkType = workType
    }

    const [total, candidates] = await Promise.all([
      AfriflowID.countDocuments(filter),
      AfriflowID.find(filter)
        .sort({ verificationScore: -1, totalXP: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          'publicId displayName country headline skills automationsBuilt ' +
          'verificationScore totalXP learningHours preferredWorkType ' +
          'expectedSalaryRange isHireable'
        )
        .lean(),
    ])

    return NextResponse.json({
      data: candidates,
      total,
      page,
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    })
  } catch (err) {
    console.error('GET /api/work/employers/search error:', err)
    return NextResponse.json({ error: 'Failed to search candidates' }, { status: 500 })
  }
}
