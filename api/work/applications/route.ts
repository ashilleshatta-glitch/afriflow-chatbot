import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import JobApplication from '@/models/JobApplication'
import JobListing from '@/models/JobListing'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    // Fetch user's applications with job data
    const applications = await JobApplication.find({ applicantId: payload.userId })
      .sort({ appliedAt: -1 })
      .lean()

    const jobIds = applications.map((a) => (a as unknown as { jobId: string }).jobId)

    const jobs = await JobListing.find({ _id: { $in: jobIds } })
      .select('title companyName companyCountry companyLogoUrl type remote isVerifiedEmployer isFeatured')
      .lean()

    const jobMap = new Map(
      (jobs as unknown as { _id: { toString(): string }; title: string; companyName: string; companyCountry: string; companyLogoUrl?: string; type: string; remote: boolean; isVerifiedEmployer: boolean; isFeatured: boolean }[])
        .map((j) => [j._id.toString(), j])
    )

    const result = (applications as unknown as {
      _id: { toString(): string }
      jobId: { toString(): string }
      coverNote?: string
      status: string
      afriflowIdPublicId?: string
      appliedAt: string
      statusUpdatedAt: string
    }[]).map((app) => {
      const job = jobMap.get(app.jobId.toString())
      const daysSinceUpdate = Math.floor(
        (Date.now() - new Date(app.statusUpdatedAt).getTime()) / (1000 * 60 * 60 * 24)
      )
      return {
        _id: app._id.toString(),
        jobId: app.jobId.toString(),
        status: app.status,
        appliedAt: app.appliedAt,
        statusUpdatedAt: app.statusUpdatedAt,
        coverNote: app.coverNote,
        afriflowIdPublicId: app.afriflowIdPublicId,
        stale: app.status === 'applied' && daysSinceUpdate > 7,
        job: job
          ? {
              title: job.title,
              companyName: job.companyName,
              companyCountry: job.companyCountry,
              companyLogoUrl: job.companyLogoUrl,
              type: job.type,
              remote: job.remote,
              isVerifiedEmployer: job.isVerifiedEmployer,
            }
          : null,
      }
    })

    const counts = {
      total: result.length,
      applied: result.filter((a) => a.status === 'applied').length,
      shortlisted: result.filter((a) => a.status === 'shortlisted').length,
      interview: result.filter((a) => a.status === 'interview').length,
      hired: result.filter((a) => a.status === 'hired').length,
      rejected: result.filter((a) => a.status === 'rejected').length,
    }

    return NextResponse.json({ data: result, counts })
  } catch (err) {
    console.error('[GET /api/work/applications]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
