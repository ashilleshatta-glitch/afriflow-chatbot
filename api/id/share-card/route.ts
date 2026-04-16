import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import AfriflowID from '@/models/AfriflowID'
import { getUserFromRequest } from '@/lib/auth'

/**
 * GET /api/id/share-card
 *
 * Returns structured metadata for generating a shareable AfriFlow ID card.
 * Used by the canvas-based share image in the My ID dashboard.
 * Also used as the OG image source for /id/[publicId].
 *
 * Authenticated users get their own card.
 * Query param ?publicId=AFR-XXXX-XXXX for public card (unauthenticated).
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const url = new URL(req.url)
    const publicIdParam = url.searchParams.get('publicId')

    let record: Record<string, unknown> | null = null

    if (publicIdParam) {
      // Public access — anyone can generate a share card for a public profile
      record = await AfriflowID.findOne({ publicId: publicIdParam, isPublic: true })
        .select('publicId displayName country headline skills verificationScore automationsBuilt certificates totalXP')
        .populate('certificates', 'courseTitle grade')
        .lean() as Record<string, unknown> | null
    } else {
      // Authenticated — own card
      const payload = await getUserFromRequest(req)
      if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

      record = await AfriflowID.findOne({ userId: payload.userId })
        .select('publicId displayName country headline skills verificationScore automationsBuilt certificates totalXP')
        .populate('certificates', 'courseTitle grade')
        .lean() as Record<string, unknown> | null

      if (!record) return NextResponse.json({ error: 'AfriflowID not found' }, { status: 404 })
    }

    if (!record) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afriflow.ai'
    const skills = (record.skills as Array<{ name: string; level: string }> | undefined) ?? []
    const certs = (record.certificates as Array<{ courseTitle: string; grade: string }> | undefined) ?? []

    const cardData = {
      publicId: record.publicId,
      displayName: record.displayName,
      country: record.country,
      headline: record.headline,
      verificationScore: record.verificationScore,
      totalXP: record.totalXP,
      automationsBuilt: record.automationsBuilt,
      topSkills: skills.slice(0, 3).map(s => ({ name: s.name, level: s.level })),
      certificateCount: certs.length,
      topCertificates: certs.slice(0, 2).map(c => c.courseTitle),
      profileUrl: `${appUrl}/id/${record.publicId}`,
      scoreLabel: getScoreLabel(Number(record.verificationScore ?? 0)),
    }

    return NextResponse.json({ data: cardData })
  } catch (err) {
    console.error('GET /api/id/share-card error:', err)
    return NextResponse.json({ error: 'Failed to generate share card' }, { status: 500 })
  }
}

function getScoreLabel(score: number): string {
  if (score >= 85) return 'Highly Verified'
  if (score >= 65) return 'Verified'
  if (score >= 40) return 'Building Profile'
  return 'Getting Started'
}
