import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Enrollment from '@/models/Enrollment'
import Activity from '@/models/Activity'
import User from '@/models/User'
import { getUserFromRequest } from '@/lib/auth'

// POST — mark a lesson as complete
export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { courseSlug, lessonId } = await req.json()

    if (!courseSlug || !lessonId) {
      return NextResponse.json({ error: 'courseSlug and lessonId are required' }, { status: 400 })
    }

    // Find enrollment
    const enrollment = await Enrollment.findOne({ user: payload.userId, courseSlug })
    if (!enrollment) {
      return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 404 })
    }

    // Check if lesson already completed
    if (enrollment.completedLessons.includes(lessonId)) {
      return NextResponse.json({
        message: 'Lesson already completed',
        enrollment,
        xpAwarded: 0,
      })
    }

    // Add lesson to completed
    enrollment.completedLessons.push(lessonId)
    enrollment.lastAccessedAt = new Date()

    // Calculate progress
    const totalLessons = enrollment.totalLessons || 8
    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100)

    // Award XP for lesson completion
    const XP_PER_LESSON = 50
    enrollment.xpEarned += XP_PER_LESSON

    // Check if course is now complete
    let bonusXp = 0
    let courseCompleted = false
    if (enrollment.progress >= 100) {
      enrollment.isCompleted = true
      enrollment.completedAt = new Date()
      enrollment.progress = 100
      bonusXp = 200 // Bonus XP for course completion
      courseCompleted = true
    }

    await enrollment.save()

    // Update user XP and completed lessons
    const totalXp = XP_PER_LESSON + bonusXp
    await User.findByIdAndUpdate(payload.userId, {
      $inc: { xp: totalXp },
      $addToSet: { completedLessons: lessonId },
    })

    // Log lesson completion activity
    await Activity.create({
      user: payload.userId,
      type: 'lesson_complete',
      title: `Completed lesson in ${enrollment.courseTitle}`,
      description: `Progress: ${enrollment.progress}%`,
      metadata: { courseSlug, lessonId, progress: enrollment.progress },
      xpAwarded: XP_PER_LESSON,
    })

    // Log course completion if applicable
    if (courseCompleted) {
      await Activity.create({
        user: payload.userId,
        type: 'course_complete',
        title: `Completed ${enrollment.courseTitle}! 🎉`,
        description: `Earned ${bonusXp} bonus XP for course completion`,
        metadata: { courseSlug, courseTitle: enrollment.courseTitle },
        xpAwarded: bonusXp,
      })
    }

    return NextResponse.json({
      enrollment,
      xpAwarded: totalXp,
      courseCompleted,
      progress: enrollment.progress,
    })
  } catch (err: any) {
    console.error('Complete lesson error:', err)
    return NextResponse.json({ error: 'Failed to complete lesson' }, { status: 500 })
  }
}
