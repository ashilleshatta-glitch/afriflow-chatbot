import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import AfriflowID from '@/models/AfriflowID'

/**
 * GET /api/id/endorse/verify/[token]
 *
 * Employer clicks the link in their email.
 * Marks the matching endorsement as isVerified = true.
 * Redirects to the learner's public profile.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    await connectDB()

    const record = await AfriflowID.findOne({
      'employerEndorsements.verifyToken': params.token,
    })

    if (!record) {
      return NextResponse.redirect(
        new URL('/id/verify-error', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
      )
    }

    // Mark endorsement verified
    const endorsement = record.employerEndorsements.find(
      (e: { verifyToken: string }) => e.verifyToken === params.token
    )
    if (endorsement) {
      endorsement.isVerified = true
    }
    await record.save()

    // Redirect to public profile with success query param
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return NextResponse.redirect(
      new URL(`/id/${record.publicId}?endorsed=1`, appUrl)
    )
  } catch (err) {
    console.error('GET /api/id/endorse/verify error:', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
