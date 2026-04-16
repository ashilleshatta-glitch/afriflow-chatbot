import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import AfriflowID from '@/models/AfriflowID'
import { validateAPIKey, logAPICall } from '@/lib/apiKeyAuth'

interface Params { params: { afriflowId: string } }

export async function GET(req: NextRequest, { params }: Params) {
  const start = Date.now()
  const endpoint = 'verify/id'

  const { client, error, status } = await validateAPIKey(req, endpoint)
  if (error || !client) {
    return NextResponse.json({ valid: false, error }, { status })
  }

  await connectDB()

  try {
    const record = await AfriflowID.findOne({
      publicId: params.afriflowId.toUpperCase(),
      isPublic: true,
    })
      .populate('certificates', 'courseTitle grade issuedAt certificateId skills isRevoked')
      .lean() as Record<string, unknown> | null

    if (!record) {
      await logAPICall(client, endpoint, 'GET', 404, Date.now() - start, req, 'Not found')
      return NextResponse.json({ valid: false, error: 'AfriFlow ID not found or is private' }, { status: 404 })
    }

    const certs = (record.certificates as Array<{
      isRevoked?: boolean; courseTitle?: string; grade?: string; issuedAt?: Date; certificateId?: string; skills?: string[]
    }> ?? []).filter((c) => !c.isRevoked)

    const responseData = {
      valid: true,
      data: {
        afriflowId: record.publicId,
        displayName: record.displayName,
        country: record.country,
        headline: record.headline,
        totalXP: record.totalXP,
        verificationScore: record.verificationScore,
        isHireable: record.isHireable,
        topSkills: (record.skills as Array<{ name: string; level: string; verified: boolean }> ?? [])
          .filter((s) => s.verified)
          .slice(0, 5)
          .map((s) => ({ name: s.name, level: s.level })),
        certificatesCount: certs.length,
        certificates: certs.slice(0, 5).map((c) => ({
          courseTitle: c.courseTitle,
          grade: c.grade,
          issuedAt: c.issuedAt,
          certificateId: c.certificateId,
          skills: c.skills,
        })),
        projectsCount: (record.projects as unknown[])?.length ?? 0,
        automationsBuilt: record.automationsBuilt,
        verifiedAt: new Date().toISOString(),
      },
    }

    await logAPICall(client, endpoint, 'GET', 200, Date.now() - start, req)
    return NextResponse.json(responseData)
  } catch (err) {
    await logAPICall(client, endpoint, 'GET', 500, Date.now() - start, req, 'Server error')
    return NextResponse.json({ valid: false, error: 'Lookup failed' }, { status: 500 })
  }
}
