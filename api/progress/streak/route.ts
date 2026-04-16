import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Activity from '@/models/Activity'
import { getUserFromRequest } from '@/lib/auth'

// POST — update user streak
export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const user = await User.findById(payload.userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const now = new Date()
    const lastActive = new Date(user.lastActive)
    const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60)

    let streakChange = 0
    let message = ''

    if (diffHours < 24) {
      // Already active today, no change
      message = 'Streak already counted today'
    } else if (diffHours < 48) {
      // Within 48 hours — extend streak
      user.streak += 1
      streakChange = 1
      message = `Streak extended to ${user.streak} days! 🔥`

      // Milestone XP bonuses
      const milestoneXp = getStreakMilestoneXp(user.streak)
      if (milestoneXp > 0) {
        user.xp += milestoneXp
        await Activity.create({
          user: payload.userId,
          type: 'streak_milestone',
          title: `${user.streak}-day streak milestone! 🔥`,
          description: `Earned ${milestoneXp} bonus XP`,
          metadata: { streak: user.streak },
          xpAwarded: milestoneXp,
        })
      }
    } else {
      // More than 48 hours — streak broken
      user.streak = 1
      streakChange = -1
      message = 'Streak reset. Starting fresh! 💪'
    }

    user.lastActive = now
    await user.save()

    return NextResponse.json({
      streak: user.streak,
      streakChange,
      message,
      xp: user.xp,
    })
  } catch (err: any) {
    console.error('Streak update error:', err)
    return NextResponse.json({ error: 'Streak update failed' }, { status: 500 })
  }
}

function getStreakMilestoneXp(streak: number): number {
  const milestones: Record<number, number> = {
    3: 50,
    7: 100,
    14: 200,
    30: 500,
    60: 1000,
    100: 2000,
    365: 5000,
  }
  return milestones[streak] || 0
}
