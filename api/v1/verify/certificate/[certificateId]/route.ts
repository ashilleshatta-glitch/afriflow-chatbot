import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Certificate from '@/models/Certificate'
import { validateAPIKey, logAPICall } from '@/lib/apiKeyAuth'

interface Params { params: { certificateId: string } }

export async function GET(req: NextRequest, { params }: Params) {
  const start = Date.now()
  const endpoint = 'verify/certificate'

  // public endpoint — no API key required for free verification
  await connectDB()

  try {
    const cert = await Certificate.findOne({
      certificateId: params.certificateId,
      isRevoked: false,
    }).populate('user', 'name country')

    if (!cert) {
      return NextResponse.json({
        valid: false,
        error: 'Certificate not found or has been revoked',
      }, { status: 404 })
    }

    const holder = cert.user as { name: string; country: string }

    return NextResponse.json({
      valid: true,
      data: {
        certificateId: cert.certificateId,
        holderName: cert.userName ?? holder?.name,
        holderCountry: holder?.country,
        courseName: cert.courseTitle,
        courseSchool: cert.courseSchool,
        completionDate: cert.issuedAt,
        grade: cert.grade,
        score: cert.score,
        skills: cert.skills ?? [],
        projectsCompleted: cert.projectsCompleted,
        automationsBuilt: cert.automationsBuilt,
        verificationHash: cert.verificationHash,
        issuedBy: 'AfriFlow AI',
        verifiedAt: new Date().toISOString(),
      },
    })
  } catch (err) {
    // Log if we have a client (optional for free endpoint)
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 })
  }
}
