// GET /api/schools/[slug] — school profile + stats
// PATCH /api/schools/[slug] — update school (admin only)
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import School, { ISchool } from '@/models/School'
import Enrollment from '@/models/Enrollment'

type SchoolDoc = ISchool & { _id: unknown }

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()
    const schoolRaw = await School.findOne({ slug: params.slug, isActive: true })
      .populate('adminUser', 'name email')
      .lean()

    if (!schoolRaw) return NextResponse.json({ error: 'School not found' }, { status: 404 })

    const school = schoolRaw as unknown as SchoolDoc

    // Aggregate per-student progress using Enrollments
    const studentCount = school.students?.length ?? 0
    let avgPct = 0

    if (studentCount > 0 && school.courseAssignments?.length > 0) {
      const slugs = school.courseAssignments.map((a) => a.courseSlug)
      const enrollments = await Enrollment.find({
        user: { $in: school.students },
        courseSlug: { $in: slugs },
      })
        .select('progressPct isCompleted')
        .lean() as Array<{ progressPct?: number; isCompleted?: boolean }>

      if (enrollments.length > 0) {
        avgPct = Math.round(
          enrollments.reduce((sum, e) => sum + (e.progressPct || 0), 0) / enrollments.length
        )
      }
    }

    return NextResponse.json({ school: { ...school, avgProgressPct: avgPct } })
  } catch (err) {
    console.error('GET /api/schools/[slug]:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const payload = verifyToken(authHeader.slice(7))
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    await connectDB()
    const school = await School.findOne({ slug: params.slug })
    if (!school) return NextResponse.json({ error: 'School not found' }, { status: 404 })

    if (school.adminUser.toString() !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const allowed = ['name', 'city', 'website', 'description', 'primaryColor', 'logoUrl', 'onboardingComplete']
    for (const key of allowed) {
      if (body[key] !== undefined) (school as unknown as Record<string, unknown>)[key] = body[key]
    }
    await school.save()
    return NextResponse.json({ school })
  } catch (err) {
    console.error('PATCH /api/schools/[slug]:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
