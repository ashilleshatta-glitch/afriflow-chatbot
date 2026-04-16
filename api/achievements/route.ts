import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Achievement from '@/models/Achievement'
import { BADGE_DEFINITIONS } from '@/models/Achievement'
import Enrollment from '@/models/Enrollment'
import Review from '@/models/Review'
import Certificate from '@/models/Certificate'
import User from '@/models/User'
import Notification from '@/models/Notification'
import { getUserFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET — list user achievements
export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const achievements = await Achievement.find({ user: payload.userId })
      .sort({ unlockedAt: -1 })
      .lean()

    // Return achievements with all badge definitions (to show locked ones too)
    const unlockedIds = new Set(achievements.map((a: any) => a.badgeId))

    const allBadges = BADGE_DEFINITIONS.map(def => ({
      ...def,
      unlocked: unlockedIds.has(def.badgeId),
      unlockedAt: achievements.find((a: any) => a.badgeId === def.badgeId)?.unlockedAt || null,
    }))

    return NextResponse.json({
      achievements,
      allBadges,
      totalUnlocked: achievements.length,
      totalBadges: BADGE_DEFINITIONS.length,
    })
  } catch (err: any) {
    console.error('Achievements GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}

// POST — check and grant eligible achievements
export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const userId = payload.userId

    // Gather user stats
    const [user, enrollmentCount, completedCount, totalLessons, reviewCount, certCount, existingBadges] = await Promise.all([
      User.findById(userId).lean() as Promise<any>,
      Enrollment.countDocuments({ user: userId }),
      Enrollment.countDocuments({ user: userId, isCompleted: true }),
      Enrollment.aggregate([
        { $match: { user: new (mongoose.Types.ObjectId as any)(userId) } },
        { $group: { _id: null, total: { $sum: { $size: '$completedLessons' } } } },
      ]),
      Review.countDocuments({ user: userId }),
      Certificate.countDocuments({ user: userId }),
      Achievement.find({ user: userId }).lean(),
    ])

    const lessonCount = totalLessons[0]?.total || 0
    const xp = user?.xp || 0
    const streak = user?.streak || 0
    const unlockedIds = new Set((existingBadges as any[]).map(a => a.badgeId))

    // Check conditions for each badge
    const badgeConditions: Record<string, boolean> = {
      'first-enrollment': enrollmentCount >= 1,
      'three-courses': enrollmentCount >= 3,
      'five-courses': enrollmentCount >= 5,
      'first-completion': completedCount >= 1,
      'three-completions': completedCount >= 3,
      'ten-lessons': lessonCount >= 10,
      'fifty-lessons': lessonCount >= 50,
      'streak-3': streak >= 3,
      'streak-7': streak >= 7,
      'streak-30': streak >= 30,
      'streak-100': streak >= 100,
      'first-review': reviewCount >= 1,
      'five-reviews': reviewCount >= 5,
      'xp-500': xp >= 500,
      'xp-2000': xp >= 2000,
      'xp-5000': xp >= 5000,
      'first-certificate': certCount >= 1,
      'early-adopter': true, // All current users are early adopters
      'african-ai-pioneer': completedCount >= 1, // Simplified: completed any course
    }

    // Grant new badges
    const newBadges: any[] = []
    for (const def of BADGE_DEFINITIONS) {
      if (unlockedIds.has(def.badgeId)) continue
      if (!badgeConditions[def.badgeId]) continue

      const badge = await Achievement.create({
        user: userId,
        badgeId: def.badgeId,
        title: def.title,
        description: def.description,
        icon: def.icon,
        rarity: def.rarity,
        category: def.category,
        xpAwarded: def.xp,
      })

      newBadges.push(badge)

      // Award XP
      if (def.xp > 0) {
        await User.findByIdAndUpdate(userId, { $inc: { xp: def.xp } })
      }

      // Create notification
      await Notification.create({
        user: userId,
        type: 'achievement',
        title: `🎖️ Badge Unlocked: ${def.title}`,
        message: def.description,
        icon: def.icon,
        link: '/dashboard?tab=achievements',
      })
    }

    return NextResponse.json({
      newBadges,
      totalUnlocked: unlockedIds.size + newBadges.length,
    })
  } catch (err: any) {
    console.error('Achievements POST error:', err)
    return NextResponse.json({ error: 'Failed to check achievements' }, { status: 500 })
  }
}

import mongoose from 'mongoose'
