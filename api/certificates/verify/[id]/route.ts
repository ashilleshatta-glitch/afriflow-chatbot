import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Certificate from '@/models/Certificate'
import crypto from 'crypto'

// GET — publicly verify a certificate by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const certificate = await Certificate.findOne({
      certificateId: params.id,
    }).lean() as any

    if (!certificate) {
      return NextResponse.json({
        verified: false,
        error: 'Certificate not found',
      }, { status: 404 })
    }

    if (certificate.isRevoked) {
      return NextResponse.json({
        verified: false,
        status: 'revoked',
        error: 'This certificate has been revoked',
      }, { status: 200 })
    }

    // Check expiry
    const now = new Date()
    const isExpired = certificate.expiryDate && new Date(certificate.expiryDate) < now
    if (isExpired) {
      return NextResponse.json({
        verified: false,
        status: 'expired',
        error: 'This certificate has expired',
        certificate: {
          certificateId: certificate.certificateId,
          userName: certificate.userName,
          courseTitle: certificate.courseTitle,
          expiryDate: certificate.expiryDate,
        },
      }, { status: 200 })
    }

    // Verify hash integrity if present
    let hashIntact = true
    if (certificate.verificationHash) {
      const expected = crypto
        .createHash('sha256')
        .update(`${certificate.certificateId}:${certificate.user.toString()}:${new Date(certificate.issuedAt).toISOString()}`)
        .digest('hex')
      hashIntact = expected === certificate.verificationHash
    }

    return NextResponse.json({
      verified: hashIntact,
      status: 'valid',
      certificate: {
        certificateId: certificate.certificateId,
        userName: certificate.userName,
        courseTitle: certificate.courseTitle,
        courseSchool: certificate.courseSchool,
        issuedAt: certificate.issuedAt,
        expiryDate: certificate.expiryDate,
        grade: certificate.grade,
        score: certificate.score,
        skills: certificate.skills || [],
        projectsCompleted: certificate.projectsCompleted || 0,
        automationsBuilt: certificate.automationsBuilt || 0,
        hashIntact,
      },
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch (err: any) {
    console.error('Certificate verify error:', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
