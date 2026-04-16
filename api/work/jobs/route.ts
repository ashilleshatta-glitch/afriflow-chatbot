import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import JobListing from '@/models/JobListing'
import { getUserFromRequest } from '@/lib/auth'

// GET /api/work/jobs — paginated job board with filters
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)

    const page   = Math.max(1, parseInt(searchParams.get('page')  || '1'))
    const limit  = Math.min(50, parseInt(searchParams.get('limit') || '20'))
    const skip   = (page - 1) * limit

    // Build filter
    const filter: Record<string, unknown> = { isActive: true }

    const search = searchParams.get('search')
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const type = searchParams.get('type')
    if (type) filter.type = type

    const remote = searchParams.get('remote')
    if (remote === 'true') filter.remote = true

    const country = searchParams.get('country')
    if (country) filter.companyCountry = { $regex: country, $options: 'i' }

    const skill = searchParams.get('skill')
    if (skill) filter.requiredSkills = { $regex: skill, $options: 'i' }

    const cert = searchParams.get('cert')
    if (cert) filter.requiredCertifications = { $regex: cert, $options: 'i' }

    const salaryMin = searchParams.get('salaryMin')
    if (salaryMin) filter.salaryMax = { $gte: parseInt(salaryMin) }

    const [total, featured, jobs] = await Promise.all([
      JobListing.countDocuments(filter),
      JobListing.find({ ...filter, isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
      JobListing.find(filter)
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ])

    return NextResponse.json({
      data: jobs,
      featured,
      total,
      page,
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    })
  } catch (err) {
    console.error('GET /api/work/jobs error:', err)
    return NextResponse.json({ error: 'Failed to load jobs' }, { status: 500 })
  }
}

// POST /api/work/jobs — create a job listing (auth required)
export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const body = await req.json()

    const {
      companyName, companyLogoUrl, companySize, companyCountry,
      title, description, responsibilities, requirements,
      requiredCertifications, requiredSkills, niceToHaveSkills,
      minimumVerificationScore, type, remote, location,
      salaryMin, salaryMax, currency, salaryPeriod,
      applicationDeadline,
    } = body

    if (!companyName || !title || !description || !companyCountry) {
      return NextResponse.json(
        { error: 'companyName, title, description, companyCountry are required' },
        { status: 400 }
      )
    }

    const job = await JobListing.create({
      companyName, companyLogoUrl, companySize,
      companyCountry: companyCountry || 'Africa',
      title, description,
      responsibilities: responsibilities || [],
      requirements: requirements || [],
      requiredCertifications: requiredCertifications || [],
      requiredSkills: requiredSkills || [],
      niceToHaveSkills: niceToHaveSkills || [],
      minimumVerificationScore: minimumVerificationScore || 0,
      type: type || 'fulltime',
      remote: remote ?? false,
      location: location || companyCountry || 'Africa',
      salaryMin, salaryMax,
      currency: currency || 'USD',
      salaryPeriod: salaryPeriod || 'monthly',
      applicationDeadline,
      postedBy: payload.userId,
      isVerifiedEmployer: payload.role === 'admin',
      isFeatured: false,
      isActive: true,
      applicationCount: 0,
    })

    return NextResponse.json({ data: job }, { status: 201 })
  } catch (err) {
    console.error('POST /api/work/jobs error:', err)
    return NextResponse.json({ error: 'Failed to create job listing' }, { status: 500 })
  }
}
