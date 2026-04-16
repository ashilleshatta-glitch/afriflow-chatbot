import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import JobListing from '@/models/JobListing'
import JobApplication from '@/models/JobApplication'
import AfriflowID from '@/models/AfriflowID'
import { getUserFromRequest } from '@/lib/auth'

// POST /api/work/jobs/[id]/apply
// One-click apply with AfriFlow ID — no CV needed.
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const job = await JobListing.findById(params.id)
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    if (!job.isActive) return NextResponse.json({ error: 'Job is no longer active' }, { status: 400 })

    // Get the applicant's AfriFlow ID
    const afriId = await AfriflowID.findOne({ userId: payload.userId }).lean() as { publicId?: string; verificationScore?: number } | null
    if (!afriId?.publicId) {
      return NextResponse.json(
        { error: 'You need an AfriFlow ID to apply. Set one up in your dashboard.' },
        { status: 400 }
      )
    }

    // Check minimum verification score
    const score = afriId.verificationScore ?? 0
    if (job.minimumVerificationScore > 0 && score < job.minimumVerificationScore) {
      return NextResponse.json(
        {
          error: `This job requires a verification score of ${job.minimumVerificationScore}. Your current score is ${score}.`,
          requiredScore: job.minimumVerificationScore,
          currentScore: score,
        },
        { status: 400 }
      )
    }

    const { coverNote } = await req.json().catch(() => ({ coverNote: undefined }))

    // Create application (will throw on duplicate due to unique index)
    const application = await JobApplication.create({
      jobId: params.id,
      applicantId: payload.userId,
      afriflowIdPublicId: afriId.publicId,
      coverNote: coverNote || '',
      status: 'applied',
      appliedAt: new Date(),
      statusUpdatedAt: new Date(),
    }).catch((err: { code?: number }) => {
      if (err.code === 11000) throw new Error('DUPLICATE')
      throw err
    })

    // Increment application count
    await JobListing.findByIdAndUpdate(params.id, { $inc: { applicationCount: 1 } })

    return NextResponse.json({
      data: {
        applicationId: application._id,
        jobTitle: job.title,
        companyName: job.companyName,
        appliedAt: application.appliedAt,
        afriflowIdPublicId: afriId.publicId,
      },
    }, { status: 201 })
  } catch (err) {
    if (err instanceof Error && err.message === 'DUPLICATE') {
      return NextResponse.json({ error: 'You have already applied for this job.' }, { status: 409 })
    }
    console.error('POST /api/work/jobs/[id]/apply error:', err)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}

// GET /api/work/jobs/[id]/apply — check if current user has already applied
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ applied: false })

    await connectDB()

    const existing = await JobApplication.findOne({
      jobId: params.id,
      applicantId: payload.userId,
    }).lean()

    return NextResponse.json({
      applied: !!existing,
      status: (existing as { status?: string } | null)?.status ?? null,
    })
  } catch {
    return NextResponse.json({ applied: false })
  }
}
