import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import AfriflowID from '@/models/AfriflowID'

// GET /api/id/[publicId] — public, no auth required
export async function GET(
  _req: NextRequest,
  { params }: { params: { publicId: string } }
) {
  try {
    await connectDB()

    const record = await AfriflowID.findOne({ publicId: params.publicId, isPublic: true })
      .populate('certificates', 'courseTitle courseSchool grade issuedAt certificateId skills isRevoked')
      .lean()

    if (!record) {
      return NextResponse.json({ error: 'Profile not found or private' }, { status: 404 })
    }

    // Increment profile views (fire-and-forget)
    AfriflowID.findOneAndUpdate(
      { publicId: params.publicId },
      { $inc: { profileViews: 1 }, lastProfileView: new Date() }
    ).catch(() => null)

    // Strip private endorsement verify tokens before returning
    const sanitised = {
      ...(record as Record<string, unknown>),
      employerEndorsements: ((record as Record<string, unknown>).employerEndorsements as Array<Record<string, unknown>>)?.map(e => {
        const { verifyToken: _, ...rest } = e
        return rest
      }) ?? [],
    }

    return NextResponse.json({ data: sanitised })
  } catch (err) {
    console.error('GET /api/id error:', err)
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 })
  }
}
