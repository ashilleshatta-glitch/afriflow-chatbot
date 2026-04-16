import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import JobListing from '@/models/JobListing'
import { getUserFromRequest } from '@/lib/auth'

// GET /api/work/jobs/[id] — full job detail
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const job = await JobListing.findById(params.id).lean()
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

    // Increment views (fire-and-forget)
    JobListing.findByIdAndUpdate(params.id, { $inc: { applicationCount: 0 } }).catch(() => {})

    const j = job as unknown as { type: string; requiredSkills: string[] }

    // Similar jobs: same type or overlapping skills, exclude this job
    const similar = await JobListing.find({
      _id: { $ne: params.id },
      isActive: true,
      $or: [
        { type: j.type },
        { requiredSkills: { $in: j.requiredSkills?.slice(0, 3) ?? [] } },
      ],
    })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(4)
      .select('_id title companyName companyCountry type remote salaryMin salaryMax currency isFeatured isVerifiedEmployer')
      .lean()

    return NextResponse.json({ data: job, similar })
  } catch (err) {
    console.error('GET /api/work/jobs/[id] error:', err)
    return NextResponse.json({ error: 'Failed to load job' }, { status: 500 })
  }
}

// PATCH /api/work/jobs/[id] — update job (poster or admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const job = await JobListing.findById(params.id)
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

    const isOwner = String(job.postedBy) === payload.userId
    if (!isOwner && payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updates = await req.json()
    // Never let someone self-promote to verified employer
    if (payload.role !== 'admin') {
      delete updates.isVerifiedEmployer
      delete updates.isFeatured
    }

    const updated = await JobListing.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )

    return NextResponse.json({ data: updated })
  } catch (err) {
    console.error('PATCH /api/work/jobs/[id] error:', err)
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
  }
}
