import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Enrollment from '@/models/Enrollment'
import Certificate from '@/models/Certificate'
import Activity from '@/models/Activity'
import Review from '@/models/Review'
import Newsletter from '@/models/Newsletter'
import Achievement from '@/models/Achievement'
import Notification from '@/models/Notification'
import { SAMPLE_COURSES } from '@/lib/data'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    // 1. Create demo user
    let demoUser = await User.findOne({ email: 'demo@afriflowai.com' })
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Kwame Asante',
        email: 'demo@afriflowai.com',
        password: 'demo1234',
        country: 'Ghana',
        role: 'student',
        subscriptionTier: 'premium',
        xp: 2450,
        streak: 12,
        bio: 'Aspiring AI automation specialist from Accra. Building the future of work in Africa. 🚀',
      })
    }

    const userId = demoUser._id

    // 2. Seed enrollments for first 4 courses
    const enrollmentData = SAMPLE_COURSES.slice(0, 4).map((course, i) => ({
      user: userId,
      courseSlug: course.slug,
      courseTitle: course.title,
      courseSchool: course.school,
      totalLessons: 8,
      completedLessons: i === 0
        ? ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5', 'lesson-6', 'lesson-7', 'lesson-8']
        : i === 1
        ? ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5']
        : i === 2
        ? ['lesson-1', 'lesson-2', 'lesson-3']
        : ['lesson-1'],
      progress: i === 0 ? 100 : i === 1 ? 63 : i === 2 ? 38 : 13,
      isCompleted: i === 0,
      completedAt: i === 0 ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : undefined,
      xpEarned: i === 0 ? 600 : i === 1 ? 250 : i === 2 ? 150 : 75,
      enrolledAt: new Date(Date.now() - (30 - i * 5) * 24 * 60 * 60 * 1000),
      lastAccessedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
    }))

    for (const data of enrollmentData) {
      await Enrollment.findOneAndUpdate(
        { user: data.user, courseSlug: data.courseSlug },
        { $set: data },
        { upsert: true, new: true }
      )
    }

    // 3. Seed certificate for completed course
    const certId = `AF-DEMO-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
    const issuedAt = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const expiryDate = new Date(issuedAt.getTime() + 2 * 365 * 24 * 60 * 60 * 1000)
    const verificationHash = crypto
      .createHash('sha256')
      .update(`${certId}:${userId.toString()}:${issuedAt.toISOString()}`)
      .digest('hex')
    await Certificate.findOneAndUpdate(
      { user: userId, courseSlug: SAMPLE_COURSES[0].slug },
      {
        $set: {
          user: userId,
          userName: demoUser.name,
          courseSlug: SAMPLE_COURSES[0].slug,
          courseTitle: SAMPLE_COURSES[0].title,
          courseSchool: SAMPLE_COURSES[0].school,
          certificateId: certId,
          grade: 'distinction',
          score: 95,
          issuedAt,
          expiryDate,
          skills: ['AI fundamentals', 'Prompt engineering', 'ChatGPT', 'Claude AI', 'Critical thinking with AI'],
          projectsCompleted: 3,
          automationsBuilt: 0,
          verificationHash,
          isRevoked: false,
        },
      },
      { upsert: true, new: true }
    )

    // 4. Seed demo reviews
    const reviewData = [
      {
        user: userId,
        userName: demoUser.name,
        userCountry: 'Ghana',
        courseSlug: SAMPLE_COURSES[0].slug,
        rating: 5,
        title: 'The best AI course for beginners in Africa!',
        content: 'This course changed how I think about AI. The African context made everything relatable. I went from knowing nothing about AI to using it daily in my business.',
      },
      {
        user: userId,
        userName: demoUser.name,
        userCountry: 'Ghana',
        courseSlug: SAMPLE_COURSES[1].slug,
        rating: 5,
        title: 'Saved my business 10+ hours a week',
        content: 'Zapier and Make automations have transformed my workflow. The course is practical and the examples are perfect for African businesses.',
      },
    ]

    for (const review of reviewData) {
      await Review.findOneAndUpdate(
        { user: review.user, courseSlug: review.courseSlug },
        { $set: review },
        { upsert: true }
      )
    }

    // 5. Seed activities
    const activities = [
      { user: userId, type: 'enrollment' as const, title: `Enrolled in ${SAMPLE_COURSES[0].title}`, description: 'Started the AI journey', xpAwarded: 25, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { user: userId, type: 'lesson_complete' as const, title: `Completed 8 lessons in ${SAMPLE_COURSES[0].title}`, description: 'Progress: 100%', xpAwarded: 400, createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { user: userId, type: 'course_complete' as const, title: `Completed ${SAMPLE_COURSES[0].title}! 🎉`, description: 'Earned 200 bonus XP', xpAwarded: 200, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { user: userId, type: 'certificate_earned' as const, title: `Earned certificate with distinction`, description: `Certificate ID: ${certId}`, xpAwarded: 150, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { user: userId, type: 'streak_milestone' as const, title: '7-day streak milestone! 🔥', description: 'Earned 100 bonus XP', xpAwarded: 100, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { user: userId, type: 'enrollment' as const, title: `Enrolled in ${SAMPLE_COURSES[1].title}`, description: 'Learning automation', xpAwarded: 25, createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
      { user: userId, type: 'enrollment' as const, title: `Enrolled in ${SAMPLE_COURSES[2].title}`, description: 'Building AI services', xpAwarded: 25, createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
      { user: userId, type: 'enrollment' as const, title: `Enrolled in ${SAMPLE_COURSES[3].title}`, description: 'WhatsApp automation', xpAwarded: 25, createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      { user: userId, type: 'login' as const, title: 'Daily login streak continued', description: 'Day 12', xpAwarded: 10, createdAt: new Date() },
    ]

    // Clear old activities for demo user and re-seed
    await Activity.deleteMany({ user: userId })
    await Activity.insertMany(activities.map(a => ({ ...a, metadata: {} })))

    // 6. Seed newsletter
    await Newsletter.findOneAndUpdate(
      { email: 'demo@afriflowai.com' },
      { $set: { email: 'demo@afriflowai.com', name: 'Kwame Asante', source: 'seed', isActive: true } },
      { upsert: true }
    )

    // 7. Seed achievements
    const achievementData = [
      { badgeId: 'first_enrollment', title: 'First Step', description: 'Enrolled in your first course', icon: '📚', rarity: 'common', category: 'learning', unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { badgeId: 'course_complete_1', title: 'Graduate', description: 'Completed your first course', icon: '🎓', rarity: 'uncommon', category: 'learning', unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { badgeId: 'streak_3', title: '3-Day Fire', description: 'Maintained a 3-day learning streak', icon: '🔥', rarity: 'common', category: 'streak', unlockedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
      { badgeId: 'streak_7', title: 'Week Warrior', description: 'Maintained a 7-day learning streak', icon: '⚡', rarity: 'uncommon', category: 'streak', unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { badgeId: 'first_review', title: 'Voice Heard', description: 'Wrote your first course review', icon: '💬', rarity: 'common', category: 'social', unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { badgeId: 'xp_100', title: 'Century Club', description: 'Earned 100 XP', icon: '💯', rarity: 'common', category: 'mastery', unlockedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
      { badgeId: 'xp_500', title: 'Half K Hero', description: 'Earned 500 XP', icon: '🚀', rarity: 'uncommon', category: 'mastery', unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      { badgeId: 'xp_1000', title: 'XP Thousandaire', description: 'Earned 1,000 XP', icon: '💎', rarity: 'rare', category: 'mastery', unlockedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
      { badgeId: 'early_adopter', title: 'Early Adopter', description: 'Joined AfriFlow AI early', icon: '🌱', rarity: 'rare', category: 'special', unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { badgeId: 'african_pioneer', title: 'African Pioneer', description: 'Among the first African AI learners', icon: '🌍', rarity: 'epic', category: 'special', unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    ]

    await Achievement.deleteMany({ user: userId })
    await Achievement.insertMany(achievementData.map(a => ({ ...a, user: userId })))

    // 8. Seed notifications
    const notificationData = [
      { type: 'achievement', title: '🏆 Achievement Unlocked!', message: 'You earned "African Pioneer" — Among the first African AI learners!', icon: '🌍', isRead: false, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { type: 'achievement', title: '🎖️ New Badge!', message: 'You unlocked "XP Thousandaire" — Earned 1,000 XP!', icon: '💎', isRead: false, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { type: 'completion', title: '🎉 Course Completed!', message: `Congratulations! You completed "${SAMPLE_COURSES[0].title}"`, icon: '🎓', isRead: true, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { type: 'certificate', title: '📜 Certificate Ready!', message: `Your certificate for "${SAMPLE_COURSES[0].title}" is ready to download`, icon: '🏆', link: '/certificates', isRead: true, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { type: 'streak', title: '🔥 7-Day Streak!', message: 'Amazing! You\'ve been learning for 7 consecutive days. Keep it going!', icon: '⚡', isRead: true, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { type: 'system', title: '👋 Welcome to AfriFlow AI!', message: 'Start your AI journey with our free beginner courses. Africa\'s future is AI-powered!', icon: '🚀', isRead: true, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    ]

    await Notification.deleteMany({ user: userId })
    await Notification.insertMany(notificationData.map(n => ({ ...n, user: userId })))

    return NextResponse.json({
      success: true,
      message: 'Full demo data seeded successfully',
      data: {
        user: { email: 'demo@afriflowai.com', password: 'demo1234' },
        enrollments: enrollmentData.length,
        certificates: 1,
        reviews: reviewData.length,
        activities: activities.length,
        achievements: achievementData.length,
        notifications: notificationData.length,
      },
    })
  } catch (err: any) {
    console.error('Seed error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
