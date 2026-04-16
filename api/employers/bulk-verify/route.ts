import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Certificate from '@/models/Certificate'
import crypto from 'crypto'

// POST — bulk verify up to 10 certificate IDs at once
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { ids } = await req.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids must be a non-empty array' }, { status: 400 })
    }
    if (ids.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 certificate IDs per request' }, { status: 400 })
    }

    const certs = await Certificate.find({
      certificateId: { $in: ids },
    }).lean() as any[]

    const now = new Date()

    const results = ids.map((id: string) => {
      const cert = certs.find((c) => c.certificateId === id)

      if (!cert) {
        return { id, status: 'not_found', verified: false }
      }
      if (cert.isRevoked) {
        return { id, status: 'revoked', verified: false, holderName: cert.userName }
      }
      if (cert.expiryDate && new Date(cert.expiryDate) < now) {
        return {
          id,
          status: 'expired',
          verified: false,
          holderName: cert.userName,
          expiryDate: cert.expiryDate,
        }
      }

      // Hash check
      let hashIntact = true
      if (cert.verificationHash) {
        const expected = crypto
          .createHash('sha256')
          .update(`${cert.certificateId}:${cert.user.toString()}:${new Date(cert.issuedAt).toISOString()}`)
          .digest('hex')
        hashIntact = expected === cert.verificationHash
      }

      return {
        id,
        status: 'valid',
        verified: hashIntact,
        holderName: cert.userName,
        courseTitle: cert.courseTitle,
        courseSchool: cert.courseSchool,
        grade: cert.grade,
        score: cert.score,
        issuedAt: cert.issuedAt,
        expiryDate: cert.expiryDate,
        skills: cert.skills || [],
      }
    })

    const summary = {
      total: ids.length,
      valid: results.filter((r) => r.status === 'valid' && r.verified).length,
      invalid: results.filter((r) => !r.verified).length,
    }

    return NextResponse.json({ results, summary })
  } catch (err: any) {
    console.error('Bulk verify error:', err)
    return NextResponse.json({ error: 'Bulk verification failed' }, { status: 500 })
  }
}
