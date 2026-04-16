import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import JobPosting from '@/models/JobPosting'

// GET — list active job postings
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const skill = searchParams.get('skill')
    const country = searchParams.get('country')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 12

    const query: any = { isActive: true }
    if (skill) query.requiredSkills = { $regex: skill, $options: 'i' }
    if (country) query.companyCountry = { $regex: country, $options: 'i' }
    if (type) query.type = type

    const [jobs, total] = await Promise.all([
      JobPosting.find(query)
        .sort({ isPremium: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      JobPosting.countDocuments(query),
    ])

    return NextResponse.json(
      { jobs, total, pages: Math.ceil(total / limit) },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    )
  } catch (err: any) {
    console.error('Jobs GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

// POST — create a job posting
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    const required = ['companyName', 'companyEmail', 'companyCountry', 'title', 'description']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const job = await JobPosting.create({
      companyName: body.companyName,
      companyEmail: body.companyEmail,
      companyCountry: body.companyCountry,
      companyWebsite: body.companyWebsite,
      title: body.title,
      description: body.description,
      requiredSkills: body.requiredSkills || [],
      requiredCertificates: body.requiredCertificates || [],
      location: body.location || 'Africa',
      isRemote: body.isRemote || false,
      salaryMin: body.salaryMin,
      salaryMax: body.salaryMax,
      currency: body.currency || 'USD',
      type: body.type || 'full-time',
      level: body.level || 'any',
      deadline: body.deadline ? new Date(body.deadline) : undefined,
      isPremium: body.isPremium || false,
    })

    return NextResponse.json({ job, message: 'Job posted successfully' }, { status: 201 })
  } catch (err: any) {
    console.error('Jobs POST error:', err)
    return NextResponse.json({ error: 'Failed to post job' }, { status: 500 })
  }
}
