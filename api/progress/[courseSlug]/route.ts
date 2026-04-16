import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Enrollment from '@/models/Enrollment'
import { getUserFromRequest } from '@/lib/auth'

// GET — get progress for a specific course
export async function GET(
  req: NextRequest,
  { params }: { params: { courseSlug: string } }
) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const enrollment = await Enrollment.findOne({
      user: payload.userId,
      courseSlug: params.courseSlug,
    }).lean() as any

    if (!enrollment) {
      return NextResponse.json({
        enrolled: false,
        progress: 0,
        completedLessons: [],
      })
    }

    return NextResponse.json({
      enrolled: true,
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
      isCompleted: enrollment.isCompleted,
      xpEarned: enrollment.xpEarned,
      lastAccessedAt: enrollment.lastAccessedAt,
    })
  } catch (err: any) {
    console.error('Progress GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
