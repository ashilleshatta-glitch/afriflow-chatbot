import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import AfriflowID from '@/models/AfriflowID'
import { validateAPIKey, logAPICall } from '@/lib/apiKeyAuth'

export async function GET(req: NextRequest) {
  const start = Date.now()
  const endpoint = 'search/graduates'

  const { client, error, status } = await validateAPIKey(req, endpoint)
  if (error || !client) {
    return NextResponse.json({ error }, { status })
  }

  // Graduate search requires at least 'starter' plan
  if (client.plan === 'free') {
    await logAPICall(client, endpoint, 'GET', 403, Date.now() - start, req, 'Plan upgrade required')
    return NextResponse.json({
      error: 'Graduate search requires a Starter plan or higher. Upgrade at afriflowai.com/developers',
    }, { status: 403 })
  }

  await connectDB()

  try {
    const { searchParams } = new URL(req.url)
    const skill = searchParams.get('skill')
    const country = searchParams.get('country')
    const minScore = parseInt(searchParams.get('minScore') ?? '0')
    const isHireable = searchParams.get('hireable') === 'true'
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = Math.min(20, parseInt(searchParams.get('limit') ?? '10'))
    const skip = (page - 1) * limit

    const filter: Record<string, unknown> = {
      isPublic: true,
      ...(isHireable && { isHireable: true }),
      ...(country && { country: { $regex: country, $options: 'i' } }),
      ...(minScore > 0 && { verificationScore: { $gte: minScore } }),
      ...(skill && { 'skills.name': { $regex: skill, $options: 'i' }, 'skills.verified': true }),
    }

    const [total, records] = await Promise.all([
      AfriflowID.countDocuments(filter),
      AfriflowID.find(filter)
        .select('publicId displayName country headline topSkills verificationScore totalXP isHireable automationsBuilt')
        .populate('certificates', 'courseTitle grade issuedAt certificateId isRevoked')
        .skip(skip)
        .limit(limit)
        .lean(),
    ])

    const graduates = records.map((r) => {
      const rec = r as Record<string, unknown>
      const certs = (rec.certificates as Array<{ isRevoked?: boolean; courseTitle?: string; grade?: string; issuedAt?: Date; certificateId?: string }> ?? [])
        .filter((c) => !c.isRevoked)
      return {
        afriflowId: rec.publicId,
        displayName: rec.displayName,
        country: rec.country,
        headline: rec.headline,
        verificationScore: rec.verificationScore,
        totalXP: rec.totalXP,
        isHireable: rec.isHireable,
        automationsBuilt: rec.automationsBuilt,
        certificatesCount: certs.length,
        topCertificates: certs.slice(0, 3).map((c) => ({
          courseTitle: c.courseTitle,
          grade: c.grade,
          issuedAt: c.issuedAt,
          certificateId: c.certificateId,
        })),
      }
    })

    await logAPICall(client, endpoint, 'GET', 200, Date.now() - start, req)

    return NextResponse.json({
      data: {
        graduates,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        apiCallsRemaining: client.monthlyCallLimit - client.callsThisMonth,
      },
    })
  } catch (err) {
    await logAPICall(client, endpoint, 'GET', 500, Date.now() - start, req, 'Server error')
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
