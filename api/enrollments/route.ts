import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Enrollment from '@/models/Enrollment'
import Activity from '@/models/Activity'
import User from '@/models/User'
import { getUserFromRequest } from '@/lib/auth'
import { SAMPLE_COURSES } from '@/lib/data'

// GET — list user's enrollments
export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const { searchParams } = new URL(req.url)
    const completed = searchParams.get('completed')

    const filter: Record<string, any> = { user: payload.userId }
    if (completed === 'true') filter.isCompleted = true
    if (completed === 'false') filter.isCompleted = false

    const enrollments = await Enrollment.find(filter)
      .sort({ lastAccessedAt: -1 })
      .lean()

    return NextResponse.json({ enrollments, total: enrollments.length })
  } catch (err: any) {
    console.error('Enrollments GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 })
  }
}

// POST — enroll in a course
export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { courseSlug } = await req.json()

    if (!courseSlug) {
      return NextResponse.json({ error: 'courseSlug is required' }, { status: 400 })
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ user: payload.userId, courseSlug })
    if (existing) {
      return NextResponse.json({ error: 'Already enrolled in this course', enrollment: existing }, { status: 409 })
    }

    // Find course data (from static data or could be from DB)
    const course = SAMPLE_COURSES.find(c => c.slug === courseSlug)
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user: payload.userId,
      courseSlug,
      courseTitle: course.title,
      courseSchool: course.school,
      totalLessons: 8, // Default lesson count
    })

    // Award XP for enrolling
    await User.findByIdAndUpdate(payload.userId, {
      $inc: { xp: 25 },
      $addToSet: { enrolledCourses: enrollment._id },
    })

    // Log activity
    await Activity.create({
      user: payload.userId,
      type: 'enrollment',
      title: `Enrolled in ${course.title}`,
      description: `Started learning in the ${course.school} school`,
      metadata: { courseSlug, courseTitle: course.title },
      xpAwarded: 25,
    })

    return NextResponse.json({ enrollment, xpAwarded: 25 }, { status: 201 })
  } catch (err: any) {
    console.error('Enrollment POST error:', err)
    return NextResponse.json({ error: 'Enrollment failed' }, { status: 500 })
  }
}

// DELETE — unenroll from a course
export async function DELETE(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { courseSlug } = await req.json()

    const enrollment = await Enrollment.findOneAndDelete({
      user: payload.userId,
      courseSlug,
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }

    // Remove from user's enrolledCourses
    await User.findByIdAndUpdate(payload.userId, {
      $pull: { enrolledCourses: enrollment._id },
    })

    return NextResponse.json({ success: true, message: 'Unenrolled successfully' })
  } catch (err: any) {
    console.error('Enrollment DELETE error:', err)
    return NextResponse.json({ error: 'Unenroll failed' }, { status: 500 })
  }
}
