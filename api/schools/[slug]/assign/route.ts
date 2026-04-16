// POST /api/schools/[slug]/assign — assign courses to all students (admin only)
// DELETE /api/schools/[slug]/assign — remove a course assignment
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import School from '@/models/School'

export async function POST(
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
    const { courseSlug, dueDate, mandatory } = body

    if (!courseSlug) return NextResponse.json({ error: 'courseSlug is required' }, { status: 400 })

    // Check if already assigned
    const exists = school.courseAssignments.some((a: { courseSlug: string }) => a.courseSlug === courseSlug)
    if (exists) {
      return NextResponse.json({ error: 'Course already assigned' }, { status: 409 })
    }

    school.courseAssignments.push({
      courseSlug,
      assignedAt: new Date(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      mandatory: mandatory ?? false,
    })

    await school.save()
    return NextResponse.json({ message: 'Course assigned', assignments: school.courseAssignments })
  } catch (err) {
    console.error('POST /api/schools/[slug]/assign:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
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
    const { courseSlug } = body
    if (!courseSlug) return NextResponse.json({ error: 'courseSlug is required' }, { status: 400 })

    school.courseAssignments = school.courseAssignments.filter((a: { courseSlug: string }) => a.courseSlug !== courseSlug)
    await school.save()

    return NextResponse.json({ message: 'Course removed', assignments: school.courseAssignments })
  } catch (err) {
    console.error('DELETE /api/schools/[slug]/assign:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
