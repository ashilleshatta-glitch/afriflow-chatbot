// GET /api/schools/[slug]/progress — student progress dashboard (admin view)
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import School from '@/models/School'
import Enrollment from '@/models/Enrollment'
import User from '@/models/User'

export async function GET(
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

    const school = await School.findOne({ slug: params.slug, isActive: true }).lean() as {
      adminUser: { toString(): string }
      students: unknown[]
      courseAssignments: Array<{ courseSlug: string; dueDate?: Date; mandatory: boolean }>
    } | null

    if (!school) return NextResponse.json({ error: 'School not found' }, { status: 404 })

    // Only admin can see progress
    if (school.adminUser.toString() !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const studentIds = school.students as import('mongoose').Types.ObjectId[]
    const assignedSlugs = school.courseAssignments.map((a) => a.courseSlug)

    // Get all enrollments for this school's students in assigned courses
    const enrollments = (await Enrollment.find({
      user: { $in: studentIds },
      courseSlug: { $in: assignedSlugs },
    })
      .select('user courseSlug progressPct isCompleted completedAt enrolledAt')
      .lean()) as unknown as Array<{
        user: { toString(): string }
        courseSlug: string
        progressPct: number
        isCompleted: boolean
        completedAt?: Date
        enrolledAt?: Date
      }>

    // Get student names/countries
    const users = (await User.find({ _id: { $in: studentIds } })
      .select('name country xp')
      .lean()) as unknown as Array<{ _id: { toString(): string }; name: string; country?: string; xp?: number }>

    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]))

    // Build per-student summary
    const studentProgress = studentIds.map((id) => {
      const uid = id.toString()
      const user = userMap[uid]
      const userEnrollments = enrollments.filter((e) => e.user.toString() === uid)
      const completed = userEnrollments.filter((e) => e.isCompleted).length
      const avgPct =
        userEnrollments.length > 0
          ? Math.round(userEnrollments.reduce((s, e) => s + e.progressPct, 0) / userEnrollments.length)
          : 0
      return {
        userId: uid,
        name: user?.name || 'Unknown',
        country: user?.country || '',
        xp: user?.xp || 0,
        enrolledCourses: userEnrollments.length,
        completedCourses: completed,
        avgProgress: avgPct,
        courses: userEnrollments.map((e) => ({
          slug: e.courseSlug,
          progressPct: e.progressPct,
          isCompleted: e.isCompleted,
        })),
      }
    })

    // Overall stats
    const totalEnrollments = enrollments.length
    const completedEnrollments = enrollments.filter((e) => e.isCompleted).length
    const overallAvgPct =
      totalEnrollments > 0
        ? Math.round(enrollments.reduce((s, e) => s + e.progressPct, 0) / totalEnrollments)
        : 0

    return NextResponse.json(
      {
        stats: {
          totalStudents: studentIds.length,
          totalEnrollments,
          completedEnrollments,
          completionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
          avgProgress: overallAvgPct,
        },
        students: studentProgress,
        assignedCourses: school.courseAssignments,
      },
      { headers: { 'Cache-Control': 's-maxage=120' } }
    )
  } catch (err) {
    console.error('GET /api/schools/[slug]/progress:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
