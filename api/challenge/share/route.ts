import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ChallengeParticipant from '@/models/ChallengeParticipant'
import User from '@/models/User'
import Activity from '@/models/Activity'
import { getUserFromRequest } from '@/lib/auth'

// POST /api/challenge/share — record a social share, award +5 XP, grant badge
export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { day, platform } = await req.json()
    if (!day || !platform) {
      return NextResponse.json({ error: 'day and platform required' }, { status: 400 })
    }

    await connectDB()

    const participant = await ChallengeParticipant.findOne({ user: payload.userId })
    if (!participant) {
      return NextResponse.json({ error: 'Not a challenge participant' }, { status: 404 })
    }

    const XP_BONUS = 5
    participant.shareCount = (participant.shareCount || 0) + 1

    // Award badge on first share
    const firstShare = !participant.hasSocialBadge
    if (firstShare) {
      participant.hasSocialBadge = true
    }

    await participant.save()

    // Award XP to user
    await User.findByIdAndUpdate(payload.userId, { $inc: { xp: XP_BONUS } })

    if (firstShare) {
      await Activity.create({
        user: payload.userId,
        type: 'achievement',
        title: 'Challenge Sharer Badge',
        description: `Shared Day ${day} progress on ${platform} — earned Challenge Sharer badge!`,
        xpAwarded: XP_BONUS,
      })
    }

    return NextResponse.json({
      success: true,
      xpAwarded: XP_BONUS,
      firstShare,
      totalShares: participant.shareCount,
    })
  } catch (err) {
    console.error('POST /api/challenge/share:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
